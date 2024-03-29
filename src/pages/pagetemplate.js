import React, { useState, useEffect, useContext } from 'react';
import * as bs from 'react-bootstrap'
import { API} from 'aws-amplify'
// import { withAuthenticator } from '@aws-amplify/ui-react';
import { getCategory, listCategoryItems } from '../graphql/queries';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'
import { ratingsByUserAndContent } from '../graphql/queries';
import { createRating as createRatingMutation } from '../graphql/mutations';
import { updateRating as updateRatingMutation } from '../graphql/mutations';
import { updateCategory as updateCategoryMutation } from '../graphql/mutations';
import { deleteRating as deleteRatingMutation } from '../graphql/mutations';
import Detail from './detail'
import TableView from './tableview'
import { Auth } from 'aws-amplify';
import AppContext from '../context/context'
import CreateCatItemModal from './create/CreateCatItemModal'
import { RiArrowDownSFill } from 'react-icons/ri';
import styled from 'styled-components'

const FilterButton = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
`

const HeaderButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`

function PageTemplate() {
    const [category, setCategory] = useState({});
    const [currentFilter, setCurrentFilter] = useState('All');
    const [categoryItems, setCategoryItems] = useState({});
    const [professorsForCourse, setProfessorsForCourse] = useState({});
    const [userRatings, setUserRatings] = useState({});
    const [userid, setUserid] = useState(null);
    const [isLoadingItems, setIsLoadingItems] = useState(true);
    const [pageStartIndex, setPageStartIndex] = useState(0);
    const [pageNum, setPageNum] = useState(1);
    const [searchFilter, setSearchFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [rankedItems, setRankedItems] = useState();
    const [ratings, setRatings] = useState({});
    const VOTE_UP  = "up";
    const VOTE_DOWN = "down";
    const match = useRouteMatch("/category/:cid");
    const matchFilter = useRouteMatch("/category/:cid/:filter");
    const history = useHistory();
    const context = useContext(AppContext);

    useEffect(() => {
        //navigates user to the top of the page on page load
        window.scrollTo(0, 0);
        fetchData();
        getData();
      }, []);


    async function fetchData() {
        try{ 
        const apiData = await API.graphql({ query: getCategory, variables: {id: match.params.cid} });
        setCategory(apiData.data.getCategory)
        setCurrentFilter('All Items')
        } catch (e) {
            return e;
        }
    }

    async function getData(filterValue) {
        const apiData = await API.graphql({ query: listCategoryItems, variables: { filter: {categoryID: {eq: match.params.cid}} }});
        const categoryItemsFromAPI = apiData.data.listCategoryItems.items;
        let ranked;

        await Promise.all(categoryItemsFromAPI.map(async item => {
            return item;
        })).then(function(categoryItemsFromAPI) {
            if (matchFilter?.params?.filter){
                rankItems(categoryItemsFromAPI, matchFilter.params.filter);
            }else{
                rankItems(categoryItemsFromAPI);
            }
            setCategoryItems(categoryItemsFromAPI);
        }).then(() => setIsLoadingItems(false)).then(() => setIsLoading(false))
    }

    async function updateScore(id, score, increment, mutationName) {
      try{
          if (increment === VOTE_UP) {
              await API.graphql({ query: mutationName, variables: { input: {"id": id, "score": score + 1} } });
          }    
          else if (increment === VOTE_DOWN){
              await API.graphql({ query: mutationName, variables: { input: {"id": id, "score": score - 1} } });
          }
      }
      catch (e) {
          return e;
      }

    }

    async function createRating(contentID, type, mutationName, score) {
        let ratingIdFromAPI;
        if (!userid) return;
        try {
            const ratingData = await API.graphql({ query: ratingsByUserAndContent, variables: { "userID": userid, "contentID": {eq: contentID } }});
            ratingIdFromAPI = ratingData.data.ratingsByUserAndContent.items;
        } catch (e) {
            return e;
        }
        if(ratingIdFromAPI[0] === undefined){
            try {
                await API.graphql({ query: createRatingMutation, variables: { input: { "contentID": contentID, "userID": userid, "ratingType": type } }});
                await API.graphql({ query: updateCategoryMutation, variables: { input: { "id": category.id, "numRatings": category.numRatings + 1 } }});
                updateScore(contentID, score, type, mutationName);
                getRatings(userid);
            } catch (e) {
                return e;
            } finally {
                getData();
            }
        } else if (ratingIdFromAPI[0].ratingType === type){
            type === VOTE_UP ? type = VOTE_DOWN : type = VOTE_UP;
            try {
                await API.graphql({ query: deleteRatingMutation, variables: { input: { "id": ratingIdFromAPI[0].id } }});
                await API.graphql({ query: updateCategoryMutation, variables: { input: { "id": category.id, "numRatings": category.numRatings - 1 } }});
                updateScore(contentID, score, type, mutationName);
                getRatings(userid);
            } catch (e) {
                return e;
            }finally {
               getData();
            }
        } else {
            type === VOTE_UP ? score += 1 : score -= 1;
            try {
                await API.graphql({ query: updateRatingMutation, variables: { input: { "id": ratingIdFromAPI[0].id, "ratingType": type } }});
                updateScore(contentID, score, type, mutationName);
                getRatings(userid);
            } catch (e) {
                return e;
            }finally {
                getData();
            }
        }
    }

    //onload getRatings gets passed the username from UseState on line 41. TODO: figure out how to get the userstate right away
    async function getRatings(user) {
        const userRatingsData = await API.graphql({ query: ratingsByUserAndContent, variables: { "userID": user }});
        const userRatingsFromAPI = userRatingsData.data.ratingsByUserAndContent.items;

        await Promise.all(userRatingsFromAPI.map(async rating => {
            return rating;
        }))

        setUserRatings(userRatingsData.data.ratingsByUserAndContent.items);
    }

    let initPageNum = () => {
        setPageNum(1);
        setPageStartIndex(0);
    }

    let nextPage = (index) => {
        setPageStartIndex(index);
        setPageNum(pageNum + 1);
    }

    let previousPage = (index) => {
        if(index > 20){
            setPageStartIndex(index - 20);
            setPageNum(pageNum - 1);
        } else if (index > 10 && index <= 20) {
            setPageStartIndex(0);
            setPageNum(pageNum - 1);
        }
    }

    let clearSearchFilter = () => {
        setSearchFilter('');
    }

    let handleChangeSearch = (val) => {
        setSearchFilter(val);
        setPageNum(1);
        setPageStartIndex(0);
    }

    let handleCreateItem = () => {
        history.push(`${match.url}/create`)
    }

    let handleFilter = (val) => {
        let tempItems = [];
        // setFilter(val)
        setCurrentFilter(val);
        if(val === 'All Items'){
            history.push(match.url)
            rankItems(categoryItems)
        } else {
            history.push(`${match.url}/${val.replaceAll(' ','-').toLowerCase()}`)
            rankItems(categoryItems, val.replaceAll(' ','-').toLowerCase())
        }
    }

    let rankItems = async(items, filter) => {
        let catItems = [];
        let filteredItems = [];
        let paginatedItems = [];
        let endingIndex;

        if (filter){
            for (const item of items) {
                if (item.SubCategory.replaceAll(' ','-').toLowerCase() === filter) {
                    catItems.push(item);
                }
            }
        } else {
            for (const item of items) {
                catItems.push(item);
            }
        }
     
        //sorting function details found at https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        (catItems).sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((a.name > b.name) ? 1 : -1) : -1 )
                
        for (let i = 0; i < catItems.length; i++){
            catItems[i].ranking = i + 1;
            if (!filter || filter === catItems[i].SubCategory.replaceAll(' ','-').toLowerCase()){
                // if(catItems[i].professor.name.toLowerCase().includes(props.searchFilter.toLowerCase())){
                    for(let j = 0; j < userRatings.length; j++){
                        if (userRatings[j].contentID === catItems[i].id){
                            catItems[i].userRating = userRatings[j].ratingType;
                        }   
                    }
                    filteredItems.push(catItems[i])
                // }
            }
        }
        for (let i = pageStartIndex; paginatedItems.length < 10; i++){  
            if(filteredItems[i]){
                paginatedItems.push(filteredItems[i])
            } else {
                break;
            }
            endingIndex = i + 1;
        }

        let newRatings ={};
        catItems.forEach(item => {
            if(item.userRating){
                newRatings[item.id] = item.userRating;
            }
        })
        setRatings(newRatings);
        setRankedItems(paginatedItems);
        setIsLoading(false);
        // return paginatedItems;
    }

    let handleRatingClick = (id, increment, mutation, score, item) => {
        if (context.user){
            setIsLoading(true);
            let tempRatings = {};
            for (const [key, value] of Object.entries(ratings)) {
                tempRatings[key] = value;
            }
    
            if (increment === VOTE_UP){
                if (tempRatings[id] === VOTE_UP){
                    item.score -= 1;
                    delete tempRatings[id];
                } else if (tempRatings[id] === VOTE_DOWN) {
                    item.score += 2;
                    tempRatings[id] = increment;
                } else if (!tempRatings[id]) {
                    item.score += 1;
                    tempRatings[id] = increment;
                }
            } else if (increment === VOTE_DOWN) {
                if (tempRatings[id] === VOTE_UP){
                    item.score -= 2;
                    tempRatings[id] = increment;
                } else if (tempRatings[id] === VOTE_DOWN) {
                    item.score += 1;
                    delete tempRatings[id];
                } else if (!tempRatings[id]) {
                    item.score -= 1;
                    tempRatings[id] = increment;
                }
        } 
            setRatings(tempRatings);
            createRating(id, increment, mutation, score);
            setIsLoading(false)
        
        }else{
            Auth.federatedSignIn({ provider: 'Google'});
        }
        
        
    }

    if(!isLoadingItems && !isLoading){
        return( 
            <Switch>
                <Route path={`${match.url}/item/:oid`}>
                    <div style={{marginTop: "3rem"}}>
                        <Detail categoryItems={categoryItems} category={category} createRating={createRating} getRatings={getRatings} />
                    </div>         
                </Route>
               
                <Route path={match.path}>
                    <div style={{background: `url(${category.imgsrc}&w=800&dpr=2`}} className="headerContainer" >
                        {/* <img alt="picture" src="https://brightspotcdn.byu.edu/31/bf/faa1cee3405387ff8d0d135ffab1/1810-23-0021-1200-4.jpg" /> */}
                        <h1 id="categoryTitle">{category.name} {currentFilter !== 'All Items' ? `(${currentFilter})` : null}</h1>
                    </div>
                    <div>
                        <div className="categoryDetails">
                            <div style={{textAlign: "left"}}>
                                <h3>Description</h3>
                                <p>{category.description}</p>
                                <p>Created By: {category.createdBy ? category.createdBy : 'Best of BYU User' }</p>
                            </div>
                            <HeaderButtonsContainer>
                                <div style={{marginRight: '1rem'}}>
                                    {
                                        category?.subCategoryOptions ?
                                            <bs.Dropdown >      
                                                <bs.Dropdown.Toggle style={{width: '200px'}} variant="info" id="dropdown-basic">
                                                    <FilterButton>
                                                        {currentFilter}
                                                        <RiArrowDownSFill />
                                                    </FilterButton>
                                                </bs.Dropdown.Toggle>
                                                <bs.Dropdown.Menu>
                                                    <bs.Dropdown.Item key='all' onClick={(e) => handleFilter(e.target.text)}>{`All Items`}</bs.Dropdown.Item>
                                                    {
                                                        
                                                        category.subCategoryOptions.map((option, index) => {
                                                            return(
                                                                <bs.Dropdown.Item key={index} onClick={(e) => handleFilter(e.target.text)}>{option}</bs.Dropdown.Item>
                                                            )
                                                        })
                                                    }
                                                </bs.Dropdown.Menu>
                                            </bs.Dropdown>
                                            :
                                            <></>
                                    }
                                </div>
                                <div>
                                    <CreateCatItemModal category={category} getData={getData}/>
                                </div>
                            </HeaderButtonsContainer>
                            
                        </div>
                        <TableView category={category} categoryItems={rankedItems} createRating={createRating} userRatings={userRatings} pageStartIndex={pageStartIndex} handleRatingClick={handleRatingClick} ratings={ratings} isLoading={isLoading} type="basic"/>
                    </div>          
                </Route>
            </Switch>   
    )} else{
        return(
            <bs.Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </bs.Spinner>
        )
    } 
}

// export default withAuthenticator(PageTemplate);
export default PageTemplate;