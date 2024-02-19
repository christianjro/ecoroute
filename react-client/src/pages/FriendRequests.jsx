import React from 'react';
import { useFriendRequestQuery, useUpdateFriendRequest } from '../store';

export default function FriendRequests() {
  const {data: friendRequests} = useFriendRequestQuery()
  const updateFriendRequest = useUpdateFriendRequest()


  function respondToFriendRequest(decision, request_id, sender_id) {
    updateFriendRequest.mutate({"decision": decision, "request_id": request_id, "sender_id": sender_id})
  }
    

  const receivedFriendRequestItems = friendRequests.received.map((item) => {
      return (
        <div key={item.id} className="card mx-auto mb-3 border-0">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title text-light mb-0">{item.sender}</h5>
              <p className="text-secondary mb-0">{item.sender_email}</p>
            </div>
            <div className="d-flex flex-column flex-sm-row">
              <button className="btn btn-success mb-2 mx-sm-2 mb-sm-0" onClick={() => respondToFriendRequest("accept", item.id, item.sender_id)}>Accept</button>
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
            <h5 className="card-title text-light mb-0">{item.recipient}</h5>
            <p className="text-secondary mb-0">{item.recipient_email}</p>
          </div>
          <p className="mb-0 text-secondary">Status: pending</p>
        </div>
      </div>
    )
  })

  return (
    <div>
        <h4 className="mt-5 mb-4 text-primary">Friend Requests</h4>
        <div className="row">
          <div className="col">
            <h5 className="my-2 text-light">Sent</h5>
            <div className="overflow-y-scroll p-4 bg-dark-subtle rounded-3" style={{height: "20rem"}}>
              {friendRequests.sent.length > 0 ? sentFriendRequestItems : <p>No requests</p>}
            </div>
          
          </div>
          <div className="col">
            <h5 className="my-2 text-light">Received</h5>
            <div className="overflow-y-scroll p-4 bg-dark-subtle rounded-3" style={{height: "20rem"}}>
              {friendRequests.received.length > 0 ? receivedFriendRequestItems : <p>No requests</p>}
            </div>
          </div>
        </div>
    </div>
  )
}
