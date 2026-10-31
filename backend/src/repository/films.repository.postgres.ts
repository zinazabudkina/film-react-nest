import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { FilmsRepository, FilmWithSchedule } from './films.repository';

@Injectable()
export class PostgresFilmsRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find();

    return films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags ? film.tags.split(',').map((tag) => tag.trim()) : [],
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    }));
  }

  async findById(id: string): Promise<FilmWithSchedule | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: { schedule: true },
      order: {
        schedule: {
          daytime: 'ASC',
          id: 'ASC',
        },
      },
    });

    if (!film) {
      return null;
    }

    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags ? film.tags.split(',').map((tag) => tag.trim()) : [],
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule: film.schedule.map((session) => ({
        id: session.id,
        daytime: session.daytime,
        hall: session.hall,
        rows: session.rows,
        seats: session.seats,
        price: session.price,
        taken: session.taken ? session.taken.split(',') : [],
      })),
    };
  }

  async findScheduleByFilmId(id: string): Promise<ScheduleDto[] | null> {
    const film = await this.findById(id);

    if (!film) {
      return null;
    }

    return film.schedule;
  }

  async addTakenSeat(
    filmId: string,
    sessionId: string,
    place: string,
  ): Promise<boolean> {
    const result = await this.scheduleRepository
      .createQueryBuilder()
      .update(Schedule)
      .set({
        taken: () =>
          `CASE
          WHEN "taken" = '' THEN :place
          ELSE "taken" || ',' || :place
        END`,
      })
      .where('id = :sessionId', { sessionId })
      .andWhere('"filmId" = :filmId', { filmId })
      .andWhere(`NOT (:place = ANY(string_to_array("taken", ',')))`)
      .setParameters({ place })
      .execute();

    return (result.affected ?? 0) > 0;
  }
}
