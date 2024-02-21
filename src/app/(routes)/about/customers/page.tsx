'use client'

import React, { useState, useEffect } from 'react';

import useConstructor from '@/app/_utils/UseConstructor';
import CustomerMap from '@/app/_components/CustomerMap';
import maps_key from '../../../_config/googleMapsKey';

let map: google.maps.Map;
let googleMapsRef: React.MutableRefObject<HTMLDivElement | null>;

const page = () => {
  useConstructor(() => {
  });

  const [show_map, setShowMap] = useState<boolean>(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);

  /**
   * Dynamically loading a third party script such as google maps MANUALLY(without the use of a npm package)
   * In previous react versions, I used react-async-script-loader for this, but it can't work beyond react 17.
   * The package acted as a HOC where the link was loaded and props were sent downstream telling us if the script was loaded and whether loading was successful.
   * The google map could not be initialized before the script was loaded.
   * Note that the callback that's supposed to be at the end of the script beow(&callback=initMap) has been removed for the reason stated above. It tries to initialize the map before the script is loaded.
   * That functionality is now handled here using an event listener to check whether the script is loaded before map initialization.
   * For more on the different methods of asyncronously loading a script: https://developers.google.com/maps/documentation/javascript/overview#Loading_the_Maps_API
   * https://www.npmjs.com/package/@googlemaps/js-api-loader
   */
  useEffect( () => {
    if(!isScriptLoaded){ //if script isn't loaded, start loading it.
      let script: HTMLScriptElement = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${maps_key}&libraries=places`;
      script.async = true;
      script.addEventListener('load', () => {
        setIsScriptLoaded(true);
      });
      document.head.appendChild(script);
    }
  }, []);

  useEffect( () => {
    if(!isScriptLoaded) return;
    initMap();
  }, [googleMapsRef, isScriptLoaded]);

  const initMap = () => {
    if(googleMapsRef.current !== null){ //For typescript. Could be null
      map = new google.maps.Map(googleMapsRef.current, {
        center: { lat: -1.2849268, lng: 36.8258265 },
        zoom: 15
      });
    }
  }

  const handleReceivedReference = (mapsRef: React.MutableRefObject<HTMLDivElement | null>) => {
    if(mapsRef.current === null) return;
    googleMapsRef = mapsRef;
  }
  
  return (
    <div>
      <h1>About our customers.</h1>
      <p>You should only be able to see this page if you're logged in.</p>
      <CustomerMap
          show_map={show_map}
          receiveMapsReference={handleReceivedReference}
      />
    </div>
  )
}

export default page;