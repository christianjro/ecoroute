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
        <div key={item.id} className="card mx-auto mb-3 border-0">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title mb-0">{item.sender}</h5>
              <p className="text-secondary mb-0">{item.sender_email}</p>
            </div>
            <div>
              <button className="btn btn-success mx-2" onClick={() => respondToFriendRequest("accept", item.id, item.sender_id)}>Accept</button>
              <button className="btn btn-danger" onClick={() => respondToFriendRequest("decline", item.id, item.sender_id)}>Decline</button>
            </div>
          </div>
        </div>
      )
  })

  const sentFriendRequestItems = friendRequests.sent.map((item) => {
    return (
      <div key={item.id} className="card mx-auto mb-3 border-0">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title mb-0">{item.recipient}</h5>
            <p className="text-secondary mb-0">{item.recipient_email}</p>
          </div>
          <p className="mb-0">Status: pending</p>
        </div>
      </div>
    )
  })

  return (
    <div className="mb-5">
        <h4>Friend Requests</h4>
        <div className="row">
          <div className="col">
            <h5>Sent</h5>
            <div className="overflow-y-scroll p-4 bg-body-secondary rounded-3" style={{height: "20rem"}}>
              {friendRequests.sent.length > 0 ? sentFriendRequestItems : <p>No requests</p>}
            </div>
          
          </div>
          <div className="col">
            <h5>Received</h5>
            <div className="overflow-y-scroll p-4 bg-body-secondary rounded-3" style={{height: "20rem"}}>
              {friendRequests.received.length > 0 ? receivedFriendRequestItems : <p>No requests</p>}
            </div>
          </div>
        </div>
    </div>
  )
}
