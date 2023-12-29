import { ApiProperty } from '@nestjs/swagger';
import { AccessTokenResponse } from '../auth.types';

export class AccessTokenResponseDto implements AccessTokenResponse {
  @ApiProperty()
  accessToken: string;
}
