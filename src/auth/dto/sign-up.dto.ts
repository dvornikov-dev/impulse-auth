import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Match } from '../decorators/match.decorator';
import { IsValidPassword } from '../decorators/is-valid-password.decorator';

export class SignUpDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsValidPassword()
  password: string;

  @ApiProperty()
  @Match('password')
  passwordConfirmation: string;
}
