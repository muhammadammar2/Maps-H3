const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibWFtbWFyMiIsImEiOiJjbHk4dTgyd2wwbDE2MmlxNDgxbTJ5dXhxIn0.BecbQfFcXIHsSY_mFFNBBg";

export const fetchShortestPath = async (
  startLat: string,
  startLng: string,
  endLat: string,
  endLng: string
): Promise<any> => {
  const response = await fetch(
    `http://localhost:4000/h3/shortestPath?startLat=${startLat}&startLng=${startLng}&goalLat=${endLat}&goalLng=${endLng}&res=9`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch shortest path: ${response.statusText}`);
  }
  return response.json();
};

export const fetchCoordinates = async (
  cell: string
): Promise<[number | undefined, number | undefined]> => {
  try {
    const response = await fetch(
      `http://localhost:4000/h3/cellToLatLng?cell=${cell}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch coordinates for cell ${cell}: ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length !== 2) {
      throw new Error(
        `Invalid data format for cell ${cell}: ${JSON.stringify(data)}`
      );
    }

    return [data[0], data[1]];
  } catch (error) {
    console.error(`Error fetching coordinates for cell ${cell}:`, error);
    return [undefined, undefined];
  }
};

export const geocodeLocation = async (
  location: string
): Promise<[number, number]> => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      location
    )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
  );
  const data = await response.json();
  if (data.features && data.features.length > 0) {
    const [lng, lat] = data.features[0].center;
    return [lat, lng];
  }
  throw new Error("Location not found");
};
