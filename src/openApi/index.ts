import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

export class Swagger{
  static create(app : INestApplication){
    const config = new DocumentBuilder()
      .setTitle('Blog')
      .setDescription('The blog project API description')
      .setVersion('1.0')
      //TODO
      .addOAuth2({
        type: 'oauth2',
        flows: {
          password: {
            tokenUrl: '/user/login',
            scopes: {},
          }
        }
      })
      .build();
    const document = SwaggerModule.createDocument(app, config, {});

    const swaggerUiOptions : SwaggerCustomOptions = {
      swaggerOptions: {
        requestInterceptor : (request: any) => {
          if(request.url.toString().includes("/user/login"))
            request.body = request.body.replace("username", "email")
          if(sessionStorage.getItem("accessToken")) {
            const token = sessionStorage.getItem("accessToken");
            request.headers.Authorization = `${token}`;
          }
          return request;
        },
        responseInterceptor : (response : any) => {
          if(response.url.toString().includes("/user/login") && JSON.parse(response.data ?? {})?.accessToken){
            sessionStorage.setItem("accessToken", JSON.parse(response.data).accessToken)
          }
          return Promise.resolve(response)
        },
      },
    };


    SwaggerModule.setup('/', app, document, swaggerUiOptions);
  }
}