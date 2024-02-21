'use client'

import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

import { AccountContext } from '../_context/AccountProvider';

type AccountType = 'customer' | 'investor' | null;

type Account = {
  logged_in: boolean;
  account_type: AccountType;
  email: string;
}

interface DecodedClaims {
  decodedClaims: Account; //Account as the type instead of object.
  setDecodedClaims: React.Dispatch<React.SetStateAction<Account>>;
}

const Header = () => {

    const { decodedClaims, setDecodedClaims } = useContext<DecodedClaims>(AccountContext);

    //Since state doesn't persist after browser reload, we'll use the cookie to update the account details back. This way, the header doesn't look like it's logged out, in contrast with the body, which looks logged in, because the cookie still allows us to access the logged in routes.
    //In a real production app, we'd use a database to do this(repupulate state).
    useEffect( () => { //componentDidMount.
        let cookie_value_stringified: string | undefined = Cookies.get('decoded_claims'); //type could be string or undefined.

        if(cookie_value_stringified !== undefined){
            //Unlike with NextRequest.cookies in middlware where you have to do request.cookies.get().name and request.cookies.get().value for each, here, getting the cookie gets the value(getCookie()) if the cookie is there. Don't forget to parse it to unstringify it though.
            let cookie_value: Account = JSON.parse(cookie_value_stringified); //We only parse it after confirming that it's not undefined.
            console.log('Header cookie value', cookie_value);

            setDecodedClaims(cookie_value);
        } else {
            console.log('Header', 'No cookie available. Not logged in.');
        }
    }, []);
    
    return (
        <div>
            <ul>
                <li hidden={!decodedClaims.logged_in}>
                    <Link href="/">Home</Link>
                </li>
                <li hidden={decodedClaims.logged_in}>
                    <Link href="/login">Log In</Link>
                </li>
                <li hidden={decodedClaims.logged_in}>
                    <Link href="/about">About Everyone</Link>
                </li>
                <li hidden={decodedClaims.logged_in}>
                    <Link href="/about/customers">About Customers</Link>
                </li>
                <li hidden={decodedClaims.logged_in}>
                    <Link href="/about/customers/young">About Young Customers</Link>
                </li>
                <li hidden={decodedClaims.logged_in}>
                    <Link href="/about/investors">About Investors</Link>
                </li>
                <li hidden={!decodedClaims.logged_in || decodedClaims.account_type !== 'customer'}>
                    <Link href="/content/customers">Customer Content</Link>
                </li>
                <li hidden={!decodedClaims.logged_in || decodedClaims.account_type !== 'investor'}>
                    <Link href="/content/investors">Investor Content</Link>
                </li>
                <li hidden={!decodedClaims.logged_in}>
                    <Link href="/logout">Logout</Link>
                </li>
                <li hidden={!decodedClaims.logged_in}>
                    <p>Logged In: {`${decodedClaims.email}`}</p>
                </li>
            </ul>
        </div>
    )
}

export default Header;