import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment';
import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';
import { PopUpContentDirective } from './shared/directives/pop-up-content.directive';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    MatIconModule,
    HttpClientModule,
    MatSelectCountryModule.forRoot('en'),
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: 'apiUrl',
      useValue: environment.apiUrl,
    },
    {
      provide: 'securityUrl',
      useValue: environment.securityUrl,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    DatePipe,
    provideCharts(withDefaultRegisterables()),
  ],
  bootstrap: [AppComponent],
  exports: [PopUpContentDirective],
})
export class AppModule {}
