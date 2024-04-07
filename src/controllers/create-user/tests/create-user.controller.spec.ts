import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserController } from '../create-user.controller';
import { CreateUserService } from '../create-user.service';
import { Repository } from "typeorm";
import { UserEntity } from "../../../dataBase/models/user.entity";

describe('CreateUserController', () => {
  let controller: CreateUserController;

  beforeEach(async () => {
    const moduleRef : TestingModule = await Test.createTestingModule({
      controllers: [CreateUserController],
    }).useMocker(token=>{
      const result = Repository<UserEntity>;
      if(token === CreateUserService){
        return {
          findAll : jest.fn().mockRejectedValue(result)
        }
      }
    })
      .compile();

    controller = moduleRef.get<CreateUserController>(CreateUserController) as CreateUserController;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
