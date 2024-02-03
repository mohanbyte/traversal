import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  title = 'here-maps';
  zoom: number;
  lat: number;
  lng: number;

  constructor(private router: Router) {
    this.zoom = 5;
    this.lat = 0;
    this.lng = 0;
  }

  logout() {
    this.router.navigate(['login']);
  }
  // // * Function Responsible for drag and zoom in the Here maps.
  // handleMapChange(event: H.map.ChangeEvent) {
  //   if (event.newValue.lookAt) {
  //     const lookAt = event.newValue.lookAt;
  //     this.zoom = lookAt.zoom;
  //     this.lat = lookAt.position.lat;
  //     this.lng = lookAt.position.lng;
  //   }
  // }

  // handleMapClick(event: H.map.HitArea) {
  //   console.log(999, event);
  // }
  getRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
