import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';

declare var SunCalc: any;
const day_ms = 24*60*60*1000;
const NUMBER_OF_HOURS = 24;
const font_color  = "white";
const line_width  = 4;

@Component({
  selector: 'clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {
  // @ViewContainerRef('clock') hostRef: any;
  @Input() public time = new Date();
  @Input() public place: any = null;
  public hours = Array(NUMBER_OF_HOURS).fill(0).map((_, i) => i);

  constructor() {
    // new SunCalc();
  }

  ngOnInit(): void {
    let time = new Date();
    let place = null;

    if (place == null) return

    // TODO: Move somewhere better
    const transparent = "transparent";
    let gradient;
    const day_color   = "rgb(62, 88, 128)";
    const night_color = "#222222";
    const day_ms = 24*60*60*1000;

    const sunTimes: any = this.getSunTimes(time, place);

    // Check day has sunrise & sunset
    if (!isNaN(sunTimes.sunrise) && !isNaN(sunTimes.sunset)) {

      // Set Gradients
      var sunriseAngle = this.getAngle(sunTimes.sunrise);
      var sunsetAngle  = this.getAngle(sunTimes.sunset);
      if ((sunTimes.sunset - sunTimes.sunrise) > (day_ms / 2)) {
          // Longer Day
          gradient = `linear-gradient(${sunriseAngle}rad, ${transparent} 50%, ${day_color} 50%),
                      linear-gradient(${sunsetAngle}rad, ${transparent} 50%, ${night_color} 50%)`;
      } else {
          // Longer Night
          gradient = `linear-gradient(${sunriseAngle}rad, ${night_color} 50%, ${transparent} 50%),
                      linear-gradient(${sunsetAngle}rad, ${transparent} 50%, ${night_color} 50%)`
      }
    } else {
      // sunrise_tag.innerHTML = "No Sunrise";
      // sunset_tag.innerHTML = "No Sunset";

      // Hack - should be a better way of doing this
      if (isNaN(sunTimes.night)) {
          gradient = `linear-gradient(0rad, ${day_color} 50%, ${day_color} 50%)`;
      } else {
          gradient = `linear-gradient(0rad, ${night_color} 50%, ${night_color} 50%)`;
      }

      // day_tag.style.backgroundImage = gradient;

      // Add Times
      this.addTime(time, 'now');
      this.addTime(sunTimes.solarNoon, 'solarnoon');
      // Tomorrow's nadir for nice Daylight Savings behaviour
      this.addTime(new Date(sunTimes.nadir.getTime() + day_ms), 'nadir');
    }


  }

  public getHourStyle(hour: number): any {
    const dp = 1000;
    const rotation = hour * 2 * Math.PI / NUMBER_OF_HOURS;
    const y = Math.round((Math.sin(rotation) * 36.6) * dp) / dp * -1;
    const x = Math.round((Math.cos(rotation) * 36.6) * dp) / dp;
    return {
      'transform': `translate(${y}vmin, ${x}vmin) rotate(${rotation}rad)`,
      'width': line_width+"px",
      'backgroundColor': font_color
    }
  }

  private getSunTimes(time: any, place: any): any {
    return SunCalc.getTimes(time, place.coords.latitude, place.coords.longitude);
  }

  private getAngle(date: Date): number {
    var ms = this.getDayMilliseconds(date);
    var circle_percent = ms/day_ms;
    return (circle_percent * 2*Math.PI) - Math.PI/2;
  }


  private addTime(time: any, name: any) {

    var today = new Date()

    var tag = document.getElementById(name);
    if (tag == null) {
        tag = document.createElement(name);
    }

    /*
    if (name === "now" && pretty_day(time) !== pretty_day(today)) {
        tag.style.display = "none";
    } else {
        var dp = 1000;
        var ms = this.getDayMilliseconds(time);

        var rotation = 2*Math.PI * (ms/day_ms);

        let y = Math.round((Math.sin(rotation) * 34.5)*dp) / dp * -1;
        let x = Math.round((Math.cos(rotation) * 34.5)*dp) / dp;

        tag.style.display = "block"
        tag.style.transform = `translate(${y}vmin, ${x}vmin) rotate(${rotation}rad)`;
        tag.style.width = line_width+"px";
        tag.className = "time";
        tag.id = name;
        day_tag.appendChild(tag);
    }
    */
}



  private getDayMilliseconds(date: Date): number {
    var ms = date.getHours()*60*60*1000;
    ms += date.getMinutes()*60*1000;
    ms += date.getSeconds()*1000;
    ms += date.getMilliseconds();
    return ms
  }
}
