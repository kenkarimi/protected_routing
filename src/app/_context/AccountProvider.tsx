'use client'

import React, { createContext, useState } from 'react';

type AccountType = 'customer' | 'investor' | null;
//type AccountType = string | null; //If you don't mind the string being anything, you can do this.
//NB: An enum can't achieve this because while you can assign Customer = 'customer' & Investor = 'investor', you can't assign Default = null or undefined.

type Account = { //Instead of using a general type like object, ince we know all the key values that'll be in the decoded claims object, we make our own custom type.
  logged_in: boolean;
  account_type: AccountType;
  email: string;
}

interface DecodedClaims {
    decodedClaims: Account; //Account as the type instead of object.
    setDecodedClaims: React.Dispatch<React.SetStateAction<Account>>;
}

export const AccountContext: React.Context<DecodedClaims> = createContext<DecodedClaims>({
    decodedClaims: { //instead of an empty object, we now have to fulfill the conditions of the 'Account' type.
        logged_in: false,
        account_type: null,
        email: ''
    },
    setDecodedClaims: () => {}
});

const AccountProvider = ({ children }: { children: React.ReactNode }) => {

    const [decodedClaims, setDecodedClaims] = useState<Account>({
        logged_in: false,
        account_type: null,
        email: ''
    })

    return (
        <AccountContext.Provider value={{ decodedClaims, setDecodedClaims }}>
            { children }
        </AccountContext.Provider>
    )
}

export default AccountProvider;