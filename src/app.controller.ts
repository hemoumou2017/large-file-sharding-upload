/*
 * @Author: 何欣 hexing@qq.com
 * @Date: 2024-09-13 09:25:02
 * @LastEditors: 何欣 hexing@qq.com
 * @LastEditTime: 2024-09-13 10:10:15
 * @FilePath: /nest学习/large-file-sharding-upload/src/app.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('file', 20, { dest: 'uploads' }))
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    console.log(files, body);

    const fileName = body.name.match(/^(.+)\-\d+$/)[1];
    const chunkDir = 'uploads/chunks_' + fileName;

    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    fs.cpSync(files[0].path, chunkDir + '/' + body.name);
    fs.rmSync(files[0].path);
  }

  @Get('merge')
  merge(@Query('name') name: string) {
    const chunkDir = 'uploads/chunks_' + name;
    const files = fs.readdirSync(chunkDir);
    let startPos = 0;
    let count = 0;
    files.map((file) => {
      const filePath = chunkDir + '/' + file;
      const fileStream = fs.createReadStream(filePath);
      fileStream
        .pipe(fs.createWriteStream('uploads/' + name, { start: startPos }))
        .on('finish', () => {
          count++;
          if (count === files.length) {
            fs.rm(chunkDir, { recursive: true }, () => {});
          }
        });
      startPos += fs.statSync(filePath).size;
    });
  }
}
