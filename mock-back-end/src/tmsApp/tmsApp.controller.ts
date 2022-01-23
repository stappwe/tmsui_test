/* tslint:disable:max-line-length */
import { Body, Controller, Get, Header, Headers, HttpCode, HttpStatus, Param, Query, Res, Post, ParseIntPipe } from '@nestjs/common';

import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';
import { enDashboardListType } from '../dashboard/dashboard.controller';

export enum enArchivePKType {
  Person = 1,
  Supplier = 2,
  KeyContact = 3,
  Task = 4,
  Event = 5,
}

export class Email {
  public to: string;
  public cc: string;
  public bcc: string;
  public subject: string;
  public body: string;
  public filename: string = '';

  constructor(data: {
    to: string,
    cc: string,
    bcc: string,
    subject: string,
    body: string,
    filename?: string,
  } = { to: '', cc: '', bcc: '', subject: '', body: '', filename: '' }) {
    Object.assign(this, data);
  }
}

@Controller('Twinning/api/TMS')
export class TMSAppController {
  @Get('get-grid-filters/:gridName')
  getGridFilters(@Headers('authorization') authorization: string,
                 @Param('gridName') gridName: string,
                 @Res() res: Response) {
    console.log('Twinning/api/TMS/get-grid-filters - Authorization: ' + authorization + ', gridName: ' + gridName);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/' + gridName + 'Filters.json')).pipe(res);
  }

  @Get('get-grid-filters/:gridName/:id')
  getGridFiltersById(@Headers('authorization') authorization: string,
                     @Param('gridName') gridName: string,
                     @Param('id') id: number,
                     @Res() res: Response) {
    console.log('Twinning/api/TMS/get-grid-filters - Authorization: ' + authorization + ', gridName: ' + gridName + ', id: ' + id);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/' + gridName + 'Filters.json')).pipe(res);
  }

  @Post('upload-document/:id/:pkType')
  getDocumentUploadUrl(@Headers('authorization') authorization: string,
                       @Param('id') id: number,
                       @Param('pkType') pkType: number,
                       @Query('templateId') templateId: number,
                       @Body() body: any,
                       @Res() res: Response) {
    console.log('Twinning/api/TMS/upload-document - Authorization: ' + authorization +
      ', id: ' + id + ', pkType: ' + pkType + ', templateId: ' + templateId);

    let filename = '../resources/json/tmsApp/';
    switch (Number(templateId)) {
    case 13:
      filename += 'template_13.json';
      break;
    default:
      filename += 'template_blanco.json';
    }
    createReadStream(path.join(__dirname, filename)).pipe(res);
  }

  @Get('download-document/:id/:pkType')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  @Header('Content-Disposition', 'attachment; filename=Empty_Document.docx')
  getDocumentDownloadURL(@Headers('authorization') authorization: string,
                       @Param('id') id: number,
                       @Param('pkType') pkType: number,
                       @Res() res: Response) {
    console.log('Twinning/api/TMS/download-document - Authorization: ' + authorization +
      ', id: ' + id + ', pkType: ' + pkType);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/Empty_Document.docx')).pipe(res);
  }

