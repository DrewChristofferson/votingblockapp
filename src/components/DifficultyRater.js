import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { updateProfessor as updateProfessorMutation } from '../graphql/mutations';
import { updateCourse as updateCourseMutation } from '../graphql/mutations';
import { API } from 'aws-amplify'


const ButtonGroupCaption = styled.div`
    display: flex;
    justify-content: space-between;

`

const Container = styled.div`
    margin: 2em 0 .5em;

`

function DifficultyRater(props) {
    const [selected, setSelected] = useState();

    const handleDifRating = async(e, difficulty) => {
        let currentDifficulty;
        switch (difficulty) {
            case 'difficultyOne':
                currentDifficulty = props.diffOne;
              break;
            case 'difficultyTwo':
                currentDifficulty = props.diffTwo;
              break;
            case 'difficultyThree':
                currentDifficulty = props.diffThree;
              break;
            case 'difficultyFour':
                currentDifficulty = props.diffFour;
              break;
            case 'difficultyFive':
                currentDifficulty = props.diffFive;
              break;
            default:
                currentDifficulty = props.diffOne;
          }
        e.preventDefault();
        setSelected(difficulty);
        props.updateDifficultyRated();

        let responseData;
        if(props.type === 'course'){
            responseData = await API.graphql({ query: updateCourseMutation, variables: { input: {"id": props.id, [difficulty]: currentDifficulty + 1} } });
            props.fetchData();
        } 
        else {
            responseData = await API.graphql({ query: updateProfessorMutation, variables: { input: {"id": props.id, [difficulty]: currentDifficulty + 1} } });
            props.fetchData();
        }
    }

    return (
        <Container>
        {/* <p>Difficulty Rating</p> */}
        <div>
            <button onClick={(e) => handleDifRating(e, 'difficultyOne')} className={selected === 'difficultyOne' ? 'ratingButton ratingActivated' : 'ratingButton'}>1</button>
            <button onClick={(e) => handleDifRating(e, 'difficultyTwo')} className={selected === 'difficultyTwo' ? 'ratingButton ratingActivated' : 'ratingButton'}>2</button>
            <button onClick={(e) => handleDifRating(e, 'difficultyThree')} className={selected === 'difficultyThree' ? 'ratingButton ratingActivated' : 'ratingButton'}>3</button>
            <button onClick={(e) => handleDifRating(e, 'difficultyFour')} className={selected === 'difficultyFour' ? 'ratingButton ratingActivated' : 'ratingButton'}>4</button>
            <button onClick={(e) => handleDifRating(e, 'difficultyFive')} className={selected === 'difficultyFive' ? 'ratingButton ratingActivated' : 'ratingButton'}>5</button>
        </div>
        <ButtonGroupCaption>
            <div>Easy</div>
            <div>Difficult</div>
        </ButtonGroupCaption>
        </Container>
    )
}

export default DifficultyRater
