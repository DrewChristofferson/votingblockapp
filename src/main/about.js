import React from 'react'
import styled from 'styled-components'
import { Link, useRouteMatch } from 'react-router-dom'

const AboutContainer = styled.div`
    @media (max-width: 799px){
        margin: 2.5rem 2.5rem;
    }
    
    @media (min-width: 800px){
        margin: 5rem 20rem;
    }
    
    display: flex;
    flex-direction: column;
    align-items: flex-start;

`
const AboutHeader = styled.h2`
    padding-bottom: 20px;
`

const AboutContent = styled.p`
    line-height: 2;
    text-align: left;
`
const Signature = styled.div`
    padding-top: 20px;
    display: flex;
    flex-direction: column;
`
const SignatureName = styled.p`
    line-height: 2;
    text-align: left;
    font-weight: bold;
`

function About() {
    const match = useRouteMatch();
    return (
        <AboutContainer>
            <AboutHeader>Hello Friends!</AboutHeader>
            <AboutContent>
                We created the VotingBlock platform because we found ourselves always Googling "What is the best..."
                For example, go ahead and search "Best Date Ideas" and you will find a plethora of results. Google even
                does a great job of providing local results for you. However, the frusterating thing is that almost 
                every result is a blog post with one person's opinion -- usually bad opinion we might add. 
            </AboutContent>
            <AboutContent>
                We wanted
                to find the top ideas across all our peers. Yes, we could post a poll on social media, but those results 
                can't be distributed to all of us. We decided to build a platform -- not the Yelp of this or the Rotten 
                Tomatoes of that -- but a true crowd-sourced ratings platform of customized categories! The category
                can be anything from Best Fantasy Novels to Best Stocks to Invest in This Year. 
            </AboutContent>
            <AboutContent>
                This platform is built primarily for BYU students. Our team has built two special categories with extra
                functionality to help students plan out their academic schedules: BYU Courses 
                and BYU Professors. We think you'll find that it is much better than RateMyProfessor.
            </AboutContent>
            <AboutContent>
                If you want to send any feedback or a more personal message, 
                please shoot us an email at <a href="mailto:info.votingblock@gmail.com">info.votingblock@gmail.com </a>   
                and we'll try to respond as soon as we can. Thanks for trying out the platform. Please share your favorite category on social media!
            </AboutContent>
            <Signature>
                <AboutContent>Cheers!</AboutContent>
                <AboutContent>Drew Christofferson</AboutContent>
                <AboutContent>Founder</AboutContent> 
            </Signature>
            <div className="fb-share-button" 
                data-href="https://master.d31xdmjzvsaw7v.amplifyapp.com/about"
                data-layout="button_count">
            </div>
            
        </AboutContainer>
    )
}

export default About
