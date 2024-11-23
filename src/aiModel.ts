import { HfInference } from "@huggingface/inference";

const hf = new HfInference("YOUR_HUGGING_FACE_API_KEY");

export async function generateAIResponse(prompt: string): Promise<string> {
    const response = await hf.textGeneration({
        model: "meta-llama/Llama-2-7b",
        inputs: prompt,
        parameters: { max_new_tokens: 100 }
    });
    return response.generated_text || "";
}
