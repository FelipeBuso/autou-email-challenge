import axios from "axios";

export interface ClassificationResult {
  original_text: string;
  preprocessed_text: string;
  label: "Produtivo" | "Improdutivo";
  score: number;
  suggested_response?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const classifyText = async (
  text: string
): Promise<ClassificationResult> => {
  const formData = new FormData();
  formData.append("text", text);

  const response = await axios.post<ClassificationResult>(
    API_URL + "/classify-text",
    formData
  );
  return response.data;
};

export const classifyFile = async (
  file: File
): Promise<ClassificationResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<ClassificationResult>(
    API_URL + "/classify-file",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};
