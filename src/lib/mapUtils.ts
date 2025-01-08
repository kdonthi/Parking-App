export const getLocationName = async (lat: number, lng: number): Promise<string> => {
  const accessToken = 'pk.eyJ1Ijoia2F1c2hpa2RyIiwiYSI6ImNtNW1yNHlqbDAzOTYya3E2MWI3ajBkZzYifQ.rX-4rgYQIUsBrJP8gU0IcA';
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.features[0]?.place_name || "My Parking Spot";
  } catch (error) {
    console.error("Error getting location name:", error);
    return "My Parking Spot";
  }
};