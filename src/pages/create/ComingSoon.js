import React, {useState} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import styled from 'styled-components'
import axios from 'axios'

const initialFormState = { name: '', comments: ''}


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


function ComingSoon() {
    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitted, setIsSubmitted] = useState(false)
    const URL = 'https://sheet.best/api/sheets/042bd674-01f6-4ff9-85fc-cb2e1a350fa4'

    const submitHandler = (e) => {
        e.preventDefault();
        axios.post(URL, formData)
        .then(setIsSubmitted(true))
        .then(setFormData({name: '', comments: ''}))
    }

    const submitForm = () => {
        axios.post(URL, formData)
        .then(setIsSubmitted(true))
        .then(setFormData({name: '', comments: ''}))
    }
    
    const handleNameChange = (value) => {
        // setFormData({ ...formData, 'id': value.replaceAll(' ','-').toLowerCase()});
        setFormData({ ...formData, 'name': value});
    }

    const handleCommentChange = (value) => {
        // setFormData({ ...formData, 'id': value.replaceAll(' ','-').toLowerCase()});
        setFormData({ ...formData, 'comments': value});
    }
    return (
        <Container>
            <h1>This feature is coming soon.</h1>
            {
                isSubmitted ?
                <>
                <h5>Your response is submitted ✔</h5>
                <Button onClick={() => setIsSubmitted(false)}>Submit Another Response</Button>
                </>
                :
                <>
                <h5>In the meantime, tell us what block you're interested in starting.</h5>
                <StyledForm onSubmit={submitHandler}>
                        <Form.Group controlId="exampleForm.ControlInput1" >
                            <Form.Label>Block Name</Form.Label>
                            <Form.Control type="text"  value={formData.name} onChange={(e) => handleNameChange(e.currentTarget.value)}/>
            
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput2" >
                            <Form.Label>Additional comments</Form.Label>
                            <Form.Control type="text" value={formData.comments} onChange={(e) => handleCommentChange(e.currentTarget.value)}/>
            
                        </Form.Group>
                    </StyledForm>
                    <Button onClick={submitForm}>Submit</Button>
                    </>
            }
        </Container>
    )
}

export default ComingSoon
