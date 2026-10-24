import { Test, TestingModule } from '@nestjs/testing';
import { BasdService } from './basd.service';

describe('BasdService', () => {
  let service: BasdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BasdService],
    }).compile();

    service = module.get<BasdService>(BasdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