  @Get('get-documents/:id/:pkType')
  getDocuments(@Headers('authorization') authorization: string,
               @Param('id') id: number,
               @Param('pkType') pkType: number,
               @Query('templateId') templateId: number,
               @Res() res: Response) {
    console.log('Twinning/api/TMS/get-documents - Authorization: ' + authorization +
      ', id: ' + id + ', pkType: ' + pkType + ', templateId: ' + templateId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/documents_tms.json')).pipe(res);
  }

  @Get('viewUploadList-print/:id/:pkType')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=ViewUploadList_Extract.xlsx')
  getViewUploadPrint(@Headers('authorization') authorization: string,
                     @Param('id') id: number,
                     @Param('pkType') pkType: number,
                     @Query('templateId') templateId: number,
                     @Res() res: Response) {
    console.log('Twinning/api/TMS/viewUploadList-print - Authorization: ' + authorization +
      ', id: ' + id + ', pkType: ' + pkType + ', templateId: ' + templateId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/ViewUploadList_Extract.xlsx')).pipe(res);
  }

  @Get('get-templates/:templateId')
  getTemplates(@Headers('authorization') authorization: string,
               @Param('templateId') templateId: number,
               @Res() res: Response) {
    console.log('Twinning/api/TMS/get-templates - Authorization: ' + authorization +
      ', templateId: ' + templateId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/templates_tms.json')).pipe(res);
  }

  @Get('get-allowed-fileTypes/:pkType')
  getAllowedFileTypes(@Headers('authorization') authorization: string,
               @Param('pkType') pkType: number,
               @Res() res: Response) {
    console.log('Twinning/api/TMS/get-allowed-fileTypes - Authorization: ' + authorization +
      ', pkType: ' + pkType);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/allowedFileTypes_tms_' + pkType + '.json')).pipe(res);
  }

  @Get('delete-document/:taskId/:templateId/:id/:pkType')
  deleteDocument(@Headers('authorization') authorization: string,
                 @Param('taskId') taskId: number,
                 @Param('templateId') templateId: number,
                 @Param('id') id: number,
                 @Param('pkType') pkType: number): boolean {
    console.log('Twinning/api/TMS/delete-document - Authorization: ' + authorization +
      ', taskId: ' + taskId + ', templateId: ' + templateId + ', id: ' + id + ', pkType: ' + pkType);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('qlikView-url')
  getQlikViewUrl(@Headers('authorization') authorization: string): string {
    console.log('Twinning/api/TMS/qlikView-url - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    // tslint:disable-next-line:max-line-length
    return 'https://webgate.ec.europa.eu/near_qv/QvAJAXZfc/opendoc.htm?document=Access%20Point/1.Application/PROD/003_TMS_Dashboard/2_Qvw/4_AccesPoint/TMS_Dashboard.qvw&host=QVS@NEAR_QLIKVIEW_ext';
  }

  @Get('chapters')
  getChaptersScreening(@Headers('authorization') authorization: string,
                      @Res() res: Response) {
    console.log('Twinning/api/TMS/chapters - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/chaptersScreening.json')).pipe(res);
  }

  @Get('event-chapters')
  getEventChaptersScreening(@Headers('authorization') authorization: string,
                       @Res() res: Response) {
    console.log('Twinning/api/TMS/event-chapters - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/eventChaptersScreening.json')).pipe(res);
  }

  @Get('keycontactcountries')
  getKeycontactCountryList(@Headers('authorization') authorization: string,
                           @Query('groups') groups: any,
                           @Res() res: Response) {
    console.log('Twinning/api/TMS/keycontactcountries - Authorization: ' + authorization + ', groups: ' + groups);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/generalCountryList.json')).pipe(res);
  }

  @Get('allsuppliertypes')
  getSupplierTypes(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/allsuppliertypes - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/suppliertypes_tms.json')).pipe(res);
  }

  @Get('formal-addresses')
  getFormalAddress(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/formal-addresses - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/formalAddress.json')).pipe(res);
  }

  @Get('admin/application-list')
  getApplicationList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/application-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/applicationList.json')).pipe(res);
  }

  @Get('supplierdetails/:supplierId')
  getSupplier(@Headers('authorization') authorization: string,
              @Param('supplierId') supplierId: number,
              @Res() res: Response) {
    console.log('Twinning/api/TMS/supplierdetails - Authorization: ' + authorization + ', supplierId: ' + supplierId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/supplier_tms.json')).pipe(res);
  }

  @Post('updatesupplier')
  updateSupplier(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TMS/updatesupplier - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    res.status(HttpStatus.OK).send(body);
  }

  @Post('createsupplier')
  createSupplier(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TMS/createsupplier - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    res.status(HttpStatus.OK).send(body);
  }

  @Post('suppliers')
  getSuppliers(@Headers('authorization') authorization: string,
               @Body() body: any,
               @Res() res: Response) {
    console.log('Twinning/api/TMS/suppliers - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/suppliers_tms.json')).pipe(res);
  }

  @Get('persondetails/:personId')
  getPerson(@Headers('authorization') authorization: string,
            @Param('personId') personId: number,
            @Res() res: Response) {
    console.log('Twinning/api/TMS/persondetails - Authorization: ' + authorization +
      ', personId: ' + personId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/person_tms.json')).pipe(res);
  }

  @Get('persondetails/:personId/:participantId')
  getPersonParticipant(@Headers('authorization') authorization: string,
                       @Param('personId') personId: number,
                       @Param('participantId') participantId: number,
                       @Res() res: Response) {
    console.log('Twinning/api/TMS/persondetails - Authorization: ' + authorization +
      ', personId: ' + personId + ', participantId: ' + participantId);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/person_tms.json')).pipe(res);
  }

  @Post('updateperson/:participantId')
  updatePerson(@Headers('authorization') authorization: string,
               @Param('participantId') participantId: number,
               @Body() body: any,
               @Res() res: Response) {
    console.log('Twinning/api/TMS/updateperson - Authorization: ' + authorization +
      ', participantId: ' + participantId + ', Body: ' + JSON.stringify(body));

    res.status(HttpStatus.OK).send(body);
  }

  @Post('createperson')
  createPerson(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TMS/createperson - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));

    res.status(HttpStatus.OK).send(body);
  }

  @Post('persons')
  getPersons(@Headers('authorization') authorization: string,
             @Body() body: any,
             @Res() res: Response) {
    console.log('Twinning/api/TMS/persons - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/persons.json')).pipe(res);
  }

  @Get('keycontacttypes')
  getContactTypes(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/keycontacttypes - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/contactTypes.json')).pipe(res);
  }

