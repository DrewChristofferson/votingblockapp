import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`

function ErrorPage() {
    return (
        <Container>
            <h2>Whoops, looks like this page doesn't exist.</h2>
            <Link to="/">Go back</Link> to the home page.
        </Container>
    )
}

export default ErrorPage
