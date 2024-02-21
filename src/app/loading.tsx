import React from 'react';

const loading = () => { //Special file that shows an instant loading state while the content of a route segment loads. The new content is automatically swapped in once rendering is complete. For more including on suspense and creating your own suspense boundaries: https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense
//NB: This file doesn't load while the 'sleep' or a fetch function in middleware is executing as that happens before the route segment starts loeading. It executes while a fetch or sleep function executes in a react server component or client component that is a route segment.
    return (
        <div>loading...</div>
    )
}

export default loading;