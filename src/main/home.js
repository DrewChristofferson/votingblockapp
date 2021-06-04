import React, { useState, useContext } from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'
import classroom from '../images/classroom.jpg'
import boardgame from '../images/boardgame.jpg'
import arrowbackground from '../images/arrowbackground.jpeg'
import professor from '../images/professor.jpg'
import background from '../images/barnbackground.jpg'
import * as BsIcons from 'react-icons/bs'
import { listCategorys, ratingsByCategory } from '../graphql/queries'
import { API } from 'aws-amplify'
import styled from 'styled-components'
import AppContext from '../context/context'
import { useMediaQuery } from 'react-responsive'
import mixpanel from 'mixpanel-browser';
mixpanel.init('6e42aa7487ee22e48b064f155a467a8d');



const JumboTron = styled(bs.Jumbotron)` 
    background-image: url(https://voting-block-images.s3-us-west-2.amazonaws.com/background.jpeg);
    background-position: 100% 20%;
    background-size: 120%;
    background-repeat: no-repeat;
    padding-bottom: 8rem;
    @media (max-width: 1199px) and (min-width: 760px) {
        padding-bottom: 1rem;
        background-position: 100% 20%;
        background-size: 130%;
      }
    @media (max-width: 759px) {
        padding-bottom: 1rem;
        background-position: 100% 20%;
        background-size: 180%;
      }
`

const AboutSection = styled.div` 
    padding: 30px 100px;
    background-color: #333333;
    color: white;
    border-radius: 15px;
    font-size: 16px;
    line-height: 1.8em;
`
const AboutTitle = styled.span` 
    font-size: 20px;
    line-height: 2em;
`

const SearchPlaceholder = styled(bs.Form.Control)`
    font-size: 1rem;
    position: relative;
    @media (max-width: 799px) {
        font-size: .75rem;
      }
`
const ContentContainer = styled(bs.Container)`
  
`
const DarkImage = styled.div`
    background-color: rgba(0, 0, 0, 0.7);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
`
const StyledInputGroup = styled(bs.InputGroup)`
 
`




