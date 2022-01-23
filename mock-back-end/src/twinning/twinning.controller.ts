import {
  Body,
  Controller,
  Get, Header,
  Headers,
  HttpCode,
  HttpStatus,
  Param, ParseIntPipe,
  Post,
  Query,
  Res
} from '@nestjs/common';

import { createReadStream } from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { GeneralRoutines } from '../common/generalRoutines';

export enum enListType {
  Pipeline = 1,
  Project = 2
}

@Controller('Twinning/api/TW')
export class TwinningController {
  @Get('get-grid-filters/:gridName')
  getGridFilters(@Headers('authorization') authorization: string,
                 @Param('gridName') gridName: string,
                 @Res() res: Response) {
    console.log('Twinning/api/TW/get-grid-filters - Authorization: ' + authorization + ', gridName: ' + gridName);

    createReadStream(path.join(__dirname, '../resources/json/twinning/' + gridName + 'Filters.json')).pipe(res);
  }

  @Get('get-grid-filters/:gridName/:id')
  getGridFiltersById(@Headers('authorization') authorization: string,
                     @Param('gridName') gridName: string,
                     @Param('id') id: number,
                     @Res() res: Response) {
    console.log('Twinning/api/TW/get-grid-filters - Authorization: ' + authorization + ', gridName: ' + gridName + ', id: ' + id);

    createReadStream(path.join(__dirname, '../resources/json/twinning/' + gridName + 'Filters.json')).pipe(res);
  }

  @Post('find-financial-decisions')
  getFinancialDecisionList(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TW/find-financial-decisions - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/twinning/twfinancialdecisionList.json')).pipe(res);
  }

  @Get('refresh-financial-decisions')
  refreshFinancialDecisionList(@Headers('authorization') authorization: string,
                               @Query('search') search: string,
                               @Res() res: Response) {
    console.log('Twinning/api/TW/refresh-financial-decisions - Authorization: ' + authorization + ', search: ' + search);

    createReadStream(path.join(__dirname, '../resources/json/twinning/twfinancialdecisionList.json')).pipe(res);
  }

  @Get('ares-search-url')
  @Header('Content-Type', 'text/plain')
  getAresSearchUrl(@Headers('authorization') authorization: string): string {
    console.log('Twinning/api/TW/refresh-financial-decisions - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    return 'http://www.cc.cec/Ares/documentDirectAccess.do?registrationNumber=';
  }

  @Post('update-decision')
  updateFinancialDecision(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TW/update-decision - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));

