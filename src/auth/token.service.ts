import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, TokensResponse } from './auth.types';
import { PrismaService } from '../prisma/prisma.service';
import AppConfig from '../config/app.config';
import { RefreshToken } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly appConfig: AppConfig,
  ) {}

  public async saveRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<RefreshToken> {
    const tokenEntity = await this.prismaService.refreshToken.findUnique({
      where: {
        token_userId: {
          userId,
          token: refreshToken,
        },
      },
    });

    if (tokenEntity) {
      return tokenEntity;
    }

    return this.prismaService.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
      },
    });
  }

  public async findRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<RefreshToken> {
    return this.prismaService.refreshToken.findUnique({
      where: {
        token_userId: {
          userId,
          token: refreshToken,
        },
      },
    });
  }

  public async deleteRefreshToken(userId: number, refreshToken: string) {
    return this.prismaService.refreshToken.delete({
      where: {
        token_userId: {
          userId,
          token: refreshToken,
        },
      },
    });
  }

  public async generateTokens(payload: JwtPayload): Promise<TokensResponse> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.appConfig.accessTokenExpirationTime,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.appConfig.jwtRefreshSecret,
      expiresIn: this.appConfig.refreshTokenExpirationTime,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.appConfig.accessTokenExpirationTime,
    });
  }

  public async validateRefreshToken(
    refreshToken: string,
  ): Promise<JwtPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.appConfig.jwtRefreshSecret,
        },
      );
      return payload;
    } catch (e) {
      return null;
    }
  }

  public async validateAccessToken(
    accessToken: string,
  ): Promise<JwtPayload | null> {
    try {
      const payload =
        await this.jwtService.verifyAsync<JwtPayload>(accessToken);
      return payload;
    } catch (e) {
      return null;
    }
  }
}
