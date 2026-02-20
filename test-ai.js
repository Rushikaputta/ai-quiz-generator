
import { GoogleGenerativeAI } from "@google/generative-ai";

// Hardcoding key for test script to avoid env parsing issues in raw node
const API_KEY = process.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY";

async function testGemini() {
  console.log("Testing Gemini API...");

  if (!API_KEY) {
    console.error("No API Key provided");
    return;
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Generate a medium quiz about "Science" in correct JSON format.
  The JSON structure should be:
  {
    "quiz": { "title": "Science Quiz", "id": "generated-id" },
    "questions": [
      {
        "question": "Question text here",
        "options": {
          "A": "Option A",
          "B": "Option B",
          "C": "Option C",
          "D": "Option D"
        },
        "correctAnswer": "A",
        "explanation": "Explanation here"
      }
    ]
  }
  Generate exactly 2 questions. ensure the output is valid JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Raw Response:", text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const data = JSON.parse(jsonMatch[0]);
    console.log("Parsed JSON:", JSON.stringify(data, null, 2));

  } catch (error) {
    console.error("Error:", error);
  }
}

testGemini();
