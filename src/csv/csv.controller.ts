import {
  Controller,
  Get,
  Injectable,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { GoogleDriveService } from 'src/google-drive/google-drive.service';
import { TaskService } from 'src/tasks/task.service';

@Injectable()
@Controller('api/v1/files')
export class CSVController {
  constructor(
    private googleDriveService: GoogleDriveService,
    private taskService: TaskService,
  ) {}

  // TODO: Should be authorized - only for manager role
  @Get()
  getCompanyFile(@Res({ passthrough: true }) res: Response) {
    try {
      return this.taskService.getOverall().then((fileName) => {
        const file = createReadStream(join(process.cwd(), fileName));
        res.set({
          'Content-Type': 'application/csv',
        });

        this.googleDriveService.uploadCompanyCSVFile(fileName).then((data) => {
          console.log(data);
        });

        return new StreamableFile(file);
      });
    } catch (error) {
      return error;
    }
  }
}
