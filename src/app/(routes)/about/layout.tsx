import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = { //Cannot be exported from a component marked 'use client' so if you ever need it, create a layout.tsx like this and have it there.
    title: 'About'
}

const layout = ({ children }: { children: React.ReactNode }) => {
    //throw new Error('Error handling with global-error.tsx works.'); //To test how global-error.tsx works in layout.tsx or template.tsx files.

    return (
        <div>
            <h5>Loading from about/layout.tsx</h5>
            { children }
        </div>
    )
}

export default layout;