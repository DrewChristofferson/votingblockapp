// import React from 'react';
// import * as bs from 'react-bootstrap'
// import '../styles/App.css';
// // import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
// import Amplify, { Auth, Hub } from 'aws-amplify';
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Field, Form, FormikHelpers } from "formik";
import axios from 'axios';
import { BrowserRouter as Router, Link } from 'react-router-dom'; 
// import { EntryPage } from '../Components/login'; 
// import EntryCard from '../Components/EntryCard';
// import InputGroup from '../Components/InputGroup';
// import LoginInput from '../Components/LoginInput';
// import LoginButton from '../Components/LoginButton';
// import { Container, FormContainer } from '../../Components/Container/container'
import Promo from './loginpromo'
import styled from 'styled-components'; 
import { Auth } from 'aws-amplify'
import AppContext from '../context/context'
import { useMediaQuery } from 'react-responsive'
import GoogleButton from 'react-google-button'


const GoogleButtonWhite = styled(GoogleButton)`
    color: white;
`      

const LoginInput = styled.input`
    width: 100%; 
    outline: none; 
    padding: 8px 16px; 
    margin-bottom: 10px;
    border: 1px solid #e0e6e8; 
    border-radius: 4px; 
    font-size: 1rem; 
    color: black; 
    transition: box-shadow 0.2s; 
    &::placeholder {
        color: #dedede; 
    }
    &:focus {
        box-shadow: 0 0 0 2px rgb(169, 172, 255, 0.5); 
    }
`;

export const Container = styled.div`
display: flex;

@media(min-width: 760px){
    position: absolute;
    height: 100%;
    width: 100%;
}
`

export const FormContainer = styled.div`
flex-basis: 60%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
@media(max-width: 759px){
    flex-basis: 100%
}
`

const InputGroup = styled.div`
    margin-bottom: 24px; 
    text-align: left; 
    label {
        display: inline-block; 
        margin-bottom: 0.5rem; 
        color: #888888;
    }
`;

const EntryCard = styled.div`
    width: 100%; 
    max-width: 600px; 
    padding: 50px; 
    @media(max-width: 759px){
        padding: 50px 10px;
    }
    margin-bottom: 40px; 
    background-color: #ffffff; 
    text-align: center; 
    h2 {
        font-weight: 500; 
        margin-bottom: 50px; 
    }
    span { 
        display: block;
        margin-top: 40px; 
        color: #888888; 
        font-size: 14px;
    }
    a{
        margin-left: 4px; 
        color: #2f8bfd; 
    }
`;

export const EntryPage = styled.div`
    display: flex; 
    
    flex-direction: row; 
    @media(min-width: 760px){
        min-height: 100vh;
        width: 100%;
        align-items: center; 
        justify-content: center;
    }
    background-color: #ffffff; 
    
    
`;

export const PageHeader = styled(Link)`
    font-size: 2rem; 
    font-weight: 600; 
    margin: 40px 0; 
    color: inherit;
`

const LoginButton = styled.button`
    width: ${props => props.full ? '100%' : null}; 
    min-width: 64px; 
    border: 0; 
    align-items: center;
    border-radius: 4px; 
    padding: 8px 16px; 
    outline: none; 
    background-color: #111111; 
    color: #ffffff; 
    font-size: 0.875rem; 
    font-weight: 500; 
    line-height: 1.5;
    letter-spacing: 0.02857rem; 
    cursor: pointer; 
    transition: all 0.2s; 
    &:hover { background-color: #ffffff;
                color: #111111;
                border: 2px solid #111111; 
            }
`;

const Error = styled.p`
    color: red;
`



