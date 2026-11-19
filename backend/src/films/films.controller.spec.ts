import { describe, it, expect, beforeEach, jest } from '@jest/globals';

import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;

  const mockFilmsService = {
    findAll: jest.fn<FilmsService['findAll']>(),
    findSchedule: jest.fn<FilmsService['findSchedule']>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return films from the service', async () => {
      const mockResponse: FilmsResponseDto = {
        total: 1,
        items: [
          {
            id: 'film-1',
            rating: 8.5,
            director: 'Test Director',
            tags: ['drama', 'comedy'],
            title: 'Test Film',
            about: 'A film about testing',
            description: 'Test film description',
            image: 'film.jpg',
            cover: 'cover.jpg',
          },
        ],
      };

      mockFilmsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll();

      expect(mockFilmsService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findSchedule', () => {
    it('should return the schedule for a film', async () => {
      const filmId = 'film-1';

      const mockResponse: ScheduleResponseDto = {
        total: 1,
        items: [
          {
            id: 'session-1',
            daytime: '2026-11-18T18:00:00',
            hall: 1,
            rows: 10,
            seats: 20,
            price: 500,
            taken: ['3:5', '4:7'],
          },
        ],
      };

      mockFilmsService.findSchedule.mockResolvedValue(mockResponse);

      const result = await controller.findSchedule(filmId);

      expect(mockFilmsService.findSchedule).toHaveBeenCalledTimes(1);
      expect(mockFilmsService.findSchedule).toHaveBeenCalledWith(filmId);
      expect(result).toEqual(mockResponse);
    });
  });
});
