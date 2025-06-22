import { api } from "@/src/lib/axios";
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  LLMModel,
} from "../types/summarize.type";
import { getUserId } from "../contexts/user-provider";

export class SummarizeService {
  static async listAvailableModels(): Promise<LLMModel[]> {
    const response = await api.get("/llm/models");
    return response.data.models;
  }

  static async analyzeText(payload: AnalyzeRequest): Promise<AnalyzeResponse> {
    const userId = getUserId();
    if (!userId) throw new Error("User ID not found in localStorage");

    const response = await api.post(
      "/llm/analyze",
      { ...payload },
      {
        headers: { "user-id": userId },
      }
    );

    return response.data;
  }

  static async analyzeFile(
    file: File,
    payload: Omit<AnalyzeRequest, "text">
  ): Promise<AnalyzeResponse> {
    const userId = getUserId();
    if (!userId) throw new Error("User ID not found in localStorage");

    const formData = new FormData();
    formData.append("model", payload.model);
    formData.append("language", payload.language ?? "eng");
    payload.entities?.forEach((entity) => {
      formData.append("entities", entity);
    });
    formData.append("file", file);

    const response = await api.post("/llm/analyze-file", formData, {
      headers: {
        "user-id": userId,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }
}
