import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away any properties that don't have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted values are provided
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Swagger OpenAPI Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Loyalty Program API')
    .setDescription('API documentation for the SaaS Customer Loyalty Program')
    .setVersion('1.0')
    .addBearerAuth(
      // If you use Bearer token authentication
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching with @ApiBearerAuth() in controllers
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  }); // Swagger UI will be available at /api-docs

  // Enable CORS
  app.enableCors({
    origin: '*', // Adjust if your frontend runs on a different port
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Important for cookies or auth headers
    allowedHeaders: 'Content-Type, Accept, Authorization', // Ensure Authorization header is allowed
  });

  // Serve static assets from the 'public' folder
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger UI available at: ${await app.getUrl()}/api-docs`);
}
void bootstrap().catch((err) => {
  console.error('Error during bootstrap', err);
  process.exit(1);
});
