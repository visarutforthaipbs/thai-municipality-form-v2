import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import MunicipalityForm from "./components/MunicipalityForm";
import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    <Flex
      width="100%"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      pt={{ base: 4, md: 8 }}
      pb={{ base: 8, md: 12 }}
      bg="#f5f8fa"
      px={{ base: 4, md: 8 }}
    >
      <Box
        maxWidth="1000px"
        width="100%"
        mx="auto"
        borderRadius="md"
        bg="white"
        overflow="visible"
        mb={{ base: 6, md: 10 }}
      >
        <Header />
        <Box p={{ base: 4, md: 6 }}>
          <MunicipalityForm />
        </Box>
      </Box>
    </Flex>
  );
}

export default App;
