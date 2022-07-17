import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import { AppComponent } from './app.component';
import { ClockComponent } from './clock/clock.component';
import { TimeInputComponent } from './time-input/time-input.component';
import { PlaceInputComponent } from './place-input/place-input.component';

@NgModule({
  declarations: [
    AppComponent,
    ClockComponent,
    TimeInputComponent,
    PlaceInputComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule
    // MatLabelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
