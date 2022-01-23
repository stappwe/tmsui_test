/* tslint:disable */
import { Body, Controller, Get, Headers, Param, Post, Query, Res, UseGuards } from '@nestjs/common';

import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { GeneralRoutines } from '../common/generalRoutines';
import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';

@Controller('TMSWebRestrict/api')
@UseGuards(RolesGuard)
export class TMSWEBAppController {
  @Post('tmsweb/set-speaker-form')
  @Roles('admin')
  setSpeakerRegistration(@Body() body: any): object {
    console.log('TMSWebRestrict/api/tmsweb/set-speaker-form - Body: ' + JSON.stringify(body));
    const data =
      {
        "result": true,
        "message": "",
        "messageType": 1,
        "data": {
          "userToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbnR5cGUiOjYsInJvbGUiOjE2LCJpZCI6MSwiZW1haWwiOiJ3c0B0YWlleC5iZSIsInVzZXJOYW1lIjoiUnV0aCBNQVJUSU4ifQ.XUh5eMNuLs6SFxD4n2COg4ihfcDbpiO6_2G3M__MLdxgZOZ6EPHga4o9ISFLDL6BOOAtap70um-yFwpFV9X-PQ"
        }
      };

    return data;
  }

  @Get('tmsweb/init-speaker-form')
  @Roles('admin')
  initSpeakerForm(@Headers('authorization') authorization: string, @Res() res: Response): void {
    console.log('TMSWebRestrict/api/tmsweb/init-speaker-form - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/tmsweb/init-speaker-form.json')).pipe(res);
  }

  @Get('tmsweb/get-speaker-form')
  getSpeakerForm(@Query('usertoken') userToken: string, @Res() res: Response): void {
    console.log('tmsweb/get-speaker-form');

    // normal expert missing, workshop
    createReadStream(path.join(__dirname, '../resources/json/tmsweb/get-speaker-form.json')).pipe(res);
    // normal expert missing, workshop - Online
    // createReadStream(path.join(__dirname, '../resources/json/tmsweb/get-speaker-form_VTC.json')).pipe(res);
    // test form
    // createReadStream(path.join(__dirname, '../resources/json/tmsweb/get-speaker-form-test.json')).pipe(res);
    // host inistution invitation - submitted
    // createReadStream(path.join(__dirname, '../resources/json/tmsweb/get-speaker-form-host-institution-submitted.json')).pipe(res);
    // study visit - expert
    // createReadStream(path.join(__dirname, '../resources/json/tmsweb/get-speaker-form-study-visit.json')).pipe(res);
    // study visit - host institution invitation
    // createReadStream(path.join(__dirname, '../resources/json/tmsweb/get-speaker-form-host-institution.json')).pipe(res);
    // eu invitation
    // createReadStream(path.join(__dirname, '../resources/json/tmsweb/get-speaker-form-eu-invitation.json')).pipe(res);
    // study visit - EU institution invitation - new person
    // createReadStream(path.join(__dirname, '../resources/json/tmsweb/get-speaker-form-eu-invitation-new-person.json')).pipe(res);
  }

  @Get('tmsweb/get-grid-filters/:gridName')
  getGridFilters(@Headers('authorization') authorization: string,
                 @Param('gridName') gridName: string,
                 @Res() res: Response) {
    console.log('TMSWebRestrict/api/tmsweb/get-grid-filters - Authorization: ' + authorization + ', gridName: ' + gridName);

    createReadStream(path.join(__dirname, '../resources/json/tmsweb/' + gridName + 'Filters.json')).pipe(res);
  }

  @Get('tmsweb/get-grid-filters/:gridName/:id')
  getGridFiltersById(@Headers('authorization') authorization: string,
                     @Param('gridName') gridName: string,
                     @Param('id') id: number,
                     @Res() res: Response) {
    console.log('TMSWebRestrict/api/tmsweb/get-grid-filters - Authorization: ' + authorization + ', gridName: ' + gridName + ', id: ' + id);

    createReadStream(path.join(__dirname, '../resources/json/tmsweb/' + gridName + 'Filters.json')).pipe(res);
  }

  @Get('tmsweb/generalCountryList')
  getGeneralCountryList(): object {
    console.log('TMSWebRestrict/api/tmsweb/generalCountryList');
    const data = [
      { 'id': 209, 'countryName': 'Afghanistan', 'abbreviation': 'AF' },
      { 'id': 51, 'countryName': 'Albania', 'abbreviation': 'AL' },
      { 'id': 78, 'countryName': 'Algeria', 'abbreviation': 'DZ' },
      { 'id': 214, 'countryName': 'American Samoa', 'abbreviation': 'AS' },
      { 'id': 162, 'countryName': 'Andorra', 'abbreviation': 'AD' },
      { 'id': 190, 'countryName': 'Angola', 'abbreviation': 'AO' },
      { 'id': 215, 'countryName': 'Antigua and Barbuda', 'abbreviation': 'AG' },
      { 'id': 163, 'countryName': 'Argentina', 'abbreviation': 'AR' },
      { 'id': 76, 'countryName': 'Armenia', 'abbreviation': 'AM' },
      { 'id': 216, 'countryName': 'Aruba', 'abbreviation': 'AW' },
      { 'id': 153, 'countryName': 'Australia', 'abbreviation': 'AU' },
      { 'id': 100, 'countryName': 'Austria', 'abbreviation': 'AT' },
      { 'id': 75, 'countryName': 'Azerbaijan', 'abbreviation': 'AZ' },
      { 'id': 164, 'countryName': 'Bahrain', 'abbreviation': 'BH' },
      { 'id': 217, 'countryName': 'Bangladesh', 'abbreviation': 'BD' },
      { 'id': 218, 'countryName': 'Barbados', 'abbreviation': 'BB' },
      { 'id': 74, 'countryName': 'Belarus', 'abbreviation': 'BY' },
      { 'id': 101, 'countryName': 'Belgium', 'abbreviation': 'BE' },
      { 'id': 219, 'countryName': 'Belize', 'abbreviation': 'BZ' },
      { 'id': 220, 'countryName': 'Bolivia', 'abbreviation': 'BO' },
      { 'id': 52, 'countryName': 'Bosnia and Herzegovina', 'abbreviation': 'BA' },
      { 'id': 191, 'countryName': 'Brazil', 'abbreviation': 'BR' },
      { 'id': 165, 'countryName': 'Brunei', 'abbreviation': 'BN' },
      { 'id': 1, 'countryName': 'Bulgaria', 'abbreviation': 'BG' },
      { 'id': 192, 'countryName': 'Cambodia', 'abbreviation': 'KH' },
      { 'id': 155, 'countryName': 'Canada', 'abbreviation': 'CA' },
      { 'id': 193, 'countryName': 'Chile', 'abbreviation': 'CL' },
      { 'id': 202, 'countryName': 'Colombia', 'abbreviation': 'CO' },
      { 'id': 221, 'countryName': 'Congo the Democratic Republic of the', 'abbreviation': 'CD' },
      { 'id': 222, 'countryName': 'Costa Rica', 'abbreviation': 'CR' },
      { 'id': 53, 'countryName': 'Croatia', 'abbreviation': 'HR' },
      { 'id': 223, 'countryName': 'Cuba', 'abbreviation': 'CU' },
      { 'id': 224, 'countryName': 'Curaçao', 'abbreviation': 'CW' },
      { 'id': 11, 'countryName': 'Cyprus', 'abbreviation': 'CY' },
      { 'id': 2, 'countryName': 'Czech Republic', 'abbreviation': 'CZ' },
      { 'id': 102, 'countryName': 'Denmark', 'abbreviation': 'DK' },
      { 'id': 225, 'countryName': 'Dominica', 'abbreviation': 'DM' },
      { 'id': 226, 'countryName': 'Dominican Republic', 'abbreviation': 'DO' },
      { 'id': 210, 'countryName': 'Ecuador', 'abbreviation': 'EC' },
      { 'id': 81, 'countryName': 'Egypt', 'abbreviation': 'EG' },
      { 'id': 212, 'countryName': 'El Salvador', 'abbreviation': 'SV' },
      { 'id': 227, 'countryName': 'Equatorial Guinea', 'abbreviation': 'GQ' },
      { 'id': 3, 'countryName': 'Estonia', 'abbreviation': 'EE' },
      { 'id': 228, 'countryName': 'Faroe Islands', 'abbreviation': 'FO' },
      { 'id': 104, 'countryName': 'France', 'abbreviation': 'FR' },
      { 'id': 73, 'countryName': 'Georgia', 'abbreviation': 'GE' },
      { 'id': 105, 'countryName': 'Germany', 'abbreviation': 'DE' },
      { 'id': 106, 'countryName': 'Greece', 'abbreviation': 'GR' },
      { 'id': 229, 'countryName': 'Greenland', 'abbreviation': 'GL' },
      { 'id': 213, 'countryName': 'Guatemala', 'abbreviation': 'GT' },
      { 'id': 230, 'countryName': 'Guinea', 'abbreviation': 'GN' },
      { 'id': 231, 'countryName': 'Guyana', 'abbreviation': 'GY' },
      { 'id': 232, 'countryName': 'Haiti', 'abbreviation': 'HT' },
      { 'id': 233, 'countryName': 'Honduras', 'abbreviation': 'HN' },
      { 'id': 158, 'countryName': 'Hong Kong', 'abbreviation': 'HK' },
      { 'id': 4, 'countryName': 'Hungary', 'abbreviation': 'HU' },
      { 'id': 156, 'countryName': 'Iceland', 'abbreviation': 'IS' },
      { 'id': 167, 'countryName': 'India', 'abbreviation': 'IN' },
      { 'id': 168, 'countryName': 'Indonesia', 'abbreviation': 'ID' },
      { 'id': 170, 'countryName': 'Irak', 'abbreviation': 'IQ' },
      { 'id': 171, 'countryName': 'Iran', 'abbreviation': 'IR' },
      { 'id': 83, 'countryName': 'Israel', 'abbreviation': 'IL' },
      { 'id': 108, 'countryName': 'Italy', 'abbreviation': 'IT' },
      { 'id': 234, 'countryName': 'Jamaica', 'abbreviation': 'JM' },
      { 'id': 172, 'countryName': 'Japan', 'abbreviation': 'JP' },
      { 'id': 85, 'countryName': 'Jordan', 'abbreviation': 'JO' },
      { 'id': 161, 'countryName': 'Kazakhstan', 'abbreviation': 'KAZ' },
      { 'id': 56, 'countryName': 'Kosovo', 'abbreviation': 'KS' },
      { 'id': 173, 'countryName': 'Kuwait', 'abbreviation': 'KW' },
      { 'id': 200, 'countryName': 'Kyrgyzstan', 'abbreviation': 'KG' },
      { 'id': 195, 'countryName': 'Laos', 'abbreviation': 'LA' },
      { 'id': 5, 'countryName': 'Latvia', 'abbreviation': 'LV' },
      { 'id': 84, 'countryName': 'Lebanon', 'abbreviation': 'LB' },
      { 'id': 87, 'countryName': 'Libya', 'abbreviation': 'LY' },
      { 'id': 174, 'countryName': 'Liechtenstein', 'abbreviation': 'LI' },
      { 'id': 6, 'countryName': 'Lithuania', 'abbreviation': 'LT' },
      { 'id': 109, 'countryName': 'Luxemburg', 'abbreviation': 'LU' },
      { 'id': 235, 'countryName': 'Macao', 'abbreviation': 'MO' },
      { 'id': 175, 'countryName': 'Malaysia', 'abbreviation': 'MY' },
      { 'id': 211, 'countryName': 'Maldives', 'abbreviation': 'MV' },
      { 'id': 13, 'countryName': 'Malta', 'abbreviation': 'MT' },
      { 'id': 176, 'countryName': 'Mexico', 'abbreviation': 'MX' },
      { 'id': 72, 'countryName': 'Moldova', 'abbreviation': 'MD' },
      { 'id': 177, 'countryName': 'Monaco', 'abbreviation': 'MC' },
      { 'id': 236, 'countryName': 'Mongolia', 'abbreviation': 'MN' },
      { 'id': 58, 'countryName': 'Montenegro', 'abbreviation': 'ME' },
      { 'id': 77, 'countryName': 'Morocco', 'abbreviation': 'MA' },
      { 'id': 196, 'countryName': 'Myanmar', 'abbreviation': 'MM' },
      { 'id': 237, 'countryName': 'Nepal', 'abbreviation': 'NP' },
      { 'id': 160, 'countryName': 'New Zealand', 'abbreviation': 'NZ' },
      { 'id': 238, 'countryName': 'Nicaragua', 'abbreviation': 'NI' },
      { 'id': 197, 'countryName': 'Nigeria', 'abbreviation': 'NG' },
      { 'id': 152, 'countryName': 'Norway', 'abbreviation': 'NO' },
      { 'id': 178, 'countryName': 'Oman', 'abbreviation': 'OM' },
      { 'id': 150, 'countryName': 'Other', 'abbreviation': 'OTHER' },
      { 'id': 179, 'countryName': 'Pakistan', 'abbreviation': 'PK' },
      { 'id': 82, 'countryName': 'Palestine', 'abbreviation': 'PS' },
      { 'id': 239, 'countryName': 'Panama', 'abbreviation': 'PA' },
      { 'id': 203, 'countryName': 'Paraguay', 'abbreviation': 'PY' },
      { 'id': 159, 'countryName': 'People\'s Republic of China', 'abbreviation': 'CN' },
      { 'id': 198, 'countryName': 'Peru', 'abbreviation': 'PE' },
      { 'id': 180, 'countryName': 'Philippines', 'abbreviation': 'PH' },
      { 'id': 7, 'countryName': 'Poland', 'abbreviation': 'PL' },
      { 'id': 111, 'countryName': 'Portugal', 'abbreviation': 'PT' },
      { 'id': 240, 'countryName': 'Puerto Rico', 'abbreviation': 'PR' },
      { 'id': 181, 'countryName': 'Qatar', 'abbreviation': 'QA' },
      { 'id': 194, 'countryName': 'Republic of Korea', 'abbreviation': 'KR' },
      { 'id': 8, 'countryName': 'Romania', 'abbreviation': 'RO' },
      { 'id': 70, 'countryName': 'Russian Federation', 'abbreviation': 'RU' },
      { 'id': 241, 'countryName': 'Sao Tome and Principe', 'abbreviation': 'ST' },
      { 'id': 182, 'countryName': 'Saudi Arabia', 'abbreviation': 'SA' },
      { 'id': 57, 'countryName': 'Serbia', 'abbreviation': 'RS' },
      { 'id': 55, 'countryName': 'Serbia and Montenegro', 'abbreviation': 'CS' },
      { 'id': 183, 'countryName': 'Singapore', 'abbreviation': 'SG' },
      { 'id': 9, 'countryName': 'Slovak Republic', 'abbreviation': 'SK' },
      { 'id': 10, 'countryName': 'Slovenia', 'abbreviation': 'SI' },
      { 'id': 184, 'countryName': 'South Africa', 'abbreviation': 'ZA' },
      { 'id': 112, 'countryName': 'Spain', 'abbreviation': 'ES' },
      { 'id': 201, 'countryName': 'Sri Lanka', 'abbreviation': 'LK' },
      { 'id': 103, 'countryName': 'Suomi Finland', 'abbreviation': 'FI' },
      { 'id': 242, 'countryName': 'Suriname', 'abbreviation': 'SR' },
      { 'id': 113, 'countryName': 'Sweden', 'abbreviation': 'SE' },
      { 'id': 154, 'countryName': 'Switzerland', 'abbreviation': 'CH' },
      { 'id': 86, 'countryName': 'Syria', 'abbreviation': 'SY' },
      { 'id': 204, 'countryName': 'Taiwan', 'abbreviation': 'TW' },
      { 'id': 205, 'countryName': 'Tajikistan', 'abbreviation': 'TJ' },
      { 'id': 186, 'countryName': 'Thailand', 'abbreviation': 'TH' },
      { 'id': 54, 'countryName': 'the former Yugoslav Republic of Macedonia', 'abbreviation': 'MK' },
      { 'id': 187, 'countryName': 'the Holy See', 'abbreviation': 'VA' },
      { 'id': 110, 'countryName': 'The Netherlands', 'abbreviation': 'NL' },
      { 'id': 243, 'countryName': 'Timor-Leste', 'abbreviation': 'TL' },
      { 'id': 244, 'countryName': 'Trinidad and Tobago', 'abbreviation': 'TT' },
      { 'id': 79, 'countryName': 'Tunisia', 'abbreviation': 'TN' },
      { 'id': 12, 'countryName': 'Turkey', 'abbreviation': 'TR' },
      { 'id': 14, 'countryName': 'Turkish Cypriot community', 'abbreviation': 'TC' },
      { 'id': 206, 'countryName': 'Turkmenistan', 'abbreviation': 'TM' },
      { 'id': 188, 'countryName': 'UAE - United Arab Emirates', 'abbreviation': 'AE' },
      { 'id': 71, 'countryName': 'Ukraine', 'abbreviation': 'UA' },
      { 'id': 114, 'countryName': 'United Kingdom', 'abbreviation': 'GB' },
      { 'id': 151, 'countryName': 'United States of America', 'abbreviation': 'US' },
      { 'id': 207, 'countryName': 'Uruguay', 'abbreviation': 'UY' },
      { 'id': 208, 'countryName': 'Uzbekistan', 'abbreviation': 'UZ' },
      { 'id': 245, 'countryName': 'Venezuela', 'abbreviation': 'VE' },
      { 'id': 199, 'countryName': 'Vietnam', 'abbreviation': 'VN' },
      { 'id': 189, 'countryName': 'Yemen', 'abbreviation': 'YE' },
      { 'id': 107, 'countryName': 'Éire Ireland', 'abbreviation': 'IE' }
    ];

    return data;
  }

  @Get('tmsweb/nationalities')
  getNationalityList(@Res() res: Response) {
    console.log('TMSWebRestrict/api/tmsweb/nationalities');

    createReadStream(path.join(__dirname, '../resources/json/tmsweb/nationalities.json')).pipe(res);
  }

  @Get('tmsweb/formal-addresses')
  getFormalAddress(): object {
    console.log('TMSWebRestrict/api/tmsweb/formal-addresses');
    const data = [
      {
        'id': 1,
        'name': 'Mr'
      },
      {
        'id': 2,
        'name': 'Ms'
      }
    ];

    return data;
  }

  @Get('tmsweb/get-allowed-fileTypes/:pkType')
  getAllowedFileTypes(@Headers('authorization') authorization: string,
                      @Param('pkType') pkType: number,
                      @Res() res: Response): void {
    console.log('TMSWebRestrict/api/tmsweb/get-allowed-fileTypes - Authorization: ' + authorization +
      ', pkType: ' + pkType);

    createReadStream(path.join(__dirname, '../resources/json/tmsweb/allowedFileTypes_' + pkType + '.json')).pipe(res);
  }

  @Get('captchaImg')
  getCaptchaImg(@Res() res: Response): void {
    console.log('TMSWebRestrict/api/captchaImg');

    createReadStream(path.join(__dirname, '../resources/json/tmsweb/captchaImg.json')).pipe(res);
  }

  @Get('reloadCaptchaImg/:captchaId')
  getReloadCaptchaImg(@Param('captchaId') captchaId: string, @Res() res: Response): void {
    console.log('TMSWebRestrict/api/reloadCaptchaImg');

    createReadStream(path.join(__dirname, '../resources/json/tmsweb/reloadCaptchaImg.json')).pipe(res);
  }

  @Post('validateCaptcha/:captchaId')
  validateCaptcha(@Param('captchaId') captchaId: string, @Body() body: any): object {
    console.log('TMSWebRestrict/api/validateCaptcha - Body: ' + JSON.stringify(body));
    const data = { "responseCaptcha": "success" };

    return data;
  }
}
