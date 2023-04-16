import { Module } from '@nestjs/common';
import { CSVService } from './csv.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CSVService],
})
export class CSVModule {}
