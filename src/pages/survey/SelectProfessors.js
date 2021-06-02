import React, { useState, useEffect } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import Form from "react-bootstrap/Form"
import { professorsByDeptID} from '../../graphql/queries';
import { API } from 'aws-amplify';
import {BiHappy} from 'react-icons/bi'
import {BiSad} from 'react-icons/bi'
import DifficultyRater from './DifficultyRater'
import SurveyPage from './Components/SurveyPage'
import Card from './Components/RatingsCard'
import Container from './Components/RatingsContainer'
import  Button from 'react-bootstrap/Button'



function SelectProfessors() {
    const [professors, setProfessors] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState({});
    const [difRatings, setDifRatings] = useState({});
    const match = useRouteMatch("/survey/major/:sid/:did")
    const history = useHistory();

    useEffect(() => {
        fetchProfessors();
    }, [])

    async function fetchProfessors() {
        
        const apiData = await API.graphql({ query: professorsByDeptID, variables: {type: 'Professor', departmentID: {eq: match.params.did}, sortDirection: 'DESC', limit: 490}});
        setProfessors(apiData.data.professorsByDeptID.items)
        setIsLoading(false)
    }

    const clickHappy = (id) => {
        let tempRatings = {};
        for (const [key, value] of Object.entries(selected)) {
            tempRatings[key] = value;
        }

        if(tempRatings[id] === 'up'){
            delete tempRatings[id];
        } else if (tempRatings[id] === 'down'){
            tempRatings[id] = 'up';
        } else {
            tempRatings[id] = 'up';
        }

        setSelected(tempRatings)
    }

    const clickSad = (id) => {
        let tempRatings = {};
        for (const [key, value] of Object.entries(selected)) {
            tempRatings[key] = value;
        }

        if(tempRatings[id] === 'down'){
            delete tempRatings[id];
        } else if (tempRatings[id] === 'up'){
            tempRatings[id] = 'down';
        } else {
            tempRatings[id] = 'down';
        }

        setSelected(tempRatings)
    }

    const updateDifRatings = (newRatings) => {
        setDifRatings(newRatings)
    }

    const handleClick = () => {
        history.push(`/survey/major/finish`)
    }

    return (
        <SurveyPage>
            <h5>What professors would you recommend?</h5>
            <p>(Rate as many or few as you want)</p>
            <Container>
            {
                isLoading ?
                <></>
                :
                professors[0] ?
                professors.map(professor => {
                    return(
                        <Card key={professor.id}>
                            <p>{professor.name}</p> 
                            <BiHappy onClick={() => clickHappy(professor.id)} size={50} style={selected[professor.id] === 'up' ? { color: 'green', cursor: 'pointer'} : { color: 'black', cursor: 'pointer'}}/>
                            <BiSad onClick={() => clickSad(professor.id)} size={50} style={selected[professor.id] === 'down' ? { color: 'red', cursor: 'pointer'} : { color: 'black', cursor: 'pointer'}}/>
                            <DifficultyRater selected={selected} difRatings={difRatings} updateDifRatings={updateDifRatings} id={professor.id} />
                        </Card>
                    )
                })
                :
                <p>Bummer! We didn't find any professors in this department. You can click finish now.</p>
            }
            </Container>
            <Button onClick={handleClick}>Finish</Button>
        </SurveyPage>
    )
}

export default SelectProfessors
