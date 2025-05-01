import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";

const Header: React.FC = () => {
  return (
    <Box
      as="header"
      bgColor="#319795"
      color="white"
      borderTopRadius="md"
      mb={4}
      boxShadow="0 2px 8px rgba(0,0,0,0.15)"
      py={2}
    >
      <Flex direction="column" align="center" justify="center">
        <Heading
          size="lg"
          mb={2}
          textAlign="center"
          fontWeight="semibold"
          color={"black"}
          fontSize="1.5rem"
        >
          ระบบกรอกข้อมูลงบประมาณเทศบาล
        </Heading>
      </Flex>
    </Box>
  );
};

export default Header;
