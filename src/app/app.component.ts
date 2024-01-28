import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'here-maps';
  zoom: number;
  lat: number;
  lng: number;

  constructor() {
    this.zoom = 5;
    this.lat = 0;
    this.lng = 0;
  }

  // * Function Responsible for drag and zoom in the Here maps.
  handleMapChange(event: H.map.ChangeEvent) {
    if (event.newValue.lookAt) {
      const lookAt = event.newValue.lookAt;
      this.zoom = lookAt.zoom;
      this.lat = lookAt.position.lat;
      this.lng = lookAt.position.lng;
    }
  }

  handleMapClick(event: H.map.HitArea) {
    console.log(999, event);
  }
}
