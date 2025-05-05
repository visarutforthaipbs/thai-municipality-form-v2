import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { MunicipalityFormData, PlanItem, CATEGORIES } from "../types";
import {
  useMunicipalityData,
  searchByName,
  findByCode,
  Municipality,
} from "../utils/municipalityData";
import { DEV_MODE } from "../services/mongoService";

// Helper functions for category colors
const getCategoryBgColor = (category: string) => {
  switch (category) {
    case "ด้านบริหารทั่วไป":
      return "blue.50";
    case "ด้านบริการชุมชนและสังคม":
      return "green.50";
    case "ด้านเศรษฐกิจ":
      return "yellow.50";
    case "ด้านดำเนินงานอื่น":
      return "purple.50";
    default:
      return "white";
  }
};

const getCategoryLabelBgColor = (category: string) => {
  switch (category) {
    case "ด้านบริหารทั่วไป":
      return "blue.100";
    case "ด้านบริการชุมชนและสังคม":
      return "green.100";
    case "ด้านเศรษฐกิจ":
      return "yellow.100";
    case "ด้านดำเนินงานอื่น":
      return "purple.100";
    default:
      return "gray.100";
  }
};

const getCategoryTextColor = (category: string) => {
  switch (category) {
    case "ด้านบริหารทั่วไป":
      return "blue.700";
    case "ด้านบริการชุมชนและสังคม":
      return "green.700";
    case "ด้านเศรษฐกิจ":
      return "yellow.700";
    case "ด้านดำเนินงานอื่น":
      return "purple.700";
    default:
      return "gray.700";
  }
};

const getCategorySelectBgColor = (category: string) => {
  switch (category) {
    case "ด้านบริหารทั่วไป":
      return "#EBF8FF"; // blue.50 equivalent
    case "ด้านบริการชุมชนและสังคม":
      return "#F0FFF4"; // green.50 equivalent
    case "ด้านเศรษฐกิจ":
      return "#FFFFF0"; // yellow.50 equivalent
    case "ด้านดำเนินงานอื่น":
      return "#FAF5FF"; // purple.50 equivalent
    default:
      return "white";
  }
};

// Default empty form data
const emptyFormData: MunicipalityFormData = {
  muniCode: "",
  muniName: "",
  province: "",
  website: "",
  totalSpent: 0,
  plans: [],
};

// Empty plan item
const emptyPlanItem: PlanItem = {
  category: CATEGORIES[0],
  plan: "",
  actual: 0,
};

// Create a simple toast function
const showToast = (props: {
  title: string;
  description?: string;
  status?: "info" | "warning" | "success" | "error";
  duration?: number;
  isClosable?: boolean;
}) => {
  // Create a temporary element for the toast
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "20px";
  container.style.right = "20px";
  container.style.zIndex = "9999";
  container.style.maxWidth = "350px";
  container.style.padding = "15px";
  container.style.borderRadius = "8px";
  container.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

  // Set background color based on status
  const bgColors: Record<string, string> = {
    info: "#3182CE",
    success: "#38A169",
    warning: "#DD6B20",
    error: "#E53E3E",
  };
  container.style.backgroundColor = bgColors[props.status || "info"];
  container.style.color = "white";

  // Create title element
  const title = document.createElement("div");
  title.textContent = props.title;
  title.style.fontWeight = "bold";
  title.style.marginBottom = props.description ? "8px" : "0";
  container.appendChild(title);

  // Create description element if provided
  if (props.description) {
    const description = document.createElement("div");
    description.textContent = props.description;
    container.appendChild(description);
  }

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.style.position = "absolute";
  closeButton.style.top = "5px";
  closeButton.style.right = "10px";
  closeButton.style.background = "none";
  closeButton.style.border = "none";
  closeButton.style.color = "white";
  closeButton.style.fontSize = "18px";
  closeButton.style.cursor = "pointer";
  closeButton.onclick = () => document.body.removeChild(container);
  container.appendChild(closeButton);

  // Add to document
  document.body.appendChild(container);

  // Auto remove after duration
  setTimeout(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }, props.duration || 5000);
};

