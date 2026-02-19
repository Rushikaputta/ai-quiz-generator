
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables manually since we are running with node
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ Error: VITE_GEMINI_API_KEY not found in .env");
    process.exit(1);
}

console.log(`🔑 Found API Key: ${API_KEY.substring(0, 5)}...`);

const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel(modelName) {
    console.log(`\nTesting Model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Return this word: 'Working'");
        const response = await result.response;
        console.log(`✅ Success! Response: ${response.text().trim()}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed: ${error.message}`);
        return false;
    }
}

async function run() {
    console.log("🚀 Starting AI Connectivity Test...");

    const models = [
        "gemini-1.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-pro",
        "gemini-2.0-flash-lite"
    ];

    let success = false;
    for (const model of models) {
        if (await testModel(model)) {
            success = true;
            break;
        }
    }

    if (success) {
        console.log("\n✅ At least one model is working!");
    } else {
        console.log("\n❌ ALL models failed. Likely an API Key or Quota issue.");
    }
}

run();
