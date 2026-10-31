import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { PostgresFilmsRepository } from './repository/films.repository.postgres';

import { Film } from './films/entities/film.entity';
import { Schedule } from './films/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
      exclude: ['/api/(.*)'],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: 'localhost',
        port: 5432,
        database: 'prac',
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        entities: [Film, Schedule],
        synchronize: false,
      }),
    }),

    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    FilmsService,
    OrderService,
    {
      provide: 'AppRepository',
      useClass: PostgresFilmsRepository,
    },
  ],
})
export class AppModule {}
