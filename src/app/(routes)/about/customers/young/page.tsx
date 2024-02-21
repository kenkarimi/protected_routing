'use client'

import React, { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { isEmpty } from 'lodash';
import { usePathname } from 'next/navigation';

import useConstructor from '@/app/_utils/UseConstructor';
import CustomerMap from '@/app/_components/CustomerMap';
import maps_key from '../../../../_config/googleMapsKey';

let map: google.maps.Map;

const loader = new Loader({ //the keys in this object are all the dynamic parameters that are typically in the URL(maps.googleapis.com).
  apiKey:  maps_key,
  version: 'weekly', //is the default if not specified.
  libraries: ['places']
});

const page = () => {
  useConstructor(() => {
  });

  const pathname = usePathname();

  const [show_map, setShowMap] = useState<boolean>(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  const [googleMapsRef, setGoogleMapsRef] = useState<React.MutableRefObject<HTMLDivElement | null>>({
    current: null //default value.
  });

  /**
   * Dynamically loading a third party script such as google maps AUTOMATICALLY(using the npm package @googlemaps/js-api-loader)
   * This method is not only more concise, but also faster than the manual method tested in /about/customers.
   * For more on the different methods of asyncronously loading a script: https://developers.google.com/maps/documentation/javascript/overview#Loading_the_Maps_API
   * https://www.npmjs.com/package/@googlemaps/js-api-loader
   */

  useEffect( () => {
    loader.importLibrary('maps').then( () => {
      setIsScriptLoaded(true);
    });
  }, []);

  useEffect( () => {
    console.log('The path has changed.');
  }, [pathname]);

  
  useEffect( () => { //Reference will only be received & change, thus executing this effect, once isScriptLoaded is true.
    if(googleMapsRef.current === null) return;
    initMap();
  }, [googleMapsRef]);

  const initMap = () => {
    if(googleMapsRef.current !== null){ //For typescript. Could be null.
      map = new google.maps.Map(googleMapsRef.current as HTMLDivElement, { //if deconstructed, use 'new Map(googleMpasRef.current)
        center: { lat: -1.2849268, lng: 36.8258265 },
        zoom: 15
      });
    }

    //places library
    let autocompleteService: google.maps.places.AutocompleteService = new google.maps.places.AutocompleteService();
    let sessionToken: google.maps.places.AutocompleteSessionToken = new google.maps.places.AutocompleteSessionToken();
  }

  const handleReceivedReference = (mapsRef: React.MutableRefObject<HTMLDivElement | null>) => {
    if(mapsRef.current === null) return;
    setGoogleMapsRef(mapsRef);
  }
  
  if(isScriptLoaded){
    return (
      <div>
        <h1>About our investors.</h1>
        <p>You should be able to see this page if you're not logged in.</p>
        <CustomerMap
            show_map={show_map}
            receiveMapsReference={handleReceivedReference}
        />
      </div>
    )
  } else if(!isScriptLoaded){
    return (
      <div>
        <h1>About our investors.</h1>
        <p>You should be able to see this page if you're not logged in...</p>
        <h3>Loading google maps & places libraries. Please wait..........</h3>
      </div>
    )
  }
}

export default page;