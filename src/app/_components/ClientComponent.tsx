'use client'

import React from 'react';
import ServerComponent from './ServerComponent';

const ClientComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
        <h3>Client Component where ServerComponent is sent down as props from a parent server component(/parent).</h3>
        {/*Improper rendering(that still works): <ServerComponent message={'This route exists only as a demonstration of how server components can be rendered from client components.'} />*/}
        {children}{/*Proper rendering with the right composition pattern*/}
    </div>
  )
}

export default ClientComponent;