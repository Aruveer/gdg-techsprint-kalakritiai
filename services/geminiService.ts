import { GoogleGenAI, Modality, GenerateContentResponse, Chat, Part } from "@google/genai";
import type { GuardianResult, ProductListing, ChartData } from '../types';

// Note: Replace with your actual API key storage mechanism
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to convert a File object to a GoogleGenAI.Part object.
const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // The result includes the data URL prefix (e.g., "data:image/jpeg;base64,"),
        // which needs to be removed.
        const base64Data = (reader.result as string).split(',')[1];
        resolve(base64Data);
      };
      reader.readAsDataURL(file);
    });
  
    return {
      inlineData: {
        data: await base64EncodedDataPromise,
        mimeType: file.type,
      },
    };
};

/**
 * Generates an image using the Gemini API based on a text prompt and style.
 * @param description The user's description of the product.
 * @param style The selected artistic style.
 * @returns A promise that resolves to a base64 encoded image data URL (e.g., "data:image/png;base64,...").
 */
export const generateImage = async (description: string, style: string): Promise<string> => {
  try {
    const prompt = `Generate a high-quality, photorealistic product mockup of: "${description}". The artistic style should be "${style}". The product should be centered on a clean, minimalist background that complements the product's aesthetic.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: prompt },
          ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
      });

    // Find the first part that contains inline image data
    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      const base64ImageBytes: string = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType || 'image/png';
      return `data:${mimeType};base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image data found in the API response.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw new Error("Failed to generate AI mockup. Please try again.");
  }
};

/**
 * Checks a product description for cultural authenticity using the AI Guardian prompt.
 * @param description The user's description of the product.
 * @returns A promise that resolves to a GuardianResult object.
 */
