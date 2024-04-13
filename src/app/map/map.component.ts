import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { geo } from '@here/maps-api-for-javascript';
import * as H from '@here/maps-api-for-javascript';
import { PinDialogComponent } from '../general/dialog/pin-dialog/pin-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  private map?: any;
  @Input() public zoom = 2;
  @Input() public lat = 0;
  @Input() public lng = 0;
  isMarker: boolean = false;
  markers: any[] = [];
  @ViewChild('map') mapDiv?: ElementRef;
  private timeoutHandle: any;
  @Output() notify = new EventEmitter();
  @Output() hitPoint = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  openDialog(data: any, marker?: any) {
    const dialogRef = this.dialog.open(PinDialogComponent, {
      width: '600px',
      data: { data }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.removeMarker(marker);
        this.hitPoint.emit(this.markers);
      }
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
        if (changes['lat'] !== undefined || changes['lng'] !== undefined) {
          this.map.setCenter({
            lat: changes['lat']?.currentValue || this.lat,
            lng: changes['lng']?.currentValue || this.lng,
          });
        }
      }
    }, 100);
  }

  ngAfterViewInit(): void {
    if (!this.map && this.mapDiv) {
      const platform = new H['default'].service.Platform({
        apikey: 'vJrfbfUY7UlHCvjAWR9maP3ggf9ES1dGcEBYaDNYAZ4',
      });
      const defaultLayers: any = platform.createDefaultLayers();
      const map = new H['default'].Map(
        this.mapDiv.nativeElement,
        defaultLayers.raster.normal.map,
        {
          pixelRatio: window.devicePixelRatio,
          center: { lat: 21.7679, lng: 78.8718 },
          politicalview: "IND",
          zoom: 4
        }
      );

      const ui = H['default'].ui.UI.createDefault(map, defaultLayers);

      window.addEventListener('resize', () => map.getViewPort().resize());

      this.map = map;
      map.addEventListener('mapviewchange', (ev: H.map.ChangeEvent) => {
        this.notify.emit(ev);
      });
      map.addEventListener('tap', (ev: any) => {
        const coordinates = map.screenToGeo(
          ev.currentPointer.viewportX,
          ev.currentPointer.viewportY
        );
        this.reverseGeocode(coordinates.lat, coordinates.lng, platform);
      });

      new H['default'].mapevents.Behavior(new H['default'].mapevents.MapEvents(map));
    }
  }

  addMarker(lat: any, lng: any, result: any) {
    const icon = new H['default'].map.Icon('../../assets/location-pin.png', {
      size: { w: 50, h: 50 },
    });

    const marker = new H['default'].map.Marker({ lat, lng }, { data: result, icon });

    const self = this;
    marker.addEventListener('tap', function (evt: any) {
      self.openDialog(result, marker);
      self.isMarker = true;
    });

    if (!this.isMarker) {
      this.map.addObject(marker);
      this.markers.push(marker);
      this.hitPoint.emit(this.markers);
      this.isMarker = false;
    }
  }

  removeMarker(marker: any) {
    this.map.removeObject(marker);
    const index = this.markers.findIndex((element: any) => element === marker);
    this.markers.splice(index, 1);
  }

  reverseGeocode(lat: any, lng: any, platform: any) {
    const geocoder = platform.getSearchService();
    const reverseGeocodingParameters = {
      at: lat + ',' + lng,
      limit: '1',
    };

    geocoder.reverseGeocode(
      reverseGeocodingParameters,
      (result: any) => {
        this.addMarker(lat, lng, result.items[0]);
      },
      this.onError
    );
  }

  onError(error: any) {
    alert("Can't reach the remote server");
  }
}
