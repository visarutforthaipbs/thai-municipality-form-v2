import React from "react";
import { Box, CloseButton, createToaster } from "@chakra-ui/react";

type ToastProps = {
  title?: string;
  description?: string;
  status?: "info" | "warning" | "success" | "error";
  duration?: number;
  isClosable?: boolean;
  onClose?: () => void;
};

// Create a simple toast component
const Toast = ({
  title,
  description,
  status = "info",
  isClosable = true,
  onClose,
}: ToastProps) => {
  // Map status to colors
  const bgColors = {
    info: "blue.500",
    success: "green.500",
    warning: "orange.500",
    error: "red.500",
  };

  return (
    <Box
      role="alert"
      borderRadius="md"
      boxShadow="lg"
      p={4}
      bg={bgColors[status as keyof typeof bgColors]}
      color="white"
      position="relative"
    >
      {title && <Box fontWeight="bold">{title}</Box>}
      {description && <Box mt={1}>{description}</Box>}
      {isClosable && (
        <CloseButton
          position="absolute"
          right={2}
          top={2}
          color="white"
          onClick={onClose}
        />
      )}
    </Box>
  );
};

// Create and export the toaster
export const { toast, ToastProvider } = createToaster({
  defaultOptions: {
    position: "top-right",
    duration: 5000,
  },
  render: (props: ToastProps) => <Toast {...props} />,
});

// Export toast as default for convenience
export default toast;
