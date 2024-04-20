import { INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../app.module";
import * as supertest from "supertest";
import { GetArticleUser } from "./ArticlesTestEnviromentHelper";

let app : INestApplication;
let dataSource : DataSource;
let user : unknown;

async function InitTestEnvironment() {
  const moduleRef : TestingModule = await Test.createTestingModule({
    imports : [AppModule ]
  }).compile();
  app = moduleRef.createNestApplication();
  await app.init();

  dataSource = moduleRef.get(DataSource);
  await dataSource.dropDatabase();
  await dataSource.synchronize()
  user = await GetArticleUser(app);
};

describe("Create article", ()=>{
  beforeAll(async ()=>{
    await InitTestEnvironment()
  });

  it("should init app",  ()=>{
    expect(app).toBeDefined()
  })

  it('should init article test user', ()=>{
    console.log(user);
    expect(user).toBeDefined()
  })

  it("should connect to the test database", async () => {
    const connectionOptions = dataSource.options;
    expect(connectionOptions.type).toBe('postgres');
    expect(connectionOptions.database).toBe('blog_test');
  });


  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });
})