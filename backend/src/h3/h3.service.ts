import { Injectable } from '@nestjs/common';
import * as h3 from 'h3-js';

@Injectable()
export class H3Service {
  //conversion of geographical coordinates to h3 index
  latLngtoCell(lat: number, lng: number, res: number): string {
    return h3.latLngToCell(lat, lng, res);
  }

  //conversion of h3 index to geographical coordinates
  cellTolatLng(cell: string): [number, number] {
    return h3.cellToLatLng(cell);
  }

  //get the boundary of an h3 cell

  cellToBoundary(
    cell: string,
    formatAsGeoJson: boolean = false,
  ): [number, number][] {
    return h3.cellToBoundary(cell, formatAsGeoJson);
  }
}
