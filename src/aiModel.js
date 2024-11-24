import dotenv from 'dotenv';

dotenv.config();

async function generateAIResponse(prompt) {
    const apiKey = process.env.OPENAI_API_KEY || "";

    if (!apiKey) {
        console.error("API key is missing. Please set the OPENAI_API_KEY environment variable.");
        throw new Error("API key is missing. Please set the OPENAI_API_KEY environment variable.");
    }

    console.log("Sending request to OpenAI API with prompt:", prompt);

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

    console.log("Received response from OpenAI API, status:", response.status);

    const data = await response.json();
    if (!response.ok) {
        console.error("Error from OpenAI API:", data.error?.message || "Unknown error");
        throw new Error(data.error?.message || "Unknown error");
    }

    console.log("AI response content:", data.choices[0].message.content);
    return data.choices[0].message.content;
}

export { generateAIResponse };
