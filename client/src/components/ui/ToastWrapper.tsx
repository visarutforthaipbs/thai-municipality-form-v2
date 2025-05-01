import React from "react";
import { Box, CloseButton } from "@chakra-ui/react";

// Simple wrapper component that does nothing special
export const ToastWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

// Export the wrapper for use in provider.tsx
export default ToastWrapper;
