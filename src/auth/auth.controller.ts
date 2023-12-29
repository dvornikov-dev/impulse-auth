import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { REFRESH_COOKIE_NAME } from './auth.constats';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtPayload } from './auth.types';
import { AuthGuard } from './auth.guard';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import AppConfig from '../config/app.config';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { AccessTokenResponseDto } from './dto/access-token-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfig: AppConfig,
  ) {}

  @ApiOkResponse({
    type: AccessTokenResponseDto,
    headers: {
      'Set-Cookie': {
        schema: { type: 'string' },
        description: 'Refresh Token',
      },
    },
  })
  @Post('/signup')
  async signUp(@Body() dto: SignUpDto, @Res() res: FastifyReply) {
    const { email, password } = dto;

    const { accessToken, refreshToken } = await this.authService.signUp(
      email,
      password,
    );

    res.setCookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      maxAge: this.appConfig.cookieMaxAge,
      path: '/',
    });

    return res.send({ accessToken });
  }

  @ApiOkResponse({
    type: AccessTokenResponseDto,
    headers: {
      'Set-Cookie': {
        schema: { type: 'string' },
        description: 'Refresh Token',
      },
    },
  })
  @Post('/signin')
  async signin(@Body() dto: SignInDto, @Res() res: FastifyReply) {
    const { email, password } = dto;

    const { accessToken, refreshToken } = await this.authService.signIn(
      email,
      password,
    );

    res.setCookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      maxAge: this.appConfig.cookieMaxAge,
      path: '/',
    });

    return res.send({ accessToken });
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logged out' },
      },
    },
  })
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(
    @CurrentUser() user: JwtPayload,
    @Req() request: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    const { refreshToken } = request.cookies;

    await this.authService.logout(user.id, refreshToken);

    res.clearCookie(REFRESH_COOKIE_NAME);

    return res.send({ message: 'Logged out' });
  }

  @ApiOkResponse({
    type: AccessTokenResponseDto,
  })
  @ApiUnauthorizedResponse()
  @Post('/refresh')
  async refresh(@Req() request: FastifyRequest, @Res() res: FastifyReply) {
    const { refreshToken } = request.cookies;

    const { accessToken } = await this.authService.refresh(refreshToken);

    return res.send({ accessToken });
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard)
  @Get('/me')
  async getMe(@CurrentUser() user: JwtPayload): Promise<UserEntity> {
    return this.authService.getMe(user.id);
  }
}
