import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddFriend() {
  const navigate = useNavigate()
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
    navigate("/dashboard")
  }

  return (
    <div className="container">
        <h1>AddFriend</h1>
        
        <div className="container mt-5" style={{maxWidth: '30rem'}}>
          <form onSubmit={handleSubmit}>
            <label class="form-label" htmlFor="recipientEmail">Friend Email:</label>
            <input className="form-control mb-3" id="recipientEmail" type="text" name="recipient_email" value={recipient.recipient_email} onChange={handleChange} />
            <button className="btn btn-primary" type="submit">Send Friend Request</button>
          </form>
        </div>
        

    </div>
  )
}