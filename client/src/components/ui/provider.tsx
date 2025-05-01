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
      padding: 10px 10px;
      margin: 50px 50px;
    }
    
    input, button, select {
      border-radius: 0.75rem !important;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
      font-family: 'DB Helvethaica X', sans-serif !important;
      font-size: 16px !important;
    }
    
    input {
      padding: 10px 10px !important;
      min-height: 10px !important;
    }
    
    button {
      font-weight: 600 !important;
      transition: all 0.2s !important;
      padding: 12px 24px !important;
    }
    
    button:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
    }
    
    .chakra-container {
      max-width: 1200px !important;
      padding: 0 1.5rem !important;
    }
    
    /* Fix for header styling */
    header {
      padding: 1.75rem 2rem !important;
      box-shadow: 0 3px 12px rgba(0,0,0,0.12) !important;
      border-top-left-radius: 0.375rem !important;
      border-top-right-radius: 0.375rem !important;
      overflow: visible !important;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: 'DB Helvethaica X', sans-serif !important;
      font-weight: 600 !important;
      margin-bottom: 16px !important;
    }
    
    p, span, div {
      font-family: 'DB Helvethaica X', sans-serif !important;
    }
    
    .chakra-form__label {
      margin-bottom: 8px !important;
    }
    
    [role="alert"] {
      border-radius: 0.5rem !important;
    }
    
    .chakra-input {
      padding: 8px 12px !important;
      height: auto !important;
    }
    
    .chakra-button {
      padding: 14px 24px !important;
      height: auto !important;
    }
    
    /* Improved form section spacing */
    .chakra-stack > * {
      margin-bottom: 16px !important;
    }
    
    /* Form container styles */
    .form-container {
      margin-bottom: 24px !important;
      padding: 40px !important;
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
