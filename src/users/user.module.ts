import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'userConnection' // ← AppModule에서 지정한 커넥션 이름과 동일해야 함
    ),
  ],
  // ...providers, controllers 등
})
export class UserModule {}
