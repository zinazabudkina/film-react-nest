import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { FilmEntity } from './film.schema';

@Injectable()
export class MongoFilmsRepository {
  constructor(
    @InjectModel('Film')
    private readonly filmModel: Model<FilmEntity>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().lean();

    return films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    }));
  }

  async findById(id: string): Promise<FilmEntity | null> {
    return this.filmModel.findOne({ id }).lean();
  }

  async findScheduleByFilmId(id: string): Promise<ScheduleDto[]> {
    const film = await this.findById(id);

    if (!film) {
      return [];
    }

    return film.schedule.map((session) => ({
      id: session.id,
      daytime: session.daytime,
      hall: String(session.hall),
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken,
    }));
  }
  async addTakenSeat(
    filmId: string,
    sessionId: string,
    place: string,
  ): Promise<void> {
    await this.filmModel.updateOne(
      {
        id: filmId,
        'schedule.id': sessionId,
      },
      {
        $addToSet: {
          'schedule.$.taken': place,
        },
      },
    );
  }
}
