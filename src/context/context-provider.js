import React, {useState, useEffect} from 'react'
import AppContext from './context'
import App from '../main/App'
import { Auth, Hub } from 'aws-amplify';
import { listDepartments } from '../graphql/queries';
import { API } from 'aws-amplify'



/** The context provider for our app */
export default function AppProvider() {
  const [ user, setUser ] = useState(null);
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);


  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUserSocial().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUserSocial().then(userData => setUser(userData));
  }, []);

  function getUserSocial() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }
  


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