  @Post('keycontacts')
  getKeyContacts(@Headers('authorization') authorization: string,
                 @Body() body: any,
                 @Res() res: Response) {
    console.log('Twinning/api/TMS/keycontacts - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/keyContacts.json')).pipe(res);
  }

  @Post('updatekeycontact')
  updateKeycontact(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TMS/updatekeycontact - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    res.status(HttpStatus.OK).send(body);
  }

  @Post('createkeycontact')
  createKeycontact(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TMS/createkeycontact - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    res.status(HttpStatus.OK).send(body);
  }

  @Get('keycontactdetails/:keycontactId')
  getKeyContact(@Headers('authorization') authorization: string,
                @Param('keycontactId') keycontactId: number,
                @Res() res: Response) {
    console.log('Twinning/api/TMS/keycontactdetails - Authorization: ' + authorization + ', keycontactId: ' + keycontactId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/keyContact.json')).pipe(res);
  }

  @Get('find-linedg')
  getLineDGList(@Headers('authorization') authorization: string,
                @Param('keycontactId') keycontactId: number,
                @Res() res: Response) {
    console.log('Twinning/api/TMS/find-linedg - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/linedglist.json')).pipe(res);
  }

  @Get('keyContactlist-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=KeyContactList.xlsx')
  getKeycontactListPrint(@Headers('authorization') authorization: string,
                         @Query('filters') filters: string,
                         @Res() res: Response) {
    console.log('Twinning/api/TMS/keyContactlist-print - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/KeyContactList.xlsx')).pipe(res);
  }

  @Get('personList-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=PersonList.xlsx')
  getPersonListPrint(@Headers('authorization') authorization: string,
                         @Headers('filters') filters: string,
                         @Res() res: Response) {
    console.log('Twinning/api/TMS/personList-print - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/PersonList.xlsx')).pipe(res);
  }

  @Get('supplierlist-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=SupplierList.xlsx')
  getSupplierListPrint(@Headers('authorization') authorization: string,
                     @Headers('filters') filters: string,
                     @Res() res: Response) {
    console.log('Twinning/api/TMS/supplierlist-print - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/SupplierList.xlsx')).pipe(res);
  }

  @Get('extractsupplier')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/msword')
  @Header('Content-Disposition', 'attachment; filename=SupplierInfos_130480.doc')
  extractSupplierData(@Headers('authorization') authorization: string,
                       @Query('id') id: number,
                       @Res() res: Response) {
    console.log('Twinning/api/TMS/extractsupplier - Authorization: ' + authorization + ', id: ' + id);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/SupplierInfos_130480.doc')).pipe(res);
  }

  @Get('delete-keyContact/:keyContactId')
  deleteKeyContact(@Headers('authorization') authorization: string,
                      @Param('keyContactId') keyContactId: number): boolean {
    console.log('Twinning/api/TMS/delete-keyContact - Authorization: ' + authorization + ', keyContactId: ' + keyContactId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Post('merge-person/:selectedMainId')
  mergePerson(@Headers('authorization') authorization: string,
              @Param('selectedMainId') selectedMainId: number, @Body() body: any): boolean {
    console.log('Twinning/api/TMS/merge-person - Authorization: ' + authorization + ', selectedMainId: ' + selectedMainId +
      ', Body: ' + body);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Post('remove-profile/:personId')
  @Header('Content-Type', 'text/plain')
  removeProfileEDB(@Headers('authorization') authorization: string,
              @Param('personId') personId: number, @Body() body: any): string {
    console.log('Twinning/api/TMS/remove-profile - Authorization: ' + authorization + ', personId: ' + personId +
      ', Body: ' + body);

    return 'Remove EDB profile performed successfully';
  }

  @Get('country-list')
  getCountryList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/country-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/keyContactCountryList.json')).pipe(res);
  }

  @Get('list-active-contractor')
  getActiveTaiexContracts(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/list-active-contractor - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/activetaiexcontracts.json')).pipe(res);
  }

  @Get('person-expert/:personId')
  getPersonExpert(@Headers('authorization') authorization: string,
                  @Param('personId') personId,
                  @Res() res: Response) {
    console.log('Twinning/api/TMS/person-expert - Authorization: ' + authorization + ', personId: ' + personId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/personexpert.json')).pipe(res);
  }

  @Post('set-person-expert')
  setPersonExpert(@Headers('authorization') authorization: string,
                  @Body() body: any,
                  @Res() res: Response) {
    console.log('Twinning/api/TMS/set-person-expert- Authorization: ' + authorization + ', body: ' + body);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/setPersonExpert.json')).pipe(res);
  }

  @Get('cityList-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=CityList.xlsx')
  getCityListPrint(@Headers('authorization') authorization: string,
                   @Query('filters') filters: string,
                   @Res() res: Response) {
    console.log('Twinning/api/TMS/cityList-print - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/CityList.xlsx')).pipe(res);
  }

  @Get('participantList-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=ParticipantList_Extract.xlsx')
  getParticipantListPrint(@Headers('authorization') authorization: string,
                          @Query('filters') filters: string,
                          @Res() res: Response) {
    console.log('Twinning/api/TMS/participantList-print - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/ParticipantList_Extract.xlsx')).pipe(res);
  }

  @Get('amadeusList-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=FileUploadHistory.xlsx')
  getAmadeusListPrint(@Headers('authorization') authorization: string,
                      @Query('filters') filters: string,
                      @Res() res: Response) {
    console.log('Twinning/api/TMS/amadeusList-print - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/FileUploadHistory.xlsx')).pipe(res);
  }

  @Post('amadeusList-upload')
  amadeusUpload(@Headers('authorization') authorization: string, @Body() body: any): number {
    console.log('Twinning/api/TMS/amadeusList-upload - Authorization: ' + authorization + ', body: ' + body);
    // Extract payload
    // let jwt = new JWT(authorization);

    return 11062;
  }

  @Post('amadeusList-process')
  amadeusProcess(@Headers('authorization') authorization: string, @Body() body: any): Array<string> {
    console.log('Twinning/api/TMS/amadeusList-process - Authorization: ' + authorization + ', body: ' + body);
    // Extract payload
    // let jwt = new JWT(authorization);

    return [
      'AIR00819.air  ###  893540/CHRONOPOULOS/GEORGIOS : Participant Id: 893540 is not existing for the event: 64069',
      '###\nRM*RQ/20NOV\n'
    ];
  }

  @Get('amadeus-clear-unprocessed')
  deleteUnprocessedFiles(@Headers('authorization') authorization: string, @Res() res: Response): boolean {
    console.log('Twinning/api/TMS/amadeus-clear-unprocessed - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('statistics/download-statistics-report/:templateId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=Statistics.xlsx')
  downloadStatisticsReport(@Headers('authorization') authorization: string,
                           @Param('templateId') templateId: number,
                           @Res() res: Response) {
    console.log('Twinning/api/TMS/statistics/download-statistics-report - Authorization: ' + authorization +
      ', templateId: ' + templateId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/Statistics.xlsx')).pipe(res);
  }

  @Get('statistics/download-commitments-by-event')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=Statistics.xlsx')
  downloadCommitmentsByEvent(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/statistics/download-commitments-by-event - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/Statistics.xlsx')).pipe(res);
  }

  @Get('statistics/download-commitments-by-event-country')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=Statistics.xlsx')
  downloadCommitmentsByEventCountry(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/statistics/download-commitments-by-event-country - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/Statistics.xlsx')).pipe(res);
  }

  @Get('statistics/download-meeting-planner')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=Statistics.xlsx')
  downloadMeetingPlanner(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/statistics/download-meeting-planner - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/Statistics.xlsx')).pipe(res);
  }

  @Get('statistics/download-accommodation')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=Statistics.xlsx')
  downloadAccommodation(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/statistics/download-accommodation - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/Statistics.xlsx')).pipe(res);
  }

  @Get('statistics/download-catering')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=Statistics.xlsx')
  downloadCatering(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/statistics/download-catering - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/Statistics.xlsx')).pipe(res);
  }

  @Get('statistics/download-conference')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=Statistics.xlsx')
  downloadConference(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/statistics/download-conference - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/Statistics.xlsx')).pipe(res);
  }

  @Get('statistics/download-VLS')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=Statistics.xlsx')
  downloadVLS(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/statistics/download-VLS - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/Statistics.xlsx')).pipe(res);
  }

  @Get('tasks/task-decisions')
  getTaskDecisionList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/tasks/task-decisions - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/taskDecisionList.json')).pipe(res);
  }

  @Get('tasks/details/:userRoleId/:taskId')
  getTaskDetail(@Headers('authorization') authorization: string,
                @Param('userRoleId') userRoleId: number,
                @Param('taskId') taskId: number,
                @Res() res: Response) {
    console.log('Twinning/api/TMS/tasks/details - Authorization: ' + authorization +
      ', userRoleId: ' + userRoleId + ', taskId: ' + taskId);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/taskDetail.json')).pipe(res);
  }

  @Post('tasks/update/:userRoleId')
  setTaskDetail(@Headers('authorization') authorization: string,
                @Param('userRoleId') userRoleId: number,
                @Body() body: any,
                @Res() res: Response) {
    console.log('Twinning/api/TMS/tasks/update - Authorization: ' + authorization +
      ', userRoleId: ' + userRoleId + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/insertUpdateTaskResult.json')).pipe(res);
  }

  @Get('tasks/task-team-leaders')
  getTeamLeaderList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/tasks/task-team-leaders - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/taskTeamleaderlist.json')).pipe(res);
  }

  @Get('tasks/proposed-actions')
  getProposedActionList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/tasks/proposed-actions - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/proposedActionList.json')).pipe(res);
  }

  @Get('tasks/event-types')
  getEventTypeList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/tasks/event-types - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/taskEventTypeList.json')).pipe(res);
  }

  @Get('tasks/projects')
  getProjectList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/tasks/projects - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/taskProjectList.json')).pipe(res);
  }

  @Get('tasks/task-beneficiary-countries')
  getTaskBeneficiaryCountryList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/tasks/task-beneficiary-countries - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/taskBeneficiaryCountryList.json')).pipe(res);
  }

  @Get('tasks/task-place-countries')
  getTaskPlaceCountryList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/tasks/task-place-countries - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/taskPlaceCountries.json')).pipe(res);
  }

  @Get('tasks/task-cities/:countryId')
  getCities(@Headers('authorization') authorization: string,
            @Param('countryId') countryId: number,
            @Query('search') search: string,
            @Res() res: Response) {
    console.log('Twinning/api/TMS/tasks/task-cities - Authorization: ' + authorization +
      ', countryId: ' + countryId + ', search: ' + search);
    // Extract payload
    // let jwt = new JWT(authorization);

    try {
      if (search && search !== '') {
        createReadStream(path.join(__dirname, '../resources/json/tmsApp/citylist_2.json')).pipe(res);
      } else {
        createReadStream(path.join(__dirname, '../resources/json/tmsApp/citylist_1.json')).pipe(res);
      }
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('General error during saving of the presentation.');
    }
  }

  @Get('tasks/send-acknowledge-letter/:userRoleId/:taskId')
  sendAcknowledgeLetter(@Headers('authorization') authorization: string,
                        @Param('userRoleId') userRoleId: number,
                        @Param('taskId') taskId: number,
                        @Res() res: Response) {
    console.log('Twinning/api/TMS/tasks/send-acknowledge-letter - Authorization: ' + authorization +
      ', userRoleId: ' + userRoleId + ', taskId: ' + taskId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/sendAcknowledgeLetter.json')).pipe(res);
  }

  @Get('tasks/allowed-workflow-actions/:userRoleId/:taskId')
  getAllowedWorkflowActionsTask(@Headers('authorization') authorization: string,
                                @Param('userRoleId') userRoleId: number,
                                @Param('taskId') taskId: number): Array<number> {
    console.log('Twinning/api/TMS/tasks/allowed-workflow-actions - Authorization: ' + authorization +
      ', userRoleId: ' + userRoleId + ', taskId: ' + taskId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return [106, 107];
  }

  @Get('find-event-list/:type')
  getEventList(@Headers('authorization') authorization: string,
               @Param('type') type: number,
               @Query('search') search: string,
               @Res() res: Response) {
    console.log('Twinning/api/TMS/find-event-list - Authorization: ' + authorization +
      ', type: ' + type + ', search: ' + search);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/evaluationEvents_' + type + '.json')).pipe(res);
  }

  @Get('find-part-participant/:eventId')
  getPartEvaluationResendList(@Headers('authorization') authorization: string,
               @Param('eventId') eventId: number,
               @Query('search') search: string,
               @Res() res: Response) {
    console.log('Twinning/api/TMS/find-part-participant - Authorization: ' + authorization +
      ', eventId: ' + eventId + ', search: ' + search);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/partevaluationResendList.json')).pipe(res);
  }

  @Get('resend-participant/:participOrEventId/:type')
  resendParticipantQuestion(@Headers('authorization') authorization: string,
                            @Param('participOrEventId') participOrEventId: number,
                            @Param('type') type: number,
                            @Query('evalCorrEmail') evalCorrEmail: string): boolean {
    console.log('Twinning/api/TMS/resend-participant - Authorization: ' + authorization +
      ', participOrEventId: ' + participOrEventId + ', type: ' + type + ', evalCorrEmail: ' + evalCorrEmail);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Post('city-list-filter')
  getCitiesList(@Headers('authorization') authorization: string,
                              @Body() body: any,
                              @Res() res: Response) {
    console.log('Twinning/api/TMS/city-list-filter - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/adminCityList.json')).pipe(res);
  }

  @Post('city-create')
  CityCreate(@Headers('authorization') authorization: string,
                @Body() body: any,
                @Res() res: Response) {
    console.log('Twinning/api/TMS/city-create - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/cityCreate.json')).pipe(res);
  }

  @Post('city-update')
  CityUpdate(@Headers('authorization') authorization: string,
             @Body() body: any,
             @Res() res: Response) {
    console.log('Twinning/api/TMS/city-update - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/cityUpdate.json')).pipe(res);
  }

  @Get('city-delete/:cityId')
  CityDelete(@Headers('authorization') authorization: string, @Param('cityId') cityId: number): boolean {
    console.log('Twinning/api/TMS/city-delete - Authorization: ' + authorization + ', cityId: ' + cityId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Post('admin/user-list')
  getUserList(@Headers('authorization') authorization: string,
              @Body() body: any,
              @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/user-list - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/userList.json')).pipe(res);
  }

  @Post('admin/user-search')
  searchUser(@Headers('authorization') authorization: string,
             @Body() body: any,
             @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/user-search - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/userSearch.json')).pipe(res);
  }

  @Get('admin/user-detail/:userId')
  getUserDetail(@Headers('authorization') authorization: string,
                @Param('userId') userId: number,
                @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/user-detail - Authorization: ' + authorization + ', userId: ' + userId);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/userDetail.json')).pipe(res);
  }

  @Post('admin/userDetails-set')
  setUserDetail(@Headers('authorization') authorization: string,
                @Body() body: any,
                @Res() res: Response): void {
    console.log('Twinning/api/TMS/admin/userDetails-set - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/setUserDetail.json')).pipe(res);
  }

  @Get('admin/user-delete/:userId/:userCategoryId')
  deleteUser(@Headers('authorization') authorization: string,
             @Param('userId') userId: string,
             @Param('userCategoryId') userCategoryId: number,
             @Res() res: Response): void {
    console.log('Twinning/api/TMS/admin/user-delete - Authorization: ' + authorization + ', userId: ' + userId + ', userCategoryId: ' + userCategoryId);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/deleteUser.json')).pipe(res);
  }

  @Get('admin/user-category-role-list/:userId/:userCategoryId')
  getUserCategoryRoleList(@Headers('authorization') authorization: string,
                          @Param('userId') userId: number,
                          @Param('userCategoryId') userCategoryId: number,
                          @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/user-category-role-list - Authorization: ' + authorization +
      ', userId: ' + userId + ', userCategoryId: ' + userCategoryId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/userCategoryRoleList.json')).pipe(res);
  }

  @Get('user-list-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=UserList_Extract.xlsx')
  extractUserListData(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/user-list-print - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/UserList_Extract.xlsx')).pipe(res);
  }

  @Get('admin/role-list')
  getRoles(@Headers('authorization') authorization: string,
           @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/role-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/rolelist.json')).pipe(res);
  }

  @Get('admin/role-delete/:roleId')
  deleteRole(@Headers('authorization') authorization: string,
             @Param('roleId') roleId: number): boolean {
    console.log('Twinning/api/TMS/admin/role-delete - Authorization: ' + authorization + ', roleId: ' + roleId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('admin/role-detail/:roleId')
  getRoleDetail(@Headers('authorization') authorization: string,
                @Param('roleId') roleId: number,
                @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/role-detail - Authorization: ' + authorization + ', roleId: ' + roleId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/roleDetail.json')).pipe(res);
  }

  @Post('admin/role-set')
  setRoleDetail(@Headers('authorization') authorization: string,
                @Body() body: any,
                @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/role-set - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/roleDetail.json')).pipe(res);
  }

  @Post('admin/update-role-order')
  updateRoleOrder(@Headers('authorization') authorization: string,
                  @Body() body: any,
                  @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/update-role-order - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/roleOrderUpdate.json')).pipe(res);
  }

  @Get('admin/user-category-list')
  getUserCategoryList(@Headers('authorization') authorization: string,
                      @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/user-category-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/userCategoryList.json')).pipe(res);
  }

  @Get('admin/user-category-list/:application')
  getUserCategoryAppList(@Headers('authorization') authorization: string,
                @Param('application') application: string,
                @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/user-category-list - Authorization: ' + authorization + ', application: ' + application);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/userCategoryList_' + application + '.json')).pipe(res);
  }

  @Get('role-list-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=RoleList_Extract.xlsx')
  extractRoleListData(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/role-list-print - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/RoleList_Extract.xlsx')).pipe(res);
  }

  @Get('admin/action-list')
  getActionList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/action-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/actionlist.json')).pipe(res);
  }

  @Get('action-list-delete')
  @Header('Content-Disposition', 'attachment; filename=RoleList_Extract.xlsx')
  deleteAction(@Headers('authorization') authorization: string,
               @Param('actionId') actionId: number): boolean {
    console.log('Twinning/api/TMS/action-list-delete - Authorization: ' + authorization + ', actionId: ' + actionId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('admin/action-detail/:actionId')
  getActionDetail(@Headers('authorization') authorization: string,
                  @Param('actionId') actionId: number,
                  @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/action-detail - Authorization: ' + authorization + ', actionId: ' + actionId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/actionDetail.json')).pipe(res);
  }

  @Post('admin/action-set')
  setActionDetail(@Headers('authorization') authorization: string,
                  @Body() body: any,
                  @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/action-set - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/actionDetail.json')).pipe(res);
  }

  @Get('action-list-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=ActionList_Extract.xlsx')
  extractActionListData(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/action-list-print - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/ActionList_Extract.xlsx')).pipe(res);
  }

  @Get('admin/action-role-list')
  getActionRoleList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/action-role-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/actionrolelist.json')).pipe(res);
  }

  @Get('admin/action-role-detail/:actionId')
  getActionRoles(@Headers('authorization') authorization: string,
                  @Param('actionId') actionId: number,
                  @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/action-role-detail - Authorization: ' + authorization + ', actionId: ' + actionId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/actionroles.json')).pipe(res);
  }

  @Post('admin/action-roles-set')
  setActionRoles(@Headers('authorization') authorization: string,
                  @Body() body: any,
                  @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/action-roles-set - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/actionroles.json')).pipe(res);
  }

  @Get('action-role-list-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=ActionRoleList_Extract.xlsx')
  extractActionRolesData(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/action-role-list-print - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/ActionRoleList_Extract.xlsx')).pipe(res);
  }

  @Get('admin/property-list')
  getPropertyList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/property-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/propertylist.json')).pipe(res);
  }

  @Get('admin/property-list-delete/:property/:taiexContractorId')
  deleteProperty(@Headers('authorization') authorization: string,
                 @Param('property') property: string,
                 @Param('taiexContractorId') taiexContractorId: number): boolean {
    console.log('Twinning/api/TMS/admin/property-list-delete - Authorization: ' + authorization +
      ', property: ' + property + ', taiexContractorId: ' + taiexContractorId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('admin/property-refresh-cache')
  refreshProperty(@Headers('authorization') authorization: string,
                 @Param('property') property: string,
                 @Param('taiexContractorId') taiexContractorId: number): boolean {
    console.log('Twinning/api/TMS/admin/property-refresh-cache - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('admin/property-detail/:property/:taiexContractorId')
  getProperty(@Headers('authorization') authorization: string,
              @Param('property') property: string,
              @Param('taiexContractorId') taiexContractorId: number,
              @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/property-detail - Authorization: ' + authorization +
      ', property: ' + property + ', taiexContractorId: ' + taiexContractorId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/property.json')).pipe(res);
  }

  @Post('admin/property-set/:isNew')
  setProperty(@Headers('authorization') authorization: string,
              @Param('isNew') isNew: boolean,
              @Body() body: any,
              @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/property-set - Authorization: ' + authorization +
      ', isNew: ' + isNew + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/property.json')).pipe(res);
  }

  @Get('property-list-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=PropertyList_Extract.xlsx')
  extractProperyList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/property-list-print - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/PropertyList_Extract.xlsx')).pipe(res);
  }

  @Get('admin/project-list')
  getAdminProjectList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/project-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/projectlist.json')).pipe(res);
  }

  @Get('admin/project-detail/:projectId')
  getProject(@Headers('authorization') authorization: string,
              @Param('projectId') projectId: number,
              @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/project-detail - Authorization: ' + authorization +
      ', projectId: ' + projectId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/project.json')).pipe(res);
  }

  @Post('admin/project-set')
  setProject(@Headers('authorization') authorization: string,
              @Body() body: any,
              @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/project-set - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/project.json')).pipe(res);
  }

  @Get('project-list-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=ProjectList_Extract.xlsx')
  extractProjectList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/project-list-print - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/ProjectList_Extract.xlsx')).pipe(res);
  }

  @Get('admin/procedurerecipients-list')
  getProcedureRecipientsList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/procedurerecipients-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/procedurerecipientslist.json')).pipe(res);
  }

  @Get('admin/procedurerecipients-list-delete/:procedureRecipientsId')
  deleteProcedureRecipients(@Headers('authorization') authorization: string,
                            @Param('procedureRecipientsId') procedureRecipientsId: number): boolean {
    console.log('Twinning/api/TMS/admin/procedurerecipients-list-delete - Authorization: ' + authorization +
      ', procedureRecipientsId: ' + procedureRecipientsId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('admin/procedurerecipients-detail/:procedureRecipientsId')
  getProcedureRecipients(@Headers('authorization') authorization: string,
                         @Param('procedureRecipientsId') procedureRecipientsId: number,
                         @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/procedurerecipients-detail - Authorization: ' + authorization +
      ', procedureRecipientsId: ' + procedureRecipientsId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/procedurerecipients.json')).pipe(res);
  }

  @Post('admin/procedurerecipients-set')
  setProcedureRecipients(@Headers('authorization') authorization: string,
             @Body() body: any,
             @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/procedurerecipients-set - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/procedurerecipients.json')).pipe(res);
  }

  @Get('procedurerecipients-list-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=ProcedureRecipientsList_Extract.xlsx')
  extractProcedureRecipientsList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/procedurerecipients-list-print - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/ProcedureRecipientsList_Extract.xlsx')).pipe(res);
  }

  @Get('admin/eventType-detail/:eventTypeId')
  getEventType(@Headers('authorization') authorization: string,
                         @Param('eventTypeId') eventTypeId: number,
                         @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/eventType-detail - Authorization: ' + authorization +
      ', eventTypeId: ' + eventTypeId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/eventtype.json')).pipe(res);
  }

  @Post('admin/eventType-set')
  setEventType(@Headers('authorization') authorization: string,
                         @Body() body: any,
                         @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/eventType-set - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/eventtype.json')).pipe(res);
  }

  @Get('admin/eventCategoryType-list')
  getEventCategoryList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/eventCategoryType-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/eventcategorylist.json')).pipe(res);
  }

  @Get('admin/teamLeaders-list')
  getAdminTeamLeaderList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/teamLeaders-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/teamleaderlist.json')).pipe(res);
  }

  @Get('admin/eventType-list')
  getAdminEventTypeList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/eventType-list - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/eventTypeList.json')).pipe(res);
  }

  @Get('eventType-list-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=EventTypeList_Extract.xlsx')
  extractEventTypeData(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/eventType-list-print - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/EventTypeList_Extract.xlsx')).pipe(res);
  }

  @Get('series-event-list/:onlyActive')
  getSeriesOfEvents(@Headers('authorization') authorization: string, @Param('onlyActive') onlyActive: boolean, @Res() res: Response) {
    console.log('Twinning/api/TMS/series-event-list - Authorization: ' + authorization + ', onlyActive: ' + onlyActive);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/seriesOfEvents.json')).pipe(res);
  }

  @Post('set-series-of-event/:show')
  setSeriesOfEvents(@Headers('authorization') authorization: string,
                    @Param('show') show: boolean,
                    @Body() body: any): boolean {
    console.log('Twinning/api/TMS/set-series-of-event - Authorization: ' + authorization +
      ', show: ' + show + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('archive-list/:archivePKType')
  getArchiveList(@Headers('authorization') authorization: string,
                 @Param('archivePKType') archivePKType: number,
                 @Query('search') search: string,
                 @Res() res: Response) {
    console.log('Twinning/api/TMS/archive-list - Authorization: ' + authorization +
      ', archivePKType: ' + archivePKType + ', search: ' + search);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/archiveList_' + enArchivePKType[archivePKType] + '.json')).pipe(res);
  }

  @Get('switch-archive-setting/:id/:archivePKType/:archive')
  switchArchiveSetting(@Headers('authorization') authorization: string,
                       @Param('id') id: number,
                       @Param('archivePKType') archivePKType: number,
                       @Param('archive') archive: boolean): string {
    console.log('Twinning/api/TMS/switch-archive-setting - Authorization: ' + authorization +
      ', id: ' + id + ', archivePKType: ' + archivePKType + ', archive: ' + archive);
    // Extract payload
    // let jwt = new JWT(authorization);

    return (archive === true)
      ? 'Please note that ID - 406360 has been Archived'
      : 'Please note that ID - 406360 has been UnArchived';
  }

  @Get('admin/dsaRates-list')
  getDsaRateList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/dsaRates-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/dsaratelist.json')).pipe(res);
  }

  @Get('admin/dsaRates-detail/:countryId')
  getDsaRate(@Headers('authorization') authorization: string,
             @Param('countryId') countryId: number,
             @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/dsaRates-detail - Authorization: ' + authorization + ', countryId: ' + countryId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/dsaratedetail.json')).pipe(res);
  }

  @Post('admin/dsaRates-set')
  setDsaRate(@Headers('authorization') authorization: string,
             @Body() body: any,
             @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/dsaRates-set - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/dsaratedetail.json')).pipe(res);
  }

  @Get('admin/country-list')
  getDSARateCountryList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/country-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/DSARateCountryList.json')).pipe(res);
  }

  @Get('dsaRates-list-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=DsaRatesList_Extract.xlsx')
  extractDsaCountryList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/dsaRates-list-print - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/DsaRatesList_Extract.xlsx')).pipe(res);
  }

  @Post('admin/payment-transfer-rate-list')
  getPaymentTransferRateList(@Headers('authorization') authorization: string,
                             @Body() body: any,
                             @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/payment-transfer-rate-list - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/paymentTransferRateList.json')).pipe(res);
  }

  @Get('admin/payment-transfer-rate-ranges')
  getPaymentTransferRateRanges(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/payment-transfer-rate-ranges - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/paymentTransferRateRanges.json')).pipe(res);
  }

  @Get('admin/payment-transfer-rate-detail/:dateRangeParam')
  getPaymentTransferRateDetail(@Headers('authorization') authorization: string,
                               @Param('dateRangeParam') dateRangeParam: string,
                               @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/dsaRates-detail - Authorization: ' + authorization +
      ', dateRangeParam: ' + dateRangeParam);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/paymentTransferRateDetail.json')).pipe(res);
  }

  @Get('admin/payment-transfer-rate-country-list')
  getPaymentTransferRateCountryList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/payment-transfer-rate-country-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/generalCountryList.json')).pipe(res);
  }

  @Post('admin/payment-transfer-rate-detail-set')
  setPaymentTransferRateDetail(@Headers('authorization') authorization: string,
             @Body() body: any,
             @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/payment-transfer-rate-detail-set - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/paymentTransferRateDetail.json')).pipe(res);
  }

  @Post('admin/applicationForm/list')
  getApplicationFormList(@Headers('authorization') authorization: string,
                         @Body() body: any,
                         @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/applicationForm/list - Authorization: ' + authorization +
      ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/applicationFormList.json')).pipe(res);
  }

  @Post('admin/applicationForm/reset-login')
  appFormResetLogin(@Headers('authorization') authorization: string,
                    @Body() body: any,
                    @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/applicationForm/reset-login - Authorization: ' + authorization +
      ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/app_form_reset_login.json')).pipe(res);
  }

  @Get('applicationFormList-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=ApplicationFormList_Extract.xlsx')
  extractApplicationFormList(@Headers('authorization') authorization: string,
                             @Query('filters') filters: string,
                             @Res() res: Response) {
    console.log('Twinning/api/TMS/applicationFormList-print - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/ApplicationFormList_Extract.xlsx')).pipe(res);
  }

  @Get('supplier-events/:supplierId')
  getSupplierEvents(@Headers('authorization') authorization: string,
                    @Param('supplierId') supplierId: number,
                    @Res() res: Response) {
    console.log('Twinning/api/TMS/supplier-events - Authorization: ' + authorization + ', supplierId: ' + supplierId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/supplierevents.json')).pipe(res);
  }

  @Get('person-events/:personId')
  getPersonEvents(@Headers('authorization') authorization: string,
                    @Param('personId') personId: number,
                    @Res() res: Response) {
    console.log('Twinning/api/TMS/person-events - Authorization: ' + authorization + ', personId: ' + personId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/personevents.json')).pipe(res);
  }

  @Post('events/list')
  getEvents(@Headers('authorization') authorization: string,
            @Body() body: any,
            @Res() res: Response) {
    console.log('Twinning/api/TMS/events/list - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));

    // unfiltered list
    createReadStream(path.join(__dirname, '../resources/json/tmsApp/eventList.json')).pipe(res);
    // createReadStream(path.join(__dirname, '../resources/json/tmsApp/eventList_test.json')).pipe(res);
    // filtered by createDate testing
    // createReadStream(path.join(__dirname, '../resources/json/tmsApp/eventList_Filtered.json')).pipe(res);
  }

  @Get('extract-person-events/:id')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=PersonEventData.xlsx')
  extractPersonEventsData(@Headers('authorization') authorization: string,
                          @Param('id') id: number,
                          @Res() res: Response) {
    console.log('Twinning/api/TMS/extract-person-events - Authorization: ' + authorization + ', id: ' + id);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/PersonEventData.xlsx')).pipe(res);
  }

  @Get('extract-supplier-events/:id')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=SupplierEventData.xlsx')
  extractSupplierEventsData(@Headers('authorization') authorization: string,
                            @Param('id') id: number,
                            @Res() res: Response) {
    console.log('Twinning/api/TMS/extract-supplier-events - Authorization: ' + authorization + ', id: ' + id);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/SupplierEventData.xlsx')).pipe(res);
  }

  @Get('eventslist-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=eventsList.xlsx')
  extractEvents(@Headers('authorization') authorization: string,
                         @Query('filters') filters: string,
                         @Res() res: Response) {
    console.log('Twinning/api/TMS/eventslist-print - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/eventsList.xlsx')).pipe(res);
  }

  @Post('events/create')
  createEvent(@Headers('authorization') authorization: string,
            @Body() body: any,
            @Res() res: Response) {
    console.log('Twinning/api/TMS/events/create - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/create_task_af_add_corr.json')).pipe(res);
  }

  @Get('getAgendaDocument')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  @Header('Content-Disposition', 'attachment; filename=Agenda_67722.docx')
  extractAgenda(@Headers('authorization') authorization: string,
                @Query('eventId') eventId: number,
                @Res() res: Response) {
    console.log('Twinning/api/TMS/getAgendaDocument - Authorization: ' + authorization + ', eventId: ' + eventId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/Agenda_67722.docx')).pipe(res);
  }

  @Get('inviterList-print/:eventId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=InviterList_Extract.xlsx')
  extractInviterList(@Headers('authorization') authorization: string,
                     @Param('eventId') eventId: number,
                     @Res() res: Response) {
    console.log('Twinning/api/TMS/inviterList-print - Authorization: ' + authorization + ', eventId: ' + eventId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/InviterList_Extract.xlsx')).pipe(res);
  }

  @Get('invEventsExcel-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=Invoice_Period_Q20_IBF_2016.xlsx')
  extractInvEventsExcel(@Headers('authorization') authorization: string,
                        @Query('userRoleId') userRoleId: number,
                        @Query('invDate') invDate: string,
                        @Query('invPeriod') invPeriod: string,
                        @Query('taiexContractorId') taiexContractorId: number,
                        @Res() res: Response) {
    console.log('Twinning/api/TMS/invEventsExcel-print - Authorization: ' + authorization + ', userRoleId: ' + userRoleId +
      ', invDate: ' + invDate + ', invPeriod: ' + invPeriod + ', taiexContractorId: ' + taiexContractorId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/Invoice_Period_Q20_IBF_2016.xlsx')).pipe(res);
  }

  @Get('taskApproval-print/:userRoleId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=taskApprovalList.xlsx')
  extractDashboardTaskApprovalList(@Headers('authorization') authorization: string,
                                   @Param('userRoleId') userRoleId: number,
                                   @Res() res: Response) {
    console.log('Twinning/api/TMS/taskApproval-print - Authorization: ' + authorization + ', userRoleId: ' + userRoleId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/taskApprovalList.xlsx')).pipe(res);
  }

  @Get('newTask-print/:userRoleId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=newTasksList.xlsx')
  extractDashboardTasksList(@Headers('authorization') authorization: string,
                            @Param('userRoleId') userRoleId: number,
                            @Res() res: Response) {
    console.log('Twinning/api/TMS/newTask-print - Authorization: ' + authorization + ', userRoleId: ' + userRoleId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tmsApp/newTasksList.xlsx')).pipe(res);
  }

  @Get('dashboard-print/:userRoleId/:dashboardListType')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  extractDashboardList(@Headers('authorization') authorization: string,
                       @Param('userRoleId') userRoleId: number,
                       @Param('dashboardListType') dashboardListType: number,
                       @Res() res: Response) {
    console.log('Twinning/api/TMS/dashboard-print - Authorization: ' + authorization + ', userRoleId: ' + userRoleId +
      ', dashboardListType: ' + dashboardListType);

    let filename: string = '';
    switch (Number(dashboardListType)) {
    case enDashboardListType.AF:
      filename = 'dashboardAFList.xlsx';
      break;
    case enDashboardListType.OF:
      filename = 'dashboardOFList.xlsx';
      break;
    case enDashboardListType.ER:
      filename = 'dashboardERList.xlsx';
      break;
    }

    res.set('Content-Disposition', 'attachment; filename=' + filename);
    createReadStream(path.join(__dirname, '../resources/tmsApp/' + filename)).pipe(res);
  }

  @Get('qlikSenseSingleEvaluation-url')
  qlikSenseSingleEvaluationURL(@Headers('authorization') authorization: string): string {
    console.log('Twinning/api/TMS/qlikSenseSingleEvaluation-url - Authorization: ' + authorization);

    return 'https://webgate.ec.europa.eu/europeaid/reporting/ecas/sense/app/5fbc9a14-8a11-418a-9d73-356330e6b554/sheet/4db84869-823e-4baf-aacf-3b64db198242/select/EVENTID/';
  }

  @Get('statistics/check-exist-report/:templateId')
  @Header('Content-Type', 'text/plain')
  checkExistReport(@Headers('authorization') authorization: string,
                   @Param('templateId') templateId: number,
                   @Res() res: Response): boolean {
    console.log('Twinning/api/TMS/statistics/check-exist-report - Authorization: ' + authorization + ', templateId: ' + templateId);

    return true;
  }

  @Get('qlik-reports-url')
  qlikReportsURL(@Res() res: Response) {
    console.log('Twinning/api/TMS/qlik-reports-url');

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/qlikReportsURL.json')).pipe(res);
  }

  @Get('get-case-handler-list/:userRoleTypeId')
  getCaseHandlerList(@Headers('authorization') authorization: string,
                     @Param('userRoleTypeId', ParseIntPipe) userRoleTypeId: number,
                     @Res() res: Response) {
    console.log('Twinning/api/TMS/get-case-handler-list - Authorization: ' + authorization + ', userRoleTypeId: ' + userRoleTypeId);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/allCaseHandlerList.json')).pipe(res);
  }

  @Get('get-active-casehandler-list/:eventId')
  getActiveCaseHandlerList(@Headers('authorization') authorization: string,
                     @Param('eventId', ParseIntPipe) eventId: number,
                     @Res() res: Response) {
    console.log('Twinning/api/TMS/get-active-casehandler-list - Authorization: ' + authorization + ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/activeCaseHandlers.json')).pipe(res);
  }

  @Get('open-invoice-quarters')
  getOpenInvoiceQuarters(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/open-invoice-quarters - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/OpenInvoiceQuarters.json')).pipe(res);
  }

  @Get('invoice-quarters')
  getInvoiceQuarters(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/invoice-quarters - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/InvoiceQuarters.json')).pipe(res);
  }

  @Get('af-info-list')
  getAFInfoList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/af-info-list - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/afInfoList.json')).pipe(res);
  }

  @Get('my-registration-list-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=MyRegistrationList_Extract.xlsx')
  getMyRegistrationListPrint(@Headers('authorization') authorization: string,
                             @Query('filters') filters: string,
                             @Res() res: Response) {
    console.log('Twinning/api/TMS/my-registration-list-print - Authorization: ' + authorization + ', filters: ' + filters);

    createReadStream(path.join(__dirname, '../resources/tmsApp/ParticipantList_Extract.xlsx')).pipe(res);
  }

  @Post('create-draft-email')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/x-msg')
  regCancelDraftEmail(@Headers('authorization') authorization: string,
                      @Body() email: Email,
                      @Res() res: Response) {
    console.log('TMSWebRestrict/api/TMS/create-draft-email - Authorization: ' + authorization + ', email: ' + JSON.stringify(email));

    res.set('Content-Disposition', 'attachment; filename=' + email.filename ? email.filename : 'draft_email.msg');
    createReadStream(path.join(__dirname, '../resources/tmsApp/draft_email.msg')).pipe(res);
  }

  @Get('add-participant-list-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=add-participant-list.xlsx')
  addParticipantListPrint(@Headers('authorization') authorization: string,
                          @Query('filters') filters: string,
                          @Res() res: Response) {
    console.log('Twinning/api/TMS/add-participant-list-print - Authorization: ' + authorization + ', filters: ' + filters);

    createReadStream(path.join(__dirname, '../resources/tmsApp/FileUploadHistory.xlsx')).pipe(res);
  }

  @Get('job-title-list')
  getJobTitleList(@Headers('authorization') authorization: string,
                  @Res() res: Response) {
    console.log('Twinning/api/TMS/job-title-list - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/job-title-list.json')).pipe(res);
  }

  @Get('admin/statistics-jobs')
  getAdminStatisticsJobs(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/admin/statistics-jobs - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsApp/statisticsJobs.json')).pipe(res);
  }
}
