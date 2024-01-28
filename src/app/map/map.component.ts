import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import H from '@here/maps-api-for-javascript';
import onResize from 'simple-element-resize-detector';
import { PinDialogComponent } from '../general/dialog/pin-dialog/pin-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  private map?: H.Map;
  @Input() public zoom = 2;
  @Input() public lat = 0;
  @Input() public lng = 0;

  isMarker: boolean = false;

  @ViewChild('map') mapDiv?: ElementRef;

  private timeoutHandle: any;
  @Output() notify = new EventEmitter();
  @Output() hitPoint = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(PinDialogComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
      this.isMarker = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    clearTimeout(this.timeoutHandle);
    this.timeoutHandle = setTimeout(() => {
      if (this.map) {
        if (changes['zoom'] !== undefined) {
          this.map.setZoom(changes['zoom'].currentValue);
        }
        if (changes['lat'] !== undefined) {
          this.map.setCenter({
            lat: changes['lat'].currentValue,
            lng: this.lng,
          });
        }
        if (changes['lng'] !== undefined) {
          this.map.setCenter({
            lat: this.lat,
            lng: changes['lng'].currentValue,
          });
        }
      }
    }, 100);
  }

  ngAfterViewInit(): void {
    let self = this;
    if (!this.map && this.mapDiv) {
      // Instantiate a platform, default layers and a map as usual.
      const platform = new H.service.Platform({
        apikey: 'KyObo0tFQfwTCFr5mtbgvvT6KxicyFV5tYSGNoz0_Fw',
      });
      const layers = platform.createDefaultLayers();
      const map = new H.Map(
        this.mapDiv.nativeElement,
        // Add type assertion to the layers object...
        // ...to avoid any Type errors during compilation.
        (layers as any).vector.normal.map,
        {
          pixelRatio: window.devicePixelRatio,
          center: { lat: 28, lng: 77 },
          zoom: 5,
        }
      );

      onResize(this.mapDiv.nativeElement, () => {
        map.getViewPort().resize();
      });
      this.map = map;
      map.addEventListener('mapviewchange', (ev: H.map.ChangeEvent) => {
        this.notify.emit(ev);
      });
      map.addEventListener('tap', (ev: any) => {
        var coordinates = map.screenToGeo(
          ev.currentPointer.viewportX,
          ev.currentPointer.viewportY
        );

        // Put Marker on the latitude and longitude
        var icon = new H.map.Icon('../../assets/location-pin.png', {
          size: { w: 50, h: 50 },
        });
        var marker = new H.map.Marker(
          {
            lat: coordinates!.lat || 0,
            lng: coordinates!.lng || 0,
          },
          { data: 'Destination', icon: icon }
        );

        marker.addEventListener('tap', function (evt: any) {
          self.openDialog();
          self.isMarker = true;
        });

        if (!self.isMarker) {
          map.addObject(marker);
          self.isMarker = false;
        }
      });
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    }
  }
}
