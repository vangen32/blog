import * as supertest from "supertest";
import { INestApplication } from "@nestjs/common";
import { CreateUserDto } from "../../controllers/create-user/dto/create-user.dto";
import TestAgent from "supertest/lib/agent";

export const ArticleTestUser = {
  "email": "wanzikhn@gmail.com",
  "name": "Ivan",
  "lastname": "Sh",
  "age": 27,
  "password": "Asd112233"
}

export const GetArticleUser = async (app : INestApplication, user : CreateUserDto = ArticleTestUser)=>{
  const http = supertest.agent(app.getHttpServer());
  await http
    .post('/user/create')
    .set('Accept', 'application/json')
    .send(user)

  let accessToken;
   await http
    .post('/user/login')
    .set('Accept', 'application/json')
    .send({
      "email": user.email,
      "password": user.password
    }).then(res=>{
      accessToken=res.body;
    });

  const {body} = await http
    .get('/user/me')
    .set('Authorization', accessToken['accessToken'].toString())

  return {
    ...accessToken,
    ...body
  }
}

export function createHttpClient(server : any) {
  const _server = server;
  return (accessToken: string = undefined) : TestAgent => {
    const http = supertest.agent(_server)
    if (accessToken)
      http.set('Authorization', accessToken)
    return http;
  }
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
