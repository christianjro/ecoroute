export const userService = {
    getUserData: async () => {
        const res = await fetch("/user_info")
        if (!res.ok) {
            throw new Error("HTTP error " + res.status)
        }
        return res.json()
    }
}