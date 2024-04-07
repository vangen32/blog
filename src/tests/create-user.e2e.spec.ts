import * as supertest from "supertest";
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from "@nestjs/common";
import { CreateUserModule } from "../controllers/create-user/create-user.module";
import { PostgresSqlModule } from "../dataBase/postgres-sql-module";
import { Repository } from "typeorm";
import { UserEntity } from "../dataBase/models/user.entity";

describe('CreateUserService', () => {
  let app : INestApplication;
  let repository : Repository<UserEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports : [CreateUserModule, PostgresSqlModule.createTestModule()]
    }).compile();
    app = module.createNestApplication();
    await app.init();
    repository = module.get('UserEntityRepository')
  });

  afterEach(async ()=>{
    await repository.clear()
  })

  it("should init app", function() {
    expect(app).toBeDefined();
  });


  it('should return an array of users', async () => {
    const arr = [
      { name: 'test-name-0',  email : "email1", lastname : "lastname1", age : 15, password: "Asd112233"},
      { name: 'test-name-2',  email : "email2", lastname : "lastname2", age : 18, password: "Asd112233"},
    ]
    await repository.save(arr);
    const { body } = await supertest.agent(app.getHttpServer())
      .get('/user/all')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body).toEqual(arr.map(x=>({id: expect.any(Number), ...x})));
  });

  afterAll(async ()=>{
    await app.close();
  })

});
