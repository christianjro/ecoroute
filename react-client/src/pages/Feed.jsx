import React from 'react'
import { useFeedQuery } from '../store';

export default function Feed() {
  const { data: feedData } = useFeedQuery()

  function formatfeed(feed) {
    const tripsArray = Object.entries(feed).flatMap(([name, trips]) => (
      trips.map(trip => ({name:name, tripData:trip}))
    ))

    const sortedTrips = tripsArray.sort((a, b) => {
      const aDate = new Date(a.tripData.date_created)
      const bDate = new Date(b.tripData.date_created)
      return bDate - aDate
    })

    return sortedTrips
  }

  const feed = formatfeed(feedData)

  function formatDate(dateString) {
      const date = new Date(dateString)
      const options = {year: "numeric", month: "long", day: "numeric"}
      return date.toLocaleDateString('en-US', options)
  }

  const feedItems = feed.map((item) => {
    return (
      <div key={item.tripData.id} className="card mb-3 border-black border-3" style={{maxWidth: '40rem'}}>
        <div className="card-body">
          <h5 className="card-title text-light">{item.name}</h5>
          <p className="card-text text-secondary">
            Date: {formatDate(item.tripData.date_created)} <br/>
            Origin: {item.tripData.origin} <br/>
            Destination: {item.tripData.destination} <br/>
            Travel Mode: {item.tripData.mode}
          </p>
        </div>
        <div className="card-footer bg-transparent text-end text-secondary border-info">GHG Emissions: {item.tripData.ghg_emissions > 0 ? item.tripData.ghg_emissions.toFixed(4) : item.tripData.ghg_emissions} MTCO2e</div>
      </div>
    )
  })

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <h4 className="mt-5 mb-4 text-primary">Feed</h4>
        {feedItems}
      </div>
    </div>
  )
}
