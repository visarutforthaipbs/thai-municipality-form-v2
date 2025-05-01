/**
 * MongoDB service for browser environment
 * This service uses fetch API to communicate with a backend API
 * that handles the actual MongoDB operations.
 */

// Determine the API endpoint URL based on environment
const getApiUrl = () => {
  // Check if deployment URL is set in environment
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // For local development
  const isLocalDev =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  return isLocalDev ? "http://localhost:5000/api" : "/api";
};

// API endpoint URL
const API_URL = getApiUrl();

// Common fetch options
const getFetchOptions = (method: string, body?: any) => {
  const options: RequestInit = {
    method,
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

/**
 * Save budget data to MongoDB via API
 */
export async function saveBudgetData(data: any) {
  try {
    const response = await fetch(
      `${API_URL}/saveFormData`,
      getFetchOptions("POST", data)
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to save data");
    }

    return {
      success: true,
      operation: result.operation,
    };
  } catch (error: any) {
    console.error("Error saving budget data:", error);
    return {
      success: false,
      error: error?.message || "Unknown error",
    };
  }
}

/**
 * Get all budget data from MongoDB via API
 */
export async function getAllBudgetData() {
  try {
    const response = await fetch(
      `${API_URL}/municipalities`,
      getFetchOptions("GET")
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch data");
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Error getting budget data:", error);
    return {
      success: false,
      error: error?.message || "Unknown error",
    };
  }
}

/**
 * Get budget data for a specific municipality via API
 */
export async function getBudgetDataByMuniCode(muniCode: string) {
  try {
    const response = await fetch(
      `${API_URL}/municipalities/${muniCode}`,
      getFetchOptions("GET")
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch data");
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Error getting budget data:", error);
    return {
      success: false,
      error: error?.message || "Unknown error",
    };
  }
}

// For development/testing in browser environment
// Simulated MongoDB functionality with localStorage
export const DEV_MODE = {
  saveBudgetData: async (data: any) => {
    try {
      const muniCode = data["รหัส อปท."][0];
      const storageKey = `municipality_budget_${muniCode}`;

      // Check if this municipality's data already exists
      const existingDataStr = localStorage.getItem(storageKey);
      const operation = existingDataStr ? "updated" : "inserted";

      // Save data to localStorage
      localStorage.setItem(storageKey, JSON.stringify(data));

      return { success: true, operation };
    } catch (error: any) {
      console.error("Error saving budget data to localStorage:", error);
      return {
        success: false,
        error: error?.message || "Unknown error",
      };
    }
  },

  getAllBudgetData: async () => {
    try {
      const data: any[] = [];

      // Get all items with the municipality_budget_ prefix
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("municipality_budget_")) {
          const item = localStorage.getItem(key);
          if (item) {
            data.push(JSON.parse(item));
          }
        }
      }

      return { success: true, data };
    } catch (error: any) {
      console.error("Error getting budget data from localStorage:", error);
      return {
        success: false,
        error: error?.message || "Unknown error",
      };
    }
  },

  getBudgetDataByMuniCode: async (muniCode: string) => {
    try {
      const storageKey = `municipality_budget_${muniCode}`;
      const dataStr = localStorage.getItem(storageKey);

      if (!dataStr) {
        return {
          success: true,
          data: null,
        };
      }

      return {
        success: true,
        data: JSON.parse(dataStr),
      };
    } catch (error: any) {
      console.error("Error getting budget data from localStorage:", error);
      return {
        success: false,
        error: error?.message || "Unknown error",
      };
    }
  },
};
