import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // public time = new Date();
  // public place: any;

  constructor() {
  }

  public timeChanged(event: any): void {

  }

  public placeChanged(event: any): void {

  }

  ngOnInit(): void {
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(p => this.place = p);
    // }
    // console.log('start!')
  }
}
