import * as supertest from "supertest";
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../dataBase/models/user.entity";
import { CreateUserModule } from "../controllers/create-user/create-user.module";
import { PostgresSqlModule } from "../dataBase/postgres-sql-module";
import { ConfigModule } from "@nestjs/config";
import { AppModule } from "../app.module";

let app : INestApplication;
let dataSource : DataSource;

/*CreateUserModule,
  PostgresSqlModule.createTestModule(),
  ConfigModule.forRoot(),*/

async function InitTestEnvironment() {
  const module: TestingModule = await Test.createTestingModule({
    imports : [
      AppModule
    ],
  }).compile();
  app = module.createNestApplication();
  await app.init();

  dataSource = module.get(DataSource);
  await dataSource.dropDatabase();
  await dataSource.synchronize()

};

describe('Create user flow', () => {

  beforeAll(async ()=> { await InitTestEnvironment()})

  it("should init app", function() {
    expect(app).toBeDefined();
  });

  it("it should create user", async ()=>{
    const {body} = await supertest.agent(app.getHttpServer())
      .post('/user/create')
      .set('Accept', 'application/json')
      .send({
        "email": "wanzikhnxzcxdfsd__zc56@gmail.com",
        "name": "Ivan",
        "lastname": "Sh",
        "age": 27,
        "password": "Asd112233"
      })
      .expect(201)

    expect(body).toBeDefined()
  })
  it("it should be 422 email not valid", async ()=>{
    const {body} = await supertest.agent(app.getHttpServer())
      .post('/user/create')
      .set('Accept', 'application/json')
      .send({
        "email": "wanzikhnxzcxdfsd__zc56gmail.com",
        "name": "Ivan",
        "lastname": "Sh",
        "age": 27,
        "password": "Asd112233"
      })
      .expect(422)
  })

  it("it should be 422 password not valid", async ()=>{
    const {body} = await supertest.agent(app.getHttpServer())
      .post('/user/create')
      .set('Accept', 'application/json')
      .send({
        "email": "wanzikhn@gmail.com",
        "name": "Ivan",
        "lastname": "Sh",
        "age": 27,
        "password": "asd112233"
      })
      .expect(422)
  })

  it("it should be 422 ", async ()=>{
    const {body} = await supertest.agent(app.getHttpServer())
      .post('/user/create')
      .set('Accept', 'application/json')
      .send({
        "some_invalid_field": "Some invalid value",
      })
      .expect(422)
  })

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });

});

describe("Get user list flow", ()=>{
  let repository : Repository<UserEntity>;
  beforeAll(async ()=>{
    await InitTestEnvironment()
    repository = dataSource.getRepository(UserEntity);
    await repository.save([
      repository.create({
          "email": "wanzikhn@gmail.com",
          "name": "Ivan",
          "lastname": "Sh",
          "age": 27,
          "password": "Asd112233"
        }),
      repository.create({
          "email": "wanzikhn@gmail2.com",
          "name": "Ivan",
          "lastname": "Sh",
          "age": 27,
          "password": "Asd112233"
        })
    ])
  });

  it("Should return 2 users with correct signature", async ()=>{
    const {body} = await supertest.agent(app.getHttpServer())
      .set('Accept', 'application/json')
      .get('/user/all')
      .query({page : 0, limit: 10})
      .expect(200)
    expect(body).toHaveLength(2)
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: expect.any(Number), name: expect.any(String), email: expect.any(String), lastname : expect.any(String), age : expect.any(Number) }),
        expect.objectContaining({ id: expect.any(Number), name: expect.any(String), email: expect.any(String), lastname : expect.any(String), age : expect.any(Number) }),
      ])
    );
  })

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });
})
