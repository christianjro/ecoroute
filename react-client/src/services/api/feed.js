export const feedService = {
    getFeed: async () => {
        const res = await fetch("/feed")
        if (!res.ok) {
            throw new Error("HTTP error " + res.status)
        }
        const data = res.json()
        return data
    }
}