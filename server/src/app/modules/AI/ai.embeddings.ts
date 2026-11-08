import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import config from "../../../config";

const apiKey = config.google_api_key;

if (!apiKey) {
  throw new Error("GOOGLE_API_KEY is missing.");
}

export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey,
  model: "gemini-embedding-001",
  outputDimensionality: 768,
});
