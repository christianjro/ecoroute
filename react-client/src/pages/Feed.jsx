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

  
  const feedItems = feed.map((item) => {
    return (
      <div key={item.tripData.id}>
        <h2>{item.name}</h2>
        <p>Date: {item.tripData.date_created}</p>
        <p>Travel Mode: {item.tripData.mode}</p>
        <p>GHG Emissions: {item.tripData.ghg_emissions}</p>
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
