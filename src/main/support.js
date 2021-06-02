import React, {useState} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import styled from 'styled-components'
import axios from 'axios'

const initialFormState = { email: '', supportcontent: ''}


const Container = styled.div`
    width: 70%;
    margin: 3rem;
`
const StyledForm = styled(Form)`
    text-align:left;
    width: 70%;
    margin-top: 2rem;
    @media (max-width: 759px){
        width: 100%;
    }
`


function Support() {
    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitted, setIsSubmitted] = useState(false)
    const URL = 'https://sheet.best/api/sheets/042bd674-01f6-4ff9-85fc-cb2e1a350fa4'

    const submitHandler = (e) => {
        e.preventDefault();
        axios.post(URL, formData)
        .then(setIsSubmitted(true))
        .then(setFormData({email: '', supportcontent: ''}))
    }

    const submitForm = () => {
        axios.post(URL, formData)
        .then(setIsSubmitted(true))
        .then(setFormData({email: '', supportcontent: ''}))
    }
    
    const handleNameChange = (value) => {
        // setFormData({ ...formData, 'id': value.replaceAll(' ','-').toLowerCase()});
        setFormData({ ...formData, 'email': value});
    }

    const handleCommentChange = (value) => {
        // setFormData({ ...formData, 'id': value.replaceAll(' ','-').toLowerCase()});
        setFormData({ ...formData, 'supportcontent': value});
    }
    return (
        <Container>
            <h1>Leave us a message!</h1>
            {
                isSubmitted ?
                <>
                <h5>Your response is submitted ✔</h5>
                <Button onClick={() => setIsSubmitted(false)}>Submit Another Response</Button>
                </>
                :
                <>
                <h5>VotingBlock is just getting started and we would love your feedback!</h5>
                <StyledForm onSubmit={submitHandler}>
                        <Form.Group controlId="exampleForm.ControlInput1" >
                            <Form.Label>Your email</Form.Label>
                            <Form.Control type="text"  value={formData.name} onChange={(e) => handleNameChange(e.currentTarget.value)}/>
            
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput2" >
                            <Form.Label>Your message</Form.Label>
                            <Form.Control as="textarea" rows={4} value={formData.comments} onChange={(e) => handleCommentChange(e.currentTarget.value)}/>
            
                        </Form.Group>
                    </StyledForm>
                    <Button onClick={submitForm}>Submit</Button>
                    </>
            }
        </Container>
    )
}

export default Support
