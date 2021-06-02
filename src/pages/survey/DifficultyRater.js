import React from 'react'
import styled from 'styled-components'
import Container from './Components/DifficultyRaterContainer'
import ButtonGroupCaption from './Components/ButtonGroupCaption'


function DifficultyRater(props) {

    const handleDifRating = (e, id, value) => {
        e.preventDefault();
        let tempRatings = {};
        for (const [key, value] of Object.entries(props.difRatings)) {
            tempRatings[key] = value;
        }

        if(tempRatings[id] === value){
            delete tempRatings[id];
        }else {
            tempRatings[id] = value;
        }

        props.updateDifRatings(tempRatings)
    }

    return (
        props.selected[props.id] ?
        <Container>
        <p>Difficulty Rating</p>
        <div>
            <button onClick={(e) => handleDifRating(e, props.id, 'one')} className={props.difRatings[props.id] === 'one' ? 'ratingButton ratingActivated' : 'ratingButton'}>1</button>
            <button onClick={(e) => handleDifRating(e, props.id, 'two')} className={props.difRatings[props.id] === 'two' ? 'ratingButton ratingActivated' : 'ratingButton'}>2</button>
            <button onClick={(e) => handleDifRating(e, props.id, 'three')} className={props.difRatings[props.id] === 'three' ? 'ratingButton ratingActivated' : 'ratingButton'}>3</button>
            <button onClick={(e) => handleDifRating(e, props.id, 'four')} className={props.difRatings[props.id] === 'four' ? 'ratingButton ratingActivated' : 'ratingButton'}>4</button>
            <button onClick={(e) => handleDifRating(e, props.id, 'five')} className={props.difRatings[props.id] === 'five' ? 'ratingButton ratingActivated' : 'ratingButton'}>5</button>
        </div>
        <ButtonGroupCaption>
            <div>Easy</div>
            <div>Difficult</div>
        </ButtonGroupCaption>
        </Container>
        
        :
        <></>
    )
}

export default DifficultyRater
