import { useEffect, useState } from "react";

export interface Municipality {
  id: number;
  code: string;
  name: string;
  type: string;
  district: string;
  province: string;
  region: string;
  website: string;
}

/**
 * Custom hook to load municipality data
 */
export const useMunicipalityData = () => {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/muni-list.csv");
        const csvText = await response.text();

        // Parse CSV
        const lines = csvText.split("\n").filter((line) => line.trim() !== "");
        const headers = lines[0].split(",");

        const parsedData: Municipality[] = lines.slice(1).map((line, index) => {
          const values = line.split(",");
          return {
            id: index + 1,
            code: values[1] || "",
            name: values[2] || "",
            type: values[3] || "",
            district: values[4] || "",
            province: values[5] || "",
            region: values[6] || "",
            website: values[7] || "",
          };
        });

        setMunicipalities(parsedData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading municipality data:", err);
        setError("Failed to load municipality data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { municipalities, loading, error };
};

/**
 * Get all unique provinces from the municipality list
 */
export const getProvinces = (municipalities: Municipality[]): string[] => {
  const uniqueProvinces: { [key: string]: boolean } = {};
  municipalities.forEach((m) => {
    uniqueProvinces[m.province] = true;
  });
  return Object.keys(uniqueProvinces).sort();
};

/**
 * Filter municipalities by province
 */
export const filterByProvince = (
  municipalities: Municipality[],
  province: string
): Municipality[] => {
  return municipalities.filter((m) => m.province === province);
};

/**
 * Find a municipality by code
 */
export const findByCode = (
  municipalities: Municipality[],
  code: string
): Municipality | undefined => {
  return municipalities.find((m) => m.code === code);
};

/**
 * Search municipalities by name
 */
export const searchByName = (
  municipalities: Municipality[],
  query: string
): Municipality[] => {
  const lowerQuery = query.toLowerCase().trim();
  return municipalities.filter(
    (m) =>
      m.name.toLowerCase().includes(lowerQuery) || m.code.includes(lowerQuery)
  );
};
