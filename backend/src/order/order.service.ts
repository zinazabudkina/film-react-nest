import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { OrderDto, OrderResponseDto, OrderResultDto } from './dto/order.dto';
import { MongoFilmsRepository } from '../repository/films.repository.mongo';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: MongoFilmsRepository) {}

  async createOrder(order: OrderDto): Promise<OrderResponseDto> {
    const places = new Set<string>();
    // проверяем все билеты
    for (const ticket of order.tickets) {
      const film = await this.filmsRepository.findById(ticket.film);

      if (!film) {
        throw new NotFoundException('Фильм не найден');
      }

      const session = film.schedule.find((item) => item.id === ticket.session);

      if (!session) {
        throw new NotFoundException('Сеанс не найден');
      }

      const place = `${ticket.row}:${ticket.seat}`;

      if (session.taken.includes(place)) {
        throw new BadRequestException(`Место ${place} уже занято`);
      }
      const placeKey = `${ticket.film}:${ticket.session}:${place}`;

      if (places.has(placeKey)) {
        throw new BadRequestException(`Место ${place} указано в заказе дважды`);
      }

      places.add(placeKey);
    }

    // Теперь занимаем места.
    const items: OrderResultDto[] = [];

    for (const ticket of order.tickets) {
      const place = `${ticket.row}:${ticket.seat}`;

      const isBooked = await this.filmsRepository.addTakenSeat(
        ticket.film,
        ticket.session,
        place,
      );

      if (!isBooked) {
        throw new BadRequestException(`Место ${place} уже занято`);
      }

      items.push({
        ...ticket,
        id: randomUUID(),
      });
    }

    return {
      total: items.length,
      items,
    };
  }
}
