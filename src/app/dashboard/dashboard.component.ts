import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PinDialogComponent } from '../general/dialog/pin-dialog/pin-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
markers:any[]= [];
  constructor(private router: Router , private dialog : MatDialog) {
    this.zoom = 5;
    this.lat = 0;
    this.lng = 0;
  }

  logout() {
    this.router.navigate(['login']);
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
  openPinDialog(data: any){
    const dialogRef = this.dialog.open(PinDialogComponent, {
      width: '600px',
      data: {data: data.data}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  handleMapClick(event: any[]) {
    console.log(999, event);
    this.markers= event;
  }
  getRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
