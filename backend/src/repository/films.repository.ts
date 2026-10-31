import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

export interface FilmWithSchedule extends FilmDto {
  schedule: ScheduleDto[];
}

export interface FilmsRepository {
  findAll(): Promise<FilmDto[]>;

  findById(id: string): Promise<FilmWithSchedule | null>;

  findScheduleByFilmId(id: string): Promise<ScheduleDto[] | null>;

  addTakenSeat(
    filmId: string,
    sessionId: string,
    place: string,
  ): Promise<boolean>;
}
