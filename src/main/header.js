import React, { useState, useEffect, useContext } from 'react'
import AppContext from '../context/context'
import { Auth } from 'aws-amplify';
import * as bs from 'react-bootstrap'
import { Link } from 'react-router-dom'
import SignupModal from '../components/SignupModal'
import SignIn from '../components/SignInButton'
import longlogo from '../images/longlogo.png'
// import { AmplifySignOut, AmplifySignInButton } from '@aws-amplify/ui-react'

function Header() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [name, setName] = useState();
    const context = useContext(AppContext)

    useEffect(() => {
        if(context.user){
            setIsSignedIn(true)
            checkUser();
        }
    }, [context])

    const checkUser = async() => {
        const user = await Auth.currentAuthenticatedUser()
        setName(user.attributes.name)
    }

    const showModal = () => {
        return(
            <SignupModal />
        )
    }

    let createNavDropdown = () => {
        if(context?.user?.attributes?.given_name){
            return(
                <bs.Nav style={{marginRight: "5%"}}>
                <bs.NavDropdown title={
                    <div style={{display: "inline", paddingRight: "15px"}}>
                        {isSignedIn ? 'My Account' : <></>}
                        {/* <img src={context?.user?.attributes?.picture} height="50px" alt="" /> */}
                    </div>
                    } 
                    id="basic-nav-dropdown">
                    {/* <bs.NavDropdown.Item href="#action/3.1">Settings</bs.NavDropdown.Item>
                    <bs.NavDropdown.Item href="#action/3.2">Account</bs.NavDropdown.Item> */}
                    <bs.NavDropdown.Item href="#action/3.3">Support</bs.NavDropdown.Item>
                    <bs.NavDropdown.Divider />
                    <bs.NavDropdown.Item onClick={() => Auth.signOut()}>Sign Out</bs.NavDropdown.Item>
                    {/* <button onClick={() => Auth.signOut()}>Sign Out</button> */}
                    {/* <bs.NavDropdown.Item href="#action/3.4">< AmplifySignOut /> </bs.NavDropdown.Item> */}
                </bs.NavDropdown>
            </bs.Nav>
            )
        } else {
            //TODO: change size
            return (
                <>
                <SignIn onClick={() => Auth.federatedSignIn()}>Sign In</SignIn>
                {/* <SignupModal /> */}
                </>
                // <AmplifySignInButton>Sign In</AmplifySignInButton>
            );
        }
    }

    return (
            <bs.Navbar variant="dark" expand="lg">
                <Link to="/">
                    <bs.Navbar.Brand> 
                        {/* <img alt="logo" src={cougarslogo} height="80px" className="mx-2"/>  */}
                        VotingBlock
                    </bs.Navbar.Brand>
                    {/* <bs.Navbar.Brand href="#home">
                    <img
                        src={longlogo}
                        width="120"
                        height="50"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                    />
                    </bs.Navbar.Brand> */}
                </Link>
                <bs.Navbar.Toggle aria-controls="basic-navbar-nav" />
                <bs.Navbar.Collapse id="basic-navbar-nav">
                    <bs.Nav className="mr-auto">
                        <Link to="/" className="nav-link">Home</Link>
                        {/* <Link to="/my-categories" className="nav-link">My Categories</Link>
                        <Link to="/saved" className="nav-link">Saved</Link> */}
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/support" className="nav-link">Feedback</Link>
                        {/* <AmplifySignInButton theme={myTheme}>Sign In</AmplifySignInButton> */}
                        {/* <AmplifySignInButton >Sign In</AmplifySignInButton> */}
                        
                    </bs.Nav>
                    <bs.Nav>
                        <Link to="/cart" className="nav-link"> <i className="fas fa-shopping-cart"> </i> </Link>
                    </bs.Nav>
                    {
                        isSignedIn ?
                        <bs.Nav style={{marginRight: "5%"}}>
                            <bs.NavDropdown title={
                                <div style={{display: "inline", paddingRight: "15px"}}>
                                    {name}
                                    {/* <img src={context?.user?.attributes?.picture} height="50px" alt="" /> */}
                                </div>
                                } 
                                id="basic-nav-dropdown">
                                {/* <bs.NavDropdown.Item href="#action/3.1">Settings</bs.NavDropdown.Item>
                                <bs.NavDropdown.Item href="#action/3.2">Account</bs.NavDropdown.Item> */}
                                <bs.NavDropdown.Item href="/support">Support</bs.NavDropdown.Item>
                                <bs.NavDropdown.Divider />
                                <bs.NavDropdown.Item onClick={() => Auth.signOut()}>Sign Out</bs.NavDropdown.Item>
                                {/* <button onClick={() => Auth.signOut()}>Sign Out</button> */}
                                {/* <bs.NavDropdown.Item href="#action/3.4">< AmplifySignOut /> </bs.NavDropdown.Item> */}
                            </bs.NavDropdown>
                        </bs.Nav>
                        :
                        <SignIn onClick={() => Auth.federatedSignIn()}>Sign In</SignIn>
                    }
                </bs.Navbar.Collapse>
            </bs.Navbar>
    )
}

export default Header;