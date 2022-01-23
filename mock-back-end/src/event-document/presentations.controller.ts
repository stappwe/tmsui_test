import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post, Query,
  Req,
  Res, UploadedFile,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

import { Request, Response } from 'express';
import { createReadStream, copyFileSync, existsSync, mkdirSync, rmdirSync, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { DashBuilder } from '../common/dashBuilder';

@Controller('Twinning/api/TMS/presentations')
export class PresentationsController {
  @Get('participant-list/:eventId')
  getParticipantList(@Headers('authorization') authorization: string,
                     @Param('eventId') eventId: number,
                     @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/participant-list - Authorization: ' + authorization + ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/presentations/participant-list.json')).pipe(res);
  }

  @Get('presentation-list/:eventId')
  getPresentationList(@Headers('authorization') authorization: string,
                      @Param('eventId') eventId: number,
                      @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/presentation-list - Authorization: ' + authorization + ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/presentations/presentation-list.json')).pipe(res);
  }

  @Get('get-presentation/:documentId')
  getPresentation(@Headers('authorization') authorization: string,
                  @Param('documentId') documentId: number,
                  @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/get-presentation - Authorization: ' + authorization + ', documentId: ' + documentId);

    createReadStream(path.join(__dirname, '../resources/json/presentations/presentation.json')).pipe(res);
  }

  @Get('get-video-languages/:documentId')
  getVideoLanguagesList(@Headers('authorization') authorization: string,
                        @Param('documentId') documentId: number,
                        @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/get-video-languages - Authorization: ' + authorization + ', documentId: ' + documentId);

    createReadStream(path.join(__dirname, '../resources/json/presentations/video_languages.json')).pipe(res);
  }

  @Get('get-video-file/:documentId')
  getVideoFile(@Headers('authorization') authorization: string,
               @Param('documentId') documentId: number,
               @Query('type') type: number,
               @Query('languageId') languageId: number,
               @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/get-video-file - Authorization: ' + authorization + ', documentId: ' + documentId + ', type: ' + type +
      ', languageId: ' + languageId);

    createReadStream(path.join(__dirname, '../resources/json/presentations/video_file.json')).pipe(res);
  }

  @Get('speaker-list/:eventId')
  getEventSpeakerList(@Headers('authorization') authorization: string,
                      @Param('eventId') eventId: number,
                      @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/speaker-list - Authorization: ' + authorization + ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/presentations/event-speaker-list.json')).pipe(res);
  }

  @Post('save-presentation-publisher')
  savePresentationPublisher(@Headers('authorization') authorization: string,
                            @Body() body: any,
                            @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/save-presentation-publisher - Authorization: ' + authorization +
      ', Body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/presentations/save-presentation-publisher.json')).pipe(res);
  }

  @Post('save-presentation-publishing-group')
  savePresentationPublishingGroup(@Headers('authorization') authorization: string,
                                  @Body() body: any,
                                  @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/save-presentation-publishing-group - Authorization: ' + authorization +
      ', Body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/presentations/save-presentation-publishing-group.json')).pipe(res);
  }

  @Post('publish-to-participants')
  publishToParticipants(@Headers('authorization') authorization: string,
                        @Body() body: any,
                        @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/publish-to-participants - Authorization: ' + authorization +
      ', Body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/presentations/publish-to-participants.json')).pipe(res);
  }

  @Get('delete-presentation/:eventId/:documentId')
  deletePresentation(@Headers('authorization') authorization: string,
                     @Param('eventId') eventId: number,
                     @Param('documentId') documentId: number,
                     @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/delete-presentation - Authorization: ' + authorization + ', eventId: ' + eventId +
      ', documentId: ' + documentId);

    createReadStream(path.join(__dirname, '../resources/json/presentations/delete-presentation.json')).pipe(res);
  }

  @Post('upload-presentation')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(AnyFilesInterceptor({ storage: diskStorage({ destination: path.join(__dirname, '../uploads') }) }))
  uploadPresentation(@Headers('authorization') authorization: string,
                     @Body() body: any,
                     @UploadedFiles() files,
                     @Req() req: Request,
                     @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/upload-presentation - Authorization: ' + authorization +
      ', Body: ' + JSON.stringify(body));

    try {
      // copy file to destination folder
      const filename = files[0].originalname;
      if (path.extname(filename).toLowerCase() === '.webm') {
        const dirName = path.basename(filename, path.extname(filename));
        const destDir = files[0].destination + '\\' + dirName;
        const destPath = destDir + '\\' + filename;
        // create directory if needed
        if (!existsSync(destDir)) {
          mkdirSync(destDir);
        } else {
          // remove all the existing files
          rmdirSync(destDir, { recursive: true });
        }
        // copy file into folder
        copyFileSync(files[0].path, destPath);
        // remove temp file
        unlinkSync(files[0].path);
        let dashBuilder = new DashBuilder();
        dashBuilder.encodeFormats(destPath);
      }
      // get presentation data and complete it
      const presentationList = JSON.parse(body.presentationList);
      const eventId = body.eventId;
      // file.filename contains the filename of the document in upploads.
      // Check it fie is attached
      // if (files.size > 0) {
      //   // fs.readFile(file.buffer, 'binary', (err, fileData) => {
      //   //
      //   //   const binBuff = new Buffer(fileData, 'binary');
      //   //
      //   //   // Delete file from filesystem
      //   //   fs.unlink(file.path, () => {
      //   //     // file deleted
      //   //   });
      //   // });
      //
      //
      // }
      createReadStream(path.join(__dirname, '../resources/json/presentations/upload-presentation.json')).pipe(res);
      res.status(200);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('General error during saving of the presentation.');
    }
  }

  @Post('upload-video/:documentId')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({ destination: path.join(__dirname, '../uploads') }) }))
  uploadVideo(@Headers('authorization') authorization: string,
              @Param('documentId') documentId: number,
              @Body() body: any,
              @UploadedFile() file,
              @Req() req: Request,
              @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/upload-video - Authorization: ' + authorization + ', documentId: ' + documentId +
      ', Body: ' + JSON.stringify(body));

    try {
      // copy file to destination folder
      const filename = file.originalname;

      createReadStream(path.join(__dirname, '../resources/json/presentations/upload_video.json')).pipe(res);
      res.status(200);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('General error during saving of the video.');
    }
  }

  @Post('upload-video-file/:documentId')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({ destination: path.join(__dirname, '../uploads') }) }))
  uploadVideoFile(@Headers('authorization') authorization: string,
              @Param('documentId') documentId: number,
              @Body() body: any,
              @UploadedFile() file,
              @Req() req: Request,
              @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/upload-video-file - Authorization: ' + authorization + ', documentId: ' + documentId +
      ', Body: ' + JSON.stringify(body));

    try {
      // copy file to destination folder
      const filename = file.originalname;

      createReadStream(path.join(__dirname, '../resources/json/presentations/upload_video_file.json')).pipe(res);
      res.status(200);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('General error during saving of the video file.');
    }
  }

  @Post('delete-video-file/:documentId')
  @Header('Content-Type', 'application/json')
  deleteVideoFile(@Headers('authorization') authorization: string,
                  @Param('documentId') documentId: number,
                  @Body() body: any,
                  @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/delete-video-file - Authorization: ' + authorization + ', documentId: ' + documentId +
      ', Body: ' + JSON.stringify(body));

    try {
      createReadStream(path.join(__dirname, '../resources/json/presentations/delete_video_file.json')).pipe(res);
      res.status(200);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('General error during deleting of the video.');
    }
  }

  @Post('save-presentation-description')
  savePresentationDescription(@Headers('authorization') authorization: string,
                              @Body() body: any,
                              @Res() res: Response) {
    console.log('Twinning/api/TMS/presentations/save-presentation-description - Authorization: ' + authorization +
      ', Body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/presentations/save-presentation-description.json')).pipe(res);
  }
}
