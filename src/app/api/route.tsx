import { NextResponse } from 'next/server';

//To access this route handler, go to http://localhost:3000/api/ on the browser.
export function GET(request: Request) { //the use of Request automatically disables caching on this route.
    return NextResponse.json({ message: 'This route handler has been executed.' });
}