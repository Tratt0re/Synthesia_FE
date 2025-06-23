// services/user.service.ts
import { api } from "@/src/lib/axios";
import {
  UserCreateRequest,
  UserUpdateRequest,
  UserResponse,
} from "@/src/types/user.type";
import { ProcessedResult } from "../types/processed-result.type";

export class UserService {
  static async createUser(payload: UserCreateRequest): Promise<UserResponse> {
    const response = await api.post("/user", { ...payload });
    return response.data;
  }

  static async getUser(id: string): Promise<UserResponse> {
    const response = await api.get(`/user/${id}`);
    return response.data;
  }

  static async updateUser(
    id: string,
    updates: UserUpdateRequest
  ): Promise<UserResponse> {
    const response = await api.put(`/user/${id}`, { ...updates });
    return response.data;
  }

  static async getUserResults(
    userId: string,
    skip = 0,
    limit = 10
  ): Promise<ProcessedResult[]> {
    const response = await api.get(`/user/${userId}/results`, {
      params: { skip, limit },
    });
    return response.data.results as ProcessedResult[];
  }

  static async deleteUserResult(
    userId: string,
    resultId: string
  ): Promise<boolean> {
    try {
      await api.delete(`/user/${userId}/results/${resultId}`);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
