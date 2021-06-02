import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import { IconContext } from "react-icons";
import { AiFillFacebook } from 'react-icons/ai'
import { AiFillInstagram } from 'react-icons/ai'
import {AiFillYoutube} from 'react-icons/ai'
import {AiOutlineTwitter} from 'react-icons/ai'

const FooterContainer = styled.div`
    background-color: #b5b5b5;
    width: 100%;
    display: flex;
    flex-direction: column;
`

const CopyrightContainer = styled.div`
    
    color: #565656;
    display: flex;
    
    
    
    @media(min-width: 760px){
        justify-content: space-around;
        align-items: flex-end;
        width: 100%;
        font-size: 13px;
        padding: 30px 0 20px;
    }
    @media(max-width: 759px){
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        padding: 20px 0 10px;
    }
`

const CopyrightText = styled.p`
    flexbasis: 50%;
    margin: 0;
    @media(max-width: 759px){
        padding: .2rem 0;
    }
`
const IconsContainer = styled.div`
    flexbasis: 20%;
    display: flex;
    justify-content: space-between;
    @media(max-width: 759px){
        padding: .2rem 0;
    }
`
const PoliciesContainer = styled.div`
    flexbasis: 30%;
    @media(max-width: 759px){
        padding: .2rem 0;
    }
`

const FooterLink = styled(Link)`
    padding: 0 5px;
`

function Footer  () {
    return(
        <FooterContainer>
            <CopyrightContainer>
                <IconsContainer>
                    <IconContext.Provider value={{ color: 'black', size: '20px', style: { margin: '0 10px' } }}>
                        <div>
                            <a href="https://www.facebook.com/votingblock.io" target="_blank"><AiFillFacebook /></a>
                        </div>
                    </IconContext.Provider>
                    <IconContext.Provider value={{ color: 'black', size: '20px', style: { margin: '0 10px' } }}>
                        <div>
                            <a href="https://www.instagram.com/votingblock.io/" target="_blank"><AiFillInstagram /></a>
                        </div>
                    </IconContext.Provider>
                    {/* <IconContext.Provider value={{ color: 'black', size: '20px', style: { margin: '0 10px' } }}>
                        <div>
                            <AiOutlineTwitter />
                        </div>
                    </IconContext.Provider>
                    <IconContext.Provider value={{ color: 'black', size: '20px', style: { margin: '0 10px' } }}>
                        <div>
                            <AiFillYoutube />
                        </div>
                    </IconContext.Provider> */}
                </IconsContainer>
                <CopyrightText>
                    &copy; {new Date().getFullYear()} Copyright: VotingBlock
                </CopyrightText>
                <PoliciesContainer>
                    <FooterLink to="/terms">Terms</FooterLink> 
                    <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>      
                </PoliciesContainer>
            </CopyrightContainer>
        </FooterContainer>
            

    )
}

export default Footer;