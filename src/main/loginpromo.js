import React from 'react'
import styled from 'styled-components'
import { IoMdBookmarks } from 'react-icons/io';
import Logo from '../images/longlogo.png'


const PromoContainer = styled.div`
    flex-basis: 40%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: black;
    color: white;
    padding-bottom: 10%;
`

const Title = styled.h1`
    font-size: 50px;
`
const QuoteRight = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 90%;
    font-size: 68px;
    font-weight: 800;
`
const QuoteLeft = styled.div`
    display: flex;
    justify-content: flex-start;
    width: 90%;
    font-size: 68px;
    font-weight: 800;
`
const QuoteContent = styled.div`
    width: 75%;
    font-size: 24px;
    font-weidht: 400;
    font-style: italic; 
`
const QuoteAuthorContent = styled.div`
    width: 50%;
    font-size: 20px;
    font-weidht: 500;
`

function LoginPromo() {
    return (
        <PromoContainer>
            {/* <IoMdBookmarks size="100"/> */}
            <img alt="VotingBlock" src={Logo} width='80%'/>
            {/* <Title>VotingBlock</Title> */}
            {/* <QuoteLeft>&#8220;</QuoteLeft> */}
            <QuoteContent>2,048 ratings and counting 🎉</QuoteContent>
            {/* <QuoteRight>&#8221;</QuoteRight> */}
            {/* <QuoteAuthorContent>- John Turner, Super Smart Developer</QuoteAuthorContent> */}
        </PromoContainer>
    )
}

export default LoginPromo