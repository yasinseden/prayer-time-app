import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { BodyComponent } from './body/body.component';
import { DiyanetApiInterceptor } from './diyanet-api.interceptor';
import { DataControlService } from './services/data-control.service';
import { FormsModule } from '@angular/forms';
import { CountdownComponent } from './countdown/countdown.component';

export function appInitializerFactory(dataControService: DataControlService) {
  return () => dataControService.appInitialization();
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    CountdownComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DiyanetApiInterceptor,
      multi: true
    },
    DataControlService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [DataControlService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
