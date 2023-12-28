import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AppConfig from './app.config';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [AppConfig],
  exports: [AppConfig],
})
export default class ApiConfigModule {}
