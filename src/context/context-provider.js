import React, {useState} from 'react'
import AppContext from './context'
import App from '../main/App'
import { Auth, Hub } from 'aws-amplify';
import { listDepartments } from '../graphql/queries';
import { API } from 'aws-amplify'



/** The context provider for our app */
export default function AppProvider() {
  const [ user, setUser ] = useState(null);
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);


    // componentDidMount() {
    //   Hub.listen("auth", ({ payload: { event, data } }) => {
    //     console.log(event, data)
    //     switch (event) {
    //       case "signIn":
    //         this.setState({ user: data });
    //         break;
    //       case 'cognitoHostedUI':
    //         console.log(data)
    //         break;
    //       case "signOut":
    //         this.setState({ user: null });
    //         break;
    //       case "customOAuthState":
    //         this.setState({ customState: data });
    //     }
    //   });
  
    //   Auth.currentAuthenticatedUser()
    //     .then(user => this.setState({ user }))
    //     .catch(() => console.log("Not signed in"));
    // }


    // componentDidMount() {
    //   Hub.listen('auth', (data) => {
    //         console.log(data)
    //     })
  
    //   Auth.currentAuthenticatedUser()
    //     .then(user => this.setState({ user }))
    //     .catch(() => console.log("Not signed in"));
    // }

    const getUser = () => {
      Auth.currentAuthenticatedUser()
        .then(user => setUser({ user }))
        .then(console.log(user))
        .catch(() => console.log("Not signed in"));
    }

    const signin = (user) => {
      setIsAuthenticated(true);
      setUser(user);
    };

    const logout = () => {
      setIsAuthenticated(false);
      setUser(null);
    }



        return (
            <AppContext.Provider value={{user, isAuthenticated, signin, logout}}>
                <App />
            </AppContext.Provider>
        )

}
