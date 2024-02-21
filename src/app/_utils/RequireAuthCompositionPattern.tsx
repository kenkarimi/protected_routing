import { FunctionComponent } from 'react';

import { AccountRequired } from './GlobalEnumerations';
import RequireAuth from './RequireAuth';

/*Because we don't know whether we're receiving a client or server component as a child,
 we have to pass it down to requireAuth, which is a client component, as props and 'slot' it(Just in case the child was a server component).
 This is because we can't render a server component inside a client component otherwise.
 We use <Client> <Server/> <Client/> pattern in a parent server component(like here) to send it down as child prop. More here: https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#unsupported-pattern-importing-server-components-into-client-components
*/

const requireAuthCompositionPattern = (Child: FunctionComponent, account_required: AccountRequired) => {

    const NewComponent = (props: any) => { //This component is needed purely to receive the rest of the props(if they're there) e.g. message prop passed to the embeded <Home /> component in /content/customers and /content/investors. This is because passing them above like so, (Child: FunctionComponent, account_required: string, ...props: any) wouldn't work. If there aren't any extra props passed down to ANY embeded route components in this manner project wide, then we could do without this NewComponent and its 'return NewComponent' below, but this is good practice.
        return (
            <RequireAuth account_required={account_required}>{/*account_required is passed down the same way we would've done it in a HOC in create-react-app using react-router-dom. It's also received the same way in requireAuth.*/}
                <Child {...props}/> {/*Passes down the message prop passed to the embeded <Home /> component in /content/customers and /content/investors to the Child*/}
            </RequireAuth>
        )
    }

    return NewComponent;
}

export default requireAuthCompositionPattern;