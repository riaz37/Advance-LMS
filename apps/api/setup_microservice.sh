#!/bin/bash

# Check if a microservice name is provided
if [ -z "$1" ]; then
  echo "Please provide a microservice name."
  exit 1
fi

# Set the microservice name from the first argument
MICROSERVICE_NAME=$1

# Create the directory structure
mkdir -p $MICROSERVICE_NAME/src

# Navigate into the microservice directory
cd $MICROSERVICE_NAME

# Initialize a new Node.js project with pnpm
pnpm init 

# Install necessary NestJS packages with pnpm
pnpm add @nestjs/core @nestjs/common @nestjs/platform-express reflect-metadata rxjs

# Install NestJS CLI as a dev dependency
pnpm add -D @nestjs/cli @nestjs/schematics typescript ts-node @types/node

# Create a basic TypeScript configuration file
cat <<EOT >> tsconfig.json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
EOT

# Create a basic NestJS application file
cat <<EOT >> src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
EOT

# Create a basic AppModule
cat <<EOT >> src/app.module.ts
import { Module } from '@nestjs/common';

@Module({})
export class AppModule {}
EOT

echo "NestJS microservice '$MICROSERVICE_NAME' setup complete."