import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('AppRepository')
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async findAll(): Promise<FilmsResponseDto> {
    const items = await this.filmsRepository.findAll();

    return {
      total: items.length,
      items,
    };
  }

  async findSchedule(id: string): Promise<ScheduleResponseDto> {
    const items = await this.filmsRepository.findScheduleByFilmId(id);

    if (items === null) {
      throw new NotFoundException('Фильм не найден');
    }

    return {
      total: items.length,
      items,
    };
  }
}
