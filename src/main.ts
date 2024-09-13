/*
 * @Author: 何欣 hexing@qq.com
 * @Date: 2024-09-13 09:25:02
 * @LastEditors: 何欣 hexing@qq.com
 * @LastEditTime: 2024-09-13 09:31:25
 * @FilePath: /nest学习/large-file-sharding-upload/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
