import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDrizzle } from './index';

@Global()
@Module({
  providers: [
    {
      provide: 'DRIZZLE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => createDrizzle(configService),
    },
  ],
  exports: ['DRIZZLE'],
})
export class DbModule {}
