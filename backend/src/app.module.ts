import { Module } from '@nestjs/common';
import { H3Service } from './h3/h3.service';
import { H3Controller } from './h3/h3.controller';

@Module({
  imports: [],
  controllers: [H3Controller],
  providers: [H3Service],
})
export class AppModule {}
