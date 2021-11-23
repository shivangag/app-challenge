import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';

import * as helmet from 'helmet';

import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import CloudWatchTransport from 'winston-cloudwatch';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(
    WinstonModule.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike()
      ),
      transports: [new winston.transports.Console()]
    })
  );

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });

  const config = new DocumentBuilder()
    .setTitle('challenge')
    .setDescription('The challenge API description')
    .setVersion('1.0')
    .addTag('first')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Bearer Token' },
      'Authorization',
    )
    .build();

  app.setGlobalPrefix('v1');
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.enableCors();

  app.use(helmet());

  const corsOptions = {
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL1],

    credentials: true,
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    allowedHeaders: [
      'Set-cookie, X-Requested-With,content-type, Origin, Accept, x-access-token, Authorization',
    ],
    exposedHeaders: ['Set-cookie'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  app.enableCors(corsOptions);

  await app.listen(3001);
}
bootstrap();