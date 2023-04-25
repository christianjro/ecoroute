import React, {useState, useEffect} from 'react';

export default function FriendRequests() {

  const [friendRequests, setFriendRequests] = useState({"received": [], "sent": []})
  const [shouldRefetchFriendRequests, setShouldRefetchFriendRequests] = useState(false)

  useEffect(() => {
    fetch("/friend_requests")
      .then(response => response.json())
      .then(data => setFriendRequests(data))
      // .then(data => console.log(data))
      // setFriendRequests(data)
  }, [shouldRefetchFriendRequests])

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
        {item.status === "pending" 
        &&
        <div>
          <h3>From: {item.sender}</h3>
          <button onClick={() => respondToFriendRequest("accept", item.id, item.sender_id)}>Accept</button>
          <button onClick={() => respondToFriendRequest("decline", item.id, item.sender_id)}>Decline</button>
        </div>
        }
      </div>
    )
  })

  const sentFriendRequestItems = friendRequests.sent.map((item) => {
    return (
      <div key={item.id}>
        {item.status === "pending" 
        && 
        <div>
          <h3>To: {item.recipient}</h3>
          <h3>Status: pending</h3>
        </div>
        }
      </div>
    )
  })

  return (
    <div>
        <h1>FriendRequests</h1>

        <h2>Sent</h2>
        {sentFriendRequestItems}
        <h2>Received</h2>
        {receivedFriendRequestItems}
    </div>
  )
}
