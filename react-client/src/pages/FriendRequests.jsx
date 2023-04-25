import React, {useState, useEffect} from 'react';

export default function FriendRequests() {

  const [friendRequests, setFriendRequests] = useState({"received": [], "sent": []})
  const [shouldRefetchFriendRequests, setShouldRefetchFriendRequests] = useState(false)

  useEffect(() => {
    fetch("/friend_requests")
      .then(response => response.json())
      // .then(data => setFriendRequests(data))
      // .then(data => console.log(data))
      .then(data => {
        const received_pending = []
        const received_all = data.received
        for(const i in received_all) {
          if (received_all[i].status === "pending") {
            received_pending.push(received_all[i])
          }
        }

        const sent_pending = []
        const sent_all = data.sent
        for(const i in sent_all) {
          if (sent_all[i].status === "pending") {
            sent_pending.push(sent_all[i])
          }
        }

        setFriendRequests({"received": received_pending, "sent": sent_pending})
      })
      // setFriendRequests(data)
  }, [shouldRefetchFriendRequests])

  console.log(friendRequests)


  function respondToFriendRequest(decision, request_id, sender_id) {
    fetch("/respond_to_friend_request", {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({"decision": decision, "request_id": request_id, "sender_id": sender_id})
    })
      .then(response => {
        if (response.status === 200) {
          setShouldRefetchFriendRequests(prev => !prev)
          // return response.json()
        } else {
          throw new Error("Could not respond to friend request.")
        }
      })
      
  }
    

  const receivedFriendRequestItems = friendRequests.received.map((item) => {
      return (
        <div key={item.id}>
          <h3>From: {item.sender}</h3>
          <button onClick={() => respondToFriendRequest("accept", item.id, item.sender_id)}>Accept</button>
          <button onClick={() => respondToFriendRequest("decline", item.id, item.sender_id)}>Decline</button>
        </div>
      )
  })

  const sentFriendRequestItems = friendRequests.sent.map((item) => {
    return (
      <div key={item.id}>
          <h3>To: {item.recipient}</h3>
          <h3>Status: pending</h3>
      </div>
    )
  })

  return (
    <div>
        <h1>FriendRequests</h1>

        <h2>Sent</h2>
        {friendRequests.sent.length > 0 ? sentFriendRequestItems : <p>No requests</p>}
        <h2>Received</h2>
        {friendRequests.received.length > 0 ? receivedFriendRequestItems : <p>No requests</p>}
    </div>
  )
}
