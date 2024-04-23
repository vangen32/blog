import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../app.module";
import { DataSource } from "typeorm";
import { createHttpClient, GetArticleUser, getRandomInt } from "./ArticlesTestEnviromentHelper";
import { INestApplication } from "@nestjs/common";


let app : INestApplication;
let dataSource : DataSource;
let http;

let user1 : any;
const articlesDtoUser1 = [];
const articlesEntitiesUser1 = []

let user2 : any;
const articlesDtoUser2 = [];
const articlesEntitiesUser2 = []



function articleFactory(tags : string[] = []){
  return  {
    content : faker.lorem.words(Math.floor(Math.random() * 10) + 1),
    tags : [
      faker.lorem.words(1),
      faker.lorem.words(1),
      ...tags
    ]
  }

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
  http = createHttpClient(app.getHttpServer())

  user1 = await GetArticleUser(app);
  for(let i = 0; i <20; i++){
    const tagArticle = articlesDtoUser1.length ? articlesDtoUser1[getRandomInt(0,articlesDtoUser1.length-1)] : undefined
    const tag = tagArticle ? tagArticle.tags[getRandomInt(0, tagArticle.tags.length-1)] : "mock"
    const article = articleFactory([tag])
    articlesDtoUser1.push(article)
    await http(user1.accessToken)
      .post("/articles/create")
      .send(article);
  }

  user2 = await GetArticleUser(app,
    {
      "email": "wanzikhn2@gmail.com",
      "name": "Ivan2",
      "lastname": "Sh2",
      "age": 27,
      "password": "Asd112233"
    });
  for(let i = 0; i <20; i++){
    const tagArticle = articlesDtoUser1.length ? articlesDtoUser1[getRandomInt(0,articlesDtoUser1.length-1)] : undefined
    const tag = tagArticle ? tagArticle.tags[getRandomInt(0, tagArticle.tags.length-1)] : "mock"
    const article = articleFactory([tag])
    articlesDtoUser2.push(article)
    await http(user2.accessToken)
      .post("/articles/create")
      .send(article);
  }
};

describe("Get articles", ()=>{
  beforeAll(async ()=> await InitTestEnvironment())

  it('should exist articles list in DB that have length of amount created articles', async ()=>{
    const limit = 50;
    const {body} = await http()
      .get("/articles/all")
      .query({page : 0, limit : limit})
      .expect(200)

    articlesEntitiesUser1.push(...body.filter(x=>x.author.id === user1.id))
    articlesEntitiesUser2.push(...body.filter(x=>x.author.id === user2.id))

    expect(body).toHaveLength(40)
    expect(articlesEntitiesUser1).toHaveLength(20)
    expect(articlesEntitiesUser2).toHaveLength(20)
  })

  it("should get articles by tag", async ()=>{
    const article = articlesEntitiesUser1[getRandomInt(0, articlesEntitiesUser1.length-1)]
    const tag = article.tags[getRandomInt(0, article.tags.length-1)].tag

    const {body} = await http()
      .get(`/articles/tag/${tag}`)
      .query({page : 0, limit : 50})
      .expect(200)

    expect(body).toHaveLength([...articlesDtoUser1, ...articlesDtoUser2].filter(x=>x.tags.some(t=>t===tag)).length)
  })

  it("should get BadRequest on articles by tag", async ()=>{
    const tag = "this_tag_is_very_not_random"
    const {body} = await http()
      .get(`/articles/tag/${tag}`)
      .query({page : 0})
      .expect(400)
  })

  it("should get articles by author id", async ()=>{
    const {body} = await http()
      .get(`/articles/author-id/${user1.id}`)
      .query({page : 0, limit : 40})
      .expect(200)

    expect(body.filter(x=>x.author.id === user1.id)).toHaveLength(20)
  })

  it("should get BadRequest on articles by author id", async ()=>{
    await http()
      .get(`/articles/author-id/12547`)
      .query({page : 0, limit : 40})
      .expect(400)
  })

  afterAll(async ()=>{
    await dataSource.dropDatabase();
    await app.close()
  })
})