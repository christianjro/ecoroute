import React, {useState, useEffect} from 'react'

export default function ViewFriends() {
  const [friends, setFriends] = useState([])
  const [shouldRefetchFriends, setShouldRefetchFriends] = useState(false)

  useEffect(() => {
    fetch("/friends")
      .then(response => response.json())
      .then(data => setFriends(data.friends))
  }, [shouldRefetchFriends])

  function handleUnfriend(friend_id) {
    fetch("/delete_friendship", {
      method: "POST", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({friend_id})
    })
      .then(response => {
        if (response.status === 200) {
          setShouldRefetchFriends(prev => !prev)
        }
      })
  }

  const friendItems = friends.map(item => {
    return (
      <div key={item.id}>
        <h2>{item.friend_name}</h2>
        <button onClick={() => handleUnfriend(item.friend_id)}>Unfriend</button>
      </div>
    )
  })
  console.log(friends)

  return (
    <div>
        <h1>ViewFriends</h1>
        {friendItems}
    </div>
  )
}
