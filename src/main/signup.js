import { useState, useContext } from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { Formik, Field, Form, FormikHelpers } from "formik";
import axios from 'axios';
// import AppContext from '../../context/context';
import { Link } from 'react-router-dom'; 
// import { EntryPage } from '../../Components/Login/login'; 
// import EntryCard from '../../Components/EntryCard/EntryCard';
// import InputGroup from '../../Components/InputGroup/InputGroup';
// import LoginInput from '../../Components/Input/LoginInput';
// import LoginButton from '../../Components/LoginButton/LoginButton';
// import { Container, FormContainer } from '../../Components/Container/container'
import Promo from './loginpromo'
import styled from 'styled-components'
import { Auth } from 'aws-amplify'
import AppContext from '../context/context'
import { useMediaQuery } from 'react-responsive'
import GoogleButton from 'react-google-button'



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
position: absolute;
height: 100%;
width: 100%;
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
    align-items: center; 
    flex-direction: row; 
    min-height: 100vh;
    background-color: #ffffff; 
    justify-content: center;
    width: 80%;
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

export default function SignUp() {
    const history = useHistory();
    const initialValues= { name:'', email: '', username: '', password: '' };
    const initialValuesCode= { code:''};
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageCode, setErrorMessageCode] = useState('');
    const [isCreated, setIsCreated] = useState(false);
    const [email, setEmail] = useState('');
    const isMobile = useMediaQuery({ query: '(max-width: 759px)' })
    const context = useContext(AppContext)


    const handleSubmit = async(values, actions) => {
        const username = values.email;
        setEmail(username);
        const password = values.password;
        const name = values.name;
        try {
            const { user } = await Auth.signUp({
                username,
                password,
                attributes: {
                    name,          // optional
                    // other custom attributes 
                }
            });
            console.log(user);
            setIsCreated(true);
        } catch (error) {
            setErrorMessage(error.message)
            console.log('error signing up:', error);
        }
    }

    const handleSubmitCode = async(values, actions) => {
        const code = values.code;
        const username = values.email;
        const password = values.password;
        try {
            await Auth.confirmSignUp(email, code);
            const user = await Auth.signIn(username, password);
            console.log(user);
            context.signin(user);
            history.push("/")
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

    const login = (values) => {
        // axios({
        //     method: 'post',
        //     url: `${context.API_BASE_URL}/login`,
        //     data: {
        //       username: values.username,
        //       password: values.password
        //     }
        //   }).then(
        //     function(response) {
        //         if(response.status === 200){    
        //             context.updateToken(response.headers.authorization);
        //             history.push("/journals");
        //         } else if (response.status === 403){
        //             console.log("invalid username or password");
        //         } else {
        //             console.log("server error");
        //         }
        //     }
        // ).catch(
        //     function(e) {
        //         setShowError(true);
        //     }
        // );
    
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
                        isCreated ?
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
                        <h1 data-testid="signupheader">Sign Up</h1>
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
                                    <label htmlFor='name'>Name</label>
                                    <Field name='name' id="name" type='text' as={LoginInput} />
                                </InputGroup>
                                <InputGroup>
                                    <label htmlFor='email'>Email</label>
                                    <Field name='email' id="email" type='text'  as={LoginInput} />
                                </InputGroup>
                                {/* <InputGroup>
                                    <label htmlFor='username'>Username</label>
                                    <Field name='username' id="username" type='text' placeholder='JohnT' as={LoginInput} />
                                </InputGroup> */}
                                <InputGroup>
                                    <label htmlFor='password'>Password</label>
                                    <Field name='password' id='password' type='password'  as={LoginInput} />
                                </InputGroup>
                                <LoginButton type='submit' data-testid="signupbutton" full>Sign Up</LoginButton>
                            </Form> 
                        </Formik>
                        </>

                    }
                    {
                        showError ?
                        <p style={{color: 'red'}}>Username already exists</p>
                        :
                        <></>
                    }   
                    <span>
                        Already have an account?
                        <Link to="/login" onClick={() => history.push("/login")} data-testid='tologin'>Sign In</Link>
                    </span>
                </EntryCard>
            </EntryPage>
          </FormContainer>
        </Container>
        </Router>
    );
}