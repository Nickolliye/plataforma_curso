class ApiService {
  private baseUrl = "http://localhost:4000";

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async getAll<T>(resource: string): Promise<T[]> {
    return this.request<T[]>(`/${resource}`);
  }

  async getById<T>(resource: string, id: string): Promise<T> {
    return this.request<T>(`/${resource}/${id}`);
  }

  async create<T>(resource: string, data: any): Promise<T> {
    return this.request<T>(`/${resource}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update<T>(resource: string, id: string, data: any): Promise<T> {
    return this.request<T>(`/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(resource: string, id: string): Promise<any> {
    return this.request(`/${resource}/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
export default apiService;
