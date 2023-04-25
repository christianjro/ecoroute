import React, {useState, useEffect} from 'react'

export default function ViewFriends() {
  const [friends, setFriends] = useState([])

  useEffect(() => {
    fetch("/friends")
      .then(response => response.json())
      .then(data => setFriends(data.friends))
  }, [])

  const friendItems = friends.map(item => {
    return (
      <div key={item.id}>
        <h2>{item.friend_name}</h2>
      </div>
    )
  })

  return (
    <div>
        <h1>ViewFriends</h1>
        {friendItems}
    </div>
  )
}
