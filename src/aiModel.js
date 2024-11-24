import dotenv from 'dotenv';

dotenv.config();

async function generateAIResponse(prompt) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.error("API key is missing. Please set the OPENAI_API_KEY environment variable.");
        throw new Error("API key is missing. Please set the OPENAI_API_KEY environment variable.");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }]
        })
    });

    const data = await response.json();
    if (!response.ok) {
        console.error("Error from OpenAI API:", data.error?.message || "Unknown error");
        throw new Error(data.error?.message || "Unknown error");
    }

    function removeCodeBlockDelimiters(generatedCode) {
        return generatedCode.replace(/```[a-z]*\n/g, '').replace(/```/g, '');
    }

    // Use the function to clean up the generated code
    const cleanedContent = removeCodeBlockDelimiters(data.choices[0].message.content);

    return cleanedContent;
}

export { generateAIResponse };