export const checkAuthenticity = async (description: string): Promise<GuardianResult> => {
    try {
        const systemInstruction = `Role: You are the AI Guardian of Tradition, the cultural compliance engine for the KalaKriti AI marketplace. Your sole function is to assess user-provided design descriptions for adherence to cultural respect and platform standards.
Tone: Objective, strict, and authoritative.
Core Directive: You MUST analyze the incoming text and classify it as either "PASS" (Appropriate/Safe) or "FAIL" (Inappropriate/Offensive/Culturally Insensitive). Your entire output MUST be a single, valid JSON object following the schema below. Do not include any conversational text, notes, or explanations outside of the JSON structure.
CULTURAL COMPLIANCE CRITERIA (FAIL Conditions):
A request is classified as "FAIL" if it contains, refers to, or implies:
Sacred Imagery Misuse: Profane, disrespectful, or overly sexualized representations of deities, symbols, or sacred texts.
Cultural Appropriation/Trivialization: Requests to blend sacred motifs (e.g., specific temple art, specific sacred geometry) with low-value, mass-market, or trivial items that disrespect their origin.
Hate Speech/Offensive Content: Any text or design that is vulgar, discriminatory, violent, or hateful towards any community.
Copyright/Branding Abuse: Requests for unauthorized corporate logos or mass-market cartoon characters applied to traditional art forms (as this violates the artisan's focus on unique craft).
REQUIRED JSON OUTPUT SCHEMA:
{
  "status": "STRING (Must be either PASS or FAIL)",
  "ui_message": "STRING (A brief, customer-facing message (2-10 words) based on the status)",
  "internal_reason": "STRING (A concise explanation for the status)"
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: description,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
            },
        });

        const jsonText = response.text.trim();
        // Clean potential markdown code block fences
        const cleanedJsonText = jsonText.replace(/^```json\n|```$/g, '');
        const result = JSON.parse(cleanedJsonText);

        if (result.status && (result.status === 'PASS' || result.status === 'FAIL') && result.ui_message) {
            return result as GuardianResult;
        } else {
            throw new Error("Invalid JSON structure from authenticity check.");
        }

    } catch (error) {
        console.error("Error checking authenticity:", error);
        throw new Error("Could not verify authenticity. The AI Guardian is currently unavailable.");
    }
};

/**
 * Generates an optimized product listing from an image and context.
 * @param imageFile The product image file.
 * @param contextText The artisan's context about the product.
 * @returns A promise that resolves to a ProductListing object.
 */
export const generateProductListing = async (imageFile: File, contextText: string): Promise<ProductListing> => {
    const systemInstruction = `Role: You are the Artisan AI Helper, a specialized marketing and pricing analyst for the KalaKriti AI marketplace. Your task is to analyze the provided product image and any accompanying text description to generate a complete, optimized product listing.

Tone: Highly persuasive, professional, and knowledgeable about traditional Indian craftsmanship.

Core Directive: You MUST generate a single, valid JSON object that strictly adheres to the schema defined below. Do not include any conversational text or formatting outside of the JSON block.

REQUIRED JSON OUTPUT SCHEMA:
{
  "product_name": "STRING (A compelling, market-ready title)",
  "long_description": "STRING (A detailed, 4-5 sentence marketing description that highlights craftsmanship, material, and cultural story)",
  "price_recommendation": {
    "currency": "STRING (e.g., USD, INR)",
    "low_end": "NUMBER (Suggested lowest price point)",
    "high_end": "NUMBER (Suggested highest price point)",
    "rationale": "STRING (Brief justification based on perceived complexity and market value)"
  },
  "suggested_tags": "ARRAY of STRINGS (5-7 relevant tags for search/SEO, e.g., 'Madhubani', 'Handmade', 'Terracotta')",
  "promotion_idea": "STRING (A 1-sentence actionable marketing tip)"
}`;

    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const textPart = { text: `Product Context Text: "${contextText}"` };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
            },
        });

        const jsonText = response.text.trim();
        const cleanedJsonText = jsonText.replace(/^```json\n|```$/g, '');
        const result = JSON.parse(cleanedJsonText);
        
        if (result.product_name && result.long_description && result.price_recommendation) {
            return result as ProductListing;
        } else {
            throw new Error("Invalid JSON structure from product listing generation.");
        }

    } catch (error) {
        console.error("Error generating product listing:", error);
        throw new Error("Failed to generate product listing. The AI Helper is currently unavailable.");
    }
};

/**
 * Generates monthly order data for the artisan dashboard chart.
 * @returns A promise that resolves to a ChartData object.
 */
export const generateMonthlyOrderData = async (): Promise<ChartData> => {
    const systemInstruction = `Role: You are the Market Analyst for KalaKriti AI. Your task is to generate realistic, sequential monthly data for an artisan's dashboard that reflects a healthy, growing business (a typical scenario in our marketplace).

Core Directive: You MUST generate a single, valid JSON object that contains the specific data required to populate a stacked line or area chart showing two distinct series over six months. Do not include any conversational text, explanations, or analysis outside of the JSON structure.

REQUIRED JSON OUTPUT SCHEMA:
The output must contain four keys: a list of month labels and three data arrays (Completed, Pending, and a combined total for context).

{
  "chart_title": "STRING (A concise title, e.g., 'Order Volume: Past 6 Months')",
  "month_labels": "ARRAY of STRINGS (Six chronological months, starting with an earlier month, e.g., ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'])",
  "completed_orders": "ARRAY of NUMBERS (Six sequential values representing growth in fulfilled orders)",
  "pending_orders": "ARRAY of NUMBERS (Six sequential values representing manageable backlog/requests)"
}
BUSINESS CONSTRAINTS (For realistic data generation):
Growth Trend: Both the completed_orders and pending_orders arrays must show a visible, steady upward trend over the six months.
Order Ratio: Completed Orders should consistently be significantly higher than Pending Orders (e.g., roughly 3:1 ratio or higher) to reflect an efficient artisan.
Data Range: All numbers should fall between 20 and 120 total orders per month to match the typical scale shown in the wireframes.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate the monthly order data required for the Artisan Dashboard. Use the current month as the final month in the series and ensure the data reflects a successful, growing artisan's business.",
            config: {
                systemInstruction,
                responseMimeType: "application/json",
            },
        });

        const jsonText = response.text.trim();
        const cleanedJsonText = jsonText.replace(/^```json\n|```$/g, '');
        const result = JSON.parse(cleanedJsonText);

        if (result.chart_title && result.month_labels && result.completed_orders && result.pending_orders) {
            return result as ChartData;
        } else {
            throw new Error("Invalid JSON structure from chart data generation.");
        }
    } catch (error) {
        console.error("Error generating chart data:", error);
        throw new Error("Failed to generate chart data. The AI Analyst is currently unavailable.");
    }
};

let chatSession: Chat | null = null;

const initializeChat = () => {
    const systemInstruction = "You are Kriti AI, a friendly and helpful assistant for the KalaKriti AI marketplace. You assist both customers and artisans. You can answer questions about traditional Indian art, help users design products, and provide business advice to artisans. You are multilingual. Keep your responses concise and helpful.";
    chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
};

/**
 * Sends a message to the AI chat assistant and gets a response.
 * @param message The user's message.
 * @returns A promise that resolves to the bot's response text.
 */
export const getChatResponse = async (message: string): Promise<string> => {
    if (!chatSession) {
        initializeChat();
    }
    
    if (!chatSession) { // Check again after initialization attempt
        throw new Error("Chat session could not be initialized.");
    }

    try {
        const response: GenerateContentResponse = await chatSession.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error getting chat response from Gemini:", error);
        // Reset chat session on error
        chatSession = null;
        throw new Error("Failed to get a response from Kriti AI. Please try again.");
    }
};
