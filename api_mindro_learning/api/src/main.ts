import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app)
  // Habilita CORS para todas as origens (ou especifique o frontend)
  app.enableCors({
    origin: '*', // IP:PORT ou DNS:PORT especifica ou use '*' para todas as origens (não recomendado em produção)
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
