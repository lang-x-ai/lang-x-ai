import { generateAIResponse } from "./aiModel.js";

async function translate(parsedData) {
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

    //Make the ai Promots better
    const aiPrompt = `
    Generate ${target_language} code with inline documentation based on the following requirements:
    ${prompt}

    Function Structure:
    ${functionDescriptions}

    Output only the code with comments, without any additional text or explanation.

    Don't add \`\`\`javascript\` \`\`\` this in this response
`;


    return await generateAIResponse(aiPrompt);
}

export { translate };
