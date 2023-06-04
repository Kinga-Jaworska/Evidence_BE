import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm/dist';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { CSVService } from './csv/csv.service';
import { dbOptions } from './db/data-source';
import { Task } from './tasks/task.entity';
import { TaskService } from './tasks/task.service';
import { TaskController } from './tasks/tasks.controller';
import { TimeSlotController } from './time-slot/time-slot.controller';
import { TimeSlot } from './time-slot/time-slot.entity';
import { TimeSlotService } from './time-slot/time-slot.service';
import { User } from './users/user.entity';
import { UserService } from './users/user.service';
import { UserController } from './users/users.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...(dbOptions as TypeOrmModuleOptions),
    }),
    TypeOrmModule.forFeature([User, TimeSlot, Task]),
    // JwtModule.register({}),
  ],
  controllers: [
    // AuthController,
    AppController,
    TaskController,
    TimeSlotController,
    UserController,
  ],
  providers: [
    // ProxyMiddleware,

    // AuthService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    AppService,
    TaskService,
    TimeSlotService,
    UserService,
    CSVService,
    // JwtStrategy,
    GoogleStrategy,
  ],
})
export class AppModule {}

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(ProxyMiddleware).forRoutes('*');
//   }
// }
