import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { DateAdapter, MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { AppComponent } from './app.component';
import { ClockComponent } from './clock/clock.component';
import { TimeInputComponent } from './time-input/time-input.component';
import { PlaceInputComponent } from './place-input/place-input.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { suggestionsReducer, placeReducer, timeReducer, firstLoadPlaceIdReducer } from './state/day.reducer';
import { DayEffects } from './state/day.effects';

import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'D MMMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'D MMMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    ClockComponent,
    TimeInputComponent,
    PlaceInputComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    StoreModule.forRoot({
      suggestedLocations: suggestionsReducer,
      time: timeReducer,
      place: placeReducer,
      firstLoadPlaceId: firstLoadPlaceIdReducer
    }),
    EffectsModule.forRoot([ DayEffects ]),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production})
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