function Home() {
    const [categorys, setCategorys] = useState({});
    const [countProfRatings, setCountProfRatings] = useState(0);
    const [isLoadingCategorys, setIsLoadingCategorys] = useState(true);
    const [isLoadingRatings, setIsLoadingRatings] = useState(true);
    const [searchSuggestions, setSearchSuggestions] = useState();
    let history = useHistory();
    const context = useContext(AppContext);
    const isMobile = useMediaQuery({ query: '(max-width: 759px)' })

    

    useState(() => {
        if(window.localStorage.getItem('redirectURL')){
            history.push(window.localStorage.getItem('redirectURL'))
            window.localStorage.removeItem('redirectURL');
        }
        getData();
    }, [])


    async function getData() {
        let sortedByName; //TODO
        let sortedByRatings;
        const apiData = await API.graphql({ query: listCategorys, authMode: 'API_KEY' });
        const categorysFromAPI = apiData.data.listCategorys.items;

        await Promise.all(categorysFromAPI.map(async category => {
          return category;
        }))

        sortedByRatings = apiData.data.listCategorys.items;
        sortedByRatings.sort((a, b) => (a.numRatings < b.numRatings) ? 1 : (a.numRatings === b.numRatings) ? ((a.name > b.name) ? 1 : -1) : -1 )
        setCategorys(sortedByRatings);
        setIsLoadingCategorys(false);
    }


    function handleClick(id) {
        if(id){
            mixpanel.track(`Category ${id} click`);
            mixpanel.track('Category click');
            history.push(`category/${id}`);
        }
      }

    let handleSearchChange = (val) => {
        let searchCategorys = [];
        let regex;
        if(val){
            regex = new RegExp(`${val.toUpperCase()}`);
            let i = 0;
            while (searchCategorys.length <= 5){
                if(categorys[i]){
                    if(regex && regex.test(categorys[i].name.toUpperCase())){
                        searchCategorys.push(categorys[i]);
                    }     
                    i++;
                } else break;   
            }
            if(!searchCategorys[0]){
                searchCategorys = 'noData'
            }
            setSearchSuggestions(searchCategorys);
        } else {
            setSearchSuggestions(null);
        }
    }

    let returnSearchSuggestions = () => {
        if(searchSuggestions){
            if(searchSuggestions === 'noData'){
                return(
                    <div>
                        <p>No categories found</p>
                    </div> 
                )
            }
            else{
                return(
                    searchSuggestions.map(category => ( 
                        <div key={category.id} onClick={() => handleClick(category.id)}>
                            <p>{category.name}</p>
                        </div>   
                    ))
                );
            } 
        } else return null;
    }

    let submitHandler = (e) => {
        e.preventDefault();
    }


    if(categorys[0]){
        return(
            <>
            <div className="py-0">
                <JumboTron fluid >
                    <ContentContainer style={{my: "5rem"}} className="py-0">
                        <h1 className="title"><span style={{color: "#002e74"}}>Voting</span><span style={{color: "#0063f3"}}>Block</span></h1>
                        <h4 className="subtitle">
                            Find top recommendations by category.
                        </h4>
                        {/* <bs.Form onSubmit={submitHandler}>
                            <bs.Row style={{marginTop: "2rem"}} className="justify-content-md-center">
                                <bs.Col md="6">
                                    <StyledInputGroup>
                                        <SearchPlaceholder onChange={(e) => handleSearchChange(e.currentTarget.value)} placeholder="Search for a category..." />
                                        <bs.InputGroup.Append onClick={() => handleClick(searchSuggestions ? searchSuggestions[0].id : null)}>
                                            <bs.InputGroup.Text id="basic-addon2" style={{backgroundColor: "#2077B0", border: "none"}}><BsIcons.BsSearch style={{color: "white", cursor: "pointer"}}/></bs.InputGroup.Text>
                                        </bs.InputGroup.Append>
                                    </StyledInputGroup>
                                
                                </bs.Col>
                            </bs.Row>
                        </bs.Form> */}
                        {/* <div className="searchDropdown">
                            {returnSearchSuggestions()}
                        </div> */}
                        {/* !hardcoded! */}
                        <p className="trending">
                            {
                                categorys[2] ?
                                <div>
                                <span>Trending: </span>
                                <span className="trending-item" onClick={() => handleClick(categorys[0].id)}> {categorys[0].name}</span>
                                , <span className="trending-item" onClick={() => handleClick(categorys[1].id)}> {categorys[1].name}</span>
                                {/* , <span className="trending-item" onClick={() => handleClick(categorys[2].id)}> {categorys[2].name}</span> */}
                                </div>
                                :
                            <></>
                            }

                            
                        </p>
                    </ContentContainer>
                </JumboTron>
                <div id="main-container">
                    {
                        context?.user ?
                        <></>
                        :
                        isMobile ?
                        <></>
                        :
                        <AboutSection>
                            <AboutTitle>Hi there and welcome to VotingBlock 👋 </AboutTitle> <br />
                            This is a new platform where you can browse categories ("Blocks") and see what the world recommends.
                            Sign in to easily 🔼 or 🔽 vote each item or leave a comment to add your opinion. 
                            More blocks coming soon.
                        </AboutSection>
                    }
                    
                    {/* <div className="categorySection">
                        <h1>Recently Added</h1>
                        <div className="categoryPreview">
                            {
                                categorys.map(category => {
                                    if(category.createdAt.split('T')[0] === '2021-04-20'){
                                        return(
                                            <div key={category.id}>
                                                <bs.Card key={category.id} style={{ width: '12rem', color: "black" }} className="categoryItemPreview">
                                                <Link to={`/category/${category.id}`} className="nav-link" style={{color: "black", width: '100%'}}>
                                                <bs.Card.Text style={{fontSize: '14px', marginBottom: '.3rem', textAlign: 'center'}}>
                                                        {`${category.numRatings} Ratings | ${category.items.items.length} Items`}
                                                    </bs.Card.Text>
                                                <bs.Card.Img variant="top" alt="img" src={category.imgsrc ? category.imgsrc : boardgame} />
                                                <bs.Card.Body style={{padding: '20px 5px'}}>
                                                    <bs.Card.Title>{category.name}</bs.Card.Title>                                                   
                                                    <bs.Card.Text style={{fontSize: '12px', fontWeight: '600', marginBottom: '.3rem'}}>                                        
                                                        {`Created By: ${category.createdBy ? category.createdBy : 'Private User'}`}
                                                    </bs.Card.Text>
                                                    <bs.Card.Text style={{fontSize: '14px', marginBottom: 0}}>
                                                        {category.description}
                                                    </bs.Card.Text>
                                                </bs.Card.Body>
                                                </Link>
                                                </bs.Card>
                                            </div>
                                        )
                                    } else return <></>
                                })
                            }
                        </div> 
                    </div> */}
                    <div className="categorySection">
                        <h1 className="sectionTitle">Popular</h1>
                        <div className="categoryPreview">
                            {
                                categorys.map(category => {
                                    if(category.numRatings >= 5){
                                        return(
                                            <div key={category.id}>
                                                <bs.Card key={category.id} className="categoryItemPreview">
                                                <Link to={category.link ? category.link : `/category/${category.id}`} className="nav-link" style={{color: "black", width: '100%'}}>
                                                {/* <bs.Card.Text style={{fontSize: '14px', marginBottom: '.3rem', textAlign: 'center'}}>
                                                        {`${category.numRatings} Ratings | ${category.items.items.length} Items`}  
                                                    </bs.Card.Text> */}
                                                <bs.Card.Img variant="top" alt="img" src={category.imgsrc ? category.imgsrc : boardgame} />
                                                <bs.Card.Body style={{padding: '20px 5px'}}>
                                                    <bs.Card.Title className="cardTitle">{category.name}</bs.Card.Title>
                                                    <bs.Card.Text className="cardCreatedBy">
                                                        {`Created By: ${category.createdBy ? category.createdBy : 'Private User'}`}
                                                    </bs.Card.Text>
                                                    <bs.Card.Text className="cardDescription">
                                                        {category.description}
                                                    </bs.Card.Text>
                                                </bs.Card.Body>
                                                </Link>
                                                </bs.Card>
                                            </div>
                                        )
                                    } else return <></>   
                                })
                            }
                        </div> 
                    </div>
                    <div className="banner">
                        <div className="bannerTitle">
                            Start a New Block
                        </div>
                        <div className="bannerSubtitle">
                            Want recommendations or suggestions from your peers? Create a block on anything from Fantasy Novels to Stocks to buy.
                        </div>
                        <div className="bannerCTA">
                            <bs.Button onClick={() => history.push("/create-category")}>Create New Block</bs.Button>
                            {/* <CreateCatModal getCategorys={getData}/> */}
                        </div>
                    </div>
                    <div className="categorySection">
                        <h1 className="sectionTitle">All Blocks</h1>
                        <div className="categoryPreview">
                            {
                                categorys.map(category => {
                                        return(
                                            
                                            category.id === 'byu-professors' || category.id === 'byu-courses' ?
                                            <div key={category.id}>
                                                <bs.Card key={category.id}  className="categoryItemPreview">
                                                    <Link to={category.link ? category.link : `/category/${category.id}`} className="nav-link" style={{color: "black", width: '100%'}}>
                                                        {/* <bs.Card.Text style={{fontSize: '14px', marginBottom: '.3rem', textAlign: 'center'}}>
                                                            {`${category.numRatings} Ratings | ${category.items.items.length} Items`}
                                                        </bs.Card.Text> */}
                                                        <bs.Card.Img variant="top" alt="img" src={category.imgsrc ? category.imgsrc : boardgame} />
                                                        <bs.Card.Body style={{padding: '20px 5px'}}>
                                                            <bs.Card.Title className="cardTitle">{category.name}</bs.Card.Title>
                                                            <bs.Card.Text className="cardCreatedBy">
                                                                {`Created By: ${category.createdBy ? category.createdBy : 'Private User'}`}
                                                            </bs.Card.Text>
                                                            <bs.Card.Text className="cardDescription">
                                                                {category.description}
                                                            </bs.Card.Text>
                                                        </bs.Card.Body>
                                                    </Link>
                                                </bs.Card>
                                            </div>
                                            :
                                          
                                            <div key={category.id} >
                                                <bs.Card key={category.id}  className="categoryItemPreview" style={{cursor: 'default'}}>
                                                    <div className="nav-link" style={{color: "black", width: '100%'}}>
                                                    <p style={{ position: 'absolute', top: '10px', right: '25px', zIndex: '10', fontSize: '12px', fontWeight: '600', color: '#ffffff', fontStyle: 'italic'}}>
                                                            Coming Soon
                                                        </p>
                                                        
                                                        <bs.Card.Img variant="top" alt="img" style={{filter: 'brightness(.4)'}} src={category.imgsrc ? category.imgsrc : boardgame} />
                                                        <bs.Card.Body style={{padding: '20px 5px'}}>
                                                            <bs.Card.Title className="cardTitle">{category.name}</bs.Card.Title>
                                                            <bs.Card.Text className="cardCreatedBy">
                                                                {`Created By: ${category.createdBy ? category.createdBy : 'Private User'}`}
                                                            </bs.Card.Text>
                                                            <bs.Card.Text className="cardDescription">
                                                                {category.description}
                                                            </bs.Card.Text>
                                                        </bs.Card.Body>
                                                    </div>
                                                </bs.Card>
                                            </div>
                                          
                                        )
                                })
                            }
                        </div> 
                    </div>           
                </div>
            </div>            
            </>
        )
    }
    else{
        return(
            <div className="py-0">
                <JumboTron fluid >
                    <ContentContainer style={{my: "5rem"}} className="py-0">
                        <h1 className="title"><span style={{color: "#002e74"}}>Voting</span><span style={{color: "#0063f3"}}>Block</span></h1>
                        <h4 className="subtitle">
                            Find top recommendations by category.
                        </h4>
                        <p className="trending">
                            <span>Trending: </span>
                        </p>
                    </ContentContainer>
                </JumboTron>
                <div>
                    Loading Data
                </div>                            
            </div>  
        )
    }  
}

export default Home