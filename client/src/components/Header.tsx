import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

const Header: React.FC = () => {
  return (
    <Box
      as="header"
      bgColor="#319795"
      color="white"
      borderTopRadius="md"
      mb={6}
      boxShadow="0 3px 12px rgba(0,0,0,0.15)"
    >
      <Flex direction="column" align="center" justify="center">
        <Heading
          size="xl"
          mb={3}
          textAlign="center"
          fontWeight="semibold"
          color={"black"}
        >
          ระบบกรอกข้อมูลงบประมาณเทศบาล
        </Heading>
      </Flex>
    </Box>
  );
};

export default Header;
