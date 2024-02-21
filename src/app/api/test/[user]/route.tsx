import { NextResponse } from 'next/server';

//To access this route handler, go to http://localhost:3000/api/test/[username] on the browser.
export function GET(request: Request, { params }: { params: any}) { //the use of Request automatically disables caching on this route.
    let { user } = params;
    return NextResponse.json({ message: 'This route handler has been executed by: '+ user });
}