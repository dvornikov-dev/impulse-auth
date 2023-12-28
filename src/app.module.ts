import { Module } from '@nestjs/common';
import ApiConfigModule from './config/api-config.module';

@Module({
  imports: [ApiConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
