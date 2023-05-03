import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react'
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer,} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '10px',
};

const center = {
  lat: 37.7941,
  lng: -120.9950
};


function Map(props) {
  const [map, setMap] = useState(null)
  const [response, setResponse] = useState(null)
  const [travelMode, setTravelMode] = useState("")
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [newTripName, setNewTripName] = useState("")
  const originRef = useRef(null)
  const destinationRef = useRef(null)

  const [distance, setDistance] = useState("")
  const [duration, setDuration] = useState("")

  const google = window.google;

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, 
    libraries: ['places']
  })



  const onLoad = useCallback((mapInstance) => {
    // This is just an example of getting and using the map instance!
    // It resets the center and zoom level on the map
    // const bounds = new window.google.maps.LatLngBounds(center);
    // mapInstance.fitBounds(bounds);

    setMap(mapInstance)
  }, [])

  console.log("This is the map Object:")
  console.log(map)

  const onUnmount = useCallback((mapInstance) => {
    setMap(null)
    setResponse(null)
  }, [])

  

  const directionsCallback = useCallback((res) => {
    console.log(res)

    if (res !== null) {
      if (res.status === 'OK') {
        setResponse(res)
        setDistance(res.routes[0].legs[0].distance.text)
        setDuration(res.routes[0].legs[0].duration.text)
      } else {
        console.log('response: ', res)
      }
    }
  }, [])


  const checkDriving = useCallback(({ target: { checked } }) => {
    checked && setTravelMode("DRIVING")
  }, [])

  const checkBicycling = useCallback(({ target: { checked } }) => {
    checked && setTravelMode("BICYCLING")
  }, [])

  const checkTransit = useCallback(({ target: { checked } }) => {
    checked && setTravelMode("TRANSIT")
  }, [])

  const checkWalking = useCallback(({ target: { checked } }) => {
    checked && setTravelMode("WALKING")
  }, [])


  // const onClick = useCallback(() => {
  //   if (originRef.current && originRef.current.value !== '' && destinationRef.current && destinationRef.current.value !== '') {
  //     setOrigin(originRef.current.value)
  //     setDestination(destinationRef.current.value)
  //   }
  // }, [])
  // useEffect(() => {
  //   if (originRef.current && originRef.current.value !== "" && destinationRef.current && destinationRef.current.value !== "") {
  //     setOrigin(originRef.current.value)
  //     setDestination(destinationRef.current.value)
  //   }
  // }, [originRef.current.value, destinationRef.current.value])

  console.log("origin is:")
  console.log(origin)
  console.log("Destination is:")
  console.log(destination)

  
  const directionsServiceOptions = useMemo(() => {
    return {
      origin: origin,
      destination: destination,
      travelMode: travelMode,
    }
  }, [origin, destination, travelMode])

  console.log("directions Service Options")
  console.log(directionsServiceOptions)

  // const directionsRendererOptions = useMemo(() => {
  //   return {
  //     directions: response,
  //   }
  // }, [response])

  const directionsRendererOptions =  {
    directions: response,
  }

  console.log('travel Mode:')
  console.log(travelMode)
  console.log('response:')
  console.log(response)
  console.log('Trip Distance:')
  console.log(distance)
  console.log("Trip Duration:")
  console.log(duration)

  const collectedData = useMemo(() => {
    return {
      name: newTripName,
      mode: travelMode,
      origin: origin,
      destination: destination,
      distance: distance,
      duration: duration,
    }
  }, [travelMode, origin, destination, distance, duration])
  console.log('Collected Data:')
  console.log(collectedData)

  useEffect(() => {
    if (origin !== "" && destination !== "" && travelMode !== "" && distance !== "" && duration !== "") {
      props.dataTransfer(collectedData)
    }
  }, [collectedData])

  return isLoaded ? (
      <div>
        <div className="row gap-3 mb-4">
          <div className="col-md d-flex flex-column justify-content-center">

            <label htmlFor="tripName">Trip Name</label>
            <div className="d-flex align-items-center mb-3">
              <i class="bi bi-pen me-2"></i>
              <input 
                id="tripName"
                className="form-control" 
                style={{minWidth: "15rem"}}
                name="name" 
                type="text" 
                value={newTripName} 
                onChange={(e) => setNewTripName(e.target.value)}
              />
            </div>

            <label htmlFor='ORIGIN'>Origin</label>
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-geo me-2"></i>
              <input
                id='ORIGIN'
                className='form-control'
                style={{minWidth: "15rem"}}
                type='text'
                // ref={originRef}
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
            
       
            <label htmlFor='DESTINATION'>Destination</label>
            <div className="d-flex align-items-center">
              <i class="bi bi-geo-fill me-2"></i>
              <input
                id='DESTINATION'
                className='form-control'
                style={{minWidth: "15rem"}}
                type='text'
                // ref={destinationRef}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-auto d-flex justify-content-center">
            <div className="btn-group" role="group" aria-label="Travel mode">
              <div className="btn-group-vertical btn-group-lg" role="group">
                <input
                  id='DRIVING'
                  name='travelMode'
                  type='radio'
                  className="btn-check"
                  checked={travelMode === 'DRIVING'}
                  onChange={checkDriving}
                  autocomplete="off"
                />
                <label className="btn btn-outline-primary rounded-top-left p-5 custom-hover" htmlFor='DRIVING'>Driving</label>

                <input
                  id='BICYCLING'
                  name='travelMode'
                  type='radio'
                  className="btn-check"
                  checked={travelMode === 'BICYCLING'}
                  onChange={checkBicycling}
                  autocomplete="off"
                />
                <label className="btn btn-outline-primary rounded-bottom-left p-5 custom-hover" htmlFor='BICYCLING'>Bicycling</label>
              </div>


              <div className="btn-group-vertical btn-group-lg" role="group">
                <input
                  id='TRANSIT'
                  name='travelMode'
                  type='radio'
                  className="btn-check"
                  checked={travelMode === 'TRANSIT'}
                  onChange={checkTransit}
                  autocomplete="off"
                />
                <label className="btn btn-outline-primary rounded-top-right p-5 custom-hover" htmlFor='TRANSIT'>Transit</label>

                <input
                  id='WALKING'
                  name='travelMode'
                  type='radio'
                  className="btn-check"
                  checked={travelMode === 'WALKING'}
                  onChange={checkWalking}
                  autocomplete="off"
                />
                <label className="btn btn-outline-primary rounded-bottom-right p-5 custom-hover" htmlFor='WALKING'>Walking</label>
              </div>
            </div>
          </div>
        </div>

        <GoogleMap
          id="direction-example"
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {destination !== "" && origin !== "" && travelMode !== "" && (
            <DirectionsService
              options={directionsServiceOptions}
              callback={directionsCallback}
            />
          )}

          {response !== null && (
            <DirectionsRenderer options={directionsRendererOptions} />
          )}
        </GoogleMap>
      </div>
  ) : <></>
}

// export default React.memo(Map)
export default Map