    res.status(HttpStatus.OK).send(body);
  }

  @Get('delete-decision/:idDecision')
  deleteFinancialDecision(@Headers('authorization') authorization: string, @Param('idDecision') idDecision: number): object {
    console.log('Twinning/api/TW/delete-decision - Authorization: ' + authorization + ', idDecision: ' + idDecision);
    // Extract payload
    // let jwt = new JWT(authorization);
    const data = {
      'result': true,
      'message': 'Successfully saved',
      'messageType': 1
    };

    return data;
  }

  @Get('print-decisions-grid')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=FinancialDecisions.xlsx')
  printFinancialDecisionList(@Headers('authorization') authorization: string, @Headers('filters') filters: string, @Res() res: Response) {
    console.log('Twinning/api/TW/print-decisions-grid - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/twinning/FinancialDecisions.xlsx')).pipe(res);
  }

  @Get('twstatuses')
  getStatusList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TW/twstatuses - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/twStatusList.json')).pipe(res);
  }

  @Get('twbudgetlines')
  getBudgetlineList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TW/twbudgetlines - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/twbudgetlineList.json')).pipe(res);
  }

  @Post('twinninglist')
  getTwinningList(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TW/twinninglist - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));

    let filename = body.externalFilterList.listType === enListType.Pipeline
      ? '../resources/json/twinning/twinningListPipeline.json'
      : '../resources/json/twinning/twinningListProject.json';

    createReadStream(path.join(__dirname, filename)).pipe(res);
  }

  @Get('twinning-fiche/:twinningId')
  getTwinningFiche(@Headers('authorization') authorization: string,
                   @Param('twinningId') twinningId: string,
                   @Res() res: Response) {
    console.log('Twinning/api/TW/twinning-fiche - Authorization: ' + authorization + ', twinningId: ' + twinningId);

    if (twinningId === '2002337' || twinningId === '2011600') {
      createReadStream(path.join(__dirname, '../resources/json/twinning/twinningFichePipeline.json')).pipe(res);
    } else {
      createReadStream(path.join(__dirname, '../resources/json/twinning/twinningFicheProject.json')).pipe(res);
    }
  }

  @Post('update-twinning-fiche')
  setUpdateTwinningFiche(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TW/update-twinning-fiche - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    res.status(HttpStatus.OK).send(body);
  }

  @Post('create-twinning-fiche')
  setCreateTwinningFiche(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TW/create-twinning-fiche - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    res.status(HttpStatus.OK).send(body);
  }

  @Get('twManualList')
  getManualList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TW/twManualList - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/twManual.json')).pipe(res);
  }

  @Get('twBeneficiaryCountryList')
  getBeneficiaryCountryList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TW/twBeneficiaryCountryList - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/beneficiaryCountryList.json')).pipe(res);
  }

  @Get('find-proposals/:twinningId')
  getListOfProposals(@Headers('authorization') authorization: string,
                     @Param('twinningId') twinningId: number): object {
    console.log('Twinning/api/TW/find-proposals - Authorization: ' + authorization + ', twinningId: ' + twinningId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return [1, 2];
  }

  @Get('find-job-title-list/:listType')
  getJobtitleList(@Headers('authorization') authorization: string,
                  @Param('listType') listType: number,
                  @Res() res: Response) {
    console.log('Twinning/api/TW/find-job-title-list - Authorization: ' + authorization + ', listType: ' + listType);

    createReadStream(path.join(__dirname, '../resources/json/twinning/twjobtitlelist_' + listType + '.json')).pipe(res);
  }

  @Get('find-management-mode-list')
  getManagementModeList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TW/find-management-mode-list - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/managementModeList.json')).pipe(res);
  }

  @Get('find-participant-list-items/:twinningId/:proposalId')
  getProposedParticipants(@Headers('authorization') authorization: string,
                          @Param('twinningId') twinningId: number,
                          @Param('proposalId') proposalId: number,
                          @Res() res: Response) {
    console.log('Twinning/api/TW/find-participant-list-items - Authorization: ' + authorization +
      ', twinningId: ' + twinningId + ', proposalId: ' + proposalId);

    createReadStream(path.join(__dirname, '../resources/json/twinning/twProposedParticipants_' + proposalId + '.json')).pipe(res);
  }

  @Get('find-persons/:countryId')
  getProposalPersonList(@Headers('authorization') authorization: string,
                          @Param('countryId') countryId: number,
                          @Query('search') search: string,
                          @Res() res: Response) {
    console.log('Twinning/api/TW/find-persons - Authorization: ' + authorization +
      ', countryId: ' + countryId + ', search: ' + search);

    createReadStream(path.join(__dirname, '../resources/json/twinning/twProposalPersonList.json')).pipe(res);
  }

  @Get('find-suppliers-by-country/:countryId')
  getProposalSupplierList(@Headers('authorization') authorization: string,
                        @Param('countryId') countryId: number,
                        @Query('search') search: string,
                        @Res() res: Response) {
    console.log('Twinning/api/TW/find-persons - Authorization: ' + authorization +
      ', countryId: ' + countryId + ', search: ' + search);

    createReadStream(path.join(__dirname, '../resources/json/twinning/twProposalSupplierList.json')).pipe(res);
  }

  @Get('find-participant/:twinningId/:participantId')
  getParticipant(@Headers('authorization') authorization: string,
                 @Param('twinningId') twinningId: number,
                 @Param('participantId') participantId: number,
                 @Res() res: Response) {
    console.log('Twinning/api/TW/find-participant - Authorization: ' + authorization +
      ', twinningId: ' + twinningId + ', participantId: ' + participantId);

    createReadStream(path.join(__dirname, '../resources/json/twinning/twProposedParticipant.json')).pipe(res);
  }

  @Post('update-participant')
  setParticipant(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TW/update-participant - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    res.status(HttpStatus.OK).send(body);
  }

  @Post('create-participant')
  createParticipant(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TW/create-participant - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/twinning/twProposedParticipantCreate.json')).pipe(res);
  }

  @Get('delete-participant/:twinningId/:participantId')
  deleteParticipant(@Headers('authorization') authorization: string,
                    @Param('twinningId') twinningId: number,
                    @Param('participantId') participantId: number,
                    @Res() res: Response) {
    console.log('Twinning/api/TW/delete-participant - Authorization: ' + authorization +
      ', twinningId: ' + twinningId + ', participantId: ' + participantId);
    // Extract payload
    // let jwt = new JWT(authorization);

    res.end();
  }

  @Get('twinning-number-exists')
  twinningNumberExists(@Headers('authorization') authorization: string,
                       @Query('twinningNumber') twinningNumber: string,
                       @Res() res: Response) {
    console.log('Twinning/api/TW/twinning-number-exists - Authorization: ' + authorization +
      ', twinningNumber: ' + twinningNumber);
    // Extract payload
    // let jwt = new JWT(authorization);

    // exist example
    // createReadStream(path.join(__dirname, '../resources/json/twinning/existingTwinningNumbers.json')).pipe(res);
    // not existing
    res.end();
  }

  @Get('getTwinningDocument')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=FinancialDecisions.xlsx')
  downloadTwinningDocument(@Headers('authorization') authorization: string,
                           @Query('id') id: number,
                           @Res() res: Response) {
    console.log('Twinning/api/TW/getTwinningDocument - Authorization: ' + authorization + ', id: ' + id);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/twinning/FinancialDecisions.xlsx')).pipe(res);
  }

  @Get('getDocument')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  @Header('Content-Disposition', 'attachment; filename=TM 2017.docx')
  downloadTwinningManual(@Headers('authorization') authorization: string,
                           @Query('id') id: number,
                           @Res() res: Response) {
    console.log('Twinning/api/TW/getDocument - Authorization: ' + authorization + ', id: ' + id);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/twinning/TM 2017.docx')).pipe(res);
  }

  @Get('twinninglist-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=TwinningProjectList.xlsx')
  getTwinninglistPrint(@Headers('authorization') authorization: string,
                       @Query('filters') filters: string,
                       @Res() res: Response) {
    console.log('Twinning/api/TW/twinninglist-print - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/twinning/TwinningProjectList.xlsx')).pipe(res);
  }

  @Get('proposalList-print/:twinningId/:proposalId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=TwinningProjectList.xlsx')
  getProjectListPrint(@Headers('authorization') authorization: string,
                      @Param('twinningId') twinningId: number,
                      @Param('proposalId') proposalId: number,
                      @Query('filters') filters: string,
                      @Res() res: Response) {
    console.log('Twinning/api/TW/proposalList-print - Authorization: ' + authorization +
      ', twinningId: ' + twinningId + ', proposalId: ' + proposalId + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/twinning/ProposalList.xlsx')).pipe(res);
  }

  @Get('find-sectors')
  getSectors(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TW/find-sectors - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/twSectors.json')).pipe(res);
  }

  @Get('SDG-list')
  getSDGList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TW/SDG-list - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/sdg-list.json')).pipe(res);
  }

  @Get('twnning-mission-task-list')
  getTwinningMissionEventList(@Headers('authorization') authorization: string,
                              @Query('search') search: string,
                              @Res() res: Response) {
    console.log('Twinning/api/TW/twnning-mission-task-list - Authorization: ' + authorization + ', search: ' + search);

    createReadStream(path.join(__dirname, '../resources/json/twinning/twReviewMissionTaskList.json')).pipe(res);
  }

  @Get('find-person-project/:personId')
  getPersonProjects(@Headers('authorization') authorization: string,
                              @Param('personId') personId: number,
                              @Res() res: Response) {
    console.log('Twinning/api/TW/find-person-project - Authorization: ' + authorization + ', personId: ' + personId);

    createReadStream(path.join(__dirname, '../resources/json/twinning/twPersonProjects.json')).pipe(res);
  }

  @Get('extract-person-projects/:personId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=PersonProjectsData.xlsx')
  extractProjectsData(@Headers('authorization') authorization: string,
                      @Param('personId') personId: number,
                      @Query('filters') filters: string,
                      @Res() res: Response) {
    console.log('Twinning/api/TW/extract-person-projects - Authorization: ' + authorization + ', personId: ' + personId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/twinning/PersonProjectsData.xlsx')).pipe(res);
  }

  @Get('twPipelineYearList')
  getPipelineYearList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TW/twPipelineYearList - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/twPipelineYearList.json')).pipe(res);
  }

  @Get('get-documents/:id/:pkType')
  getDocuments(@Headers('authorization') authorization: string,
               @Param('id') id: number,
               @Param('pkType') pkType: number,
               @Query('templateId') templateId: number,
               @Res() res: Response) {
    console.log('Twinning/api/TW/get-documents - Authorization: ' + authorization +
      ', id: ' + id + ', pkType: ' + pkType + ', templateId: ' + templateId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/documents_tw.json')).pipe(res);
  }

  @Get('viewUploadList-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=ViewUploadList_Extract.xlsx')
  getViewUploadPrint(@Headers('authorization') authorization: string,
                     @Param('id') id: number,
                     @Param('pkType') pkType: number,
                     @Query('templateId') templateId: number,
                     @Res() res: Response) {
    console.log('Twinning/api/TW/viewUploadList-print - Authorization: ' + authorization +
      ', id: ' + id + ', pkType: ' + pkType + ', templateId: ' + templateId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/twinning/ViewUploadList_Extract.xlsx')).pipe(res);
  }

  @Get('get-templates/:id/:pkType')
  getTemplates(@Headers('authorization') authorization: string,
               @Param('templateId') templateId: number,
               @Res() res: Response) {
    console.log('Twinning/api/TW/get-templates - Authorization: ' + authorization +
      ', templateId: ' + templateId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/templates_tw.json')).pipe(res);
  }

  @Get('get-allowed-fileTypes/:pkType')
  getAllowedFileTypes(@Headers('authorization') authorization: string,
                      @Param('pkType') pkType: number,
                      @Res() res: Response) {
    console.log('Twinning/api/TW/get-allowed-fileTypes - Authorization: ' + authorization +
      ', pkType: ' + pkType);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/allowedFileTypes_tw.json')).pipe(res);
  }

  @Get('delete-document/:taskId/:templateId/:id/:pkType')
  deleteDocument(@Headers('authorization') authorization: string,
                 @Param('taskId') taskId: number,
                 @Param('templateId') templateId: number,
                 @Param('id') id: number,
                 @Param('pkType') pkType: number): boolean {
    console.log('Twinning/api/TW/delete-document - Authorization: ' + authorization +
      ', taskId: ' + taskId + ', templateId: ' + templateId + ', id: ' + id + ', pkType: ' + pkType);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('chapters')
  getChaptersScreening(@Headers('authorization') authorization: string,
                       @Res() res: Response) {
    console.log('Twinning/api/TW/chapters - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/chaptersScreening.json')).pipe(res);
  }

  @Get('keycontactcountries')
  getKeycontactCountryList(@Headers('authorization') authorization: string,
                           @Query('groups') groups: number[],
                           @Res() res: Response) {
    console.log('Twinning/api/TW/keycontactcountries - Authorization: ' + authorization + ', groups: ' + groups);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/generalCountryList.json')).pipe(res);
  }

  @Get('allsuppliertypes')
  getSupplierTypes(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TW/allsuppliertypes - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/suppliertypes_tw.json')).pipe(res);
  }

  @Get('formal-addresses')
  getFormalAddress(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TW/formal-addresses - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/formalAddress.json')).pipe(res);
  }

  @Get('admin/application-list')
  getApplicationList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TW/admin/application-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/applicationList.json')).pipe(res);
  }

  @Get('supplierdetails/:supplierId')
  getSupplier(@Headers('authorization') authorization: string,
              @Param('supplierId') supplierId: number,
              @Res() res: Response) {
    console.log('Twinning/api/TW/supplierdetails - Authorization: ' + authorization + ', supplierId: ' + supplierId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/supplier_tw.json')).pipe(res);
  }

  @Post('updatesupplier')
  updateSupplier(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TW/updatesupplier - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    res.status(HttpStatus.OK).send(body);
  }

  @Post('createsupplier')
  createSupplier(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TW/createsupplier - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    res.status(HttpStatus.OK).send(body);
  }

  @Post('suppliers')
  getSuppliers(@Headers('authorization') authorization: string,
               @Body() body: any,
               @Res() res: Response) {
    console.log('Twinning/api/TW/suppliers - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/suppliers_tw.json')).pipe(res);
  }

  @Get('persondetails/:personId/:participantId')
  getPersonParticipant(@Headers('authorization') authorization: string,
                       @Param('personId') personId: number,
                       @Param('participantId') participantId: number,
                       @Res() res: Response) {
    console.log('Twinning/api/TW/persondetails - Authorization: ' + authorization +
      ', personId: ' + personId + ', participantId: ' + participantId);

    createReadStream(path.join(__dirname, '../resources/json/twinning/personParticipantDetails.json')).pipe(res);
  }

  @Get('persondetails/:personId')
  getPerson(@Headers('authorization') authorization: string,
            @Param('personId') personId: number,
            @Res() res: Response) {
    console.log('Twinning/api/TW/persondetails - Authorization: ' + authorization +
      ', personId: ' + personId);

    createReadStream(path.join(__dirname, '../resources/json/twinning/personDetails.json')).pipe(res);
  }

  @Post('updateperson/:participantId')
  updatePerson(@Headers('authorization') authorization: string,
               @Param('participantId') participantId: number,
               @Body() body: any,
               @Res() res: Response) {
    console.log('Twinning/api/TW/updateperson - Authorization: ' + authorization +
      ', participantId: ' + participantId + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    res.status(HttpStatus.OK).send(body);
  }

  @Post('createperson')
  createPerson(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TW/createperson - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    res.status(HttpStatus.OK).send(body);
  }

  @Post('persons')
  getPersons(@Headers('authorization') authorization: string,
             @Body() body: any,
             @Res() res: Response) {
    console.log('Twinning/api/TW/persons - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/persons.json')).pipe(res);
  }

  @Get('keycontacttypes')
  getContactTypes(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TW/keycontacttypes - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/contactTypes.json')).pipe(res);
  }

  @Post('keycontacts')
  getKeyContacts(@Headers('authorization') authorization: string,
                 @Body() body: any,
                 @Res() res: Response) {
    console.log('Twinning/api/TW/keycontacts - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/keyContacts.json')).pipe(res);
  }

  @Post('updatekeycontact')
  updateKeycontact(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TW/updatekeycontact - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    res.status(HttpStatus.OK).send(body);
  }

  @Post('createkeycontact')
  createKeycontact(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('Twinning/api/TW/createkeycontact - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    res.status(HttpStatus.OK).send(body);
  }

  @Get('keycontactdetails/:keycontactId')
  getKeyContact(@Headers('authorization') authorization: string,
                @Param('keycontactId') keycontactId: number,
                @Res() res: Response) {
    console.log('Twinning/api/TW/keycontactdetails - Authorization: ' + authorization + ', keycontactId: ' + keycontactId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/keyContact.json')).pipe(res);
  }

  @Get('find-linedg')
  getLineDGList(@Headers('authorization') authorization: string,
                @Param('keycontactId') keycontactId: number,
                @Res() res: Response) {
    console.log('Twinning/api/TW/find-linedg - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/linedglist.json')).pipe(res);
  }

  @Get('keyContactlist-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=KeyContactList.xlsx')
  getKeycontactListPrint(@Headers('authorization') authorization: string,
                         @Headers('filters') filters: string,
                         @Res() res: Response) {
    console.log('Twinning/api/TW/keyContactlist-print - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/twinning/KeyContactList.xlsx')).pipe(res);
  }

  @Get('personList-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=PersonList.xlsx')
  getPersonListPrint(@Headers('authorization') authorization: string,
                     @Headers('filters') filters: string,
                     @Res() res: Response) {
    console.log('Twinning/api/TW/personList-print - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/twinning/PersonList.xlsx')).pipe(res);
  }

  @Get('supplierlist-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=SupplierList.xlsx')
  getSupplierListPrint(@Headers('authorization') authorization: string,
                       @Headers('filters') filters: string,
                       @Res() res: Response) {
    console.log('Twinning/api/TW/supplierlist-print - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/twinning/SupplierList.xlsx')).pipe(res);
  }

  @Get('extractsupplier')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/msword')
  @Header('Content-Disposition', 'attachment; filename=SupplierInfos_130480.doc')
  extractSupplierData(@Headers('authorization') authorization: string,
                      @Query('id') id: number,
                      @Res() res: Response) {
    console.log('Twinning/api/TW/extractsupplier - Authorization: ' + authorization + ', id: ' + id);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/twinning/SupplierInfos_130480.doc')).pipe(res);
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
    console.log('Twinning/api/TW/merge-person - Authorization: ' + authorization + ', selectedMainId: ' + selectedMainId +
      ', Body: ' + body);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Post('remove-profile/:personId')
  @Header('Content-Type', 'text/plain')
  removeProfileEDB(@Headers('authorization') authorization: string,
                   @Param('personId') personId: number, @Body() body: any): string {
    console.log('Twinning/api/TW/remove-profile - Authorization: ' + authorization + ', personId: ' + personId +
      ', Body: ' + body);
    // Extract payload
    // let jwt = new JWT(authorization);

    return '';
  }

  @Get('country-list')
  getCountryList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TW/country-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/twinning/keyContactCountryList.json')).pipe(res);
  }

  @Get('update-fiche-status/:twinningId/:status')
  getUpdateFicheStatus(@Headers('authorization') authorization: string,
                       @Param('twinningId') twinningId: string,
                       @Param('status') status: number,
                       @Res() res: Response) {
    console.log('Twinning/api/TW/update-fiche-status - Authorization: ' + authorization + ', twinningId: '
      + twinningId + ', status: ' + status);

    createReadStream(path.join(__dirname, '../resources/json/twinning/updateFicheStatus_' + status + '.json')).pipe(res);
  }

  @Get('delete-twinningfiche/:twinningId')
  deleteTwinningFiche(@Headers('authorization') authorization: string,
                      @Param('twinningId', ParseIntPipe) twinningId: number): object {
    console.log('Twinning/api/TW/delete-twinningfiche - Authorization: ' + authorization + ', twinningId: '
      + twinningId);

    const data = {
      result: true,
      message: '',
      messageType: 1
    };

    return data;
  }
}
