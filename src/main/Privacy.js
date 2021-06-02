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

function Privacy() {
    return (
        <AboutContainer>
            <AboutHeader>Privacy Policy</AboutHeader>
            <ul>
                <li>
                    Your ratings are anonymous
                </li>
                <li>
                    We retain the information you give upon signing up such as name and email
                </li>
                <li>
                    We will never distribute any information that you give or create on VotingBlock
                </li>
                <li>
                    We reserve the right to track anonymous user actions to collect feedback and make the platform better
                </li>
            </ul>
        </AboutContainer>
    )
}

export default Privacy
