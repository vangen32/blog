import * as supertest from "supertest";
import { INestApplication } from "@nestjs/common";

export const ArticleTestUser = {
  "email": "wanzikhn@gmail.com",
  "name": "Ivan",
  "lastname": "Sh",
  "age": 27,
  "password": "Asd112233"
}

export const GetArticleUser = async (app : INestApplication)=>{
  const http = supertest.agent(app.getHttpServer());
  await http
    .post('/user/create')
    .set('Accept', 'application/json')
    .send(ArticleTestUser)

  let accessToken;
   await http
    .post('/user/login')
    .set('Accept', 'application/json')
    .send({
      "email": ArticleTestUser.email,
      "password": ArticleTestUser.password
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