const MunicipalityForm: React.FC = () => {
  const [formData, setFormData] = useState<MunicipalityFormData>(emptyFormData);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Municipality[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<
    "connected" | "disconnected" | "checking"
  >("checking");

  const { municipalities, error } = useMunicipalityData();

  // Check server connectivity on component mount
  useEffect(() => {
    checkServerConnectivity();
  }, []);

  // Function to check if the server is accessible
  const checkServerConnectivity = async () => {
    try {
      setServerStatus("checking");

      // Get API URL - use environment variable in production if available
      const apiBaseUrl = process.env.REACT_APP_API_URL || "";
      const isLocalDev =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const apiUrl =
        apiBaseUrl || (isLocalDev ? "http://localhost:5000/api" : "/api");

      const response = await fetch(apiUrl, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const isConnected = response.ok;
      setServerStatus(isConnected ? "connected" : "disconnected");
      return isConnected;
    } catch (error) {
      console.error("Server connectivity check failed:", error);
      setServerStatus("disconnected");
      return false;
    }
  };

  // Add these comments to suppress the linter warnings for variables that might be used later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  if (error) console.log("Error loading municipalities:", error);

  // Update search results when query changes
  useEffect(() => {
    if (searchQuery && searchQuery.length > 1 && municipalities.length > 0) {
      setSearchResults(searchByName(municipalities, searchQuery).slice(0, 7));
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, municipalities]);

  // Auto-calculate totalSpent from the sum of all plan actual values
  useEffect(() => {
    // Create a string representation of the actual values to use as dependency
    const actuals = formData.plans.map((plan) => plan.actual);

    const totalActual = actuals.reduce(
      (sum, actual) => sum + (Number(actual) || 0),
      0
    );

    // Only update if the value has changed to avoid infinite loops
    if (totalActual !== formData.totalSpent) {
      setFormData((prev) => ({
        ...prev,
        totalSpent: totalActual,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formData.plans.map((plan) => plan.actual))]);

  // Select municipality from search results
  const selectMunicipality = (municipality: Municipality) => {
    setFormData((prev) => ({
      ...prev,
      muniCode: municipality.code,
      muniName: municipality.name,
      province: municipality.province,
      website: municipality.website,
    }));
    setSearchQuery("");
    setShowResults(false);
  };

  // Handle text input changes for main form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If changing municipality code, try to find the municipality
    if (name === "muniCode" && value.length >= 8 && municipalities.length > 0) {
      const municipality = findByCode(municipalities, value);
      if (municipality) {
        setFormData((prev) => ({
          ...prev,
          muniName: municipality.name,
          province: municipality.province,
          website: municipality.website,
        }));
      }
    }

    // If changing municipality name, update the search query
    if (name === "muniName") {
      setSearchQuery(value);
    }
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : Number(value),
    }));
  };

  // Handle select changes
  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    handlePlanTextChange(index, "category", e.target.value);
  };

  // Add a new plan item
  const addPlanItem = () => {
    setFormData((prev) => {
      const updatedPlans = [...prev.plans, { ...emptyPlanItem }];
      return {
        ...prev,
        plans: updatedPlans,
      };
    });
  };

  // Remove a plan item
  const removePlanItem = (index: number) => {
    setFormData((prev) => {
      const updatedPlans = prev.plans.filter((_, i) => i !== index);
      return {
        ...prev,
        plans: updatedPlans,
      };
    });
  };

  // Handle plan item changes for text fields
  const handlePlanTextChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const updatedPlans = [...prev.plans];
      updatedPlans[index] = {
        ...updatedPlans[index],
        [field]: value,
      };
      return {
        ...prev,
        plans: updatedPlans,
      };
    });
  };

  // Handle plan item changes for number fields
  const handlePlanNumberChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const updatedPlans = [...prev.plans];
      updatedPlans[index] = {
        ...updatedPlans[index],
        [field]: value === "" ? 0 : Number(value),
      };
      return {
        ...prev,
        plans: updatedPlans,
      };
    });
  };

  // Generate JSON output function removed as we're using direct MongoDB storage

  // Save to MongoDB
  const saveToMongoDB = async () => {
    // Validate form data
    if (!formData.muniCode || !formData.muniName || !formData.province) {
      showToast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "กรุณากรอกรหัส อปท., ชื่อเทศบาล และจังหวัด",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // Set loading state
      setIsSaving(true);

      // Check server connectivity first
      const isConnected = await checkServerConnectivity();

      // If server is unavailable, use DEV_MODE (localStorage)
      if (!isConnected) {
        // Simulate some delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 800));

        showToast({
          title: "เซิร์ฟเวอร์ไม่พร้อมใช้งาน",
          description: "ระบบจะบันทึกข้อมูลแบบออฟไลน์",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });

        // Create formatted data structure for local storage
        // Include budget fields to maintain compatibility with existing data format
        const localData = {
          "รหัส อปท.": [formData.muniCode],
          "ชื่ออปท.": [formData.muniName],
          จังหวัด: [formData.province],
          เว็บไซต์: [formData.website],
          งบประมาณรวม: [formData.totalSpent], // For backward compatibility
          รายจ่ายจริงรวม: [formData.totalSpent],
          แผนงบประมาณ: formData.plans.map((plan) => ({
            ประเภท: plan.category,
            แผนงาน: plan.plan,
            งบประมาณ: plan.actual, // For backward compatibility
            ใช้จริง: plan.actual,
          })),
        };

        const result = await DEV_MODE.saveBudgetData(localData);

        if (result.success) {
          showToast({
            title: `บันทึกข้อมูลสำเร็จ (แบบออฟไลน์)`,
            description: "ข้อมูลถูกบันทึกลงในเครื่องของคุณเท่านั้น",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          throw new Error(result.error || "ไม่สามารถบันทึกข้อมูลได้");
        }

        return;
      }

      // Determine the server URL
      const apiBaseUrl = process.env.REACT_APP_API_URL || "";
      const isLocalDev =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const baseUrl = apiBaseUrl || (isLocalDev ? "http://localhost:5000" : "");
      const saveFormDataUrl = `${baseUrl}/api/saveFormData`;

      // Create request body with the format expected by our API
      // Include budget fields to maintain compatibility with existing MongoDB schema
      const requestBody = {
        muniCode: formData.muniCode,
        muniName: formData.muniName,
        province: formData.province,
        website: formData.website,
        totalBudget: formData.totalSpent, // For backward compatibility, use totalSpent as totalBudget
        totalSpent: formData.totalSpent,
        plans: formData.plans.map((plan) => ({
          category: plan.category,
          plan: plan.plan,
          budget: plan.actual, // For backward compatibility, use actual as budget
          actual: plan.actual,
        })),
      };

      // Make API call to our Express backend
      const response = await fetch(saveFormDataUrl, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Check if response is ok
      if (!response.ok) {
        // Check for specific status codes
        if (response.status === 403) {
          throw new Error(
            `เข้าถึงไม่ได้ (403 Forbidden): ไม่มีสิทธิ์ในการบันทึกข้อมูล`
          );
        }

        // Try to get error details from response
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.message || `เกิดข้อผิดพลาด (${response.status})`;
        } catch (e) {
          // If we can't parse the JSON
          errorMessage = `เกิดข้อผิดพลาด (${response.status}): ไม่สามารถรับข้อมูลจากเซิร์ฟเวอร์`;
        }

        throw new Error(errorMessage);
      }

      // Try to parse the JSON response, handle empty responses gracefully
      let result;
      try {
        const text = await response.text();
        result = text
          ? JSON.parse(text)
          : { success: false, message: "ไม่มีข้อมูลตอบกลับจากเซิร์ฟเวอร์" };
      } catch (error) {
        console.error("Error parsing response:", error);
        throw new Error("ไม่สามารถประมวลผลข้อมูลตอบกลับจากเซิร์ฟเวอร์");
      }

      if (result.success) {
        showToast({
          title: `บันทึกข้อมูลสำเร็จ (${
            result.operation === "inserted" ? "เพิ่มข้อมูลใหม่" : "อัปเดตข้อมูล"
          })`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        showToast({
          title: "เกิดข้อผิดพลาด",
          description: result.message || "ไม่สามารถบันทึกข้อมูลได้",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error saving form data:", error);
      showToast({
        title: "เกิดข้อผิดพลาด",
        description:
          error instanceof Error
            ? error.message
            : "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // Always clear loading state
      setIsSaving(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData(emptyFormData);
    showToast({
      title: "ล้างฟอร์มเรียบร้อย",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="900px" mx="auto">
      {/* Saving Indicator Overlay */}
      {isSaving && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.5)"
          zIndex="9999"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            bg="white"
            p={5}
            borderRadius="md"
            textAlign="center"
            boxShadow="lg"
            maxW="300px"
            width="100%"
          >
            <div
              style={{
                display: "inline-block",
                width: "40px",
                height: "40px",
                margin: "0 auto 12px auto",
                border: "4px solid rgba(0, 0, 0, 0.1)",
                borderTopColor: "#38B2AC",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              กำลังบันทึกข้อมูล
            </Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              โปรดรอสักครู่...
            </Text>
          </Box>
        </Box>
      )}

      {/* Server Status Indicator */}
      {serverStatus === "disconnected" && (
        <Box
          p={2}
          mb={3}
          bg="red.100"
          color="red.800"
          rounded="md"
          border="1px solid"
          borderColor="red.300"
          fontSize="sm"
        >
          <Text fontWeight="medium">
            ⚠️ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้
            ระบบจะบันทึกข้อมูลลงในเครื่องของคุณเท่านั้น
          </Text>
        </Box>
      )}

      {/* Section 1: Municipal Info */}
      <Box p={5} rounded="lg" shadow="sm" mb={4} bg="white">
        <Heading fontSize="lg" fontWeight="bold" mb={3}>
          🏛️ ข้อมูลเทศบาล (Municipal Info)
        </Heading>
        <Flex wrap="wrap" margin="-8px">
          <Box width={{ base: "80%", md: "50%" }} p="8px">
            <Text fontWeight="medium" mb={2} fontSize="sm">
              รหัส อปท.
            </Text>
            <Input
              name="muniCode"
              value={formData.muniCode}
              onChange={handleInputChange}
              placeholder="รหัส อปท."
              rounded="md"
              variant="outline"
              borderColor="gray.300"
              _focus={{ borderColor: "green.400" }}
              size="sm"
              height="32px"
            />
          </Box>

          <Box width={{ base: "100%", md: "50%" }} p="8px" position="relative">
            <Text fontWeight="medium" mb={2} fontSize="sm">
              ชื่อเทศบาล
            </Text>
            <Input
              name="muniName"
              value={formData.muniName}
              onChange={handleInputChange}
              placeholder="ชื่อเทศบาล"
              rounded="md"
              variant="outline"
              borderColor="gray.300"
              _focus={{ borderColor: "green.400" }}
              size="sm"
              height="32px"
            />
            {/* Search results dropdown */}
            {showResults && searchResults.length > 0 && (
              <Box
                position="absolute"
                zIndex={10}
                width="calc(100% - 16px)"
                bg="white"
                shadow="md"
                rounded="md"
                mt={1}
                maxH="150px"
                overflowY="auto"
              >
                <Box>
                  {searchResults.map((muni) => (
                    <Box
                      key={muni.code}
                      p={1.5}
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                      onClick={() => selectMunicipality(muni)}
                    >
                      <Text fontWeight="medium" fontSize="sm">
                        {muni.name}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {muni.province} (รหัส: {muni.code})
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Box width={{ base: "100%", md: "50%" }} p="8px">
            <Text fontWeight="medium" mb={2} fontSize="sm">
              จังหวัด
            </Text>
            <Input
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              placeholder="จังหวัด"
              rounded="md"
              variant="outline"
              borderColor="gray.300"
              _focus={{ borderColor: "green.400" }}
              size="sm"
              height="32px"
            />
          </Box>

          <Box width={{ base: "100%", md: "50%" }} p="8px">
            <Text fontWeight="medium" mb={2} fontSize="sm">
              เว็บไซต์
            </Text>
            <Input
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="www.example.go.th"
              rounded="md"
              variant="outline"
              borderColor="gray.300"
              _focus={{ borderColor: "green.400" }}
              size="sm"
              height="32px"
            />
          </Box>

          <Box width={{ base: "100%", md: "50%" }} p="8px">
            <Text fontWeight="medium" mb={2} fontSize="sm">
              รายจ่ายจริงรวม (คำนวณอัตโนมัติ)
            </Text>
            <Box position="relative">
              <Input
                name="totalSpent"
                value={formData.totalSpent}
                readOnly
                bg="gray.50"
                type="number"
                min={0}
                rounded="md"
                borderColor="gray.300"
                _focus={{ borderColor: "green.400" }}
                paddingRight="40px"
                size="sm"
                height="32px"
              />
              <Text
                position="absolute"
                right="10px"
                top="50%"
                transform="translateY(-50%)"
                pointerEvents="none"
                color="gray.500"
                fontSize="xs"
              >
                บาท
              </Text>
              <Text fontSize="xs" color="gray.500" mt={1}>
                *คำนวณจากผลรวมของ "ใช้จริง" ทั้งหมดในแผนงบประมาณ
              </Text>
            </Box>
          </Box>
        </Flex>
      </Box>

      {/* Section 2: Budget Plan Details */}
      <Box p={5} rounded="lg" shadow="sm" mb={4} bg="white">
        <Flex justifyContent="space-between" alignItems="center" mb={3}>
          <Heading fontSize="lg" fontWeight="bold">
            📊 รายละเอียดแผนงบประมาณ
          </Heading>
          <Button
            colorScheme="green"
            variant="solid"
            onClick={addPlanItem}
            size="sm"
            px={3}
            height="30px"
          >
            + เพิ่มแผนงาน
          </Button>
        </Flex>

        {/* Category color legend */}
        <Flex wrap="wrap" mb={4} gap={2}>
          {CATEGORIES.map((category) => (
            <Box
              key={category}
              px={2}
              py={1}
              borderRadius="md"
              fontSize="xs"
              fontWeight="medium"
              bg={getCategoryLabelBgColor(category)}
              color={getCategoryTextColor(category)}
            >
              {category}
            </Box>
          ))}
        </Flex>

        {formData.plans.length === 0 ? (
          <Box p={3} bg="gray.50" rounded="md" textAlign="center">
            <Text color="gray.500" fontSize="sm">
              ยังไม่มีแผนงบประมาณ กรุณาเพิ่มแผนงบประมาณ
            </Text>
          </Box>
        ) : (
          <Box>
            {formData.plans.map((plan, index) => (
              <Box
                key={index}
                p={3}
                rounded="md"
                borderWidth="1px"
                borderColor="gray.200"
                mb={3}
                bg={getCategoryBgColor(plan.category)}
              >
                <Flex justify="space-between" mb={2} alignItems="center">
                  <Heading fontSize="sm">แผนงบประมาณ #{index + 1}</Heading>
                  <Flex alignItems="center">
                    <Box
                      px={2}
                      py={1}
                      mr={2}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="medium"
                      bg={getCategoryLabelBgColor(plan.category)}
                      color={getCategoryTextColor(plan.category)}
                    >
                      {plan.category}
                    </Box>
                    <Button
                      size="xs"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removePlanItem(index)}
                      height="24px"
                    >
                      ลบ
                    </Button>
                  </Flex>
                </Flex>
                <Flex wrap="wrap" margin="-8px">
                  <Box width={{ base: "100%", md: "50%" }} p="8px">
                    <Text fontWeight="medium" mb={2} fontSize="sm">
                      ประเภท
                    </Text>
                    <Box position="relative">
                      <select
                        value={plan.category}
                        onChange={(e) => handleSelectChange(e, index)}
                        style={{
                          width: "100%",
                          padding: "6px 10px",
                          borderRadius: "0.375rem",
                          border: "1px solid",
                          borderColor: "#CBD5E0",
                          outline: "none",
                          height: "32px",
                          fontSize: "14px",
                          backgroundColor: getCategorySelectBgColor(
                            plan.category
                          ),
                        }}
                      >
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </Box>
                  </Box>

                  <Box width={{ base: "100%", md: "50%" }} p="8px">
                    <Text fontWeight="medium" mb={2} fontSize="sm">
                      แผนงาน
                    </Text>
                    <Input
                      value={plan.plan}
                      onChange={(e) =>
                        handlePlanTextChange(index, "plan", e.target.value)
                      }
                      placeholder="แผนงาน"
                      rounded="md"
                      variant="outline"
                      borderColor="gray.300"
                      _focus={{ borderColor: "green.400" }}
                      size="sm"
                      height="32px"
                    />
                  </Box>

                  <Box width={{ base: "100%", md: "50%" }} p="8px">
                    <Text fontWeight="medium" mb={2} fontSize="sm">
                      ใช้จริง
                    </Text>
                    <Box position="relative">
                      <Input
                        value={plan.actual}
                        onChange={(e) =>
                          handlePlanNumberChange(
                            index,
                            "actual",
                            e.target.value
                          )
                        }
                        type="number"
                        min={0}
                        rounded="md"
                        borderColor="gray.300"
                        _focus={{ borderColor: "green.400" }}
                        paddingRight="40px"
                        size="sm"
                        height="32px"
                      />
                      <Text
                        position="absolute"
                        right="10px"
                        top="50%"
                        transform="translateY(-50%)"
                        pointerEvents="none"
                        color="gray.500"
                        fontSize="xs"
                      >
                        บาท
                      </Text>
                    </Box>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Box>
        )}

        {formData.plans.length > 0 && (
          <Box mt={3} textAlign="center">
            <Button
              colorScheme="green"
              variant="outline"
              onClick={addPlanItem}
              size="sm"
              px={3}
              height="30px"
            >
              + เพิ่มแผนงาน
            </Button>
          </Box>
        )}
      </Box>

      {/* Section 3: Actions */}
      <Box p={4} rounded="lg" shadow="sm" mb={4} bg="white">
        <Heading fontSize="lg" fontWeight="bold" mb={3}>
          🔄 ดำเนินการ (Actions)
        </Heading>
        <Box>
          <Flex
            flexWrap={{ base: "wrap", md: "nowrap" }}
            gap="10px"
            justifyContent="center"
            mb={3}
          >
            <Button
              colorScheme="teal"
              onClick={saveToMongoDB}
              loading={isSaving}
              flex={{ base: "1", md: "auto" }}
              size="sm"
              height="32px"
              px={4}
              fontWeight="bold"
            >
              {isSaving ? "กำลังบันทึก..." : "💾 บันทึกข้อมูล"}
            </Button>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={resetForm}
              disabled={isSaving}
              flex={{ base: "1", md: "auto" }}
              size="sm"
              height="32px"
              px={4}
              fontWeight="bold"
            >
              🔄 รีเซ็ตฟอร์ม
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default MunicipalityForm;