export default function Login() {
    const history = useHistory();
    const initialValues= { username: '', password: '' };
    const initialValuesCode= { code: '' };
    const [showError, setShowError] = useState(false);
    const [notConfirmed, setNotConfirmed] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageCode, setErrorMessageCode] = useState('');
    const [email, setEmail] = useState('');
    const isMobile = useMediaQuery({ query: '(max-width: 759px)' })
    const context = useContext(AppContext)




    const handleSubmit = async(values, actions) => {
        const username = values.username;
        const password = values.password;
        try {
            const user = await Auth.signIn(username, password);
            console.log(user);
            context.signin(user);
            history.push("/")
        } catch (error) {
            if(error.code === "UserNotConfirmedException"){
                setEmail(username)
                try {
                    await Auth.resendSignUp(username);
                    console.log('code resent successfully');
                } catch (err) {
                    console.log('error resending code: ', err);
                }
                setNotConfirmed(true);
            }
            else{
                setErrorMessage(error.message)
            }
            console.log('error signing in', error);
        }
    //     axios({
    //         method: 'post',
    //         data: {
    //           username: values.username,
    //           password: values.password
    //         }
    //       }).then(
    //         function(response) {
    //             if(response.status === 200){    
    //                 history.push("/journals");
    //             } else if (response.status === 403){
    //                 console.log("invalid username or password");
    //             } else {
    //                 console.log("server error");
    //             }
    //         }
    //     ).catch(
    //         function(e) {
    //             setShowError(true);
    //         }
    //     );
    //     actions.setSubmitting(false);
    }

    const handleSubmitCode = async(values, actions) => {
        const code = values.code;
        try {
            await Auth.confirmSignUp(email, code);
            let url = window.localStorage.getItem('redirectURL')
            if(url){
                history.push(url)
                window.localStorage.removeItem('redirectURL')
            } else {
                history.push("/")
            }
          } catch (error) {
                setErrorMessageCode(error.message)
              console.log('error confirming sign up', error);
          }
    
        // axios({
        //     method: 'post',
        //     url: `${context.API_BASE_URL}/api/v1/user`,
        //     data: {
        //       name: values.name,
        //       email: values.email,
        //       username: values.username,
        //       password: values.password
        //     }
        //   }).then(
        //     function(response) {
        //         if(response.status === 200){
        //             login(values)
        //         } else if (response.status === 405){
        //             console.log("Method Not Allowed");
        //         } else {
        //             console.log("server error");
        //         }
        //     }
        // ).catch(
        //     function(e) {
        //         setShowError(true);
        //     }
        // );
        // actions.setSubmitting(false);
    }

    return (
        <Router>
        <Container>
            {
                isMobile ?
                <></>
                :
                <Promo/>
            }
            <FormContainer>
            <EntryPage>
                {/* <PageHeader to="/">Awesome Journal</PageHeader> */}
                <EntryCard>
                    {
                        notConfirmed ?
                        <>
                        <h1 data-testid="signupcode">Sign Up</h1>
                        {
                            errorMessageCode ?
                            <Error>{errorMessageCode}</Error>
                            :
                            <></>
                        }
                        <Formik 
                            initialValuesCode={initialValuesCode}
                            onSubmit={(values, actions) => {
                            handleSubmitCode( values, actions );
                        }}>
                            <Form>
                                <InputGroup>
                                    <label htmlFor='code'>Enter the code sent to your email</label>
                                    <Field name='code' id="code" type='text' as={LoginInput} />
                                </InputGroup>
                                <LoginButton type='submit' data-testid="signupcodebutton" full>Get Started</LoginButton>
                            </Form> 
                        </Formik>
                        </>
                        :
                        <>
                            <h1 data-testid='loginheader'>Login</h1>
                            {
                                errorMessage ?
                                <Error>{errorMessage}</Error>
                                :
                                <></>
                            }  
                            <Formik 
                                initialValues={initialValues}
                                onSubmit={(values, actions) => {
                                handleSubmit( values, actions );
                            }}>
                                <Form>
                                    <InputGroup>
                                        <label htmlFor='username'>Username</label>
                                        <Field name='username' id='username' type='text' as={LoginInput} />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor='password'>Password</label>
                                        <Field name='password' id='password' type='password' as={LoginInput} />
                                    </InputGroup>
                                    <LoginButton type='submit' data-testid='loginbutton' full>Sign In</LoginButton>
                                </Form> 
                            </Formik>
                            {/* <GoogleButton onClick={() => Auth.federatedSignIn({provider: 'Google'})}/> */}

                             
                            <span>
                                Don't have an account?
                                <Link to="/signup" data-testid='tosignup' onClick={() => history.push("/signup")}>Sign Up</Link>
                            </span>
                        </>
                    }
                    
                </EntryCard>
            </EntryPage>
          </FormContainer>
        </Container>
        </Router>
    );
}