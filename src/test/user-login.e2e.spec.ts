import { INestApplication } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { PostgresSqlModule } from "../dataBase/postgres-sql-module";
import { ConfigModule } from "@nestjs/config";
import { UserEntity } from "../dataBase/models/user.entity";
import * as supertest from "supertest";
import { UserAuthorizationModule } from "../controllers/user-authorization/user-authorization.module";
import { AuthGuardModule } from "../global/authGuard/auth-guard.module";
import { UserDto } from "../controllers/create-user/dto/user.dto";
import { AppModule } from "../app.module";

let app : INestApplication;
let dataSource : DataSource;
let repository : Repository<UserEntity>;
const user = {
  "email": "wanzikhn@gmail.com",
  "name": "Ivan",
  "lastname": "Sh",
  "age": 27,
  "password": "Asd112233"
}
/* UserAuthorizationModule,
 PostgresSqlModule.createTestModule(),
 ConfigModule.forRoot(),
 AuthGuardModule*/
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
  repository = await dataSource.getRepository(UserEntity);
  await repository.save(repository.create(user))
};

describe("User login", ()=>{

  let accessToken : string;

  beforeAll( async ()=>{
     await InitTestEnvironment()
  });

  it("Should login user and return access token", async ()=>{
    const {body} = await supertest.agent(app.getHttpServer())
      .post('/user/login')
      .set('Accept', 'application/json')
      .send({
        "email": user.email,
        "password": user.password
      })
    expect(body).toHaveProperty('accessToken');
    expect(body.accessToken).toMatch(/^Bearer/);

    accessToken = body.accessToken;
  })

  it("Should get user data by access token", async ()=>{

    expect(accessToken).toBeDefined();
    expect(accessToken).toMatch(/^Bearer/);

    const {body} = await supertest.agent(app.getHttpServer())
      .get('/user/me')
      .set('Authorization', accessToken.toString())
      .expect(200)

    expect(body).toEqual({ id : expect.any(Number), ...UserDto.GetInstance(user as UserEntity)})
  })

  it("Should return bad request exception on invalid credentials", async ()=>{
    const {body} = await supertest.agent(app.getHttpServer())
      .post('/user/login')
      .set('Accept', 'application/json')
      .send({
        "email": user.email,
        "password": "Invalid pass"
      })
      .expect(400)
  })


  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });
})