import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm/dist';
import { AuthMiddleware } from 'middleware/google.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { CSVController } from './csv/csv.controller';
import { CSVService } from './csv/csv.service';
import { dbOptions } from './db/data-source';
import { GoogleDriveService } from './google-drive/google-drive.service';
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
    ConfigModule.forRoot({}),
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
    CSVController,
  ],
  providers: [
    AuthService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    AppService,
    TaskService,
    TimeSlotService,
    UserService,
    CSVService,
    GoogleDriveService,
    // JwtStrategy,
    // GoogleStrategy,
  ],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/v1');
  }
}
