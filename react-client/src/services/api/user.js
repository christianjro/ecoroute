export const userService = {
    getUserData: async () => {
        const res = await fetch("/user_info")
        if (!res.ok) {
            throw new Error("HTTP error " + res.status)
        }
        return res.json()
    },
    createUser: async (formData) => {
        const res = fetch("/signup", {
            method: "POST", 
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(formData)
          })
          if (!res.ok) {
            throw new Error("HTTP error " + res.status)
          }
          return res.json()
    }
}