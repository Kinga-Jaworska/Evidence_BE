import {
  Controller,
  Get,
  Injectable,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { Param, Res } from '@nestjs/common/decorators';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { TaskService } from 'src/tasks/task.service';
import { UserService } from './user.service';

@Injectable()
@Controller('api/v1/users')
export class UserController {
  constructor(
    private userService: UserService,
    private taskService: TaskService,
  ) {}

  @Post()
  async addUser() {
    return this.userService.add();
  }

  @Get(':id')
  async getCSVFilePerUser(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: number,
  ) {
    try {
      const fileName = await this.taskService.getGroupedTasksPerUser(id);
      return await this.taskService.getGroupedTasksPerUser(id).then(() => {
        const file = createReadStream(join(process.cwd(), fileName));
        res.set({
          'Content-Type': 'application/csv',
        });
        return new StreamableFile(file);
      });
    } catch (error) {
      return error;
    }
  }
}
