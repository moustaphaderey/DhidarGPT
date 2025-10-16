import { GoogleGenAI, Chat, Modality } from "@google/genai";
import type { ChatMessage } from '../types';

// FIX: Initialize the Google Gemini AI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

let chat: Chat;

/**
 * Initializes a new chat session with a specified model and history.
 * @param model - The model to use (e.g., 'gemini-2.5-flash').
 * @param history - The initial chat history.
 */
export const startChat = (model: string, history: ChatMessage[]) => {
  // FIX: Use ai.chats.create to start a new chat session.
  chat = ai.chats.create({
    model: model,
    history: history,
  });
};

/**
 * Sends a message to the current chat session and gets a response.
 * @param message - The user's message.
 * @returns The model's response text.
 */
export const getChatResponse = async (message: string): Promise<string> => {
  if (!chat) {
    // Fallback: Initialize with a default model if chat is not started.
    startChat('gemini-2.5-flash', []);
  }
  try {
    // FIX: Use chat.sendMessage to send a message and get a response.
    const response = await chat.sendMessage({ message });
    // FIX: Extract text from the response using the .text property.
    return response.text;
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "Désolé, une erreur s'est produite. Veuillez réessayer.";
  }
};

/**
 * Summarizes a given text using the Gemini model.
 * @param textToSummarize - The text to be summarized.
 * @returns The summarized text.
 */
export const summarizeText = async (textToSummarize: string): Promise<string> => {
  try {
    // FIX: Use ai.models.generateContent for a single-turn request like summarization.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // A suitable model for summarization tasks.
      contents: `Résume le texte suivant en français. Sois concis et extrais les points clés. Le texte est : \n\n${textToSummarize}`,
    });
    // FIX: Extract text from the response using the .text property.
    return response.text;
  } catch (error) {
    console.error("Error summarizing text:", error);
    return "Désolé, une erreur s'est produite lors du résumé du texte.";
  }
};

/**
 * Generates or edits an image based on a text prompt and an optional base image.
 * @param prompt - The text prompt for image generation/editing.
 * @param base64Image - Optional base64 encoded image data.
 * @param mimeType - Optional mime type of the base image.
 * @returns A base64 data URL of the generated image or an error message.
 */
export const generateImage = async (
  prompt: string,
  base64Image?: string,
  mimeType?: string,
): Promise<string> => {
  try {
    // If a base image is provided, use the image editing model
    if (base64Image && mimeType) {
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType,
        },
      };
      const textPart = { text: prompt };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      // Check for safety violations
      if (response.candidates?.[0]?.finishReason === 'SAFETY') {
        return "ERROR:SafetyViolation";
      }

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return "Impossible de générer l'image. Aucune donnée d'image n'a été trouvée dans la réponse.";

    } else {
      // If no base image, use the text-to-image generation model
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      } else {
        return "Impossible de générer l'image. Aucune image n'a été retournée par l'API.";
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return "Désolé, une erreur inattendue s'est produite lors de la génération de l'image.";
  }
};