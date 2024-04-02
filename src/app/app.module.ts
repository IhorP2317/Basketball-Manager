import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedComponentsModule } from './shared/components/shared-components.module';
import { AppRoutingModule } from './app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedComponentsModule,
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
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
