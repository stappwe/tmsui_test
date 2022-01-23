import { Controller, Get, Header, HttpCode, HttpStatus, Param, Query, Req, Res, UseGuards } from '@nestjs/common';

import { RolesGuard } from '../common/roles.guard';
import { Request, Response } from 'express';
import { createReadStream, statSync } from 'fs';
import * as path from 'path';

@Controller('TMSWebRestrict/api/library')
@UseGuards(RolesGuard)
export class LibraryController {
  @Get('init-event-venue')
  getEventCountryList(@Res() res: Response): void {
    console.log('library/init-event-venue');

    createReadStream(path.join(__dirname, '../resources/json/library/init-legislation.json')).pipe(res);
  }

  @Get('init-beneficiary')
  getBeneficiaryCountryList(@Res() res: Response): void {
    console.log('library/init-beneficiary');

    createReadStream(path.join(__dirname, '../resources/json/library/init-beneficiary.json')).pipe(res);
  }

  @Get('init-expert-countries')
  getExpertCountryList(@Res() res: Response): void {
    console.log('library/init-expert-countries');

    createReadStream(path.join(__dirname, '../resources/json/library/init-expert-countries.json')).pipe(res);
  }

  @Get('init-instrument')
  getGroupList(@Res() res: Response): void {
    console.log('library/init-instrument');

    createReadStream(path.join(__dirname, '../resources/json/library/init-instrument.json')).pipe(res);
  }

  @Get('init-legislation')
  getChaptersScreening(@Res() res: Response): void {
    console.log('library/init-legislation');

    createReadStream(path.join(__dirname, '../resources/json/library/init-legislation.json')).pipe(res);
  }

  @Get('getAgendaDocument')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  @Header('Content-Disposition', 'attachment; filename=Agenda_70598.docx')
  extractAgenda(@Query('id') id: string,
                @Res() res: Response) {
    console.log('library/getAgendaDocument - id: ' + id);

    createReadStream(path.join(__dirname, '../resources/library/Agenda_70598.docx')).pipe(res);
  }

  @Get('video/:filename')
  getVideoContent(@Req() req: Request, @Param('filename') filename: string, @Res() res: Response): void {
    console.log('library/video - filename: ' + filename);

    // Ensure there is a range given for the video
    const file = path.join(__dirname, '../resources/library/video/', filename);
    const range = req.headers.range;
    // const CHUNK_SIZE = 10 ** 6; // 1MB
    // let start: number;
    // let end: number;
    if (!range) {
      res.status(400).send('Requires Range header');
    // } else {
    //   const positions = range.replace(/bytes=/, '').split('-');
    //   start = parseInt(positions[0], 10);
    //   end = positions[1] ? parseInt(positions[1], 10) : start + CHUNK_SIZE;
    }

    // get video stats (about 61MB)
    const videoSize = statSync(file).size;

    // Parse Range
    // Example: 'bytes=32324-'
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = createReadStream(file, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
  }
}
