import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { TokenService } from './token.service';
import AppConfig from '../config/app.config';
import { PasswordService } from './password.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [AppConfig],
      useFactory: async (appConfig: AppConfig) => ({
        secret: appConfig.jwtSecret,
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, PasswordService],
  exports: [],
})
export class AuthModule {}
