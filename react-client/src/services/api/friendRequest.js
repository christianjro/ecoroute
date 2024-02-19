export const friendRequestService = {
    getFriendRequests: async () => {
        const res = await fetch("/friend_requests")
        if (!res.ok) {
            throw new Error("HTTP error " + res.status)
        }
        const data = await res.json()
        const received_pending = []
        const received_all = data.received
        for (const i in received_all) {
            if (received_all[i].status === "pending") {
                received_pending.push(received_all[i])
            }
        }

        const sent_pending = []
        const sent_all = data.sent
        for (const i in sent_all) {
            if (sent_all[i].status === "pending") {
                sent_pending.push(sent_all[i])
            }
        }
        return {"received": received_pending, "sent": sent_pending}
    }, 
    createFriendRequest: async (recipientEmail) => {
        const res = await fetch ("/new_friend_request", {
            method: "POST", 
            headers: {"Content-Type" : "application/json"}, 
            body: JSON.stringify(recipientEmail)
        })
        if (!res.ok) {
            throw new Error("HTTP error " + res.status)
        }
    }, 
    respondToFriendRequest: async (decision, request_id, sender_id) => {
        const res = await fetch ("/respond_to_friend_request", {
            method: "POST", 
            headers: {"Content-Type" :  "application/json"}, 
            body: JSON.stringify({"decision": decision, "request_id": request_id, "sender_id": sender_id})
        })
        if (!res.ok) {
            throw new Error("HTTP error " + res.status)
        }
        return res.json()
    }
}