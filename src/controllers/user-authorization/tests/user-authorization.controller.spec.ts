import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthorizationController } from '../user-authorization.controller';
import { UserAuthorizationService } from '../user-authorization.service';

describe('UserAuthorizationController', () => {
  let controller: UserAuthorizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAuthorizationController],
      providers: [UserAuthorizationService],
    }).compile();

    controller = module.get<UserAuthorizationController>(UserAuthorizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
