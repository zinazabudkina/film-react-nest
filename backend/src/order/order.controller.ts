import { Body, Controller, Post } from '@nestjs/common';

import { OrderService } from './order.service';
import { OrderDto, OrderResponseDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() order: OrderDto): Promise<OrderResponseDto> {
    return this.orderService.createOrder(order);
  }
}
