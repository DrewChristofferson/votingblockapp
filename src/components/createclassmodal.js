import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import React, { useState, useEffect } from "react"
import { useRouteMatch } from 'react-router-dom'
import Form from "react-bootstrap/Form"
import SearchBar from './searchbar'
import { API } from 'aws-amplify'
import { listProfessors, listSchools, searchCourses, searchProfessors } from '../graphql/queries';
import { createClass as createClassMutation } from '../graphql/mutations';
import styled from 'styled-components'

const SearchTable = styled.div`
  display: flex;
  margin: 2rem 0;
  flex-direction: column;
  align-items: flex-start;
  max-height: 50vh;
  overflow-y: scroll;
`

const SearchItem = styled.div`
  padding: 1rem 2rem;
  width: 100%;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background-color: #60adff;
  }
`
const SearchItemClicked = styled.div`
  padding: 1rem 2rem;
  width: 100%;
  cursor: pointer;
  background-color: #007afc;
  color: white;
  font-weight: 600;
  &:hover {
    background-color: #60adff;
  }
`
const CenterContent = styled.div`
  display: flex;
  justify-content: center;
`
const SearchResults = styled.h5`
  text-align: center;
  padding: 2rem 0 .5rem;
`

function CreateClassModal(props) {
    const match = useRouteMatch("/schools/:sid/:did/:type/:oid")
    const initialSearchFormState = { professorID: '', courseID: ''}
    const [show, setShow] = useState(false);
    const [searchFormData, setSearchFormData] = useState(initialSearchFormState);
    const [professors, setProfessors] = useState();
    const [courses, setCourses] = useState();
    const [searchFilter, setSearchFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);


    const handleClose = () => {
      setShow(false);
      setSearchFilter('');
    }
    const handleShow = () => setShow(true);

    async function getAllProfessors(searchValue) {
      let apiData;
      if(!searchValue || searchValue?.length < 3){
        setProfessors();
        setCourses();
        return;
      };
        
      apiData = await API.graphql({ query: searchProfessors, authMode: 'API_KEY', variables: {filter: {name: {matchPhrase: searchValue}}}, limit: 30} );
      const profsIn = apiData.data.searchProfessors.items
      setProfessors(profsIn);
      setIsLoading(false)
  }
    async function getAllCourses(searchValue) {
      let apiData;
      if(!searchValue || searchValue?.length < 3) return;
        
      apiData = await API.graphql({ query: searchCourses, authMode: 'API_KEY', variables: {filter: {code: {matchPhrase: searchValue}}}, limit: 30} );
      const coursesIn = apiData.data.searchCourses.items
      setCourses(coursesIn);
      setIsLoading(false)
  }

      async function createClass() {
        if (!searchFormData.professorID || !searchFormData.courseID) return;
        await API.graphql({ query: createClassMutation, variables: { input: searchFormData } });
        //use props as state
        //props.setProfessors([ ...props.professors, formData ]);
        props.fetchData();
        setSearchFormData(initialSearchFormState);
      }

    let submitHandler = (e) => {
        e.preventDefault();
    }

    let handleChangeSearch = (val) => {
      if(match.params.type === "courses"){
          getAllProfessors(val)
      }
      else if(match.params.type === "professors"){
        getAllCourses(val)
      }
      // setPageNum(1);
      // setPageStartIndex(0);
  }

  const handleSelect = (id) => {
    if(match.params.type === 'courses'){
      if(!id){
        setSearchFormData({ ...searchFormData, 'professorID': ''});
      }
      else{
        setSearchFormData({ ...searchFormData, 'professorID': id, 'courseID': match.params.oid});
      }
    } else if (match.params.type === 'professors'){
      if(!id){
        setSearchFormData({ ...searchFormData, 'courseID': ''});
      }
      else{
        setSearchFormData({ ...searchFormData, 'courseID': id, 'professorID': match.params.oid});
      }
    }
  }

    return (
      <div style={{paddingLeft: "1rem"}}>
        {
          match.params.type === "professors" ?
            <Button onClick={handleShow}>Add Course for {props.name}</Button>
          :
            <Button onClick={handleShow}>Add Professor for {props.courseCode}</Button>
        }
        {/* <FontAwesomeIcon icon={faPlusCircle} onClick={handleShow} style={{cursor: "pointer", fontSize: "30px", marginTop: ".7rem"}} /> */}
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            {
              match.params.type === "professors" ?
              <Modal.Title>Add Course for {props.name}</Modal.Title>
              :
              <Modal.Title>Add Professor for {props.courseCode}</Modal.Title>
            }
            
          </Modal.Header>
          <Modal.Body>
            <CenterContent><SearchBar handleChangeSearch={handleChangeSearch} classModal={true} /></CenterContent>
            {
              match.params.type === "professors" ?
              <SearchResults>Found {courses?.length || 0} Courses(s)</SearchResults>
              :
              <SearchResults>Found {professors?.length || 0} Professor(s)</SearchResults>
            }
            
          {
            isLoading ?
            <></>
            :
            professors ?
            <SearchTable>
              
              {
                professors.map(professor => {
                  
                  

                    return(
                      
                        searchFormData.professorID === professor.id ?
                        <SearchItemClicked key={professor.id} onClick={() => handleSelect()}>{professor.name}</SearchItemClicked>
                        :
                        <SearchItem key={professor.id} onClick={() => handleSelect(professor.id)}>{professor.name}</SearchItem>
                      
                    
                    )
                    
                })
              }
            </SearchTable>
            :
            courses[0] ?
            <SearchTable>
              {
                courses.map(course => {
                  return(
                    searchFormData.courseID === course.id ?
                    <SearchItemClicked key={course.id} onClick={() => handleSelect()}>{course.name} ({course.code})</SearchItemClicked>
                    :
                    <SearchItem key={course.id} onClick={() => handleSelect(course.id)}>{course.name} ({course.code})</SearchItem>
                  )
                })
              }
            </SearchTable>
            :
            match.params.type === "professors" ?
            <p>Make sure your course code is formatted like 'Acc 200'</p>
            :
            <></>
          }
          </Modal.Body>
          {/* <Modal.Body>
            <Form style={{paddingLeft: "1rem"}} onSubmit={submitHandler}>
                <Form.Group controlId="exampleForm.ControlInput2" >
                    <Form.Control type="text" placeholder="Search for a Professor" onChange={(e) => handleChangeSearch(e.currentTarget.value)}/>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect2" onChange={handleProfessorChange}>
                    <Form.Label>Professors</Form.Label>
                    {getProfessorsFromSearch()}
                </Form.Group>
            </Form>
          </Modal.Body> */}
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {
              match.params.type === "professors" ?
                <Button variant="primary" disabled={searchFormData.professorID && searchFormData.courseID ? false : true} onClick={() => { createClass(); handleClose(); }}>
                  Add Course
                </Button>
                :
                <Button variant="primary" disabled={searchFormData.professorID && searchFormData.courseID ? false : true} onClick={() => { createClass(); handleClose(); }}>
                  Add Professor
                </Button>
            }
            
          </Modal.Footer>
        </Modal>
      </div>
    );   
  }
  
  export default CreateClassModal;