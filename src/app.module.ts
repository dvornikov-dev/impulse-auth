import { Module } from '@nestjs/common';
import ApiConfigModule from './config/api-config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ApiConfigModule, PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
