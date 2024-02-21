import React from 'react';

//Metadata wouldn't work here even if imported because this isn't a route component. This means that even when this server component is improperly imported and rendered in a client component, it still works. This isn't good practice though, and should be avoided.
const ServerComponent = (props: any) => {
  return (
    <div>
        <h3>Server Component</h3>
        <p>This is a server component rendered in a client component by being passed in props to the client component and being slotted in.</p>
        <p><b>Message:</b> {props.message}</p>
    </div>
  )
}

export default ServerComponent;