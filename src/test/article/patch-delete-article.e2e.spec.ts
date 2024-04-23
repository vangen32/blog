import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../app.module";
import { DataSource } from "typeorm";
import { INestApplication } from "@nestjs/common";
import { createHttpClient, GetArticleUser } from "./ArticlesTestEnviromentHelper";

let app : INestApplication;
let dataSource : DataSource;
let user1 : any;
let user2 : any;
let articleUser1: any;
let articleUser2: any;
let http;


async function InitTestEnvironment() {
  const moduleRef : TestingModule = await Test.createTestingModule({
    imports : [AppModule ]
  }).compile();
  app = moduleRef.createNestApplication();
  await app.init();

  dataSource = moduleRef.get(DataSource);
  await dataSource.dropDatabase();
  await dataSource.synchronize()
  user1 = await GetArticleUser(app);
  user2 = await GetArticleUser(app, {
    "email": "wanzikhn2@gmail.com",
    "name": "Ivan 2",
    "lastname": "Sh 2",
    "age": 27,
    "password": "Asd112233"
  });
  http = createHttpClient(app.getHttpServer())
};

const createArticleForUser = async (article, accessToken = undefined) => {
  const {body} = await http(accessToken)
    .post("/articles/create")
    .set('Accept', 'application/json')
    .send(article)
  return body;
}

describe("Patch, delete articles", ()=>{
  beforeAll( async ()=> await InitTestEnvironment())

  it("should create test environment", ()=>{
    expect(app).toBeDefined()
    expect(user1).toBeDefined()
    expect(user2).toBeDefined()
  })

  it("should create articles for each user", async ()=>{
    const articleDtoUser1 = {
      content : "Test article content user 1",
      tags : ["test_tag_1", "test_tag_2"],
    }

    const articleDtoUser2 = {
      content : "Test article content user 2",
      tags : ["test_tag_2", "test_tag_3" ],
    }

     articleUser1 = await createArticleForUser(
      articleDtoUser1,
      user1.accessToken
    )
    articleUser2 = await createArticleForUser(
      articleDtoUser2,
      user2.accessToken
    )

    expect(articleUser1).toMatchObject({
      id : expect.any(Number),
      content : articleDtoUser1.content,
      author :{
        id: user1.id,
        name : user1.name,
        lastname : user1.lastname
      },
      tags : articleDtoUser1.tags.map(x=>({
        id : expect.any(Number),
        tag : x
      }))
    })

    expect(articleUser2).toMatchObject({
      id : expect.any(Number),
      content : articleDtoUser2.content,
      author :{
        id: user2.id,
        name : user2.name,
        lastname : user2.lastname
      },
      tags : articleDtoUser2.tags.map(x=>({
        id : expect.any(Number),
        tag : x
      }))
    })
  })

  it( "should patch article", async ()=>{
    const patchedArticle = {
      content : "Test article content user 1 edited",
      tags : ["test_tag_1", "test_tag_2", "test_tag_4"],
    }
    const {body} = await http(user1.accessToken)
      .patch(`/articles/${articleUser1.id}`)
      .send(patchedArticle)
      .expect(200)

    articleUser1 = body;
    expect(articleUser1).toMatchObject({
      id : expect.any(Number),
      content : patchedArticle.content,
      author :{
        id: user1.id,
        name : user1.name,
        lastname : user1.lastname
      },
      tags : patchedArticle.tags.map(x=>({
        id : expect.any(Number),
        tag : x
      }))
    })

  })
  it( "should get Forbidden exception on patch article", async ()=>{
    const patchedArticle = {
      content : "Test article content user 1 edited by user 2",
      tags : ["test_tag_1", "test_tag_2", "test_tag_4"],
    }
    await http(user2.accessToken)
      .patch(`/articles/${articleUser1.id}`)
      .send(patchedArticle)
      .expect(403)
  })

  it( "should get Unauthorized exception on patch article", async ()=>{
    const patchedArticle = {
      content : "Test article content user 1 edited by user 2",
      tags : ["test_tag_1", "test_tag_2", "test_tag_4"],
    }
    await http()
      .patch(`/articles/${articleUser1.id}`)
      .send(patchedArticle)
      .expect(401)
  })

  it( "should get Unauthorized on delete article", async ()=>{
    await http()
      .delete(`/articles/${articleUser1.id}`)
      .expect(401)
  })

  it( "should get Forbidden delete article", async ()=>{
    await http(user2.accessToken)
      .delete(`/articles/${articleUser1.id}`)
      .expect(403)
  })

  it( "should delete article", async ()=>{
    await http(user1.accessToken)
      .delete(`/articles/${articleUser1.id}`)
      .expect(204)
  })

  afterAll( async ()=>{
    await app.close()
  })
})