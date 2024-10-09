import { Test, TestingModule } from '@nestjs/testing';
import { TriviaController } from '../../apps/main/src/controllers/trivia.controller';

describe('TriviaController', () => {
  let controller: TriviaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TriviaController],
    }).compile();

    controller = module.get<TriviaController>(TriviaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
