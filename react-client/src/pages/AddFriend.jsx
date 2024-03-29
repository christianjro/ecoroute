import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateFriendRequest } from '../store';

export default function AddFriend() {
  const navigate = useNavigate()
  const createFriendRequest = useCreateFriendRequest()
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
    createFriendRequest.mutate(recipient)
    navigate("/")
  }

  return (
    <div className="row">
        <div className="col">
          <h4 className="text-primary mt-5 mb-4">Add Friend</h4>

          <form className="card d-flex flex-row border-0 justify-content-center" onSubmit={handleSubmit}>
            <div className="w-100">
                <label className="visually-hidden text-secondary" htmlFor="recipientEmail">Friend Email:</label>
                <input className="form-control border-3 text-secondary" placeholder="Friend's email" id="recipientEmail" type="text" name="recipient_email" value={recipient.recipient_email} onChange={handleChange} />
            </div>

            <div>
              <button className="btn btn-secondary ms-2 text-nowrap" type="submit">Send Request</button>
            </div>
          </form>
        </div>
    </div>
  )
}