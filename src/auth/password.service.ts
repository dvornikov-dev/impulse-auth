import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { SALT_LEN, KEY_LEN } from './auth.constats';

@Injectable()
export class PasswordService {
  public async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(SALT_LEN);

    const passwordHash = (await promisify(scrypt)(
      password,
      salt,
      KEY_LEN,
    )) as Buffer;

    return `${salt.toString('base64')}$${passwordHash.toString('base64')}`;
  }

  public async validatePassword(password: string, saltHash: string) {
    const [salt, hash] = saltHash.split('$');

    const passwordHash = (await promisify(scrypt)(
      password,
      Buffer.from(salt, 'base64'),
      KEY_LEN,
    )) as Buffer;

    return timingSafeEqual(passwordHash, Buffer.from(hash, 'base64'));
  }
}
