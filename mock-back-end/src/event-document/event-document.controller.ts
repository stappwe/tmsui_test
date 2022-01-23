import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpStatus,
  Param, ParseIntPipe,
  Post, Query, Req,
  Res, UploadedFiles, UseInterceptors
} from '@nestjs/common';

import { Request, Response } from 'express';
import { copyFileSync, createReadStream, existsSync, mkdirSync, rmdirSync, unlinkSync } from 'fs';
import * as path from 'path';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DashBuilder } from '../common/dashBuilder';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { handleError } from '@eui/core';

@Controller('Twinning/api/TMS/eventDocument')
export class EventDocumentController {
  public static pollingService: number = 0;
  @Get('supplierConfirmation/:eventId/:documentType')
  getSupplierConfirmationList(@Headers('authorization') authorization: string,
                              @Param('eventId') eventId: number,
                              @Param('documentType') documentType: number,
                              @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/supplierConfirmation - Authorization: ' + authorization +
      ', eventId: ' + eventId + ', documentType: ' + documentType);

    switch (Number(documentType)) {
    case 1:
      createReadStream(path.join(__dirname, '../resources/json/eventDocument/supplierConfirmationList.json')).pipe(res);
      break;
    case 2:
      createReadStream(path.join(__dirname, '../resources/json/eventDocument/supplierOptionList.json')).pipe(res);
      break;
    }
  }

  @Get('extractSupplierDocument/:eventId/:documentType/:supplierId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  extractSupplierDocument(@Headers('authorization') authorization: string,
                          @Param('eventId') eventId: number,
                          @Param('documentType') documentType: number,
                          @Param('supplierId') supplierId: number,
                          @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/extractSupplierDocument - Authorization: ' + authorization +
      ', eventId: ' + eventId + ', documentType: ' + documentType + ', supplierId: ' + supplierId);

    let filename: string = '';
    switch (Number(documentType)) {
    case 1:
      filename = 'Supplier_Confirmation.docx';
      break;
    case 2:
      filename = 'Suppliers_Option.docx';
      break;
    }

    res.set('Content-Disposition', 'attachment; filename=' + filename);
    createReadStream(path.join(__dirname, '../resources/eventDocument/' + filename)).pipe(res);
  }

  @Get('expertLVSInterpreter/:eventId')
  getExpertLVSInterpreterList(@Headers('authorization') authorization: string,
                              @Param('eventId') eventId: number,
                              @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/expertLVSInterpreter - Authorization: ' + authorization +
      ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/expertLVSInterpreterList.json')).pipe(res);
  }

  @Post('extractExpertLVSInterpreterDocument/:eventId/:documentType/:id')
  extractExpertLVSInterpreterDocument(@Headers('authorization') authorization: string,
                                      @Param('eventId') eventId: number,
                                      @Param('documentType') documentType: number,
                                      @Param('id') id: number,
                                      @Body() body: any,
                                      @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/extractExpertLVSInterpreterDocument - Authorization: ' + authorization +
      ', eventId: ' + eventId + ', documentType: ' + documentType + ', id: ' + id + ', specialArrangements: ' + JSON.stringify(body));
    let filename: string = '';
    switch (Number(documentType)) {
    case 1: // Expert
      filename = '../resources/json/eventDocument/extractExpertContract.json';
      break;
    case 2: // LVS - Other
      filename = '../resources/json/eventDocument/extractLVSContract.json';
      break;
    case 3: // Interpreters
      filename = '../resources/json/eventDocument/extractInterpretationContract.json';
      break;
    }

    createReadStream(path.join(__dirname, filename)).pipe(res);
  }

  @Get('eventChecklist/:eventId')
  getEventChecklist(@Headers('authorization') authorization: string,
                    @Param('eventId') eventId: number,
                    @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/eventChecklist - Authorization: ' + authorization +
      ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/eventChecklist.json')).pipe(res);
  }

  @Post('updateChecklist')
  updateChecklist(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/updateChecklist - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/updateChecklist.json')).pipe(res);
  }

  @Get('extractSendingLCODocument/:eventId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=SendingLCO_67400.pdf')
  extractSendingLCODocument(@Headers('authorization') authorization: string,
                           @Param('eventId') eventId: number,
                           @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/extractSendingLCODocument - Authorization: ' + authorization +
      ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/eventDocument/SendingLCO_67400.pdf')).pipe(res);
  }

  @Get('extractPackageMail/:eventId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/x-msg')
  @Header('Content-Disposition', 'attachment; filename=Package_mail_67400.msg')
  extractPackageMail(@Headers('authorization') authorization: string,
                     @Param('eventId') eventId: number,
                     @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/extractPackageMail - Authorization: ' + authorization +
      ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/eventDocument/Package_mail_67400.msg')).pipe(res);
  }

  @Get('invitation/participant-list/:motherEventId')
  getInvitationParticipantList(@Headers('authorization') authorization: string,
                               @Param('motherEventId') motherEventId: number,
                               @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/invitation/participant-list - Authorization: ' + authorization +
      ', motherEventId: ' + motherEventId);

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/invitationParticipantList.json')).pipe(res);
  }

  @Get('invitation/letter-details/:motherEventId')
  getInvitationLetterDetails(@Headers('authorization') authorization: string,
                             @Param('motherEventId') motherEventId: number,
                             @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/invitation/letter-details - Authorization: ' + authorization +
      ', motherEventId: ' + motherEventId);

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/invitationLetterDetails.json')).pipe(res);
  }

  @Post('invitation/create-invitation-letter/:motherEventId/:letterType/:languageType')
  createInvitationLetter(@Headers('authorization') authorization: string,
                         @Param('motherEventId') motherEventId: number,
                         @Param('letterType') letterType: number,
                         @Param('languageType') languageType: number,
                         @Body() body: any,
                         @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/invitation/letter-details - Authorization: ' + authorization +
      ', motherEventId: ' + motherEventId + ', letterType: ' + letterType + ', languageType: ' + languageType + ', details: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/createInvitationLetter.json')).pipe(res);
  }

  @Post('invitation/send-draft-email/:eventId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/x-msg')
  @Header('Content-Disposition', 'attachment; filename=Send_Draft_Email.msg')
  createDraftEmail(@Headers('authorization') authorization: string,
                   @Param('eventId') eventId: number,
                   @Query('selectedIds') selectedIds: Array<number>,
                   @Query('emailType', ParseIntPipe) emailType: number,
                   @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/invitation/send-draft-email - Authorization: ' + authorization +
      ', eventId:' + eventId + ', selectedIds: ' + selectedIds + ', emailType: ' + emailType);

    createReadStream(path.join(__dirname, '../resources/eventDocument/Send_Draft_Email.msg')).pipe(res);
  }

  @Get('confirmation/participant-list/:eventId')
  getParticipantConfirmationList(@Headers('authorization') authorization: string,
                               @Param('eventId') eventId: number,
                               @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/confirmation/participant-list - Authorization: ' + authorization +
      ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/participantConfirmationList.json')).pipe(res);
  }

  @Get('confirmation/document-participant-list/:eventId/:attachGlobal/:participantToken')
  getDocumentParticipantList(@Headers('authorization') authorization: string,
                             @Param('eventId') eventId: number,
                             @Param('attachGlobal') attachGlobal: boolean,
                             @Param('participantToken') participantToken: string,
                             @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/confirmation/document-participant-list - Authorization: ' + authorization +
      ', eventId: ' + eventId + ', attachGlobal: ' + attachGlobal + ', participantToken: ' + participantToken);

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/documentParticipantList.json')).pipe(res);
  }

  @Post('confirmation/create-participant-confirmation-letter')
  createParticipantConfirmationLetter(@Headers('authorization') authorization: string,
                                      @Body() body: any,
                                      @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/confirmation/create-participant-confirmation-letter - Authorization: ' + authorization +
      ', details: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/createParticipantConfirmationLetter.json')).pipe(res);
  }

  @Post('upload-document-participant')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(AnyFilesInterceptor({ storage: diskStorage({ destination: path.join(__dirname, '../uploads') }) }))
  uploadDocumentParticipant(@Headers('authorization') authorization: string,
                   @Body() body: any,
                   @UploadedFiles() files,
                   @Req() req: Request,
                   @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/upload-document-participant - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));

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
      // get attachment list data and complete it
      const documentParticipantList = JSON.parse(body.documentParticipantList);
      const participantTokens = body.participantTokens;
      const attachGlobal = body.attachGlobal;

      createReadStream(path.join(__dirname, '../resources/json/eventDocument/uploadDocumentParticipant.json')).pipe(res);
      res.status(200);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('General error during saving of the participant document(s).');
    }
  }

  @Get('delete-agenda/:eventId')
  deleteAgenda(@Headers('authorization') authorization: string,
               @Param('eventId') eventId: number,
               @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/delete-agenda - Authorization: ' + authorization + ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/deleteAgenda.json')).pipe(res);
  }

  @Get('delete-document-participant/:participantToken/:documentId/:documentType/:attachGlobal')
  deleteDocumentParticipant(@Headers('authorization') authorization: string,
                            @Param('participantToken') participantToken: string,
                            @Param('documentId') documentId: number,
                            @Param('documentType') documentType: number,
                            @Param('attachGlobal') attachGlobal: boolean,
                            @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/delete-document-participant - Authorization: ' + authorization + ', participantToken: ' + participantToken +
      ', documentId: ' + documentId + ', documentType: ' + documentType + ', attachGlobal: ' + attachGlobal);

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/deleteDocumentParticipant.json')).pipe(res);
  }

  @Get('add-agenda-document/:eventId')
  addAgendaDocument(@Headers('authorization') authorization: string,
                    @Param('eventId') eventId: number,
                    @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/add-agenda-document - Authorization: ' + authorization + ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/addAgendaDocument.json')).pipe(res);
  }

  @Post('attach-global-document-selected-participant')
  attachDocToSelParticipants(@Headers('authorization') authorization: string,
                             @Body() body: any,
                             @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/attach-global-document-selected-participant - Authorization: ' + authorization +
      ', data: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/attachDocToSelParticipants.json')).pipe(res);
  }

  @Post('confirmation/send-participant-confirmation-Letter')
  sendParticipantConfirmationLetter(@Headers('authorization') authorization: string,
                                    @Body() body: any,
                                    @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/confirmation/send-participant-confirmation-Letter - Authorization: ' + authorization +
      ', data: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/sendParticipantConfirmationLetter.json')).pipe(res);
  }

  @Post('confirmation/unlock-participant-confirmation')
  unlockParticipantConfirmation(@Headers('authorization') authorization: string,
                                @Body() body: any,
                                @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/confirmation/unlock-participant-confirmation - Authorization: ' + authorization +
      ', data: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/eventDocument/unlockParticipantConfirmation.json')).pipe(res);
  }

  @Get('confirmation/check-mailing-confirmation-letter/:eventId')
  checkMailingConfirmationLetter(@Headers('authorization') authorization: string,
                                 @Param('eventId') eventId: number,
                                 @Res() res: Response) {
    console.log('Twinning/api/TMS/eventDocument/confirmation/check-mailing-confirmation-letter - Authorization: ' + authorization + ', eventId: ' + eventId);

    EventDocumentController.pollingService += 1;
    if (Math.floor(EventDocumentController.pollingService / 10) === (EventDocumentController.pollingService / 10)) {
      createReadStream(path.join(__dirname, '../resources/json/eventDocument/checkMailingConfirmationLetterFalse.json')).pipe(res);
    } else {
      createReadStream(path.join(__dirname, '../resources/json/eventDocument/checkMailingConfirmationLetterTrue.json')).pipe(res);
    }
  }
}
