import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { MS_PER_HOUR, MS_PER_MINUTE } from './day.consts';
import { hasSunriseAndSunset, SunTimesType } from './types/sunTimes.type';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public daylightTime$ = new Subject<string>();

  public onNewSunTimes(sunTimes: SunTimesType): void {
    if (!hasSunriseAndSunset(sunTimes)) {
      this.daylightTime$.next((isNaN(sunTimes.night.getTime())) ? '24h' : '0h');
    } else {
      const diff = sunTimes.sunset.getTime() - sunTimes.sunrise.getTime();
      const hours = Math.floor(diff / MS_PER_HOUR);
      let result = `${hours}h`;	
      const minutes = Math.floor((diff - (hours * MS_PER_HOUR)) / MS_PER_MINUTE);
      if (minutes > 0) {
        result += ` ${minutes}m`;
      }
      this.daylightTime$.next(result);
    }
  }
}
