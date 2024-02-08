export const tripService = {
    getTrips: async () => {
        const res = await fetch("/trips")
        if (!res.ok) {
            throw new Error("HTTP error " + res.status)
        }
        const data = await res.json()
        const sortedTrips = data.trips.sort((a, b) => {
            return new Date(b.date_created) - new Date(a.date_created)
        })
        return sortedTrips
    },

    createTrip: async (trip) => {
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
    },

    deleteTrip: async (tripId) => {
        const res = await fetch("/delete_trip", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({"trip_id": tripId})
        })
        if (!res.ok) {
            throw new Error("HTTP error " + res.status)
        }
    }
}