// src/llm/llm.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface OpenAIResponse {
  choices: { message: { content: string } }[];
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly openaiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    const key = this.configService.get<string>('OPENAI_API_KEY');
    if (!key) {
      throw new Error('Missing OPENAI_API_KEY in environment variables');
    }
    this.apiKey = key;
  }

  async generateChatCompletion(prompt: string, model = 'gpt-3.5-turbo'): Promise<string> {
    const body = {
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful and patient language tutor helping students practice real-world phrases with translations. Focus on useful, beginner-friendly, everyday language in English with accurate translations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService.post<OpenAIResponse>(this.openaiUrl, body, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        })
      );
      return data.choices[0].message.content;
    } catch (error) {
      this.logger.error('OpenAI request failed', error);
      throw new Error('OpenAI service unavailable');
    }
  }

  async generateQuiz(level: string, language: string): Promise<any[]> {
    const prompt = `
Generate a JSON array of 5 ${level}-level ${language} quiz questions for students learning ${language} as a second language.
Each question should focus on vocabulary, grammar, or simple sentence structure.

Guidelines:
- Each question must include ONE correct answer and THREE plausible but incorrect options.
- The correct answer must be placed in a RANDOM position within the "options" array.
- The "options" array must contain exactly 4 unique strings (no repeats).
- The "answer" field must exactly match the correct value in "options".

Avoid:
- General knowledge or trivia questions.
- Repeated question or option patterns across items.

Format:
[
  {
    "question": "What is the plural of 'child'?",
    "options": ["childs", "children", "childes", "chields"],
    "answer": "children"
  },
  ...
]

Return ONLY a valid JSON array.
`;
    const response = await this.generateChatCompletion(prompt);
    const cleaned = cleanJSON(response);

    try {
      const parsed = JSON.parse(cleaned);
      return parsed.map((item, index) => ({
        ...item,
        id: (index + 1).toString(),
      }));
    } catch (err) {
      this.logger.error('Failed to parse JSON from OpenAI response', {
        raw: response,
        cleaned,
        error: err.message,
      });
      throw new Error('Invalid JSON returned by OpenAI');
    }
  }

  async generateVocabularyTranslation(level: string, language: string, translatorTo: string = 'Portugues Brasil'): Promise<any[]> {
    const prompt = `Generate a JSON array of 5 ${level}-level English learning phrases for students learning ${language} as a second language.
Each object must include:
- text: a very simple ${language}  sentence commonly used in daily life (e.g., greetings, questions, descriptions, basic actions);
- answer: the correct translation of the sentence into ${translatorTo};

Guidelines:
- Avoid repeating sentence patterns, verbs, or vocabulary from recent examples.
- Vary the structure: include affirmatives, negatives, and simple questions.
- Prioritize clear, useful, and real-world phrases that are helpful for learners.
- Return only a valid JSON array of 5 objects.
`;

    const response = await this.generateChatCompletion(prompt);
    const cleaned = cleanJSON(response);

    try {
      const parsed = JSON.parse(cleaned);
      return parsed.map((item, index) => ({
        ...item,
        id: (index + 1).toString(),
      }));
    } catch (err) {
      this.logger.error('Failed to parse JSON from OpenAI response', {
        raw: response,
        cleaned,
        error: err.message,
      });
      throw new Error('Invalid JSON returned by OpenAI');
    }
  }
}

function cleanJSON(raw: string): string {
  return raw
    .replace(/```json\s*/i, '')  // remove bloco de abertura ```json
    .replace(/```/g, '')         // remove qualquer ``` restante
    .trim();
}

