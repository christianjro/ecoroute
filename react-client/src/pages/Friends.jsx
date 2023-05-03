import React, {useState, useEffect} from 'react'
import ViewFriends from './ViewFriends';
import AddFriend from './AddFriend';
import FriendRequests from './FriendRequests';

export default function Friends() {
  return (
    <div>
      <FriendRequests />
      <AddFriend />
      <ViewFriends />
    </div>
  )
}
