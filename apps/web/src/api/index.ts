import axios from "axios";

export interface ClassificationResult {
  original_text: string;
  preprocessed_text: string;
  label: "Produtivo" | "Improdutivo";
  score: number;
  suggested_response?: string;
}

export const classifyText = async (
  text: string
): Promise<ClassificationResult> => {
  const formData = new FormData();
  formData.append("text", text);

  const response = await axios.post<ClassificationResult>(
    "/classify-text",
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
    "/classify-file",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};
