
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Verified available models from list-models.js output
const MODELS_TO_TRY = [
  "gemini-2.5-flash",        // Newest stable flash
  "gemini-flash-latest",     // Generic alias for latest efficient model
  "gemini-2.0-flash-lite-001", // Specific lite version
  "gemini-2.0-flash",        // Standard 2.0
  "gemini-2.5-pro",          // Higher quality
  "gemini-3-flash-preview",  // Experimental
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Emergency Local Generator
const generateLocalFallback = (topic: string, questionCount: number) => {
  console.warn("⚠️ API Failed. Using Emergency Local Fallback.");
  return {
    quiz: {
      title: `${topic} (Offline Mode)`,
      id: `offline-${Date.now()}`
    },
    questions: Array.from({ length: questionCount }).map((_, i) => ({
      question: `(Offline) what is a key concept in ${topic}?`,
      options: {
        A: `Concept ${i + 1}A`,
        B: `Concept ${i + 1}B`,
        C: `Concept ${i + 1}C`,
        D: `Concept ${i + 1}D`
      },
      correctAnswer: "A",
      explanation: "This is a generated placeholder because the AI service is currently overwhelmed. Please try again later for real AI questions."
    }))
  };
};

export const generateQuiz = async (topic: string, difficulty: string, questionCount: number) => {
  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is not set in .env");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  // Try the list of models twice
  const MAX_GLOBAL_RETRIES = 1;

  for (let attempt = 0; attempt <= MAX_GLOBAL_RETRIES; attempt++) {
    for (const modelName of MODELS_TO_TRY) {
      try {
        console.log(`[Attempt ${attempt + 1}] Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = `You are a professional quiz generator. Create a high-quality ${difficulty} quiz about "${topic}".
        
        Strictly return ONLY a valid JSON object. Do not include markdown formatting like \`\`\`json or \`\`\`.
        
        The JSON structure must match this schema exactly:
        {
          "quiz": { 
            "title": "A creative title for the ${topic} quiz", 
            "id": "generated-id" 
          },
          "questions": [
            {
              "question": "A clear, challenging question text",
              "options": {
                "A": "Option A",
                "B": "Option B",
                "C": "Option C",
                "D": "Option D"
              },
              "correctAnswer": "A", // Must be one of A, B, C, or D
              "explanation": "A helpful explanation of why the answer is correct"
            }
          ]
        }
        
        Requirements:
        1. Generate exactly ${questionCount} questions.
        2. Ensure all 4 options (A, B, C, D) are provided and distinct.
        3. The "correctAnswer" must match one of the keys (A, B, C, D).
        4. The JSON must be valid and parseable.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        let data;

        // Try regex first
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          data = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback parse
          data = JSON.parse(cleanedText);
        }

        console.log(`Successfully generated quiz with model: ${modelName}`);
        return { data, error: null };

      } catch (error: any) {
        console.warn(`Failed with model ${modelName}:`, error.message);

        if (error.message?.includes("429")) {
          // Rate limited - wait with jitter
          const jitter = Math.floor(Math.random() * 500);
          await sleep(2000 + jitter);
        } else if (error.message?.includes("404")) {
          // Model not found - skip immediately
          continue;
        }
      }
    }
    // High traffic backoff
    if (attempt < MAX_GLOBAL_RETRIES) await sleep(3000);
  }

  // If all else fails, return local fallback
  return {
    data: generateLocalFallback(topic, questionCount),
    error: null
  };
};
