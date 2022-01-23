import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';

import './common/objectExtensions';
import { GeneralRoutines } from './common/generalRoutines';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GeneralRoutines.appConfig.server.root);
  app.enableCors({ credentials: true, origin: GeneralRoutines.appConfig.server.urlServer });
  if (GeneralRoutines.appConfig.server.urlServer === 'http://localhost:4200') {
    await app.listen(GeneralRoutines.appConfig.server.port);
    Logger.log(`Server running on http://localhost:${GeneralRoutines.appConfig.server.port}`, 'Bootstrap');
  } else {
    await app.listen(process.env.PORT);
    Logger.log(`Server running on http://localhost:${process.env.PORT}`, 'Bootstrap');
  }
}
bootstrap();
