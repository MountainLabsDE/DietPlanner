import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { OpenAIProvider } from './providers/openai.provider';

@Module({
  imports: [ConfigModule],
  controllers: [AIController],
  providers: [AIService, OpenAIProvider],
  exports: [AIService],
})
export class AIModule {}
