import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
class AppConfig {
  constructor(private configService: ConfigService) {}

  get port(): string {
    return this.configService.getOrThrow('PORT');
  }

  get host(): string {
    return this.configService.getOrThrow('HOST');
  }

  get jwtSecret(): string {
    return this.configService.getOrThrow('JWT_SECRET');
  }

  get jwtRefreshSecret(): string {
    return this.configService.getOrThrow('JWT_REFRESH_SECRET');
  }

  get cookieSecret(): string {
    return this.configService.getOrThrow('COOKIE_SECRET');
  }

  get cookieMaxAge(): number {
    return this.configService.getOrThrow('REFRESH_COOKIE_MAX_AGE');
  }

  get refreshTokenExpirationTime(): string {
    return this.configService.getOrThrow('REFRESH_TOKEN_EXPIRATION_TIME');
  }

  get accessTokenExpirationTime(): string {
    return this.configService.getOrThrow('ACCESS_TOKEN_EXPIRATION_TIME');
  }
}

export default AppConfig;
