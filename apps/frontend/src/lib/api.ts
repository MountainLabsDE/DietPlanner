class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string>),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || 'An error occurred',
        data.errors
      );
    }

    return data;
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  setTokens(accessToken: string, refreshToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.request<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string) {
    return this.request<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    this.clearTokens();
  }

  async updateProfile(data: { firstName?: string; lastName?: string; avatarUrl?: string }) {
    return this.request<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isVerified: boolean;
      avatarUrl: string | null;
      createdAt: string;
    }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async get<D = any>(endpoint: string) {
    return this.request<D>(endpoint, { method: 'GET' });
  }

  async post<D = any>(endpoint: string, data: any) {
    return this.request<D>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<D = any>(endpoint: string, data: any) {
    return this.request<D>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<D = any>(endpoint: string) {
    return this.request<D>(endpoint, { method: 'DELETE' });
  }

  // Recipe methods
  async getRecipes(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
    restrictions?: string[];
    maxCalories?: number;
    mealType?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.tags) queryParams.append('tags', params.tags.join(','));
    if (params?.restrictions) queryParams.append('restrictions', params.restrictions.join(','));
    if (params?.maxCalories) queryParams.append('maxCalories', params.maxCalories.toString());
    if (params?.mealType) queryParams.append('mealType', params.mealType);

    const queryString = queryParams.toString();
    const endpoint = `/recipes${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint, { method: 'GET' });
  }

  async getRecipe(id: string): Promise<any> {
    return this.request(`/recipes/${id}`, { method: 'GET' });
  }

  async createRecipe(data: any) {
    return this.request('/recipes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRecipe(id: string, data: any) {
    return this.request(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRecipe(id: string) {
    return this.request(`/recipes/${id}`, { method: 'DELETE' });
  }

  async getRecipesByTag(tag: string) {
    return this.request(`/recipes/tags/${tag}`, { method: 'GET' });
  }

  async getQuickRecipes(maxPrepTime?: number) {
    const queryParams = maxPrepTime ? `?maxPrepTime=${maxPrepTime}` : '';
    return this.request(`/recipes/quick${queryParams}`, { method: 'GET' });
  }

  // Meal Plan methods
  async getMealPlans(params?: {
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/meal-plans${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint, { method: 'GET' });
  }

  async getMealPlan(id: string) {
    return this.request(`/meal-plans/${id}`, { method: 'GET' });
  }

  async generateMealPlan(config: any) {
    return this.request(`/meal-plans/generate`, {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async deleteMealPlan(id: string) {
    return this.request(`/meal-plans/${id}`, { method: 'DELETE' });
  }

  async toggleMealPlanFavorite(id: string) {
    return this.request(`/meal-plans/${id}/favorite`, {
      method: 'POST',
    });
  }

  async shareMealPlan(id: string) {
    return this.request(`/meal-plans/${id}/share`, {
      method: 'POST',
    });
  }

  async exportMealPlan(id: string, format: 'pdf' | 'csv' | 'json') {
    const response = await fetch(`${this.baseUrl}/meal-plans/${id}/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
    });
    
    if (!response.ok) {
      throw new ApiError(
        response.status,
        'Export failed'
      );
    }

    const blob = await response.blob();
    return blob;
  }

  // Diet Profile methods
  async getDietProfiles(predefinedOnly = false, page = 1, limit = 10): Promise<any> {
    const queryParams = new URLSearchParams();
    if (predefinedOnly) queryParams.append('predefinedOnly', 'true');
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    return this.request(`/diet-profiles?${queryParams}`, { method: 'GET' });
  }

  async getPredefinedProfiles(): Promise<any> {
    return this.request('/diet-profiles/predefined', { method: 'GET' });
  }

  async getDietProfile(id: string): Promise<any> {
    return this.request(`/diet-profiles/${id}`, { method: 'GET' });
  }

  async createDietProfile(data: any): Promise<any> {
    return this.post('/diet-profiles', data);
  }

  async updateDietProfile(id: string, data: any): Promise<any> {
    return this.put(`/diet-profiles/${id}`, data);
  }

  async deleteDietProfile(id: string): Promise<any> {
    return this.delete(`/diet-profiles/${id}`);
  }

  async combineDietProfiles(name: string, profileIds: string[]): Promise<any> {
    return this.post('/diet-profiles/combine', { name, profileIds });
  }

  // AI methods
  async generateMeals(config: {
    dietProfileId?: string;
    dailyCalories?: number;
    proteinPercentage?: number;
    carbsPercentage?: number;
    fatPercentage?: number;
    restrictions?: string[];
    days?: number;
    preferences?: any;
  }) {
    return this.request('/ai/generate-meals', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async generateRecipe(config: {
    type?: string;
    restrictions?: string[];
    maxCalories?: number;
    cuisine?: string;
    mealType?: string;
  }) {
    return this.request('/ai/generate-recipe', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async analyzeMeal(mealData: any) {
    return this.request('/ai/analyze-meal', {
      method: 'POST',
      body: JSON.stringify(mealData),
    });
  }

  // Aliases for compatibility with frontend
  async generateAIMeals(config: any) {
    return this.generateMeals(config);
  }

  async generateAIRecipe(config: any) {
    return this.generateRecipe(config);
  }

  async optimizeAIMealPlan(config: any) {
    return this.request(`/ai/optimize-meal-plan`, {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async analyzeAIMeal(config: any) {
    return this.analyzeMeal(config);
  }
}

export const api = new ApiClient();
