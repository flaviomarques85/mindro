// src/llm/llm.controller.ts
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { LlmService } from './llm.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('llm')
@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) { }

  @Get('quiz')
  @ApiQuery({ name: 'level', required: true })
  @ApiQuery({ name: 'language', required: true })
  async getQuiz(@Query('level') level: string, @Query('language') language: string) {
    if (!level || !language) {
      throw new BadRequestException('Both level and language must be provided.');
    }
    return this.llmService.generateQuiz(level, language);
  }

  @Get('vocabulary-translator')
  @ApiQuery({ name: 'level', required: true })
  @ApiQuery({ name: 'language', required: true })
  async getVocabulary(@Query('level') level: string, @Query('language') language: string) {
    if (!level || !language) {
      throw new BadRequestException('Both level and language must be provided.');
    }
    return this.llmService.generateVocabularyTranslation(level, language);
  }
}
