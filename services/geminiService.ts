
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizeContent = async (content: string, type: string) => {
  try {
    // Using gemini-3-flash-preview for a basic text transformation task
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `El usuario quiere crear un código QR tipo ${type}. 
      Los datos actuales son: "${content}". 
      
      Si el tipo es 'vcard', el usuario puede haber enviado un JSON con campos separados o texto libre. 
      Devuelve 3 sugerencias con el formato estándar VCARD 3.0 completo.
      Asegúrate de:
      - Incluir el campo URL si hay enlaces a Instagram o LinkedIn.
      - Formatear el nombre correctamente (FN y N).
      - Organizar la empresa y el cargo de forma profesional.
      
      Para otros tipos, simplemente optimiza el texto o URL.
      Devuelve un JSON con "suggestion" (contenido final del QR) y "reason" (explicación breve).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              suggestion: { 
                type: Type.STRING,
                description: "The optimized content for the QR code."
              },
              reason: { 
                type: Type.STRING,
                description: "Short explanation of the optimization."
              }
            },
            required: ["suggestion", "reason"],
            propertyOrdering: ["suggestion", "reason"]
          }
        }
      }
    });
    
    // Access the .text property directly (not a method)
    const jsonStr = response.text?.trim() || '[]';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini optimization error:", error);
    return null;
  }
};
