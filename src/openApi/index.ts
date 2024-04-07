import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

export class Swagger{
  static create(app : INestApplication){
    const config = new DocumentBuilder()
      .setTitle('Blog')
      .setDescription('The blog project API description')
      .setVersion('1.0')
      //TODO
      .addBearerAuth()
      .addOAuth2({
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'http://localhost:3000/user/login', // Шлях до вашого ендпоінту для логіну
            tokenUrl: 'http://localhost:3000/user/login', // Шлях до вашого ендпоінту для отримання токену доступу
            scopes: {},
          },
        },
      })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
}