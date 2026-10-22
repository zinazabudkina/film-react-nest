import { Injectable } from '@nestjs/common';

import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';
import { MongoFilmsRepository } from '../repository/films.repository.mongo';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: MongoFilmsRepository) {}

  async findAll(): Promise<FilmsResponseDto> {
    const items = await this.filmsRepository.findAll();

    return {
      total: items.length,
      items,
    };
  }

  async findSchedule(id: string): Promise<ScheduleResponseDto> {
    const items = await this.filmsRepository.findScheduleByFilmId(id);

    return {
      total: items.length,
      items,
    };
  }
}
