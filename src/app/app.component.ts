import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { hasSunriseAndSunset, SunTimesType } from './types/sunTimes.type';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public daylightTime$ = new Subject<Date>();

  public onNewSunTimes($event: SunTimesType): void {
    console.log($event);
    if (hasSunriseAndSunset($event)) {
      const diff = $event.sunset.getTime() - $event.sunrise.getTime();
      this.daylightTime$.next(new Date(diff));
    } else {
      this.daylightTime$.next(new Date(0));
    }
  }
}
