import { NextRequest, NextResponse } from 'next/server';
import { AccountRequired } from './app/_utils/GlobalEnumerations';

const url_prefix: string = "http://localhost:3000";
const routes: Array<string> = [ //'/login', '/about', '/about/customers', '/about/customers/young', 'about/investors' and any other static pages shouldn't be included here since they don't require log in.
    '/',
    '/content/customers',
    '/content/investors',
    '/logout'
];

type AccountType = 'customer' | 'investor' | null;

interface Account {
    logged_in: boolean;
    account_type: AccountType;
    email: string;
}

function sleep(milliseconds: number){
    return new Promise( (resolve) => setTimeout(resolve, milliseconds));
}

export const middleware = (request: NextRequest) => {
    /**
     * Although middleware is out of the /app directory, you can still import from the app directory
     * Here, we import the AccountRequired enum from a file in the /app directory.
     */
    let a: AccountRequired  = AccountRequired.Investor;

    if(a === AccountRequired.Investor){
        console.log('A IS AN INVESTOR');
    } else if(a === AccountRequired.Customer){
        console.log('A IS A CUSTOMER');
    }
    //Two ways to define which paths middleware will run on: 1. Conditional statements(if/switch) 2. Custom matcher config.

    //1. Conditional statements:
    //a) Using request.url

    /*if(request.url === `${url_prefix}/`){ //if home is the url requested/where request is coming from.
        return NextResponse.redirect(new URL('/login', request.url));
    }*/

    //b) Using request.nextUrl.pathname

    /*if(request.nextUrl.pathname === '/'){ //in this case, we don't need to use a url prefix.
        return NextResponse.redirect(new URL('/login', request.url));
    }*/

    //Using if statements with the aid of an array to loop through all routes. Any non-existing route redirects to a custom NextJs 404 page.
    /*let route_exists: boolean = false;

    if(routes.length > 0){
        for(let i = 0; i < routes.length; i++){
            if(request.nextUrl.pathname === routes[i]){
                route_exists = true;
                //Check if logged in. If not, redirect to log in.
                //console.log(request.cookies.get('decoded_claims')); //returns undefined if empty. else { name:, value:, path: } or { name: value: }
                //console.log(request.cookies.getAll()); //returns an empty array if empty. else [{ name:, value:, path: }] or [{ name:, value: }]
                //console.log(request.cookies.has('decoded_claims')); //returns true/false.
                //console.log(request.cookies.delete('decoded_claims')); //returns true/false.

                if(request.cookies.has('decoded_claims')){
                    const myCookie: any = request.cookies.get('decoded_claims');

                    let cookie_name: string = myCookie.name;
                    console.log('cookie name', cookie_name);

                    let cookie_value: Account = JSON.parse(myCookie.value); //unstringify decoded_claims object.
                    console.log('account object', cookie_value);

                    let logged_in: boolean = cookie_value.logged_in;
                    console.log('logged_in', logged_in);

                    let account_type: AccountType = cookie_value.account_type;
                    console.log('account_type', account_type);

                    let email: string = cookie_value.email;
                    console.log('email', email);

                    if(logged_in){
                        //No response needed. Proceeds to requested url.
                        //Check for accesss control.
                        if(request.nextUrl.pathname === '/' && account_type !== 'customer' && account_type !== 'investor'){
                            return NextResponse.redirect(new URL('/', request.url)); //no permission. redirect to home.
                        } else if(request.nextUrl.pathname === '/content/customers' && account_type !== 'customer'){
                            console.log('/content/customers');
                            return NextResponse.redirect(new URL('/', request.url)); //no permission. redirect to home.
                        } else if(request.nextUrl.pathname === '/content/investors' && account_type !== 'investor'){
                            console.log('/content/investors');
                            return NextResponse.redirect(new URL('/', request.url)); //no permission. redirect to home.
                        } else if(request.nextUrl.pathname === '/logout' && account_type !== 'customer' && account_type !== 'investor'){
                            console.log('/logout');
                            return NextResponse.redirect(new URL('/', request.url)); //no permission. redirect to home.
                        } else {
                            //You have permission. Go ahead.
                            //This sleep operation is meant to simulate a fetch call. Without a fetch or any other activity that requires a promise, the Middleware executes first before the Higher Order Component. With this a fetch, the HOC how executes before the Middleware as can be seen from the console. This means we can't use a HOC to reuse/minimize the amount of code written on the client side. we have to do any resets to context on the function components componentDidMount equivalent or custom constructor after we approved to go to that route.
                            sleep(5000).then(() => { //Can also use async await.
                                console.log(`Middleware executing at ${new Date()}`);
                                console.log('Just before you switch up on me,', request.url);
                                return NextResponse.next(); //Can be left out and response would still send since this is the last line of code.
                            });
                        }
                    } else if(!logged_in){
                        console.log('Not logged in');
                        return NextResponse.redirect(new URL('/login', request.url)); //redirects to /login and shows login's content/page.tsx.
                        //return NextResponse.rewrite(new URL('/login', request.url)); //rewrites response such that user still goes to requested url path, but instead of showing that path's content/page.tsx, it shows the /login's content/page.tsx. So it's the login page, but the url path on the browser isn't /login.
                    }
                } else {
                    console.log('No cookie');
                    return NextResponse.redirect(new URL('/login', request.url)); //redirects to /login and shows login's content/page.tsx.
                    //return NextResponse.rewrite(new URL('/login', request.url)); //rewrites response such that user still goes to requested url path, but instead of showing that path's content/page.tsx, it shows the /login's content/page.tsx. So it's the login page, but the url path on the browser isn't /login.
                }
            }
        }

        //If loop ends and requested pathname wasn't found in routes array.
        if(!route_exists){
            if(request.nextUrl.pathname === '/login'){ //If log in page was the one requested, we don't want to mistakenly redirect it to /404 just because it wasn't in routes array.
                //Check if logged in. If logged in, redirect to home('/'). If not, let user proceed to '/login'(empty else if)
                if(request.cookies.has('decoded_claims')){
                    const myCookie: any = request.cookies.get('decoded_claims');

                    let cookie_value: Account = JSON.parse(myCookie.value); //unstringify decoded_claims object.

                    if(cookie_value.logged_in){
                        console.log('Hold on right there. You\'re logged in. Go home.');
                        return NextResponse.redirect(new URL('/', request.url));
                    } else if(!cookie_value.logged_in){ //Cookie available but false. Let user proceed to '/login'(empty else if)
                        console.log('Fine! You\'re not logged in. Go ahead.');
                        return NextResponse.next(); //Can be left out and response would still send since this is the last line of code.
                    }
                } else { //Cookie unavailable. Let user proceed to '/login'(empty else if)
                    console.log('No cookie');
                    return NextResponse.next(); //Can be left out and response would still send since this is the last line of code.
                }
            } else {
                //If it's any of '/about', '/about/customers', '/about/customers/young', 'about/investors' it'll continue to render. If the route is a 404, it'll be handled by not-found.tsx
                return NextResponse.next(); //Can be left out and response would still send since this is the last line of code.
            }
        }
    }*/

    //Unrelated with the above/below, but this is how you'd set a cookie with NextResponse before redirecting if you needed to:
    /*NextResponse.next().cookies.set('decoded_claims', 'account', { //path, maxAge, expires & domain are configuration choices & are optional(you can ommit the object as one of the parameters of Set-Cookie).
        path: '/', //If path omitted, it returns '/' as it's default path.
        maxAge: 60, //Specifies the number (in seconds). if both expires and maxAge are set, then maxAge takes precedence, but it is possible not all clients by obey this, so if both are set, they should point to the same date and time.
        expires: 60000 //A number of milliseconds or Date interface(new Date('2023-09-30')) containing the expires of the cookie.
    });*/
    /*NextResponse.next().cookies.set({ //path, maxAge & expires are optional keys but the others are required.
        name: 'decoded_claims',
        value: 'account',
        path: '/',
        //maxAge: 70, //commented out so that expires can take precedence, otherwise it would overwrite whatever date is written in expires.
        expires: new Date('2026-09-30')
    });
    //NB: The path option is used in this case to allow the program to access the cookie from any location when the response is sent to the client.
    
    console.log(NextResponse.next().cookies.get('decoded_claims'));
    return NextResponse.redirect(new URL('/login', request.url)); //redirects to /login and shows login's content/page.tsx.*/

    //2.Custom matcher config:
    //console.log(request.url);
    //return NextResponse.redirect(new URL('/login', request.url));
    if(request.nextUrl.pathname === '/login'){
        //Check if logged in. If logged in, redirect to home('/'). If not, let user proceed to '/login'(empty else if)
        if(request.cookies.has('decoded_claims')){
            const myCookie: any = request.cookies.get('decoded_claims');

            let cookie_value: Account = JSON.parse(myCookie.value); //unstringify decoded_claims object.

            if(cookie_value.logged_in){
                console.log('Hold on right there. You\'re logged in. Go home.');
                //return NextResponse.json({ message: 'You can\'t access /login as you\'re already logged in.' });
                return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //status 307 & 308(Temporary & Permanent redirect respectively) are the only status codes that are accepted by NextResponse.redirect(). The rest lead to an error when executing.
            } else if(!cookie_value.logged_in){ //Cookie available but false. Let user proceed to '/login'(empty else if)
                console.log('Fine! You\'re not logged in. Go ahead.');
                //return NextResponse.json({ message: 'Go ahead and log in.' }, { status: 200 });
                return NextResponse.next(); //Can be left out and response would still send since this is the last line of code.
            }
        } else { //Cookie unavailable. Let user proceed to '/login'(empty else if)
            console.log('No cookie');
            //return NextResponse.json({ message: 'Go ahead and log in.' }, { status: 200 });
            return NextResponse.next(); //Can be left out and response would still send since this is the last line of code.
        }
    } else { //Any other pathname in the array.
        //Check if logged in. If not, redirect to log in.

        if(request.cookies.has('decoded_claims')){
            const myCookie: any = request.cookies.get('decoded_claims');

            let cookie_name: string = myCookie.name;
            console.log('cookie name', cookie_name);

            let cookie_value: Account = JSON.parse(myCookie.value); //unstringify decoded_claims object.
            console.log('account object', cookie_value);

            let logged_in: boolean = cookie_value.logged_in;
            console.log('logged_in', logged_in);

            let account_type: AccountType = cookie_value.account_type;
            console.log('account_type', account_type);

            let email: string = cookie_value.email;
            console.log('email', email);

            if(logged_in){
                //No response needed. Proceeds to requested url.
                //Check for accesss control.
                if(request.nextUrl.pathname === '/' && account_type !== 'customer' && account_type !== 'investor'){
                    //return NextResponse.json({ message: 'You do not have permission to access /, but we\'ll take you anyway, since you\'re logged in.' });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(request.nextUrl.pathname === '/content/customers' && account_type !== 'customer'){
                    //return NextResponse.json({ message: 'You do not have permission to access /content/customers' });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(request.nextUrl.pathname === '/content/investors' && account_type !== 'investor'){
                    //return NextResponse.json({ message: 'You do not have permission to access /content/investors' });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(request.nextUrl.pathname === '/logout' && account_type !== 'customer' && account_type !== 'investor'){
                    //return NextResponse.json({ message: 'You do not have have permission to access /logout' });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else {
                    //You have permission. Go ahead.
                    //This sleep operation is meant to simulate a fetch call. Without a fetch or any other activity that requires a promise, the Middleware executes first before the Higher Order Component. With this a fetch, the HOC now executes before the Middleware as can be seen from the console. This means we can't use a HOC to reuse/minimize the amount of code written on the client side. we have to do any resets to context on the function components componentDidMount equivalent or custom constructor after we are approved to go to that route.
                    return sleep(2000).then(() => { //Can also use async await.
                        console.log(`Middleware executing at ${new Date()}`);
                        console.log('Just before you switch up on me,', request.url);
                        //return new NextResponse(JSON.stringify({ message: 'You have permission.' }), { status: 200, headers: { 'content-type': 'application/json', 'x-hello-from-middleware': 'Habari yako?' } }); //Cannot set cookies here as it's not a known property of ResponseInit.
                        /*const response = new NextResponse(JSON.stringify({ msg: 'You have permission' }), { status: 200 });
                        response.headers.set('x-message-from-middleware', 'You have permission');
                        response.headers.set('x-shift-data', JSON.stringify({
                            status: 200,
                            message: 'You have permission...'
                        }));
                        response.cookies.set('next_response_cookie', 'Other than NextResponse.json() which overwrites a components html with the json response, the only other way to send responses to a react server component or client component from middleware is by sending a response cookie or response header.', {
                            path: '/', //If path omitted, it returns '/' as it's default path.
                            maxAge: 6000, //Specifies the number (in seconds). if both expires and maxAge are set, then maxAge takes precedence, but it is possible not all clients by obey this, so if both are set, they should point to the same date and time.
                            expires: 6000000 //A number of milliseconds or Date interface(new Date('2023-09-30')) containing the expires of the cookie.
                        });
                        return response;*/
                        //return NextResponse.json({ success: true, message: 'You have permission.' }, { status: 200, headers: { 'content-type': 'application/json', 'x-hello-from-middleware': 'Habari yako?' } }); //Can set cookies after headers too.
                        /*const response = NextResponse.next({ status: 401 }); //Can also set headers here instead of response.headers below. Can't do that for cookies though. response.cookies.set() has to be done below.
                        response.headers.set('x-message-from-middleware', 'You have permission');
                        response.cookies.set('next_response_cookie', 'Other than NextResponse.json() which overwrites a component\'s html with the json response, the only other way to send responses to a react server component or client component from middleware is by sending a response cookie or response header.', {
                            path: '/', //If path omitted, it returns '/' as it's default path. The path /foo matches /foobar and /foo/bar.html. The path '/' is the most general path.
                            maxAge: 6000, //Specifies the number (in seconds). if both expires and maxAge are set, then maxAge takes precedence, but it is possible not all clients by obey this, so if both are set, they should point to the same date and time.
                            expires: 6000000 //A number of milliseconds or Date interface(new Date('2023-09-30')) containing the expires of the cookie.
                        });
                        return response; //Can be left out and response would still send since this is the last line of code.
                        */
                       
                       //return NextResponse.redirect(new URL('/', request.url), { status: 308 });
                    });
                }
            } else if(!logged_in){
            console.log('Not logged in');
                //return NextResponse.json({ message: 'You do not have permission to access this route. You need to first log in.' });
                return NextResponse.redirect(new URL('/login', request.url), { status: 308 }); //redirects to /login and shows login's content/page.tsx.
                //return NextResponse.rewrite(new URL('/login', request.url)); //rewrites response such that user still goes to requested url path, but instead of showing that path's content/page.tsx, it shows the /login's content/page.tsx. So it's the login page, but the url path on the browser isn't /login.
            }
        } else {
            console.log('No cookie');
            //return NextResponse.json({ message: 'You do not have permission to access this route. You need to first log in.' });
            return NextResponse.redirect(new URL('/login', request.url), { status: 308 }); //redirects to /login and shows login's content/page.tsx.
            //return NextResponse.rewrite(new URL('/login', request.url)); //rewrites response such that user still goes to requested url path, but instead of showing that path's content/page.tsx, it shows the /login's content/page.tsx. So it's the login page, but the url path on the browser isn't /login.
        }
    }

    //REQUEST & RESPONSE HEADERS: Request headers are used to provide additional information about the HTTP request.
    /*console.log('REQUEST.HEADERS', request.headers);

    console.log('////////////////////////////////////////Getting default headers that come with the original request from request.headers/////////////////////////////////////////////////////');
    let accept = request.headers.get('accept'); //type of data client is willing to accept. e.g. text/html, application/json etc.
    console.log('accept', accept);
    let accept_encoding = request.headers.get('accept-encoding'); //type of encoding client is willing to accept e.g. 
    console.log('accept-encoding', accept_encoding);
    let accept_language = request.headers.get('accept-language'); //language(s) client is willing to accept.
    console.log('accept-language', accept_language);
    let connection = request.headers.get('connection');
    console.log('connection', connection);
    let cookie: any = request.headers.get('cookie');
    console.log('cookie(encoded)', cookie);
    console.log('cookie(decoded)', decodeURIComponent(cookie)); //unescape/decodeURIComponent used to decoded cookie string. unescape() is deprecated so decodeURIComponent is preferred.
    let cache_control = request.headers.get('cache-control');
    console.log('cache-control', cache_control);
    let user_agent = request.headers.get('user-agent');
    console.log('user-agent', user_agent); //type of client that is making the request. e.g. web browser, mobile device etc.
    let host = request.headers.get('host');
    console.log('host', host);
    console.log('/////////////////////////////////////////////////////////////////////////////////////////////');

    // Clone the request headers and set a new header `x-hello-from-middleware1`
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-hello-from-middleware1', 'hello');
    requestHeaders.set('x-possible-user-name1', 'John Doe');
    requestHeaders.set('x-possible-user-name2', 'Jane Doe');
    console.log('REQUESTHEADERS', requestHeaders);

    console.log('///////////////////////////////////Getting headers by name from requestHeaders we just set//////////////////////////////////////////////////////////');
    let greeting_header_request = requestHeaders.get('x-hello-from-middleware1'); //Don't use the x-middleware-request that it's prefixed with in the header. Just use the name.
    console.log('hello request', greeting_header_request);
    let possible_user1 = requestHeaders.get('x-possible-user-name1');
    console.log('possible user 1', possible_user1);
    let possible_user2 = requestHeaders.get('x-possible-user-name2');
    console.log('possible user 2', possible_user2);
    console.log('/////////////////////////////////////////////////////////////////////////////////////////////');

    // You can also set request headers in NextResponse.rewrite
    const response = NextResponse.next({
        request: {
            // New request headers
            headers: requestHeaders
        }
    });

    // Set a new response header `x-hello-from-middleware2`
    response.headers.set('x-hello-from-middleware2', 'hello'); //In the console, this won't be prefixed. It'll appear as: x-hello-from-middleware2: 'hello' in the headers: {} section.
    console.log('RESPONSE.HEADERS',response);
    console.log('///////////////////////////////////Repeated again but instead of getting them from the requestHeders we get them from response.headers//////////////////////////////////////////////////////////');
    let greeting_header_response = response.headers.get('x-hello-from-middleware2'); //Don't prefix with x-middleware-request since this was set in response.headers
    console.log('hello response', greeting_header_response);
    greeting_header_request = response.headers.get('x-middleware-request-x-hello-from-middleware1'); //In the console, this will be prefixed with x-middleware-request like so: x-middleware-request-x-hello-from-middleware1: 'John Doe' in the headers: {} section since this was set in request.headers.
    console.log('hello request', greeting_header_request);
    possible_user1 = response.headers.get('x-middleware-request-x-possible-user-name1'); //In the console, this will be prefixed with x-middleware-request like so: x-middleware-request-x-possible-user-name1: 'John Doe' in the headers: {} section since this was set in request.headers.
    console.log('possible user 1', possible_user1);
    possible_user2 = response.headers.get('x-middleware-request-x-possible-user-name2');
    console.log('possible user 2', possible_user2);
    console.log('/////////////////////////////////////////////////////////////////////////////////////////////');

    return response;*/
}

 //a)Custom matcher config with only one matching path. 
