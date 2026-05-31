import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || 'dummy_key',
});

export async function getChatCompletion(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente de ventas experto. Tu objetivo es ayudar a los clientes con sus dudas y cerrar ventas de manera amable y profesional.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    return response.choices[0]?.message?.content || 'Lo siento, no pude procesar tu solicitud.';
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    return 'Hubo un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.';
  }
}
