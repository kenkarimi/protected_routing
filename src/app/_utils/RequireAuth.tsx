'use client'

import React from 'react';
import { usePathname } from 'next/navigation';

import { AccountRequired } from './GlobalEnumerations';

const RequireAuth = ({ children, account_required }: { children: React.ReactNode, account_required: AccountRequired }) => { //This HOC wraps every function component that requires auth: /, /content/customers, /content/investors

        const pathname = usePathname(); //pathname being requested.

        console.log(`HOC executing at ${new Date()} for path ${pathname}`);
        console.log(`Account required to access this route: ${account_required}`);

        //Accept(only media types that the client willing to accept) can be */*(the default), application/json, text/html etc. No Content-Type because this is a GET request. Unlike Content-Type, Accept is not wrapped in quotation marks.
        let options: object = {
                method: 'GET',
                cache: 'force-cache', //force-cache is the default for NextJs and automatically caches the returned values. Others: default(if fresh, use cache if stale check server if changed, if so, fetch resource from server & update cache), no-store(fetch resource from server without checking if cached version changed, don't update cache), reload(fetch resource from server without checking if cached version changed, but update cache), no-cache(regardless of whether fresh/stale, check server if changed, if not, use cache, if so, fetch resource from server & update cache), only-if-cached(if cached, regardless of whether fresh/stale use cache. if not cached, return 504 gateway timeout error). For sensitive information, always use no-store so its not stored in cache and is always fetched directly from server & ignores cache. For constantly changing information consider using no-cache or use the default force-cache with time-based cache revalidation at short intervals.
                next: {
                        revalidate: 3600 //cache lifetime of resource in seconds. Not only purges the data cache but also re-fetches every 3600 seconds making sure the user is always seeing the latest version.
                },
                headers: {
                        Accept: '*/*'
                }
        }
        //NB: Cache revalidation can be used with any caching method(although most useful with force-cache) and also with GET/POST/PUT requests. If revalidating a POST/PUT request, make sure its idempotent.
        //NB: If revalidate is set to 0(meaning you don't want to cache) and the 'cache:' key is also used, the compiler shows an error at runtime. If revalidate is set to 0, then Next prefers for 'cache:' to be ommitted to be its default 'force-cache'.

        return fetch('https://jsonplaceholder.typicode.com/todos', options)
                .then( (res) => res.json()) //Unlike axios which automatically transforms the data returned from the server, with fetch you have to call res.json() to parse the data to a Javascript object.
                .then( (data) => {
                        console.log('RequireAuth', 'GET request successful');
                        //console.log(data);
                        return children;
                }).catch( (err) => {
                        console.log(err);
                        return <></>;
                });

        
}

export default RequireAuth;