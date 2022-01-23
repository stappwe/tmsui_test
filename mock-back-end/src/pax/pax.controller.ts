/* tslint:disable:max-line-length */
import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Header,
  Res, ParseIntPipe
} from '@nestjs/common';

import { Response } from 'express';

import { Roles } from '../common/roles.decorator';
import { JWT } from '../common/generalRoutines';
import { RolesGuard } from '../common/roles.guard';
import * as path from 'path';
import { createReadStream, readFileSync } from 'fs';

export enum enRegistrationVersion {
  short = 1,
  full = 2
}

@Controller('TMSWebRestrict/api/PAX')
@UseGuards(RolesGuard)
export class PaxController {
  @Post('registration/inviter-detail')
  @Roles('admin')
  getInviterDetails(@Headers('authorization') authorization: string): object {
    console.log('pax/registration/inviter-detail - Authorization: ' + authorization);
    // Extract payload
    let jwt = new JWT(authorization);
    let data = {};
    console.log('pax/registration/inviter-detail - jwt.payLoad: ' + JSON.stringify(jwt.payLoad));
    if (jwt.payLoad.eventintiterid === 1) {
      data = {
        'eventId' : 80034,
        'eventName' : 'TAIEX Workshop on Regional development of new Trade routes',
        'eventDates' : '06 - 08 June 2021',
        'eventPlace' : 'Aulon',
        'eventcountryId' : 76,
        'eventCountry' : 'Armenia',
        'isWorkshop' : true,
        'eventInviterId' : 1,
        'countryId' : 75,
        'country' : 'Azerbaijan',
        'maxParticipants' : 20,
        'registrationDeadline' : 2609282800000,
        'registrationClosed' : false,
        'registrationVersion' : 3,
        'vPassRequired' : false
      };
    } else if (jwt.payLoad.eventintiterid === 2) {
      data = {
        'eventId' : 80034,
        'eventName' : 'TAIEX Workshop on Regional development of new Trade routes',
        'eventDates' : '06 - 08 June 2019',
        'eventPlace' : 'Aulon',
        'eventcountryId' : 76,
        'eventCountry' : 'Armenia',
        'isWorkshop' : true,
        'eventInviterId' : 2,
        'countryId' : null,
        'country' : null,
        'maxParticipants' : 10,
        'registrationDeadline' : 2609282800000,
        'registrationClosed' : false,
        'registrationVersion' : 2,
        'vPassRequired' : true
      };
    } else if (jwt.payLoad.eventintiterid === 3) {
      data = {
        'eventId' : 80034,
        'eventName' : 'TAIEX Workshop on Regional development of new Trade routes',
        'eventDates' : '06 - 08 June 2019',
        'eventPlace' : 'Aulon',
        'eventcountryId' : 76,
        'eventCountry' : 'Armenia',
        'isWorkshop' : true,
        'eventInviterId' : 3,
        'countryId' : null,
        'country' : null,
        'maxParticipants' : 5,
        'registrationDeadline' : 2609282800000,
        'registrationClosed' : false,
        'registrationVersion' : 1,
        'vPassRequired' : false
      };
    } else if (jwt.payLoad.eventintiterid === 4) {
      data = {
        'eventId' : 80034,
        'eventName' : 'TAIEX Workshop on Regional development of new Trade routes',
        'eventDates' : '06 - 08 June 2019',
        'eventPlace' : 'Aulon',
        'eventcountryId' : 76,
        'eventCountry' : 'Armenia',
        'isWorkshop' : true,
        'eventInviterId' : 3,
        'countryId' : null,
        'country' : null,
        'maxParticipants' : 20,
        'registrationDeadline' : 2609282800000,
        'registrationClosed' : false,
        'registrationVersion' : 1,
        'vPassRequired' : false
      };
    } else if (jwt.payLoad.eventintiterid === 5) {
      data = {
        'eventId' : 80034,
        'eventName' : 'TAIEX Workshop on Regional development of new Trade routes',
        'eventDates' : '06 - 08 June 2019',
        'eventPlace' : 'Aulon',
        'eventcountryId' : 76,
        'eventCountry' : 'Armenia',
        'isWorkshop' : true,
        'eventInviterId' : 5,
        'countryId' : 105,
        'country' : 'Germany',
        'maxParticipants' : 5,
        'registrationDeadline' : 2609282800000,
        'registrationClosed' : false,
        'registrationVersion' : 1,
        'vPassRequired' : true
      };
    } else if (jwt.payLoad.eventintiterid === 897329) {
      data = {
        'eventId' : 80034,
        'eventName' : 'TAIEX Workshop on Regional development of new Trade routes',
        'eventDates' : '06 - 08 June 2021',
        'eventPlace' : 'Aulon',
        'eventcountryId' : 76,
        'eventCountry' : 'Armenia',
        'isWorkshop' : true,
        'eventInviterId' : 1,
        'countryId' : 51,
        'country' : 'Albania',
        'maxParticipants' : 20,
        'registrationDeadline' : 2609282800000,
        'registrationClosed' : false,
        'registrationVersion' : 2,
        'vPassRequired' : false
      };
    }

    return data;
  }