/*export const config = { //middleware only runs if this one path is matched.
    matcher: '/'
}*/

//b)Custom matcher config with an array of paths that can match.
/*export const config = {
    matcher: ['/', '/about/:path*', '/content/:path*']
}*/
/*NB: You can't do '/:path*' cause the scope is too wide and there's too many redirects.
If /about is mispelt as '/abouts' or we try going to '/a' or '/b', it produces a default 404 page made by NextJs. The same happens for any other pathname that is not in the array with the exception of any mispelt pathname that occurs where '/:path*' has been used. In this case, the user is redirected to the log in page instead of being served with a default NextJs 404 page. In short, anything written by the user where '/:path*' exists redirects you to the log in page if you're not logged in.*/

//All routes have to be explicitly defined if you want to always produce the default NextJs 404 page for non-existing routes. There can be no use of '/:path*'. Those are redirected to log in page for non-existing pathnames where '/:path*' is used.
//NB: Even though we still leave the '/about:path*' pages out of this matcher like we did in the routes array, here, we include '/login' in the matcher array so as to stop a logged in user from going to the log in page. We achieve this with an if else conditional in the middleware.
//'/about', '/about/customers', '/about/customers/young' and 'about/investors' aren't included in the matcher array as they're static pages that don't require log in.
export const config = {
    matcher: [
        '/',
        '/login',
        '/content/customers',
        '/content/investors',
        '/logout'
    ]
}

// Limit the middleware to paths starting with `/api/`
/*export const config = {
    matcher: '/api/:function*'
}*/

//request.url returns the entire url including the pathname while request.nextUrl.pathname only returns the pathname after the domain.
//request.nextUrl returns an object containing href, origin, protocol, username, password, host, hostname, port, pathname etc. //To get the pathname only  you use request.nextUrl.pathname. The same can be done for any of the other keys in the object.
/*
{
  href: 'http://localhost:3000/',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  searchParams: <ref *1> URLSearchParams {
  [Symbol(query)]: [],
  [Symbol(context)]: URL {
  [Symbol(context)]: URLContext {
  href: 'http://localhost:3000/',
  protocol_end: 5,
  username_end: 7,
  host_start: 7,
  host_end: 16,
  pathname_start: 21,
  search_start: 4294967295,
  hash_start: 4294967295,
  port: 3000,
  scheme_type: 0
},
  [Symbol(query)]: [Circular *1]
}
},
  hash: ''
}
*/