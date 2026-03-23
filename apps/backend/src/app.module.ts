import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { DietProfilesModule } from './modules/diet-profiles/diet-profiles.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { MealPlansModule } from './modules/meal-plans/meal-plans.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    DietProfilesModule,
    RecipesModule,
    MealPlansModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
