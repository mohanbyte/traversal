import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import * as H from '@here/maps-api-for-javascript';
import { PinDialogComponent } from '../dashboard/pin-dialog/pin-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../general/confirm-dialog/confirm-dialog.component';

interface GeocodeResult {
  items: { position: H.geo.Point }[]; // Define the structure of 'items' array
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  private map?: any;
  private platform: any;
  @Input() public zoom = 2;
  @Input() public lat = 0;
  @Input() public lng = 0;
  isMarker: boolean = false;
  markers: any[] = [];
  locallyStoredMarkers = [];
  @ViewChild('map') mapDiv?: ElementRef;
  private timeoutHandle: any;
  @Output() notify = new EventEmitter();
  @Output() hitPoint = new EventEmitter();
  searchQuery: string = '';
  searchOptions: any[] = [];

  constructor(public dialog: MatDialog) {}

  openDialog(data: any, marker?: any) {
    const dialogRef = this.dialog.open(PinDialogComponent, {
      width: '750px',
      data: { data },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.removeMarker(marker);
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
      this.platform = new H['default'].service.Platform({
        apikey: 'vJrfbfUY7UlHCvjAWR9maP3ggf9ES1dGcEBYaDNYAZ4',
      });
      const defaultLayers: any = this.platform.createDefaultLayers();
      const map = new H['default'].Map(
        this.mapDiv.nativeElement,
        defaultLayers.raster.normal.map,
        {
          pixelRatio: window.devicePixelRatio,
          center: { lat: 21.7679, lng: 78.8718 },
          politicalview: 'IND',
          zoom: 4,
        }
      );

      const ui = H['default'].ui.UI.createDefault(map, defaultLayers);

      window.addEventListener('resize', () => map.getViewPort().resize());

      this.map = map;
      const addedMarkers = JSON.parse(window.localStorage.getItem('markers'));
      if (addedMarkers && addedMarkers.length) {
        for (let mark of addedMarkers) {
          let [lat, lng, result] = mark;
          this.addMarker(lat, lng, result);
        }
        // this.markers = addedMarkers;
        this.locallyStoredMarkers = addedMarkers;
      }
      map.addEventListener('mapviewchange', (ev: H.map.ChangeEvent) => {
        this.notify.emit(ev);
      });
      map.addEventListener('tap', (ev: any) => {
        const coordinates = map.screenToGeo(
          ev.currentPointer.viewportX,
          ev.currentPointer.viewportY
        );
        this.reverseGeocode(coordinates.lat, coordinates.lng, this.platform);
      });

      new H['default'].mapevents.Behavior(
        new H['default'].mapevents.MapEvents(map)
      );
    }
  }

  addMarker(lat: any, lng: any, result: any) {
    const icon = new H['default'].map.Icon('../../assets/location-pin.png', {
      size: { w: 50, h: 50 },
    });
    this.locallyStoredMarkers.push([lat, lng, result]);
    window.localStorage.setItem(
      'markers',
      JSON.stringify(this.locallyStoredMarkers)
    );
    const marker = new H['default'].map.Marker(
      { lat, lng },
      { data: result, icon }
    );

    const self = this;
    marker.addEventListener('tap', function (evt: Event) {
      evt.stopPropagation();
      self.openDialog(result, marker);
      //self.isMarker = true;
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

    console.log(this.markers, 'removeMarkerbefore');
    this.locallyStoredMarkers.splice(index, 1);
    window.localStorage.setItem(
      'markers',
      JSON.stringify(this.locallyStoredMarkers)
    );
    this.markers.splice(index, 1);
    console.log(this.markers, 'removeMarker');
    this.hitPoint.emit(this.markers);
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
        if (result.items.length) this.addMarker(lat, lng, result.items[0]);
        else this.dialog.open(ConfirmDialogComponent);
      },
      this.onError
    );
  }

  onError(error: any) {
    alert("Can't reach the remote server");
  }

  fillSearchOptions(event) {
    if (event.target.value === '') {
      return;
    }

    const service = this.platform.getSearchService();
    service.geocode(
      {
        q: event.target.value,
      },
      (result: GeocodeResult) => {
        // Clear previous map objects
        this.map.removeObjects(this.map.getObjects());
        this.searchOptions = result.items;
      },
      (error) => {
        console.error('Error searching for location:', error);
      }
    );
  }

  searchLocation(event): void {
    if (event === '') {
      return;
    }
    this.searchQuery = event;
    // Use Geocoding and Search API to find locations
    const service = this.platform.getSearchService();
    service.geocode(
      {
        q: event,
      },
      (result: GeocodeResult) => {
        // Clear previous map objects
        this.map.removeObjects(this.map.getObjects());
        // Zoom to the first result
        if (result.items.length > 0) {
          this.map.setCenter(result.items[0].position);
          this.map.setZoom(14);
        }

        this.searchOptions = [];
      }
    );
  }
}
