import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDto, OrderResponseDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;

  const mockOrderService = {
    createOrder: jest.fn<OrderService['createOrder']>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should call the service and return the order', async () => {
      const order: OrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            film: 'film-1',
            session: 'session-1',
            daytime: '2026-11-18T18:00:00',
            row: 3,
            seat: 5,
            price: 500,
          },
        ],
      };

      const mockResponse: OrderResponseDto = {
        total: 500,
        items: [
          {
            id: 'ticket-1',
            film: 'film-1',
            session: 'session-1',
            daytime: '2026-11-18T18:00:00',
            row: 3,
            seat: 5,
            price: 500,
          },
        ],
      };

      mockOrderService.createOrder.mockResolvedValue(mockResponse);

      const result = await controller.createOrder(order);

      expect(mockOrderService.createOrder).toHaveBeenCalledTimes(1);
      expect(mockOrderService.createOrder).toHaveBeenCalledWith(order);
      expect(result).toEqual(mockResponse);
    });
  });
});
