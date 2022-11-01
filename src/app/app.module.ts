import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { ClockComponent } from './clock/clock.component';
import { TimeInputComponent } from './time-input/time-input.component';
import { PlaceInputComponent } from './place-input/place-input.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { suggestionsReducer, placeReducer } from './state/day.reducer';
import { DayEffects } from './state/day.effects';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    ClockComponent,
    TimeInputComponent,
    PlaceInputComponent
  ],
  imports: [
    BrowserModule,
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
      // time: timeReducer,
      place: placeReducer
    }),
    EffectsModule.forRoot([ DayEffects ]),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production})
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-NZ' },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
