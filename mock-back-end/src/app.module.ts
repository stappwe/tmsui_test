import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/logger.middleware';
import { SearchController } from './search/search.controller';
import { EdbController } from './edb/edb.controller';
import { TMSWEBAppController } from './tmswebApp/tmswebApp.controller';
import { AppFormController } from './app-form/app-form.controller';
import { LibraryController } from './library/library.controller';
import { PaxController } from './pax/pax.controller';
import { SpeakerController } from './speaker/speaker.controller';
import { HttpErrorFilter } from './common/http-error.filter';
import { LoggingInterceptor } from './common/logging.interceptor';
import { TwinningController } from './twinning/twinning.controller';
import { UserController } from './user/user.controller';
import { GeneralController } from './general/general.controller';
import { DashboardController } from './dashboard/dashboard.controller';
import { EventMaterialController } from './event-material/event-material.controller';
import { ParticipantController } from './participant/participant.controller';
import { TasksController } from './tasks/tasks.controller';
import { FinancialController } from './financial/financial.controller';
import { TMSAppController } from './tmsApp/tmsApp.controller';
import { EvaluationController } from './evaluation/evaluation.controller';
import { EventDocumentController } from './event-document/event-document.controller';
import { ReportController } from './report/report.controller';
import { RegisterController } from './register/register.controller';
import { ParticipantPortalController } from './participant-portal/participant-portal.controller';
import { EventsController } from './events/eventsController';
import { MulterModule } from '@nestjs/platform-express';
import { PresentationsController } from './event-document/presentations.controller';
import { EventPeopleController } from './event-people/event-people.controller';
import { EventExpertController } from './event-expert/event-expert.controller';
import { EventTravelController } from './event-travel/event-travel.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    })
  ],
  controllers: [AppController, SearchController, EdbController, TMSWEBAppController, AppFormController, LibraryController,
    PaxController, SpeakerController, TwinningController, UserController, GeneralController, DashboardController,
    EventMaterialController, ParticipantController, FinancialController, TasksController, TMSAppController, EvaluationController,
    EventDocumentController, EventsController, EventPeopleController, ReportController, RegisterController, ParticipantPortalController,
    PresentationsController, EventExpertController, EventTravelController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    AppService
  ],
})
export class AppModule implements NestModule {
  constructor() {
    console.log('started');
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('TMSWebRestrict/api', 'Twinning/api');
  }
}
