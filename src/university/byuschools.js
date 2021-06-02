import React, { useState, useEffect, useContext } from 'react';
import * as bs from 'react-bootstrap'
import { API, container, Storage } from 'aws-amplify'
// import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listSchools, listRatings, getCategory, listProfessors } from '../graphql/queries';
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { ratingsByUserAndContent, ratingsByUserAndCategory, professorsByScore, coursesByScore, coursesByDeptID, coursesByGE, coursesByName, professorsByDeptID, searchCourses, searchProfessors} from '../graphql/queries';
import { createRating as createRatingMutation } from '../graphql/mutations';
import { updateRating as updateRatingMutation } from '../graphql/mutations';
import { deleteRating as deleteRatingMutation } from '../graphql/mutations';
import { updateCategory as updateCategoryMutation } from '../graphql/mutations';
import { updateProfessor as updateProfessorMutation } from '../graphql/mutations';
import SchoolTables from './schooltables'
import schoolresolver from '../schoolresolver'
import Detail from './detail'
import { Auth } from 'aws-amplify';
// import { withAuthenticator } from '@aws-amplify/ui-react';
import AppContext from '../context/context'
import MyTheme from '../styles/amplifyTheme'


function BYUSchools() {
    const [schools, setSchools] = useState({});
    const [departments, setDepartments] = useState({});
    const [courses, setCourses] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [professorsForCourse, setProfessorsForCourse] = useState({});
    const [userRatings, setUserRatings] = useState({});
    const [testRatings, setTestRatings] = useState({});
    const [profCategory, setProfCategory] = useState({})
    const [courseCategory, setCourseCategory] = useState({})
    const [userid, setUserid] = useState(null);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
    const [isLoadingProfessors, setIsLoadingProfessors] = useState(true);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [isFinishedLoadingCourses, setIsFinishedLoadingCourses] = useState(false);
    const [isFinishedLoadingProfs, setIsFinishedLoadingProfs] = useState(false);
    const [isLoadingProfessorsForCourse, setIsLoadingProfessorsForCourse] = useState(true);
    const [pageStartIndex, setPageStartIndex] = useState(0);
    const [pageNum, setPageNum] = useState(1);
    const [searchFilter, setSearchFilter] = useState('');
    const [categoryValue, setCategoryValue] = useState('courses');
    const [savedNextTokenCourse, setSavedNextTokenCourse] = useState();
    const [savedNextTokenProfessor, setSavedNextTokenProfessor] = useState();
    const [isSearched, setIsSearched] = useState(false);
    const VOTE_UP  = "up";
    const VOTE_DOWN = "down";
    let match = useRouteMatch();
    let matchParams = useRouteMatch("/schools/:sid/:did/:type")
    let colleges = []
    let tempCourses = [];
    let tempProfessors = [];
    const context = useContext(AppContext)


    useEffect(() => {
        //navigates user to the top of the page on page load
        window.scrollTo(0, 0);
        
        fetchData();
        fetchCategories();
      
      }, []);

    useEffect(() => {
        getDataCourses();
        getDataProfessors();
      }, [match.location, matchParams.params.did, matchParams.params.sid, matchParams.params.type, match.url]);

    useEffect(() => {
        getRatings()
      
      }, [context]);

    async function fetchData() {
        try{ 
        const apiData = await API.graphql({ query: listSchools, authMode: 'API_KEY' });
        setSchools(apiData.data.listSchools.items)
        } catch (e) {
            return e;
        }
    }

    async function migrate() {
        
        // await API.graphql({ query: updateCourseMutation, variables: { input: {"id": "course.id", "isGeneralStr": "true"} } });

        for(let i=0; i < professors.length; i++){ 
            if(!professors[i].migration){
                await API.graphql({ query: updateProfessorMutation, variables: { input: {"id": professors[i].id, "migration": true} } });
            }  else {
                console.log("already added", professors[i].name)
            }
        }
    }

    const updateLoadingCourses = () => {
        setIsFinishedLoadingCourses(!isFinishedLoadingCourses)
    }
    const updateLoadingProfessors = () => {
        setIsFinishedLoadingProfs(!isFinishedLoadingProfs)
    }

    async function getAllProfessors(nextTokenIn, searchValue) {
        let apiData;
        if(searchValue){
            if(nextTokenIn){
                apiData = await API.graphql({ query: searchProfessors, authMode: 'API_KEY', variables: {filter: {name: {matchPhrase: searchValue}}}, limit: 30, nextToken: nextTokenIn} );
                const profsIn = apiData.data.searchProfessors.items
                tempProfessors = [...tempProfessors, ...profsIn]
            }else {
                apiData = await API.graphql({ query: searchProfessors, authMode: 'API_KEY', variables: {filter: {name: {matchPhrase: searchValue}}}, limit: 30} );
                const profsIn = apiData.data.searchProfessors.items
                tempProfessors = [...tempProfessors, ...profsIn]
            }
            setProfessors(tempProfessors);

            if(isLoadingProfessors){
                setIsLoadingProfessors(false);
            }
    
            if(apiData.data.searchProfessors.nextToken){
                // getDataCourses(apiData.data.coursesByScore.nextToken)
                setSavedNextTokenProfessor(apiData.data.searchProfessors.nextToken)
                // if(searchValue){
                //     getDataCourses(apiData.data.searchCourses.nextToken, searchValue)
                // }
            }
            setIsSearched(true)
        } else{
            if(nextTokenIn){
                apiData = await API.graphql({ query: professorsByScore, authMode: 'API_KEY', variables: {type: 'Professor', score: {ge: -10000}, sortDirection: 'DESC', limit: 10, nextToken: nextTokenIn} });
                tempProfessors = [...professors, ...apiData.data.professorsByScore.items]
            }else {
                apiData = await API.graphql({ query: professorsByScore, authMode: 'API_KEY', variables: {type: 'Professor', score: {ge: -10000}, sortDirection: 'DESC', limit: 10} });
                tempProfessors = [...apiData.data.professorsByScore.items]
            }
            setProfessors(tempProfessors);
    
            if(isLoadingProfessors){
                setIsLoadingProfessors(false);
            }
    
            if(apiData.data.professorsByScore.nextToken){
                setSavedNextTokenProfessor(apiData.data.professorsByScore.nextToken)
                // getDataProfessors(apiData.data.professorsByScore.nextToken)
            } 
            setIsSearched(false)
        }
        setIsFinishedLoadingProfs(true);
        
        setIsLoadingProfessors(false);
    }

    async function getFilteredProfessors(nextTokenIn) {
        let apiData;
        if(matchParams.params.did === "all"){
            if(nextTokenIn){
                apiData = await API.graphql({ query: professorsByDeptID, authMode: 'API_KEY', variables: {type: 'Professor', departmentID: {beginsWith: schoolresolver[matchParams.params.sid]}, sortDirection: 'DESC', limit: 1000, nextToken: nextTokenIn} });
            }else {
                apiData = await API.graphql({ query: professorsByDeptID, authMode: 'API_KEY', variables: {type: 'Professor', departmentID: {beginsWith: schoolresolver[matchParams.params.sid]}, sortDirection: 'DESC', limit: 500} });
            }
        } else{
            if(nextTokenIn){
                apiData = await API.graphql({ query: professorsByDeptID, authMode: 'API_KEY', variables: {type: 'Professor', departmentID: {eq: matchParams.params.did}, sortDirection: 'DESC', limit: 1000, nextToken: nextTokenIn} });
            }else {
                apiData = await API.graphql({ query: professorsByDeptID, authMode: 'API_KEY', variables: {type: 'Professor', departmentID: {eq: matchParams.params.did}, sortDirection: 'DESC', limit: 500} });
            }
        }
        const professorsFromAPI = apiData.data.professorsByDeptID.items;

        await Promise.all(professorsFromAPI.map(async course => {
            return course;
        }))
        tempProfessors = [...tempProfessors, ...apiData.data.professorsByDeptID.items]
        setProfessors(tempProfessors);

        if(isLoadingCourses){
            setIsLoadingProfessors(false);
        }

        if(apiData.data.professorsByDeptID.nextToken){
            getDataProfessors(apiData.data.professorsByDeptID.nextToken)
        } else {
            setIsFinishedLoadingProfs(true);
        }
        setIsSearched(false)
    }
    async function getAllCourses(nextTokenIn, searchValue) {
        let apiData;
        let finalData = [];
        if(searchValue){
            if(nextTokenIn){
                apiData = await API.graphql({ query: searchCourses, authMode: 'API_KEY', variables: {filter: {name: {matchPhrase: searchValue}}}, limit: 30, nextToken: nextTokenIn} );
                const coursesIn = apiData.data.searchCourses.items

                finalData = [...coursesIn]
                apiData = await API.graphql({ query: searchCourses, authMode: 'API_KEY', variables: {filter: {code: {matchPhrase: searchValue}}}, limit: 30, nextToken: nextTokenIn} );
                const coursesIn2 = apiData.data.searchCourses.items
                finalData = [...finalData, ...coursesIn2]
                tempCourses = [...tempCourses, ...finalData]
            }else {
                apiData = await API.graphql({ query: searchCourses, authMode: 'API_KEY', variables: {filter: {name: {matchPhrase: searchValue}}}, limit: 30} );
                const coursesIn = apiData.data.searchCourses.items

                finalData = [...coursesIn]
                apiData = await API.graphql({ query: searchCourses, authMode: 'API_KEY', variables: {filter: {code: {matchPhrase: searchValue}}}, limit: 30, nextToken: nextTokenIn} );
                const coursesIn2 = apiData.data.searchCourses.items
                finalData = [...finalData, ...coursesIn2]
                tempCourses = [...tempCourses, ...finalData]
            }
            setCourses(tempCourses);

            if(isLoadingCourses){
                setIsLoadingCourses(false);
            }
    
            if(apiData.data.searchCourses.nextToken){
                // getDataCourses(apiData.data.coursesByScore.nextToken)
                setSavedNextTokenCourse(apiData.data.searchCourses.nextToken)
                // if(searchValue){
                //     getDataCourses(apiData.data.searchCourses.nextToken, searchValue)
                // }
            }
            setIsSearched(true)
        } else{
            if(nextTokenIn){
                apiData = await API.graphql({ query: coursesByScore, authMode: 'API_KEY', variables: {type: 'Course', score: {ge: -10000}, sortDirection: 'DESC', limit: 10, nextToken: nextTokenIn} });
                tempCourses = [...courses, ...apiData.data.coursesByScore.items]
            }else {
                apiData = await API.graphql({ query: coursesByScore, authMode: 'API_KEY', variables: {type: 'Course', score: {ge: -10000}, sortDirection: 'DESC', limit: 10} });
                tempCourses = [...apiData.data.coursesByScore.items]
            }
            setCourses(tempCourses);

            if(isLoadingCourses){
                setIsLoadingCourses(false);
            }
    
            if(apiData.data.coursesByScore.nextToken){
                // getDataCourses(apiData.data.coursesByScore.nextToken)
                setSavedNextTokenCourse(apiData.data.coursesByScore.nextToken)
                if(searchValue){
                    getDataCourses(apiData.data.coursesByScore.nextToken, searchValue)
                }
            }
            setIsSearched(false)
        }
        // const coursesFromAPI = apiData.data.coursesByScore.items;

        // await Promise.all(coursesFromAPI.map(async course => {
        //     return course;
        // }))
        // tempCourses = [...courses, ...apiData.data.coursesByScore.items]
        // setCourses(tempCourses);

        
        setIsFinishedLoadingCourses(true);
        
    }

    async function getFilteredCourses(nextTokenIn) {
        let apiData;
        if(matchParams.params.did === "all"){
            if(nextTokenIn){
                apiData = await API.graphql({ query: coursesByDeptID, authMode: 'API_KEY', variables: {type: 'Course', departmentID: {beginsWith: schoolresolver[matchParams.params.sid]}, sortDirection: 'DESC', limit: 1000, nextToken: nextTokenIn} });
            }else {
                apiData = await API.graphql({ query: coursesByDeptID, authMode: 'API_KEY', variables: {type: 'Course', departmentID: {beginsWith: schoolresolver[matchParams.params.sid]}, sortDirection: 'DESC', limit: 500} });
            }
        } else{
            if(nextTokenIn){
                apiData = await API.graphql({ query: coursesByDeptID, authMode: 'API_KEY', variables: {type: 'Course', departmentID: {eq: matchParams.params.did}, sortDirection: 'DESC', limit: 1000, nextToken: nextTokenIn} });
            }else {
                apiData = await API.graphql({ query: coursesByDeptID, authMode: 'API_KEY', variables: {type: 'Course', departmentID: {eq: matchParams.params.did}, sortDirection: 'DESC', limit: 500} });
            }
        }
        const coursesFromAPI = apiData.data.coursesByDeptID.items;

        await Promise.all(coursesFromAPI.map(async course => {
            return course;
        }))
        tempCourses = [...tempCourses, ...apiData.data.coursesByDeptID.items]
        setCourses(tempCourses);

        if(isLoadingCourses){
            setIsLoadingCourses(false);
        }

        if(apiData.data.coursesByDeptID.nextToken){
            getDataCourses(apiData.data.coursesByDeptID.nextToken)
        } else {
            setIsFinishedLoadingCourses(true);
        }
        setIsSearched(false)
    }

    async function getGECourses(nextTokenIn) {
        let apiData;
        if(nextTokenIn){
            apiData = await API.graphql({ query: coursesByGE, authMode: 'API_KEY', variables: {type: 'Course', isGeneralStr: {eq: "true"}, sortDirection: 'DESC', limit: 1000, nextToken: nextTokenIn} });
        }else {
            apiData = await API.graphql({ query: coursesByGE, authMode: 'API_KEY', variables: {type: 'Course', isGeneralStr: {ge: "true"}, sortDirection: 'DESC', limit: 600} });
        }
        const coursesFromAPI = apiData.data.coursesByGE.items;

        await Promise.all(coursesFromAPI.map(async course => {
            return course;
        }))
        tempCourses = [...tempCourses, ...apiData.data.coursesByGE.items]
        setCourses(tempCourses);

        if(isLoadingCourses){
            setIsLoadingCourses(false);
        }

        if(apiData.data.coursesByGE.nextToken){
            getDataCourses(apiData.data.coursesByGE.nextToken)
        } else {
            setIsFinishedLoadingCourses(true);
        }
        setIsSearched(false)
    }

    async function getDataCourses(nextTokenIn, searchValue) {
        if(matchParams.params.sid === "all"){
            getAllCourses(nextTokenIn, searchValue);
        } else if(matchParams.params.sid === "ge") {
            getGECourses(nextTokenIn)
        } else if(matchParams.params.did === "all") {
            getFilteredCourses(nextTokenIn)
        } else {
            // user has selected a school and department
            getFilteredCourses(nextTokenIn)
        }
    }


    async function getDataProfessors(nextTokenIn, searchValue) {
        if(matchParams.params.sid === "all"){
            getAllProfessors(nextTokenIn, searchValue);
        } else if(matchParams.params.sid === "ge") {
            setIsFinishedLoadingProfs(true)
        } else if(matchParams.params.did === "all") {
            getFilteredProfessors(nextTokenIn)
        } else {
            // user has selected a school and department
            getFilteredProfessors(nextTokenIn)
        }
    }

    async function fetchCategories() {
        try{ 
            const apiData = await API.graphql({ query: getCategory, authMode: 'API_KEY', variables: {id: "byu-courses"} });
            setCourseCategory(apiData.data.getCategory)
        } catch (e) {
            console.log(e);
        }
        try{ 
            const apiData = await API.graphql({ query: getCategory, authMode: 'API_KEY', variables: {id: "byu-professors"} });
            setProfCategory(apiData.data.getCategory)
        } catch (e) {
            console.log(e);
        }
    }

    async function updateScore(id, score, increment, mutationName) {
        let resp;
      try{
          if (increment === VOTE_UP) {
              resp = await API.graphql({ query: mutationName, variables: { input: {"id": id, "score": score + 1} } });
          }    
          else if (increment === VOTE_DOWN){
              resp = await API.graphql({ query: mutationName, variables: { input: {"id": id, "score": score - 1} } });
          }
      }
      catch (e) {
          return e;
      }

    }

    async function createRating(contentID, type, mutationName, score, category) {
        let ratingIdFromAPI;
        if (!context.user){
            window.localStorage.setItem('redirectURL', matchParams.url)
            Auth.federatedSignIn()
        }
        else{
            try {
                const ratingData = await API.graphql({ query: ratingsByUserAndContent, variables: { "userID": context.user.username, "contentID": {eq: contentID } }});
                ratingIdFromAPI = ratingData.data.ratingsByUserAndContent.items;
            } catch (e) {
                return e;
            }
            if(ratingIdFromAPI[0] === undefined){
                try {
                    await API.graphql({ query: createRatingMutation, variables: { input: { "contentID": contentID, "userID": context.user.username, "ratingType": type, "type": "Rating", "category": category } }});
                    if (categoryValue === 'professors'){
                        await API.graphql({ query: updateCategoryMutation, variables: { input: { "id": "byu-professors", "numRatings": profCategory.numRatings + 1 } }});
                    }
                    else if (categoryValue === 'courses'){
                        await API.graphql({ query: updateCategoryMutation, variables: { input: { "id": "byu-courses", "numRatings": courseCategory.numRatings + 1 } }});

                    }
                    updateScore(contentID, score, type, mutationName);
                    //getRatings(userid);
                } catch (e) {
                    console.log(e);
                } finally {
                    //getData();
                }
            } else if (ratingIdFromAPI[0].ratingType === type){
                type === VOTE_UP ? type = VOTE_DOWN : type = VOTE_UP;
                try {
                    await API.graphql({ query: deleteRatingMutation, variables: { input: { "id": ratingIdFromAPI[0].id } }});
                    if (categoryValue === 'Professors'){
                        await API.graphql({ query: updateCategoryMutation, variables: { input: { "id": "byu-professors", "numRatings": profCategory.numRatings - 1 } }});
                    }
                    else if (categoryValue === 'Courses'){
                        await API.graphql({ query: updateCategoryMutation, variables: { input: { "id": "byu-courses", "numRatings": courseCategory.numRatings - 1 } }});

                    }
                    updateScore(contentID, score, type, mutationName);
                    //getRatings(userid);
                } catch (e) {
                    return e;
                }finally {
                   //getData();
                }
            } else {
                type === VOTE_UP ? score += 1 : score -= 1;
                try {
                    await API.graphql({ query: updateRatingMutation, variables: { input: { "id": ratingIdFromAPI[0].id, "ratingType": type } }});
                    updateScore(contentID, score, type, mutationName);
                    //getRatings(userid);
                } catch (e) {
                    return e;
                }finally {
                    //getData();
                }
            }
        }
        
    }

    //onload getRatings gets passed the username from UseState on line 41. TODO: figure out how to get the userstate right away
    async function getRatings() {
        if(!context.user) return;
        const userRatingsData = await API.graphql({ query: ratingsByUserAndCategory, variables: { "userID": context.user.username, "sortDirection": "ASC" }});
        const userRatingsFromAPI = userRatingsData.data.ratingsByUserAndCategory.items;

        // await Promise.all(userRatingsFromAPI.map(async rating => {
        //     return rating;
        // }))
        setUserRatings(userRatingsData.data.ratingsByUserAndCategory.items);
    }


    const fetchAllRatings = async() => {
        try {
         const apiData = await API.graphql({ query: listRatings, variables: {limit: 500 }});
         const ratingsFromAPI = apiData.data.listRatings.items;
 
         await Promise.all(ratingsFromAPI.map(async rating => {
           return rating;
         }))
         setTestRatings(apiData.data.listRatings.items)
         uploadDifficulty(apiData.data.listRatings.items)
        } catch (e) {
            console.log(e);
        }
    }

    const toggleCategory = (val) => {
        setCategoryValue(val)
    }

    let initPageNum = () => {
        setPageNum(1);
        setPageStartIndex(0);
    }

    let nextPage = (index) => {
        if(matchParams.params.sid === "all" && matchParams.params.type === "professors"){
            getDataProfessors(savedNextTokenProfessor);
            setPageStartIndex(index);
            setPageNum(pageNum + 1);
        } else if (matchParams.params.sid === "all" && matchParams.params.type === "courses") {
            getDataCourses(savedNextTokenCourse);
            setPageStartIndex(index);
            setPageNum(pageNum + 1);
        } else {
            setPageStartIndex(index);
            setPageNum(pageNum + 1);
        }
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
        if(matchParams.params.sid === "all" && matchParams.params.type === "courses"){
            getDataCourses(undefined, val)
        }
        else if(matchParams.params.sid === "all" && matchParams.params.type === "professors"){
            getDataProfessors(undefined, val)
        } else {
            setSearchFilter(val);
        }
        // setPageNum(1);
        // setPageStartIndex(0);
    }


    let uploadDifficulty = async(data) => {
        for (let i = 0; i < 150; i++){
            if(!data[i]?.type ){
                try{ 
                    const apiData = await API.graphql({ 
                        query: updateRatingMutation, 
                        variables: { 
                            input: 
                                {
                                    "id": data[i].id, 
                                    "type": "Rating"
                                } 
                        } 
                    });
                    } catch (e) {
                        console.log(e);
                    }
            } else{
                console.log(courses[i].id, "already updated")
            }
            
        }
        
    }
    
    for (let i = 0; i < schools.length; i ++) {
        colleges.push(schools[i])
    }


    return(
        <Switch>
            <Route path={`${match.path}/:schId/:deptId/:type/:oid`}>
                <div style={{marginTop: "3rem"}}>
                    <Detail 
                        professorsForCourse={professorsForCourse}
                        // getProfsForCourse={getProfessorsForCourse}
                        detailsLoading={isLoadingProfessorsForCourse}
                        updateScore={updateScore} 
                        getRatings={getRatings} 
                        userRatings={userRatings} 
                        courses={courses}
                        professors={professors}
                        createRating={createRating} 
                        isLoading={isLoadingCourses}
                        nextPage={nextPage}
                        previousPage={previousPage}
                        pageNum={pageNum}
                        pageStartIndex={pageStartIndex}
                        searchFilter={searchFilter}
                        handleChangeSearch={handleChangeSearch}
                        isSearched={isSearched}
                        getDataCourses={getDataCourses}
                        getDataProfessors={getDataProfessors}
                    />
                </div>
                
            </Route>

            <Route path="/schools">
                <div className="headerContainer">
                    {/* <img alt="picture" src="https://brightspotcdn.byu.edu/31/bf/faa1cee3405387ff8d0d135ffab1/1810-23-0021-1200-4.jpg" /> */}
                    <h1 id="categoryTitle">BYU Academics</h1>
                </div>
                {/* <button onClick={migrate}>update difficulty</button> */}
                
                
                {/* <bs.Container fluid className="min-vh-100 d-flex flex-column" style={{textAlign: "left"}}>
                    <bs.Row className=" pb-5 pl-3 flex-grow-0 flex-shrink-0 border-bottom shadow-sm" >
                        <bs.Col md="6">
                            <SchoolSideBar colleges={colleges} initPageNum={initPageNum}/>
                        </bs.Col>
                        <bs.Col md="6">
                            <NewSideBar colleges={colleges} initPageNum={initPageNum}/>
                        </bs.Col>
                        
                    </bs.Row>
                </bs.Container> */}

                <Switch>
                    <Route path={`${match.path}/:schId/:deptId`}>
                        <SchoolTables 
                            toggleCategory={toggleCategory}
                            categoryValue={categoryValue}
                            isFinishedLoadingCourses={isFinishedLoadingCourses}
                            isFinishedLoadingProfs={isFinishedLoadingProfs}
                            updateLoadingCourses={updateLoadingCourses}
                            updateLoadingProfessors={updateLoadingProfessors}
                            savedNextTokenCourse={savedNextTokenCourse}
                            savedNextTokenProfessor={savedNextTokenProfessor}
                            updateScore={updateScore} 
                            getRatings={getRatings} 
                            userRatings={userRatings} 
                            createRating={createRating} 
                            courses={courses}
                            professors={professors}
                            colleges={colleges}
                            isLoading={isLoadingCourses}
                            nextPage={nextPage}
                            previousPage={previousPage}
                            pageNum={pageNum}
                            pageStartIndex={pageStartIndex}
                            searchFilter={searchFilter}
                            handleChangeSearch={handleChangeSearch}
                            initPageNum={initPageNum}
                            clearSearchFilter={clearSearchFilter}
                            isSearched={isSearched}
                        />
                    </Route>
                    <Route path={match.path}>
                        <h2>Select a Department</h2>
                    </Route>
                </Switch>

                        
            </Route>

        </Switch>
    
    
    )

    
}

export default BYUSchools;
// export default withAuthenticator(BYUSchools, false, [], null, MyTheme, {
//     signUpConfig: {
//       hiddenDefaults: ["phone_number"],
//       signUpFields: [
//         { label: "Name", key: "name", required: true, type: "string" }
//       ]
//     }
//   });