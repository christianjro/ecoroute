import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react'
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer,} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 37.7941,
  lng: -120.9950
};


function Map() {
  const [map, setMap] = useState(null)
  const [response, setResponse] = useState(null)
  const [travelMode, setTravelMode] = useState("DRIVING")
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
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


  const onClick = useCallback(() => {
    if (originRef.current && originRef.current.value !== '' && destinationRef.current && destinationRef.current.value !== '') {
      setOrigin(originRef.current.value)

      setDestination(destinationRef.current.value)
    }
  }, [])
  console.log("origin is:")
  console.log(origin)
  console.log("Destination is:")
  console.log(destination)

  
  const directionsServiceOptions = useMemo(() => {
    return {
      destination: destination,
      origin: origin,
      travelMode: travelMode,
    }
  }, [destination, origin, travelMode])

  console.log("directions Service Options")
  console.log(directionsServiceOptions)

  const directionsRendererOptions = useMemo(() => {
    return {
      directions: response,
    }
  }, [response])

  console.log('travel Mode:')
  console.log(travelMode)
  console.log('response:')
  console.log(response)
  console.log('Trip Distance:')
  console.log(distance)
  console.log("Trip Duration:")
  console.log(duration)


  return isLoaded ? (
      <div>
        <div>
          <label htmlFor='ORIGIN'>Origin</label>
          <br />
          <input
            id='ORIGIN'
            className='form-control'
            type='text'
            ref={originRef}
          />
          <br />
          <label htmlFor='DESTINATION'>Destination</label>
          <br />
          <input
            id='DESTINATION'
            className='form-control'
            type='text'
            ref={destinationRef}
          />
        </div>

        <div>
          <input
            id='DRIVING'
            className='custom-control-input'
            name='travelMode'
            type='radio'
            checked={travelMode === 'DRIVING'}
            onChange={checkDriving}
          />
          <label className='custom-control-label' htmlFor='DRIVING'>
            Driving
          </label>

          <input
            id='BICYCLING'
            className='custom-control-input'
            name='travelMode'
            type='radio'
            checked={travelMode === 'BICYCLING'}
            onChange={checkBicycling}
          />
          <label className='custom-control-label' htmlFor='BICYCLING'>
            Bicycling
          </label>

          <input
            id='TRANSIT'
            className='custom-control-input'
            name='travelMode'
            type='radio'
            checked={travelMode === 'TRANSIT'}
            onChange={checkTransit}
          />
          <label className='custom-control-label' htmlFor='TRANSIT'>
            Transit
          </label>

          <input
            id='WALKING'
            className='custom-control-input'
            name='travelMode'
            type='radio'
            checked={travelMode === 'WALKING'}
            onChange={checkWalking}
          />
          <label className='custom-control-label' htmlFor='WALKING'>
            Walking
          </label>

          <button className='btn btn-primary' type='button' onClick={onClick}>
          Build Route
          </button>
        </div>
        <GoogleMap
          id="direction-example"
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          onLoad={onLoad}
          // onUnmount={onUnmount}
        >
          {destination !== '' && origin !== '' && (
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
