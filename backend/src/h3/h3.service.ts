import { Injectable } from '@nestjs/common';
import * as h3 from 'h3-js';
import PriorityQueue from 'js-priority-queue';

console.log('PriorityQueue:', PriorityQueue);

@Injectable()
export class H3Service {
  // Conversion of geographical coordinates to h3 index
  latLngToCell(lat: number, lng: number, res: number): string {
    return h3.latLngToCell(lat, lng, res);
  }

  // Conversion of h3 index to geographical coordinates
  cellToLatLng(cell: string): [number, number] {
    return h3.cellToLatLng(cell);
  }

  // Get the boundary of an h3 cell
  cellToBoundary(
    cell: string,
    formatAsGeoJson: boolean = false,
  ): [number, number][] {
    return h3.cellToBoundary(cell, formatAsGeoJson);
  }

  // A*
  getShortestPath(
    startLat: number,
    startLng: number,
    goalLat: number,
    goalLng: number,
    res: number,
  ): string[] {
    interface Node {
      h3Index: string;
      cost: number;
      heuristic: number;
      parent?: Node;
    }

    const startH3Index = this.latLngToCell(startLat, startLng, res);
    const goalH3Index = this.latLngToCell(goalLat, goalLng, res);

    const haversineDistance = (h3Index1: string, h3Index2: string): number => {
      const [lat1, lon1] = this.cellToLatLng(h3Index1);
      const [lat2, lon2] = this.cellToLatLng(h3Index2);
      const toRadians = (deg: number) => (deg * Math.PI) / 180;
      const R = 6371; // earth radius in km
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const openSet = new PriorityQueue<Node>({
      comparator: (a, b) => a.cost + a.heuristic - (b.cost + b.heuristic),
    });

    openSet.queue({
      h3Index: startH3Index,
      cost: 0,
      heuristic: haversineDistance(startH3Index, goalH3Index),
    });

    const closedSet: Set<string> = new Set();
    const bestCosts: Map<string, number> = new Map();

    while (openSet.length > 0) {
      const current = openSet.dequeue()!;
      if (current.h3Index === goalH3Index) {
        const path: string[] = [];
        let node: Node | undefined = current;
        while (node) {
          path.unshift(node.h3Index);
          node = node.parent;
        }
        return path;
      }

      closedSet.add(current.h3Index);

      const neighbors = (h3 as any).kRing(current.h3Index, 1) as string[];
      for (const neighbor of neighbors) {
        if (closedSet.has(neighbor)) continue;

        const tentativeCost = current.cost + 1;
        const bestCost = bestCosts.get(neighbor);

        if (bestCost === undefined || tentativeCost < bestCost) {
          bestCosts.set(neighbor, tentativeCost);
          openSet.queue({
            h3Index: neighbor,
            cost: tentativeCost,
            heuristic: haversineDistance(neighbor, goalH3Index),
            parent: current,
          });
        }
      }
    }

    return [];
  }
}

export default H3Service;
