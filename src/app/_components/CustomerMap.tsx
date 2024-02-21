'use client'

import React, { useRef, useEffect } from 'react';

interface Props {
    show_map: boolean;
    receiveMapsReference: (mapsRef: React.MutableRefObject<HTMLDivElement | null>) => void; //or Function
}

function CustomerMap(props: Props) {
    const googleMapsRef: React.MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

    useEffect( () => { //To ensure googleMapsRef.current isn't still null when we return it, we need a useEffect that watches it for changes.
        if(googleMapsRef.current === null) return;
        props.receiveMapsReference(googleMapsRef); // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [googleMapsRef]);

    return (
        <div id="map" style={{ width: '100vw', height: '100vh' }}ref={googleMapsRef} hidden={props.show_map !== true}></div>
    );
}

export default CustomerMap;