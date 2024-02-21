import { NextResponse } from 'next/server';

//To access this route handler, go to http://localhost:3000/content/customers/api/ on the browser.
export function GET(request: Request) { //the use of Request automatically disables caching on this route.
    console.log('API executing @ /content/customers/api/');
    return NextResponse.json({ message: 'This route handler has been executed.' });
}