
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('Polyglots API')
    .setDescription(
      `RESTful API for the Polyglots language learning platform. This backend provides:
      - User and teacher management
      - Course and lesson scheduling
      - Vocabulary and translation tasks
      - Financial tracking and payment history
      - Integration with OpenAI for dynamic quizzes and phrase generation
      - Secure access via JWT and Kong Gateway
      `
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
