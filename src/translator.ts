import { generateAIResponse } from "./aiModel";
import { ParsedData } from "./parser";

export async function translate(parsedData: ParsedData): Promise<string> {
    const { target_language, prompt, functions } = parsedData;
    if (!target_language || !prompt) {
        throw new Error("Target language or prompt missing in the Fantom file.");
    }

    let functionDescriptions = "";
    for (const [funcName, funcData] of Object.entries(functions)) {
        const inputs = funcData.input.join(", ");
        const body = funcData.body.map(([type, value]) => `${type} ${value}`).join("\n");
        functionDescriptions += `Function ${funcName}(${inputs}):\n${body}\n\n`;
    }

    const aiPrompt = `
        Generate ${target_language} code based on the following requirements:
        ${prompt}

        Function Structure:
        ${functionDescriptions}
    `;

    return await generateAIResponse(aiPrompt);
}
