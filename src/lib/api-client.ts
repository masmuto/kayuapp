import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}/api${endpoint}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      // Show toast error for user feedback
      if (options.method !== "GET") {
        toast.error(errorMessage);
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Dashboard
  async getDashboardStats() {
    return this.request("/dashboard/stats");
  }

  // Inventory
  async getInventory() {
    return this.request("/inventory");
  }

  async createInventory(data: any) {
    return this.request("/inventory", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateInventory(id: string, data: any) {
    return this.request(`/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteInventory(id: string) {
    return this.request(`/inventory/${id}`, {
      method: "DELETE",
    });
  }

  // Contacts
  async getContacts() {
    return this.request("/contacts");
  }

  async createContact(data: any) {
    return this.request("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Sales
  async getSales() {
    return this.request("/sales");
  }

  async createSale(data: any) {
    return this.request("/sales", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Expenses
  async getExpenses() {
    return this.request("/expenses");
  }

  async createExpense(data: any) {
    return this.request("/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Database health
  async getDatabaseHealth() {
    return this.request("/database/health");
  }
}

export const apiClient = new ApiClient();