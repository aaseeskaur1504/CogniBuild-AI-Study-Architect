import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface StudyKit {
  topic: string;
  roadmap: Array<{
    phase: string;
    description: string;
    duration: string;
  }>;
  keyConcepts: Array<{
    term: string;
    definition: string;
    examples: string[];
  }>;
  quickQuiz: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
}

export async function generateStudyKit(prompt: string): Promise<StudyKit> {
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a comprehensive study kit for the topic: "${prompt}". 
    Create a structured breakdown for a student to master this topic.
    Ensure the "quickQuiz" array contains exactly 5 high-quality questions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                description: { type: Type.STRING },
                duration: { type: Type.STRING }
              },
              required: ["phase", "description", "duration"]
            }
          },
          keyConcepts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING },
                examples: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["term", "definition", "examples"]
            }
          },
          quickQuiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        },
        required: ["topic", "roadmap", "keyConcepts", "quickQuiz"]
      }
    }
  });

  return JSON.parse(result.text);
}