  @Post('registration/list-participant')
  @Roles('admin')
  getRegistrationList(@Headers('authorization') authorization: string, @Body() body: any): object {
    console.log('pax/registration/list-participant - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    let jwt = new JWT(authorization);
    let data = {};
    if (body.registrationVersion === enRegistrationVersion.short) {
      data = {
        'result': true,
        'message': null,
        'messageType': 1,
        'data': {
          'rows': [
            {
              'registrationId': 159753,
              'personId': 537693,
              'formalTitle': 'Mr',
              'firstName': 'Pieter',
              'familyName': 'Brown',
              'supplierId': 323465,
              'institution': 'RTC shpk',
              'city': 'Tiranna',
              'countryName': 'Albania',
              'comments': 'No...',
              'profEmail': 'info@aku.gov.al',
              'status': 0,
              'userToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbnR5cGUiOjIsImV2ZW50aWQiOjY1MjczLCJldmVudGludGl0ZXJpZCI6ODk3MzI5LCJyZWdpc3RyYXRpb25pZCI6OTg3MzQxLCJyb2xlIjo0LCJqdGkiOiJjMzZjYzYxYS0wYTE5LTQ3OTEtODFmMy0wZjM1ODFhYmFkZmQiLCJpYXQiOjE0OTY2NTIxMjUsImV4cCI6MTQ5NjY1NTcyNX0.DdT8ftGTSrvXI5hGpWb5nPH8RpKz-_4Yp4Oc0cHBneI',
            },
            {
              'registrationId': 159754,
              'personId': 463922,
              'formalTitle': 'Ms',
              'firstName': 'Pata',
              'familyName': 'Beni',
              'supplierId': 277255,
              'institution': 'Ministry of Agriculture, Rural Development and Water Administration',
              'city': 'Tiranna',
              'countryName': 'Albania',
              'comments': 'Will be early',
              'profEmail': 'irma.bregasi@bujqesia.gov.al',
              'status': 1,
              'submittedDate': '2017-03-01T23:00:00.000Z',
              'userToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbnR5cGUiOjIsImV2ZW50aWQiOjY1MjczLCJldmVudGludGl0ZXJpZCI6ODk3MzI5LCJyZWdpc3RyYXRpb25pZCI6OTg3MzQxLCJyb2xlIjo0LCJqdGkiOiJjMzZjYzYxYS0wYTE5LTQ3OTEtODFmMy0wZjM1ODFhYmFkZmQiLCJpYXQiOjE0OTY2NTIxMjUsImV4cCI6MTQ5NjY1NTcyNX0.DdT8ftGTSrvXI5hGpWb5nPH8RpKz-_4Yp4Oc0cHBneI'
            },
            {
              'registrationId': 159755,
              'personId': 465072,
              'formalTitle': 'Mr',
              'firstName': 'Pipe',
              'familyName': 'Puto',
              'supplierId': 277815,
              'institution': 'RNFA Fier',
              'city': 'Tiranna',
              'countryName': 'Albania',
              'comments': 'No food',
              'profEmail': 'Ledio.capo@aku.gov.al',
              'status': 16,
              'submittedDate': '2017-02-25T23:00:00.000Z',
              'userToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbnR5cGUiOjIsImV2ZW50aWQiOjY1MjczLCJldmVudGludGl0ZXJpZCI6ODk3MzI5LCJyZWdpc3RyYXRpb25pZCI6OTg3MzQxLCJyb2xlIjo0LCJqdGkiOiJjMzZjYzYxYS0wYTE5LTQ3OTEtODFmMy0wZjM1ODFhYmFkZmQiLCJpYXQiOjE0OTY2NTIxMjUsImV4cCI6MTQ5NjY1NTcyNX0.DdT8ftGTSrvXI5hGpWb5nPH8RpKz-_4Yp4Oc0cHBneI'
            }
          ],
          'rowCount': 3
        }
      };
    } else {
      data = {
        'result': true,
        'message': null,
        'messageType': 1,
        'data': {
          'rows': [
            {
              'registrationId': 159753,
              'personId': 537693,
              'formalTitle': 'Ms',
              'firstName': 'Drilona',
              'familyName': 'Banushaj',
              'supplierId': 323465,
              'institution': 'VIVAL shpk',
              'position': 'Representative',
              'city': 'Vlore',
              'countryName': 'Albania',
              'comments': 'No...',
              'distanceToVenue': 0,
              'travelBy': -1,
              'departureAirport': '',
              'departureStation': '',
              'profEmail': 'info@aku.gov.al',
              'status': 0,
              'ibuRefusalComment': '',
              'userToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbnR5cGUiOjIsImV2ZW50aWQiOjY1MjczLCJldmVudGludGl0ZXJpZCI6ODk3MzI5LCJyZWdpc3RyYXRpb25pZCI6OTg3MzQxLCJyb2xlIjo0LCJqdGkiOiJjMzZjYzYxYS0wYTE5LTQ3OTEtODFmMy0wZjM1ODFhYmFkZmQiLCJpYXQiOjE0OTY2NTIxMjUsImV4cCI6MTQ5NjY1NTcyNX0.DdT8ftGTSrvXI5hGpWb5nPH8RpKz-_4Yp4Oc0cHBneI'
            },
            {
              'registrationId': 159754,
              'personId': 463922,
              'formalTitle': 'Ms',
              'firstName': 'Irma',
              'familyName': 'Bregasi',
              'supplierId': 277255,
              'institution': 'Ministry of Agriculture, Rural Development and Water Administration',
              'position': 'Specialist in the Food Safety Sector',
              'city': 'Vlore',
              'countryName': 'Albania',
              'comments': 'Will be early',
              'distanceToVenue': 0,
              'travelBy': -1,
              'departureAirport': '',
              'departureStation': '',
              'profEmail': 'irma.bregasi@bujqesia.gov.al',
              'status': 1,
              'submittedDate': '2017-03-01T23:00:00.000Z',
              'ibuRefusalComment': '',
              'userToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbnR5cGUiOjIsImV2ZW50aWQiOjY1MjczLCJldmVudGludGl0ZXJpZCI6ODk3MzI5LCJyZWdpc3RyYXRpb25pZCI6OTg3MzQxLCJyb2xlIjo0LCJqdGkiOiJjMzZjYzYxYS0wYTE5LTQ3OTEtODFmMy0wZjM1ODFhYmFkZmQiLCJpYXQiOjE0OTY2NTIxMjUsImV4cCI6MTQ5NjY1NTcyNX0.DdT8ftGTSrvXI5hGpWb5nPH8RpKz-_4Yp4Oc0cHBneI'
            },
            {
              'registrationId': 159755,
              'personId': 465072,
              'formalTitle': 'Mr',
              'firstName': 'Ledio',
              'familyName': 'Capo',
              'supplierId': 277815,
              'institution': 'RDNFA Fier',
              'position': 'Inspector',
              'city': 'FIER',
              'countryName': 'Albania',
              'comments': 'No food',
              'distanceToVenue': 650,
              'travelBy': 3,
              'departureAirport': 'FIER',
              'departureStation': 'Vlore',
              'profEmail': 'Ledio.capo@aku.gov.al',
              'status': 16,
              'submittedDate': '2017-02-25T23:00:00.000Z',
              'ibuRefusalComment': '',
              'userToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbnR5cGUiOjIsImV2ZW50aWQiOjY1MjczLCJldmVudGludGl0ZXJpZCI6ODk3MzI5LCJyZWdpc3RyYXRpb25pZCI6OTg3MzQxLCJyb2xlIjo0LCJqdGkiOiJjMzZjYzYxYS0wYTE5LTQ3OTEtODFmMy0wZjM1ODFhYmFkZmQiLCJpYXQiOjE0OTY2NTIxMjUsImV4cCI6MTQ5NjY1NTcyNX0.DdT8ftGTSrvXI5hGpWb5nPH8RpKz-_4Yp4Oc0cHBneI'
            },
            {
              'registrationId': 159756,
              'personId': 467842,
              'formalTitle': 'Mr',
              'firstName': 'Uran',
              'familyName': 'Doci',
              'supplierId': 277818,
              'institution': 'RDNFA',
              'position': 'Coordinator',
              'city': 'KUKES',
              'countryName': 'Albania',
              'comments': '',
              'distanceToVenue': 325,
              'travelBy': 8,
              'departureAirport': '',
              'departureStation': '',
              'profEmail': 'uran.doci@aku.gov.al',
              'status': 8,
              'submittedDate': '2017-02-20T23:00:00.000Z',
              'ibuRefusalComment': 'Participant is not qualified for this topic',
              'userToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbnR5cGUiOjIsImV2ZW50aWQiOjY1MjczLCJldmVudGludGl0ZXJpZCI6ODk3MzI5LCJyZWdpc3RyYXRpb25pZCI6OTg3MzQxLCJyb2xlIjo0LCJqdGkiOiJjMzZjYzYxYS0wYTE5LTQ3OTEtODFmMy0wZjM1ODFhYmFkZmQiLCJpYXQiOjE0OTY2NTIxMjUsImV4cCI6MTQ5NjY1NTcyNX0.DdT8ftGTSrvXI5hGpWb5nPH8RpKz-_4Yp4Oc0cHBneI'
            },
            {
              'registrationId': 159757,
              'personId': -1,
              'formalTitle': 'Mr',
              'firstName': 'Uran',
              'familyName': 'Doci',
              'supplierId': -1,
              'countryName': 'Albania',
              'comments': '',
              'distanceToVenue': 0,
              'travelBy': -1,
              'departureAirport': '',
              'departureStation': '',
              'profEmail': 'uran.doci@aku.gov.al',
              'status': 0,
              'ibuRefusalComment': '',
              'userToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbnR5cGUiOjIsImV2ZW50aWQiOjY1MjczLCJldmVudGludGl0ZXJpZCI6ODk3MzI5LCJyZWdpc3RyYXRpb25pZCI6OTg3MzQxLCJyb2xlIjo0LCJqdGkiOiJjMzZjYzYxYS0wYTE5LTQ3OTEtODFmMy0wZjM1ODFhYmFkZmQiLCJpYXQiOjE0OTY2NTIxMjUsImV4cCI6MTQ5NjY1NTcyNX0.DdT8ftGTSrvXI5hGpWb5nPH8RpKz-_4Yp4Oc0cHBneI'
            }
          ],
          'rowCount': 5
        }
      };
    }
    return data;
  }

  @Get('registration/delete-participant/:registrationId')
  @Roles('admin')
  deleteRegistration(@Headers('authorization') authorization: string,
                     @Param('registrationId') registrationId: number): boolean {
    console.log('pax/registration/delete-participant - registrationId: ' + registrationId);
    // Extract payload
    let jwt = new JWT(authorization);

    return true;
  }

  @Get('registration/participant-detail/:registrationId')
  @Roles('admin')
  getRegistration(@Headers('authorization') authorization: string,
                  @Param('registrationId') registrationId: number): object {
    console.log('TMSWebRestrict/api/PAX/registration/participant-detail - registrationId: ' + registrationId);
    // Extract payload
    let jwt = new JWT(authorization);
    let data = {};
    if (registrationId === 1) {
      data = {
        'eventId' : 63718,
        'eventcountryId' : 51,
        'eventPlace' : 'Aulon',
        'isWorkshop' : true,
        'registrationId' : 159756,
        'personId' : 467842,
        'formalAddressId' : 1,
        'firstName' : 'Uran',
        'familyName' : 'Doci',
        'supplierId' : 277818,
        'institution' : 'RDNFA',
        'position' : 'Coordinator',
        'street' : 'ish-parku i ri',
        'city' : 'Aulon',
        'postalCode' : '8500',
        'countryId' : 51,
        'inviter' : 'Mr Uran Dadic',
        'inviterEmail' : 'uran.dadic@gov.al',
        'distanceToVenue' : 425,
        'travelBy' : 8,
        'departureAirport' : '',
        'departureStation' : '',
        'profEmail' : 'uran.doci@aku.gov.al',
        'mobilePhone' : '+321686786',
        'privateEmail' : 'uran.doci@gmail.com',
        'bookHotel' : true,
        'earlyArrival' : false,
        'comment' : 'require train tickets',
        'status' : 4,
        'createdDate' : 1530655200000,
        'submittedDate' : 1530655200000,
        'taiexChangedDate' : 1530655200000,
        'lastchangedDate' : 1530655200000,
        'ibuRefusalComment' : 'Participant is not qualified for this topic',
        'registrationVersion' : 1,
        'dateOfBirth' : null,
        'identityCardNumber' : '14.10.80 352.23',
        'expirationDate' : 1530655200000,
        'nationalityId' : null,
        'selectedBreakOutSessions' : [1, 2],
        'implementationType': 2
      };
    } else {
      data = {
        'eventId' : 63718,
        'eventcountryId' : 51,
        'eventPlace' : 'Aulon',
        'isWorkshop' : true,
        'registrationId' : 159756,
        'personId' : 467842,
        'formalAddressId' : 1,
        'firstName' : 'Uran',
        'familyName' : 'Doci',
        'supplierId' : 277818,
        'institution' : 'RDNFA',
        'position' : 'Coordinator',
        'street' : 'ish-parku i ri',
        'city' : 'Aulon',
        'postalCode' : '8500',
        'countryId' : 51,
        'inviter' : 'Mr Uran Dadic',
        'inviterEmail' : 'uran.dadic@gov.al',
        'distanceToVenue' : 425,
        'travelBy' : 8,
        'departureAirport' : '',
        'departureStation' : '',
        'profEmail' : 'uran.doci@aku.gov.al',
        'mobilePhone' : '+321686786',
        'privateEmail' : 'uran.doci@gmail.com',
        'bookHotel' : true,
        'earlyArrival' : false,
        'comment' : 'require train tickets',
        'status' : 4,
        'createdDate' : 1530655200000,
        'submittedDate' : 1530655200000,
        'taiexChangedDate' : 1530655200000,
        'lastchangedDate' : 1530655200000,
        'ibuRefusalComment' : 'Participant is not qualified for this topic',
        'registrationVersion' : 2,
        'dateOfBirth' : '2000-08-08T00:00:00.000Z',
        'identityCardNumber' : '14.10.80 352.23',
        'expirationDate' : '2022-12-01T00:00:00.000Z',
        'nationalityId' : null,
        'selectedBreakOutSessions' : [1, 2],
        'implementationType': 2
      };
    }

    return data;
  }

  @Post('registration/set-participant')
  @Roles('admin')
  setRegistration(@Headers('authorization') authorization: string, @Body() body: any): object {
    console.log('TMSWebRestrict/api/PAX/registration/set-participant - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    let jwt = new JWT(authorization);
    const data = {
      'result': true,
      'message': 'Successfully saved',
      'messageType': 1,
      'data': body
    };

    return data;
  }

  @Post('registration/add-participant')
  @Roles('admin')
  addRegInvitation(@Headers('authorization') authorization: string, @Body() body: any): object {
    console.log('pax/registration/add-participant - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    let jwt = new JWT(authorization);
    const data = {
      'result': true,
      'message': 'Added successfully',
      'messageType': 1,
      'data': {
        'registrationId': 158,
        'personId': null,
        'eventId': 68113,
        'formalAddressId': 1,
        'formalTitle': 'Mr',
        'firstName': 'Werner',
        'familyName': 'Stappaerts',
        'supplierId': null,
        'institution': null,
        'position': null,
        'city': null,
        'countryName': 'Austria',
        'countryId': 100,
        'eventInviterId': 73,
        'inviter': 'Mr Inv Austria ',
        'inviterEmail': 'inv@austria.be',
        'isLocalSpeaker': false,
        'distanceToVenue': null,
        'travelBy': null,
        'departureAirport': null,
        'departureStation': null,
        'profEmail': 'werner.stappaert@taiex.be',
        'status': 0,
        'submittedDate': null,
        'ibuRefusalComment': null,
        'postalCode': null,
        'eventcountryId': 100,
        'eventPlace': 'Admont',
        'isWorkshop': true,
        'street': null,
        'mobilePhone': null,
        'privateEmail': null,
        'bookHotel': null,
        'comments': null,
        'earlyArrival': null,
        'createdDate': 1582447268339,
        'taiexChangedDate': null,
        'lastchangedDate': 1582447268133,
        'peinID': null,
        'registrationAdded': true,
        'taiexChanged': null,
        'isParticipant': null,
        'isStudyVisit': false,
        'dateOfBirth': null,
        'nationality': null,
        'nationalityCode': null,
        'nationalityId': null,
        'identityCardNumber': null,
        'expirationDate': null,
        'registrationVersion': 2,
        'vPassRequired': false
      }
    };

    return data;
  }

  @Get('registration/fetch-person-to-invite')
  @Roles('admin')
  getPersonList(@Headers('authorization') authorization: string,
                @Query('search') search: string = ''): object {
    console.log('pax/registration/fetch-person-to-invite - Authorization: ' + authorization + ', search: ' + search);
    // Extract payload
    let jwt = new JWT(authorization);
    const data = [
      {
        'id': 21672,
        'name': 'Ms Mimoza Preku, Union of Chambers of Commerce of ALBANIA - Advisor Foreign Trade Department'
      },
      {
        'id': 21035,
        'name': 'Ms Daniela Tamo, Tamo Daniela* - Interpreter'
      },
      {
        'id': 62579,
        'name': 'Mr Pajtim Melani, Albanian Competition Authority - Specialist'
      },
      {
        'id': 218040,
        'name': 'Ms Shpresa Cali, Ministry of Agriculture and Food - Head of Sector'
      },
      {
        'id': 98639,
        'name': 'Ms Elvira Beli, Food Safety and Veterinary Institute - Specialist'
      },
      {
        'id': 49370,
        'name': 'Mr Bajram Mejdaj, State Social Services - Head of Sector'
      },
      {
        'id': 124566,
        'name': 'Mr Bujar Leka, Ministry of Economy, Trade and Energy - Director'
      },
      {
        'id': 204954,
        'name': 'Mr Bujar Bala, Mission of Albania to the EU - First Secretary'
      },
      {
        'id': 119019,
        'name': 'Ms Matilda Xhepa, Ministry of Agriculture, Food and Consumer Protection - Specialist'
      },
      {
        'id': 55814,
        'name': 'Ms Matilda Xhepa, Ministry of Agriculture, Food and Consumer Protection - Veterinarian Specialist'
      },
      {
        'id': 25721,
        'name': 'Mr Harallamb Pace, Institute of Plant Protection - Bacteriologist'
      },
      {
        'id': 185382,
        'name': 'Mr Pajtim Melani, Competition Authority - Director'
      },
      {
        'id': 69755,
        'name': 'Mr Altin Vrapi, Ministry of Transport & Telecommunications - Director of Airports and Security'
      },
      {
        'id': 22064,
        'name': 'Mr Altin Vrapi, State Labour Inspectorate - Director'
      },
      {
        'id': 193442,
        'name': 'Ms Shpresa Cali, Ministry of Agriculture, Food & Consumer Protection - Expert,Plant Protection sector'
      },
      {
        'id': 218042,
        'name': 'Mr Aleksander Kolaci, Ministry of Agriculture and Food - Director'
      },
      {
        'id': 17145,
        'name': 'Ms Matilda Xhepa, Ministry of Agriculture and Food - Specialist'
      },
      {
        'id': 42874,
        'name': 'Ms Renata Teta, Ministry of Public works, Transport and Telecomunication - Expert'
      },
      {
        'id': 69380,
        'name': 'Mr Elvis �ibuku, Bank of Albania - Lawyer'
      },
      {
        'id': 18790,
        'name': 'Ms Ledia Hysi, Ministry of Foreign Affairs - Director'
      },
      {
        'id': 18791,
        'name': 'Ms Albana Shtylla, Ministry  of Labour and Social Affairs - Director'
      },
      {
        'id': 84396,
        'name': 'Mr Ardian Visha, General Prosecution Office - Director'
      },
      {
        'id': 17227,
        'name': 'Ms Valbona Kuko, Ministry of European Integration - Director'
      },
      {
        'id': 117831,
        'name': 'Ms Valbona Kuko, Council of Ministers - Foreign Aid Director'
      },
      {
        'id': 220364,
        'name': 'Mr Lulzim Ndreu, Ministry of Health - Law Specialist'
      },
      {
        'id': 19408,
        'name': 'Mr Edmond Hido, Energy Efficienty Centre(EEC) - Director'
      },
      {
        'id': 18339,
        'name': 'Mr Bajram Mejdaj, Ministry of Environment - Lawyer'
      },
      {
        'id': 148893,
        'name': 'Ms Matilda Xhepa, Ministry of Agiculture, Food and Consumer Protection - Specialist'
      },
      {
        'id': 25722,
        'name': 'Mr Skender Varaku, Institute of Plant Protection - Director'
      },
      {
        'id': 123344,
        'name': 'Mr Elvis �ibuku, Bank of Albania - Specialist'
      },
      {
        'id': 174937,
        'name': 'Ms Albana Shtylla, Ministry Of Agriculture Food and Consumer Protection -  '
      },
      {
        'id': 25958,
        'name': 'Ms Miranda Ramaj, Bank of Albania - Representative'
      },
      {
        'id': 18772,
        'name': 'Mr Pajtim Melani, Ministry of European Integration - Specialist'
      },
      {
        'id': 247119,
        'name': 'Mr Gledis Gjipali, European Movement Albania (EMA) -  '
      },
      {
        'id': 22119,
        'name': 'Mr Enklid Gjini, Prosecution Office - Prosecutor'
      },
      {
        'id': 220365,
        'name': 'Ms Marita Afezolli, Ministry of Health - Specialist of Primary Health Care'
      },
      {
        'id': 49359,
        'name': 'Mr Bujar Leka, Ministry of Economy, Trade and Energy - Director'
      },
      {
        'id': 18557,
        'name': 'Ms Renata Teta, Ministry of Transport and Communication - Specialist'
      },
      {
        'id': 232984,
        'name': 'Mr Adrian Hoxha, Ministry of Finance - Specialist'
      },
      {
        'id': 20513,
        'name': 'Mr Agim Bufi, Union Chamber of Commerce and Industry of Albania - Secretary General'
      },
      {
        'id': 25881,
        'name': 'Mr Gledis Gjipali, Ministry of European Integration - Expert in Directory of Approximation of Legislatio'
      },
      {
        'id': 117977,
        'name': 'Ms Valbona Kuko, Council of Ministers - Director'
      },
      {
        'id': 267748,
        'name': 'Ms Shpresa Cali, Ministry of Agriculture, Food and Consumer Protection - Expert of Plant Protection'
      },
      {
        'id': 193432,
        'name': 'Ms Shpresa Cali, Ministry of Agriculture, Food & Consumer Protection - Expert,Plant Protection sector'
      },
      {
        'id': 148839,
        'name': 'Ms Elvira Beli, Institute of Food Safety and Veterinary - Head of Food Safety Department'
      },
      {
        'id': 256213,
        'name': 'Mr Aneil Singh, European Commission Delegation in Tirana - Head of Section'
      },
      {
        'id': 72515,
        'name': 'Mr Ardian Dvorani, Obersten Gerichtshof der Republik Albanien - Representative'
      },
      {
        'id': 111730,
        'name': 'Ms Matilda Xhepa, Ministry of Agriculture, Food and Consumer Protection - Specialist'
      },
      {
        'id': 146020,
        'name': 'Ms Mamica Dhamo, Ministry of Economy, Trade, and Industry - Head of Unit'
      },
      {
        'id': 22065,
        'name': 'Mr Ylli Spahaj, State Labour Inspectorate - Head of Certifications and Maintenance Dept.'
      },
      {
        'id': 220366,
        'name': 'Mr Agim Shehi, Ministry of Health - Director of Primary Health Care'
      },
      {
        'id': 35231,
        'name': 'Mr Gledis Gjipali, Ministry of European Integration - Specialist'
      },
      {
        'id': 220351,
        'name': 'Mr Gledis Gjipali, Ministry of European Integration - Specialist'
      },
      {
        'id': 220350,
        'name': 'Mr Ditmir Bushati, Ministry of European Integration - Director'
      },
      {
        'id': 21516,
        'name': 'Ms Rudina Xhillari, Rudina Xhillari* - Interpreter'
      },
      {
        'id': 57966,
        'name': 'Ms Matilda Xhepa, Ministry of Agriculture, Food and Consumer Protection - Veterinarian Specialist'
      },
      {
        'id': 111729,
        'name': 'Ms Matilda Xhepa, Ministry of Agriculture, Food and Consumer Protection - Veterinarian Specialist'
      },
      {
        'id': 220352,
        'name': 'Mr Elvis �ibuku, Ministry of European Integration - Lawyer'
      },
      {
        'id': 21506,
        'name': 'Ms Mamica Dhamo, Ministry of Economy - Specialist'
      },
      {
        'id': 123345,
        'name': 'Ms Miranda Ramaj, Bank of Albania - Deputy Director'
      },
      {
        'id': 232876,
        'name': 'Ms Miranda Ramaj, Bank Of Albania - Chief of Sector'
      },
      {
        'id': 180892,
        'name': 'Mr Pajtim Melani, ACA - Director of Market Surveillance'
      },
      {
        'id': 21876,
        'name': 'Ms Nikoleta Gjordeni, Ministry of Culture, Youth & Sports - Director'
      },
      {
        'id': 21877,
        'name': 'Mr Joaquin Tasso Vilallonga, Delegation of the European Commission to Albania - Justice and Home Affairs Coordinator'
      },
      {
        'id': 35225,
        'name': 'Mr Adrian Hoxha, General Directorate for Prevention of Money Laundering - Inspector'
      },
      {
        'id': 78513,
        'name': 'Mr Agim Bufi, Union of Chambers of Commerce and Industry Albania - Secretary'
      },
      {
        'id': 118022,
        'name': 'Mr Gledis Gjipali, Ministry of European Integration - Expert'
      },
      {
        'id': 129621,
        'name': 'Ms Valbona Kuko, Council of Ministers - Director'
      },
      {
        'id': 193430,
        'name': 'Mr Skender Varaku, Agricultural University of Tirana - Professor'
      },
      {
        'id': 232875,
        'name': 'Mr Elvis �ibuku, Bank Of Albania - LAWYER'
      },
      {
        'id': 85085,
        'name': 'Ms Mamica Dhamo, Ministry of Economy, Trade and Energy - Chief of Consumer Protection Unit'
      },
      {
        'id': 117820,
        'name': 'Mr Pajtim Melani, Competition Authority - Director'
      },
      {
        'id': 131343,
        'name': 'Mr Ditmir Bushati, European Movement in Albania - Executive Director'
      },
      {
        'id': 196883,
        'name': 'Mr Ditmir Bushati, European Movement in Albania - Executive Director'
      },
      {
        'id': 18771,
        'name': 'Mr Ditmir Bushati, Ministry of European Integration - Director'
      },
      {
        'id': 57965,
        'name': 'Ms Gordana Sudar, Ministry of Agriculture, Food and Consumer Protection - Director of Juridical Department'
      },
      {
        'id': 17143,
        'name': 'Ms Gordana Sudar, Ministry of Agriculture and Food - Lawyer'
      },
      {
        'id': 59168,
        'name': 'Ms Shpresa Cali, Ministry of Agriculture, Food and Consumer Protection - Plant Protection Expert'
      },
      {
        'id': 17144,
        'name': 'Ms Shpresa Cali, Ministry of Agriculture and Food - Specialist'
      },
      {
        'id': 19597,
        'name': 'Ms Edlira Baraj, Ministry of Economy - Director'
      }
    ];

    return data;
  }

  @Get('registration/person-detail/:peinid')
  @Roles('admin')
  getPersonDetail(@Headers('authorization') authorization: string,
                  @Param('peinid') peInId: number): object {
    console.log('pax/registration/person-detail - Authorization: ' + authorization + ', peInId: ' + peInId);
    // Extract payload
    let jwt = new JWT(authorization);
    const data = {
      'peinID': 17139,
      'personId': 92279,
      'supplierId': 49099,
      'formalAddressId': 1,
      'firstName': 'Bujar',
      'familyName': 'Huqi',
      'profEmail': 'imb@albmail.com',
      'isLocalSpeaker': false,
      'countryId': 51,
      'eventInviterId': 159753,
      'implementationType': 1
    };

    return data;
  }

  @Get('registration/reOpen-registration/:registrationId')
  @Roles('admin')
  reOpenRegistration(@Headers('authorization') authorization: string,
                     @Param('registrationId') registrationId: number): object {
    console.log('TMSWebRestrict/api/PAX/registration/reOpen-registration - Authorization: ' + authorization + ', registrationId: ' + registrationId);
    // Extract payload
    let jwt = new JWT(authorization);
    const data = {
      'registrationId': 159754,
      'personId': null,
      'eventId': 68113,
      'formalAddressId': 1,
      'formalTitle': 'Mr',
      'firstName': 'Werner',
      'familyName': 'Stappaerts',
      'supplierId': null,
      'institution': null,
      'position': null,
      'city': null,
      'countryName': 'Austria',
      'countryId': 100,
      'eventInviterId': 73,
      'inviter': 'Mr Inv Austria ',
      'inviterEmail': 'inv@austria.be',
      'isLocalSpeaker': false,
      'distanceToVenue': null,
      'travelBy': null,
      'departureAirport': null,
      'departureStation': null,
      'profEmail': 'werner.stappaert@taiex.be',
      'status': 4,
      'submittedDate': null,
      'ibuRefusalComment': null,
      'postalCode': null,
      'eventcountryId': 100,
      'eventPlace': 'Admont',
      'isWorkshop': true,
      'street': null,
      'mobilePhone': null,
      'privateEmail': null,
      'bookHotel': null,
      'comments': null,
      'earlyArrival': null,
      'createdDate': 1582447268339,
      'taiexChangedDate': null,
      'lastchangedDate': 1582447268133,
      'peinID': null,
      'registrationAdded': true,
      'taiexChanged': null,
      'isParticipant': null,
      'isStudyVisit': false,
      'dateOfBirth': null,
      'nationality': null,
      'nationalityCode': null,
      'nationalityId': null,
      'identityCardNumber': null,
      'expirationDate': null,
      'registrationVersion': 2,
      'vPassRequired': false,
      'selectedBreakOutSessions': [1, 2],
      'implementationType': 1
    };

    return data;
  }

  @Post('registration/approve-registration-list')
  @Roles('admin')
  approveRegistrationList(@Headers('authorization') authorization: string, @Body() body: any): object {
    console.log('pax/registration/approve-registration-list - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    let jwt = new JWT(authorization);
    const data = [];

    return data;
  }

  @Get('registration/participantList-print')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=Registration_participantList_list.xlsx')
  printParticipantList(@Headers('authorization') authorization: string, @Headers('filters') sortFilter: string, @Res() res: Response) {
    console.log('TMSWebRestrict/api/PAX/registration/participantList-print - Authorization: ' + authorization + ', sortFilter: ' + sortFilter);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/pax/Registration_participantList_list.xlsx')).pipe(res);
  }

  @Get('registration/send-draft-email')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/x-msg')
  @Header('Content-Disposition', 'attachment; filename=Registration_Draft_Email.msg')
  createDraftEmail(@Query('userToken') userToken: string,
                   @Query('registrationIds') registrationIds: string,
                   @Query('registrationVersion') registrationVersion: enRegistrationVersion,
                   @Query('emailType') emailType: string,
                   @Res() res: Response) {
    console.log('TMSWebRestrict/api/PAX/registration/send-draft-email - userToken: ' + userToken + ', registrationIds: ' + registrationIds +
      ', registrationVersion: ' + registrationVersion + ', emailType: ' + emailType);

    createReadStream(path.join(__dirname, '../resources/pax/Registration_Draft_Email.msg')).pipe(res);
  }

  @Get('registration/regCancel-draft-email')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/x-msg')
  @Header('Content-Disposition', 'attachment; filename=Registration_Cancel_Draft_Email.msg')
  regCancelDraftEmail(@Query('usertoken') userToken: string,
                      @Query('displayname') displayName: string,
                      @Query('emailid') emailId: string,
                      @Query('comment') comment: string,
                      @Res() res: Response) {
    console.log('TMSWebRestrict/api/PAX/registration/regCancel-draft-email - userToken: ' + userToken + ', displayName: ' + displayName +
      ', emailId: ' + emailId + ', comment: ' + comment);

    createReadStream(path.join(__dirname, '../resources/pax/Registration_Cancel_Draft_Email.msg')).pipe(res);
  }

  @Get('inviters/list')
  getInviterList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('TMSWebRestrict/api/PAX/inviters/list - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/pax/inviterList_2.json')).pipe(res);
  }

  @Get('inviters/remove-inviter/:eventInviterId')
  removeEventInviter(@Headers('authorization') authorization: string,
                     @Param('eventInviterId') eventInviterId: number): boolean {
    console.log('TMSWebRestrict/api/PAX/inviters/remove-inviter - Authorization: ' + authorization +
      ', eventInviterId: ' + eventInviterId);

    return false;
  }

  @Get('inviters/details/event-inviter-countries')
  getEventInviterCountryList(@Headers('authorization') authorization: string,
                             @Res() res: Response) {
    console.log('TMSWebRestrict/api/PAX/inviters/details/event-inviter-countries - Authorization: ' + authorization);
    // Extract payload
    let jwt = new JWT(authorization);
    console.log('TMSWebRestrict/api/PAX/inviters/details/event-inviter-countries - jwt.payLoad: ' + JSON.stringify(jwt.payLoad));

    createReadStream(path.join(__dirname, '../resources/json/pax/event_inviter_country_List_' + jwt.payLoad.eventintiterid + '.json')).pipe(res);
  }

  @Get('inviters/list/print/:eventInviterId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=InviterList_Extract.xlsx')
  extractInviterList(@Headers('authorization') authorization: string,
                     @Param('eventInviterId') eventInviterId: number,
                     @Res() res: Response) {
    console.log('TMSWebRestrict/api/PAX/inviters/list/print - Authorization: ' + authorization + ', eventInviterId: ' + eventInviterId);

    createReadStream(path.join(__dirname, '../resources/pax/InviterList_Extract.xlsx')).pipe(res);
  }

  @Get('inviters/send-draft-email')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/x-msg')
  @Header('Content-Disposition', 'attachment; filename=Registration_Draft_Email.msg')
  createInvDraftEmail(@Headers('authorization') authorization: string,
                   @Query('selectedIds') selectedIds: Array<number>,
                   @Query('emailType', ParseIntPipe) emailType: number,
                   @Res() res: Response) {
    console.log('TMSWebRestrict/api/PAX/inviters/send-draft-email - Authorization: ' + authorization +
      ', selectedIds: ' + selectedIds + ', emailType: ' + emailType);

    createReadStream(path.join(__dirname, '../resources/pax/Registration_Draft_Email.msg')).pipe(res);
  }

  @Get('inviters/inviter-detail')
  getInviter(@Headers('authorization') authorization: string): object {
    console.log('TMSWebRestrict/api/PAX/inviters/inviter-detail - Authorization: ' + authorization);

    // get list and extract selected event id - test data
    let inviterList: Array<any> = JSON.parse(readFileSync(path.join(__dirname, '../resources/json/pax/inviterList.json')).toString());
    // 0 = full, 2 = short, 1 = short & full
    return inviterList[1];
  }

  @Post('inviters/set-inviter')
  setInviter(@Headers('authorization') authorization: string,
             @Body() body: any): object {
    console.log('TMSWebRestrict/api/PAX/inviters/set-inviter - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));

    let resultData = {
      'result': true,
      'message': 'Updated successfully',
      'messageType': 1,
      'data': undefined
    };
    body.inviterAdded = true;
    resultData.data = body;
    return resultData;
  }

  @Post('registration/import-registration-list')
  importRegistrationList(@Headers('authorization') authorization: string, @Body() body: any): object {
    console.log('pax/registration/import-registration-list - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));

    const data = {
      'result': true,
      'message': null,
      'messageType': 1
    };

    return data;
  }
}
