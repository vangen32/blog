import { INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../app.module";
import * as supertest from "supertest";
import { GetArticleUser } from "./ArticlesTestEnviromentHelper";
import { UserDto } from "../../controllers/create-user/dto/user.dto";
import { UserEntity } from "../../dataBase/models/user.entity";
import TestAgent from "supertest/lib/agent";

let app : INestApplication;
let dataSource : DataSource;
let user : any;

let firstArticle;
let secondArticle;

const httpClient = () : TestAgent => {
  const http = supertest.agent(app.getHttpServer())
    if(user.accessToken)
      http.set('Authorization', user.accessToken.toString())
  return http;
}

async function InitTestEnvironment() {
  const moduleRef : TestingModule = await Test.createTestingModule({
    imports : [AppModule ]
  }).compile();
  app = moduleRef.createNestApplication();
  await app.init();

  dataSource = moduleRef.get(DataSource);
  await dataSource.dropDatabase();
  await dataSource.synchronize()
};

describe("Create article", ()=>{
  beforeAll(async ()=>{
    await InitTestEnvironment()
  });

  it("should init app",  ()=>{
    expect(app).toBeDefined()
  })
  it("should connect to the test database",  () => {
    const connectionOptions = dataSource.options;
    expect(connectionOptions.type).toBe('postgres');
    expect(connectionOptions.database).toBe('blog_test');
  });

  it('should init article test user', async ()=>{
    user = await GetArticleUser(app);
    expect(user).toBeDefined()
    expect(user).toEqual(
      {
        id: expect.any(Number),
        ...UserDto.GetInstance(user as UserEntity)
      })
  })

  it("should create new article", async ()=>{
    const article = {
      content : "Test article content",
      tags : ["test_tag_1", "test_tag_2"],
    }
    const {body} = await httpClient()
      .post("/articles/create")
      .set('Accept', 'application/json')
      .send(article)
      .expect(201)

    expect(body).toMatchObject({
      id : expect.any(Number),
      content : article.content,
      author :{
        id: user.id,
        name : user.name,
        lastname : user.lastname
      },
      tags : article.tags.map(x=>({
        id : expect.any(Number),
        tag : x
      }))
    })
    firstArticle = {...body};
  })

  it("should create new article without tags", async ()=>{
    const article = {
      content : "Test article content",
    }
    const {body} = await httpClient()
      .post("/articles/create")
      .set('Accept', 'application/json')
      .send(article)
      .expect(201)

    expect(body).toMatchObject({
      id : expect.any(Number),
      content : article.content,
      author :{
        id: user.id,
        name : user.name,
        lastname : user.lastname
      },
      tags : []
    })
  })

  it("should create new article and not recreate tags", async ()=>{
    const article = {
      content : "Test article content 123",
      tags : ["test_tag_1", "test_tag_3"],
    }
    const {body} = await httpClient()
      .post("/articles/create")
      .set('Accept', 'application/json')
      .send(article)
      .expect(201)

    expect(body).toMatchObject({
      id : expect.any(Number),
      content : article.content,
      author :{
        id: user.id,
        name : user.name,
        lastname : user.lastname
      },
      tags : expect.any(Array)
    })
    expect(body.tags).toHaveLength(article.tags.length);
    expect(body.tags).toEqual(expect.arrayContaining(
      [
        {
          id : expect.any(Number),
          tag : article.tags[1]
        },
        firstArticle.tags.find(x=>x.tag === article.tags[0])]
      ));
    secondArticle = {...body};
  })

  it("should return article list", async ()=>{
    const {body} = await httpClient()
      .get("/articles/all")
      .query({page : 0, limit: 10})
      .expect(200)

    expect(body).toEqual(expect.arrayContaining([
      secondArticle, firstArticle
    ]))
  })

  it("should return BadRequest because of page", async ()=>{
    await httpClient()
      .get("/articles/all")
      .query({page : 1, limit: 10})
      .expect(400)
  })

  it("should return article by id", async ()=>{
    const {body} = await httpClient()
      .get(`/articles/${firstArticle.id}`)
      .expect(200)

    expect(body).toEqual(firstArticle)
  })

  it("should return BadRequest for article by id", async ()=>{
    await httpClient()
      .get(`/articles/21457`)
      .expect(400)
  })

  it("should return articles by tag", async ()=>{
    const {body} = await httpClient()
      .get(`/articles/tag/test_tag_3`)
      .query({page : 0})
      .expect(200)

    expect(body).toEqual([
      secondArticle
    ])
  })

  it("should return BadRequest on get articles by not existed tag", async ()=>{
    await httpClient()
      .get(`/articles/tag/not_existed_tag`)
      .query({page : 0})
      .expect(400)
  })



  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });
})