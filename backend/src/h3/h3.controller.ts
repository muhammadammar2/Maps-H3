import { Controller, Get, Query } from '@nestjs/common';
import { H3Service } from './h3.service';
// import { latLngToCell } from 'h3-js';

@Controller('h3')
export class H3Controller {
  constructor(private readonly h3Service: H3Service) {}

  @Get('latLngToCell')
  latLngtoCell(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('res') res: string,
  ) {
    return this.h3Service.latLngtoCell(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(res),
    );
  }

  @Get('cellToLatlng')
  cellToLatlng(@Query('cell') cell: string) {
    return this.h3Service.cellTolatLng(cell);
  }

  @Get('cellToBoundary')
  cellToBoundary(
    @Query('cell') cell: string,
    @Query('formatAsGeoJson') formatAsGeoJson: string,
  ) {
    return this.h3Service.cellToBoundary(cell, formatAsGeoJson === 'true');
  }

  @Get('shortestPath')
  getShortestPath(
    @Query('startLat') startLat: string,
    @Query('startLng') startLng: string,
    @Query('goalLat') goalLat: string,
    @Query('goalLng') goalLng: string,
    @Query('res') res: string,
  ) {
    return this.h3Service.getShortestPath(
      parseFloat(startLat),
      parseFloat(startLng),
      parseFloat(goalLat),
      parseFloat(goalLng),
      parseInt(res, 10),
    );
  }
}
