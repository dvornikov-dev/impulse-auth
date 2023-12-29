import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import { AccessTokenResponse, TokensResponse } from './auth.types';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
  ) {}

  public async signUp(
    email: string,
    password: string,
  ): Promise<TokensResponse> {
    const candidate = await this.userService.findByEmail(email);

    if (candidate) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = await this.passwordService.hashPassword(password);

    const user = await this.userService.create({
      email,
      password: passwordHash,
    });

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({
        id: user.id,
        email: user.email,
      });

    await this.tokenService.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async signIn(
    email: string,
    password: string,
  ): Promise<TokensResponse> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Wrong login or password');
    }

    const isPasswordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Wrong login or password');
    }

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({
        id: user.id,
        email: user.email,
      });

    await this.tokenService.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async logout(userId: number, refreshToken: string) {
    const result = await this.tokenService.deleteRefreshToken(
      userId,
      refreshToken,
    );
    return result;
  }

  public async refresh(refreshToken: string): Promise<AccessTokenResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const payload = await this.tokenService.validateRefreshToken(refreshToken);

    if (!payload) {
      throw new UnauthorizedException();
    }

    const tokenFromDb = await this.tokenService.findRefreshToken(
      payload.id,
      refreshToken,
    );

    if (!tokenFromDb) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findByEmail(payload.email);

    if (!user || user.email !== payload.email) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    return {
      accessToken,
    };
  }

  public async getMe(userId: number) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    delete user.password;

    return user;
  }
}
