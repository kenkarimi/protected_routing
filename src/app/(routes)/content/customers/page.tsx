import requireAuthCompositionPattern from "@/app/_utils/RequireAuthCompositionPattern";
import type { Metadata } from "next";
import { headers, cookies } from 'next/headers'; //only works in Server Components.

import { AccountRequired } from '../../../_utils/GlobalEnumerations'; //exported within curly brackets because it's not a default export but an individual one, which is necessary in order to be able to access .Any, .Customer, .Inestor below.
import Home from '../../../page';

/*Metadata can only be rendered from server components. This is why there's an error when this server component is improperly rendered from a client component e.g. the RequireAuth HOC.
  Without it or any other server specific property, this component would render even if improperly rendered from a client component.
  This is also the case when metadata is imported and used in a non-route component e.g. in '_components' directory.
  Since metadata can't change the title there(because it isn't a route), even though used in a server component, if said server component is imported and improperly rendered in a client component, rendering is still successful.
  With this said, it's good practice to follow the supported pattern when rendering a server component from a client component. More: https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props
*/
export const metadata: Metadata = {
  title: 'Customer Content'
}

const account_required: AccountRequired = AccountRequired.Customer; //can also be typed as 'number' since it's a numbered enum.

const Page = () => {

  //Accept(only media types that the client willing to accept) can be */*(the default), application/json, text/html etc. No Content-Type because this is a GET request. Unlike Content-Type, Accept is not wrapped in quotation marks.
  const options: object = {
    method: 'PUT',
    cache: 'no-cache', //force-cache is the default for NextJs and automatically caches the returned values. Others: default(if fresh, use cache if stale check server if changed, if so, fetch resource from server & update cache), no-store(fetch resource from server without checking if cached version changed, don't update cache), reload(fetch resource from server without checking if cached version changed, but update cache), no-cache(regardless of whether fresh/stale, check server if changed, if not, use cache, if so, fetch resource from server & update cache), only-if-cached(if cached, regardless of whether fresh/stale use cache. if not cached, return 504 gateway timeout error). For sensitive information, always use no-store so its not stored in cache and is always fetched directly from server & ignores cache. For constantly changing information consider using no-cache or use the default force-cache with time-based cache revalidation at short intervals.
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: 10,
      title: 'extra random title',
      body: 'I know what all this is about'
    })
  }
  //NB: Cache revalidation can be used with any caching method(although most useful with force-cache) and also with GET/POST/PUT requests. If revalidating a POST/PUT request, make sure its idempotent.
  //NB: If revalidate is set to 0(meaning you don't want to cache) and the 'cache:' key is also used, the compiler shows an error at runtime. If revalidate is set to 0, then Next prefers for 'cache:' to be ommitted to be its default 'force-cache'.

  fetch('https://jsonplaceholder.typicode.com/posts/100', options)
    .then( (res) => res.json())
    .then( (data) => {
      console.log('/content/customers', 'PUT request successful');
      //console.log(data);
    }).catch( (err) => {
      console.log(err);
    });

  console.log('/content/customers executing...');
  //The headers() function below from next/headers can only be used in a server component such as this one. This function returns a read-only web headers object that allows you to access headers from incoming requests.
  //As such when sending a response from middelware to a RSC or client component, use cookies instead.
  let header_list: any = headers(); //ReadonlyHeaders is unresolved.

  if(header_list.has('x-message-from-middleware')) { //returns true or false.
    let message_header: string = header_list.get('x-message-from-middleware');
    console.log('/content/customers ReadonlyHeaders', message_header);
  } else {
    console.log('/content/customers ReadonlyHeaders', 'header not available.');
  }
  
  let cookies_list: any = cookies(); //ReadonlyRequestCookies is unresolved. 'cookies' is a reserved variable use cookies_list, myCookies etc.

  if(cookies_list.has('next_response_cookie')){ //returns true or false.
    let cookie = cookies_list.get('next_response_cookie');
    console.log('/content/customers cookie', cookie);
    let cookie_name = cookie.name;
    console.log('/content/customers cookie_name', cookie_name);
    let cookie_value = cookie.value;
    console.log('/content/customers cookie_value', cookie_value);
  } else {
    console.log('/content/customers cookie', 'Cookie not available or has expired');
  }
  
  return (
    <div>
      <h1>Customer content.</h1>
      <p>You should only be able to see this page if you're logged in.</p>
      <p>Additionally, this content can only be seen by customers.</p>
      <Home message={'This is how extra props can be passed to a component which itself is being passed to a higher order component. The props have to be received by the HOC as well and passed down with the component using the spread operator. This also shows that a route component can be embeded/imported and rendered from another route component(still has to follow composition pattern rules from react docs).'} />
    </div>
  )
}

export default requireAuthCompositionPattern(Page, account_required);
  