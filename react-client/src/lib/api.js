export const getUserData = async () => {
  const res = await fetch("/user_info")
  if (!res.ok) {
    throw new Error("HTTP error " + res.status)
  }
  return res.json()
}

export const getTrips = async () => {
  const res = await fetch("/trips")
  
  if (!res.ok) {
    throw new Error("HTTP error " + res.status)
  }

  const data = await res.json()
  const sortedTrips = data.trips.sort((a, b) => {
    return new Date(b.date_created) - new Date(a.date_created)
  })
  return sortedTrips
}

export const postNewTrip = async (trip) => {
  const res = await fetch("/new_trip", {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify(trip)
  })

  if (!res.ok) {
    throw new Error("HTTP error " + res.status)
  }

  const data = await res.json()
  return data
}

export const deleteTrip = async (tripId) => {
  console.log(tripId)
  const res = await fetch("/delete_trip", {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify({"trip_id": tripId})
  })

  if (!res.ok) {
    throw new Error("HTTP error " + res.status)
  }
}

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

export const getFeed = async () => {
  const res = await fetch("/feed")
  if (!res.ok) {
    throw new Error("HTTP error " + res.status)
  }
  const data = res.json()
  return data
}
