
import { GoogleGenerativeAI } from "@google/generative-ai";


import dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function listModels() {
    if (!API_KEY) {
        console.error("No API Key provided");
        return;
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    try {
        // Accessing the model manager is not directly exposed in the high-level SDK for listing in the same way 
        // as the REST API, but we can try to find a model that works or use the REST API directly if SDK fails.
        // Actually, the SDK doesn't have a simple listModels method exposed on the main class easily in all versions.
        // Let's try a simple fetch to the REST API to be sure.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                console.log(`- ${m.name} (Supported: ${m.supportedGenerationMethods})`);
            });
        } else {
            console.log("No models found or error:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
