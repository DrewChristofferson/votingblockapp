import React from 'react'
import styled from 'styled-components'
import { Link, useRouteMatch } from 'react-router-dom'

const AboutContainer = styled.div`
    @media (max-width: 799px){
        margin: 3rem 2rem;
    }
    @media (min-width: 800px){
        margin: 5rem 10rem;
    }

    
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;

`
const AboutHeader = styled.h2`
    padding-bottom: 20px;
`

function Terms() {
    const match = useRouteMatch();
    return (
        <AboutContainer>
            <AboutHeader>Terms and Conditions</AboutHeader>
            <ul>
                <li>
                    By signing up, you agree to the terms and conditions
                </li>
                <li>
                    We reserve the right to delete any user accounts that post obscene or abusive content
                </li>
                <li>
                    VotingBlock is completely free, and will always be free for users
                </li>
                <li>
                    Since VotingBlock is an open source platform where ratings are crowd-sourced, we do not assume any liability that could harm something or someone's reputation
                </li>
            </ul>
        </AboutContainer>
    )
}

export default Terms
