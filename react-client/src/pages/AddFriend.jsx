import React, {useState} from 'react';

export default function AddFriend() {
  const [ recipient, setRecipient ] = useState({recipient_email: ""})

  function handleChange(event) {
    setRecipient(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name] : event.target.value
      }
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    fetch("/new_friend_request", {
      method: "POST", 
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(recipient)
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error("Could not send friend request")
        }
      })
  }

  return (
    <div>
        <h1>AddFriend</h1>

        <form onSubmit={handleSubmit}>
            <label htmlFor="recipientEmail">Friend Email:</label>
            <input id="recipientEmail" type="text" name="recipient_email" value={recipient.recipient_email} onChange={handleChange} />
            <button type="submit">Send Friend Request</button>
        </form>

    </div>
  )
}