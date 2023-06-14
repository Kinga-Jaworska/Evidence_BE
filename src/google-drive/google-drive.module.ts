import { Module } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GoogleDriveService],
})
export class CSVModule {}
