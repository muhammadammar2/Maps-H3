import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import PathForm from "./PathForm";
import { fetchShortestPath, fetchCoordinates, geocodeLocation } from "../api";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFtbWFyMiIsImEiOiJjbHk4dTgyd2wwbDE2MmlxNDgxbTJ5dXhxIn0.BecbQfFcXIHsSY_mFFNBBg";

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [pathData, setPathData] = useState<string[]>([]);

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [73.0479, 33.6844], // Islamabad, Pakistan
        zoom: 9, // Set the initial zoom level
      });
    }
  }, []);

  useEffect(() => {
    if (map.current && pathData.length > 0) {
      const loadCoordinates = async () => {
        try {
          const coordinates = await Promise.all(
            pathData.map(async (cell: string) => {
              const coords = await fetchCoordinates(cell);
              console.log(`Coordinates for cell ${cell}:`, coords); // Debug log
              if (
                !coords ||
                coords.length !== 2 ||
                coords.includes(undefined)
              ) {
                console.warn(`Invalid coordinates for cell ${cell}:`, coords);
                throw new Error(`Invalid coordinates for cell: ${cell}`);
              }
              return coords;
            })
          );

          // Check if the source already exists
          if (map.current?.getSource("route")) {
            map.current.removeLayer("route");
            map.current.removeSource("route");
          }

          map.current?.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: coordinates,
              },
            },
          });

          map.current?.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#888",
              "line-width": 8,
            },
          });
        } catch (error) {
          console.error("Error loading coordinates:", error);
        }
      };

      loadCoordinates();
    }
  }, [pathData]);

  const handlePathSearch = async (
    startLocation: string,
    endLocation: string
  ) => {
    try {
      const [startLat, startLng] = await geocodeLocation(startLocation);
      const [endLat, endLng] = await geocodeLocation(endLocation);

      const data = await fetchShortestPath(
        startLat.toString(),
        startLng.toString(),
        endLat.toString(),
        endLng.toString()
      );
      console.log("Path data:", data); // Log the received data
      setPathData(data);
    } catch (error) {
      console.error("Error fetching path:", error);
    }
  };

  return (
    <div>
      <PathForm onSearch={handlePathSearch} />
      <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default MapComponent;
