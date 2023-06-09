import {
  Controller,
  Get,
  Injectable,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { Headers, Param, Query, Res } from '@nestjs/common/decorators';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { GoogleDriveService } from 'src/google-drive/google-drive.service';
import { TaskService } from 'src/tasks/task.service';
import { UserService } from './user.service';

@Injectable()
@Controller('api/v1/users')
export class UserController {
  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private googleDriveService: GoogleDriveService,
  ) {}

  @Post()
  async addUser() {
    return this.userService.add();
  }

  @Get(':id')
  async getCSVFilePerUser(
    @Query('start_date') startDate: string,
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: number,
    @Headers('authorization') authorization: string,
  ) {
    try {
      return await this.taskService
        .getGroupedTasksPerUser(id, startDate)
        .then((fileName) => {
          const file = createReadStream(join(process.cwd(), fileName));
          res.set({
            'Content-Type': 'application/csv',
          });

          // TODO: make it work with google drive of logged user
          if (authorization) {
            const accessToken = authorization.split(' ')[1];
            this.googleDriveService
              .uploadUserCSVFile(fileName, accessToken)
              .then((data) => {
                console.log(data);
              });
          }

          return new StreamableFile(file);
        });
    } catch (error) {
      console.log('error', error);
    }
  }
}
