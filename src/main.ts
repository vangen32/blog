import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Swagger } from "./openApi";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Swagger.create(app);
  await app.listen(3000);
}
bootstrap();
