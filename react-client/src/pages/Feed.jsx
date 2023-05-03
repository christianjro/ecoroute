import React, {useState, useEffect} from 'react'

export default function Feed() {
  const [feed, setFeed] = useState([])

  useEffect(() => {
    fetch("/feed")
      .then(response => response.json())
      .then(data => {
        const tripsArray = Object.entries(data).flatMap(([name, trips]) => (
            trips.map(trip => ({name:name, tripData:trip}))
          )
        )

        const sortedTrips = tripsArray.sort((a,b) => {
          const aDate = new Date(a.tripData.date_created)
          const bDate = new Date(b.tripData.date_created)
          return bDate - aDate
        })

        console.log(tripsArray)
        console.log(sortedTrips)

        setFeed(sortedTrips)
      })
  }, [])

  function formatDate(dateString) {
      const date = new Date(dateString)
      const options = {year: "numeric", month: "long", day: "numeric"}
      return date.toLocaleDateString('en-US', options)
  }

  const feedItems = feed.map((item) => {
    return (
      <div key={item.tripData.id} className="card mb-3" style={{maxWidth: '40rem'}}>
        <div className="card-body">
          <h5 className="card-title">{item.name}</h5>
          <p className="card-text">
            Date: {formatDate(item.tripData.date_created)} <br/>
            Origin: {item.tripData.origin} <br/>
            Destination: {item.tripData.destination} <br/>
            Travel Mode: {item.tripData.mode}
          </p>
        </div>
        <div className="card-footer bg-transparent text-end">GHG Emissions: {item.tripData.ghg_emissions > 0 ? item.tripData.ghg_emissions.toFixed(4) : item.tripData.ghg_emissions} MTCO2e</div>
      </div>
    )
  })

  return (
    <div>
      <h1>Feed</h1>
      {feedItems}
    </div>
  )
}
