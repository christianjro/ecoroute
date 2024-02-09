export const vehicleService = {
    createVehicle: async (newVehicle) => {
        const res = await fetch("/new_vehicle", {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newVehicle)
        })
        if (!res.ok) {
            throw new Error("HTTP error " + res.status)
        }
        const data = await res.json()
        return data
    },
    updateVehicle: async (newVehicle) => {
        const res = await fetch("/update_vehicle", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newVehicle)
        })
        if (!res.ok) {
            throw new Error("HTTP error " + res.status)
        }
        const data = await res.json()
        return data
    }
}