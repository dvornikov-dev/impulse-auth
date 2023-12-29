import { Module } from '@nestjs/common';
import ApiConfigModule from './config/api-config.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ApiConfigModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
