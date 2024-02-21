import React from 'react';
import type { Metadata } from 'next';

import ClientComponent from '@/app/_components/ClientComponent';
import ServerComponent from '@/app/_components/ServerComponent';

//This Function component has to be a server component not only because of metadata but also to adhere to the proper composition pattern for sending server components to client components as a child/prop. If otherwise, we wouldn't be able to import ServerComponent above.
export const metadata: Metadata = {
    title: 'Random Server Component'
}

const ParentServerComponent = (props: any) => {
  return (
    <ClientComponent>
      <ServerComponent message={'This route exists only as a demonstration of how server components can be rendered from client components using the right composition pattern.'}/>
    </ClientComponent>
  )
}

export default ParentServerComponent;