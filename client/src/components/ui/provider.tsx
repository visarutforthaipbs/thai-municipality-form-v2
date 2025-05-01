import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import ToastWrapper from "./ToastWrapper";
import thaiSystem from "../../theme";

// Add these styles to the head to improve UI appearance
const injectGlobalStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    body {
      color: #2D3748;
      font-family: 'DB Helvethaica X', sans-serif;
      padding: 6px 6px;
      margin: 30px 30px;
    }
    
    input, button, select {
      border-radius: 0.375rem !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
      font-family: 'DB Helvethaica X', sans-serif !important;
      font-size: 14px !important;
    }
    
    input {
      padding: 6px 6px !important;
      min-height: 6px !important;
    }
    
    button {
      font-weight: 600 !important;
      transition: all 0.2s !important;
      padding: 8px 16px !important;
      height: 32px !important;
    }
    
    button:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 10px -3px rgba(0, 0, 0, 0.1), 0 3px 4px -2px rgba(0, 0, 0, 0.05) !important;
    }
    
    .chakra-container {
      max-width: 900px !important;
      padding: 0 0.9rem !important;
    }
    
    /* Fix for header styling */
    header {
      padding: 1rem 1.2rem !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12) !important;
      border-top-left-radius: 0.375rem !important;
      border-top-right-radius: 0.375rem !important;
      overflow: visible !important;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: 'DB Helvethaica X', sans-serif !important;
      font-weight: 600 !important;
      margin-bottom: 10px !important;
    }
    
    p, span, div {
      font-family: 'DB Helvethaica X', sans-serif !important;
    }
    
    .chakra-form__label {
      margin-bottom: 5px !important;
    }
    
    [role="alert"] {
      border-radius: 0.375rem !important;
    }
    
    .chakra-input {
      padding: 5px 8px !important;
      height: 32px !important;
    }
    
    .chakra-button {
      padding: 8px 16px !important;
      height: 32px !important;
    }
    
    /* Improved form section spacing */
    .chakra-stack > * {
      margin-bottom: 10px !important;
    }
    
    /* Form container styles */
    .form-container {
      margin-bottom: 15px !important;
      padding: 24px !important;
    }
  `;
  document.head.appendChild(style);
};

interface ProviderProps {
  children: React.ReactNode;
}

export function Provider({ children }: ProviderProps) {
  // Inject global styles on mount
  React.useEffect(() => {
    injectGlobalStyles();
  }, []);

  return (
    <ChakraProvider value={thaiSystem}>
      <ToastWrapper>{children}</ToastWrapper>
    </ChakraProvider>
  );
}
