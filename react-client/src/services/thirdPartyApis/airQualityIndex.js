export const getAirQualityIndex = async (location) => {
    const airNowAPIKey = process.env.REACT_APP_AIRNOW_API_KEY
    const url = `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${location.latitude}&longitude=${location.longitude}&distance=30&API_KEY=${airNowAPIKey}`
  
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error("HTTP error " + res.status)
    }
    const data = await res.json()
    return data[0]
}