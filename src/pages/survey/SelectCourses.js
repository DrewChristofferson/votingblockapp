import React, { useState, useEffect } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import Form from "react-bootstrap/Form"
import { coursesByDeptID} from '../../graphql/queries';
import { API } from 'aws-amplify';
import {BiHappy} from 'react-icons/bi'
import {BiSad} from 'react-icons/bi'
import DifficultyRater from './DifficultyRater'
import styled from 'styled-components'
import  Button from 'react-bootstrap/Button'
import SurveyPage from './Components/SurveyPage'
import Card from './Components/RatingsCard'
import Container from './Components/RatingsContainer'


function SelectCourses() {
    const [courses, setCourses] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState({});
    const [difRatings, setDifRatings] = useState({});
    const match = useRouteMatch("/survey/major/:sid/:did")
    const history = useHistory();

    useEffect(() => {
        fetchCourses();
    }, [])

    async function fetchCourses() {
        
        const apiData = await API.graphql({ query: coursesByDeptID, variables: {type: 'Course', departmentID: {eq: match.params.did}, sortDirection: 'DESC', limit: 490}});
        apiData.data.coursesByDeptID.items.sort((a, b) => (a.code > b.code) ? 1 : -1 )
        setCourses(apiData.data.coursesByDeptID.items)
        setIsLoading(false)
    }

    const clickHappy = (id) => {
        let tempRatings = {};
        let tempDifRatings ={};
        for (const [key, value] of Object.entries(selected)) {
            tempRatings[key] = value;
        }
        for (const [key, value] of Object.entries(difRatings)) {
            tempDifRatings[key] = value;
        }

        if(tempRatings[id] === 'up'){
            delete tempRatings[id];
            if(tempDifRatings[id]){
                delete tempDifRatings[id];
            }
        } else if (tempRatings[id] === 'down'){
            tempRatings[id] = 'up';
        } else {
            tempRatings[id] = 'up';
        }

        setSelected(tempRatings)
        setDifRatings(tempDifRatings)
    }

    const clickSad = (id) => {
        let tempRatings = {};
        let tempDifRatings ={};
        for (const [key, value] of Object.entries(selected)) {
            tempRatings[key] = value;
        }
        for (const [key, value] of Object.entries(difRatings)) {
            tempDifRatings[key] = value;
        }

        if(tempRatings[id] === 'down'){
            delete tempRatings[id];
            if(tempDifRatings[id]){
                delete tempDifRatings[id];
            }
        } else if (tempRatings[id] === 'up'){
            tempRatings[id] = 'down';
        } else {
            tempRatings[id] = 'down';
        }

        setSelected(tempRatings)
        setDifRatings(tempDifRatings)
    }

    const updateDifRatings = (newRatings) => {
        setDifRatings(newRatings)
    }

    const handleClick = () => {
        history.push(`${match.url}/professors`)
    }

    return (
        <SurveyPage>
            <h5>Which courses from your major would you recommend?</h5>
            <p>(Rate as many or few as you want)</p>
            <Container>
            {
                isLoading ?
                <></>
                :
                courses[0] ?
                courses.map(course => {
                    return(
                        <Card key={course.id}>
                            <p>{course.code}  -  {course.name}</p> 
                            <BiHappy onClick={() => clickHappy(course.id)} size={50} style={selected[course.id] === 'up' ? { color: 'green', cursor: 'pointer'} : { color: 'black', cursor: 'pointer'}}/>
                            <BiSad onClick={() => clickSad(course.id)} size={50} style={selected[course.id] === 'down' ? { color: 'red', cursor: 'pointer'} : { color: 'black', cursor: 'pointer'}}/>
                            <DifficultyRater selected={selected} difRatings={difRatings} updateDifRatings={updateDifRatings} id={course.id} />
                        </Card>
                    )
                })
                :
                <p>Bummer! We didn't find any courses in this department. Click next to see professors.</p>
            }
            </Container>
            <Button onClick={handleClick}>Next</Button>
        </SurveyPage>
    )
}

export default SelectCourses
