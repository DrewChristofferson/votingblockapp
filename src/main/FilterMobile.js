import React, { useState, useEffect } from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import objGE from '../geobject'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import SubMenu from './submenu'
import generalEd from '../gedata'
import { BsPrefixComponent } from 'react-bootstrap/esm/helpers'

const FilterContainer = styled.div`
    color: black;
`

const Nav = styled.div`
    background: #15171c;
    height: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const NavIcon = styled(Link)`
    margin-left: 2em;
    font-size: 2em;
    height: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`

const SidebarNav = styled.nav`
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

`
const Content = styled.div`
    margin: 2em 0 4em 0;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const FilterSubtitle = styled.p`
    color: black;
`

const SidebarWrap = styled.div`
    width: 20%
`

const FormGroup = styled(Form.Group)`
    @media(min-width: 760px){
        padding: 0 2rem;
    }
    
`
const FormLabel = styled(Form.Label)`
    @media(min-width: 760px){
        padding-right: .5rem;
    }
    
`

const FilterLink = styled.span`
    color: blue;
    cursor: pointer;
    padding: 0 .5rem;
`
const FilterLinkBold = styled.span`
    color: blue;
    cursor: pointer;
    padding: 0 .5rem;
    font-weight: 600;
`

function FilterMobile(props) {
    const match = useRouteMatch("/schools/:sid/:did/:category")
    const [schools, setSchools] = useState();
    const [isMajorFilter, setIsMajorFilter] = useState(false);
    const [isGEFilter, setIsGEFilter] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(match.params.did);
    const [selectedSchool, setSelectedSchool] = useState(match.params.sid);
    const history = useHistory();

    useEffect(() => {
        let temp = {};
        props.colleges.forEach(college => {
            let tempdepts = {};
            college.departments.items.forEach(dept => {
                tempdepts[dept.id] = dept.name
            })
            temp[college.id] = 
                {
                    name: college.name, 
                    departments: tempdepts
                }
        })
        if(temp[1]){
            setSchools(temp)
        }
        
    }, [props.colleges])

    useEffect(() => {
        if(match.params.sid === "ge"){
            setIsGEFilter(true)
        }
        else if(match.params.sid !== "all"){
            setIsMajorFilter(true)
        }
        
    }, [match.params.category])

    useEffect(() => {
        setSelectedSchool(match.params.sid)
        
    }, [match.params.sid])

    useEffect(() => {
        setSelectedDepartment(match.params.did)
        
    }, [match.params.did])


    let getGE = () => {
        if(objGE){
          return(
            <>
              <Form.Control as="select" value={selectedDepartment} >
              <option key='select' value="all">All Requirements</option>
                {
                    Object.entries(objGE).map(([key, value]) => ( 
                            <option key={key} value={key}>{value}</option>
                    ))
                //   schools.map((school, indx) => (
                //     <option key={indx} value={indx}>{school.name}</option>
                //   ))
                }
            </Form.Control>
          </>
          )
        } else {
          return;
        }
      }

    let getSchools = () => {
        if(schools){
          return(
            <>
              <Form.Control as="select" value={selectedSchool} >
              <option key='select' value="all">All Colleges</option>
                {
                    Object.entries(schools).map(([key, value]) => ( 
                            <option key={key} value={key}>{value.name}</option>
                    ))
                //   schools.map((school, indx) => (
                //     <option key={indx} value={indx}>{school.name}</option>
                //   ))
                }
            </Form.Control>
          </>
          )
        } else {
          return;
        }
      }

    let getDepartments = () => {
        let depts;
        
        if(schools){
            depts = schools[selectedSchool] ? schools[selectedSchool].departments : null
            if(depts){
                return(
                <Form.Control as="select" value={selectedDepartment}>
                    <option key='all' value={'all'}>All Departments</option>
                    {
                        Object.entries(depts).map(([key, value]) => ( 
                            <option key={key} value={key}>{value}</option>
                    ))
                    //   depts.map((department, indx) => (
                    //     <option key={indx} value={indx}>{department.name}</option>
                    //   ))
                    }
                </Form.Control>
                )
            } else {
                return(
                <Form.Control as="select" defaultValue={'DEFAULT'}>
                <option value={'DEFAULT'} disabled>All Departments</option>
                <option disabled>You Must First Select a College</option>
                </Form.Control>
                )
            }
        } else {
            return(
                <Form.Control as="select" defaultValue={'DEFAULT'}>
                <option value={'DEFAULT'} disabled>All Departments</option>
                </Form.Control>
            )
        }
      }

    let handleSchoolChange = (e) => {
        setSelectedSchool(e.target.value);
        setSelectedDepartment('all');
        history.push(`/schools/${e.target.value}/all/${match.params.category}`)
        props.updateFinishedLoading();
        props.initPageNum();
        props.handleChangeSearch('');
        // if(schools[e.target.value].departments.items[0]){
        //   setFormData({ ...formData, 'departmentID': schools[e.target.value].departments.items[0].id});
        // }
        // getDepartments();
      }

      let handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
        if(e.target.value === 'all'){
            history.push(`/schools/${match.params.sid}/all/${match.params.category}`)
        } else{
            history.push(`/schools/${match.params.sid}/${e.target.value}/${match.params.category}`)
        }
        props.updateFinishedLoading();
        props.initPageNum();
        props.handleChangeSearch('');
        // setFormData({ ...formData, 'departmentID': schools[selectedSchool].departments.items[e.target.value].id});
      }

      let submitHandler = (e) => {
        e.preventDefault();
      }

      const handleMajorClick = () => {
            history.push(`/schools/all/all/${match.params.category}`)
          setIsMajorFilter(!isMajorFilter);
          setIsGEFilter(false);
          props.initPageNum();
          props.handleChangeSearch('');
      }

      const handleGEClick = () => {
          if(isGEFilter){
            history.push(`/schools/all/all/${match.params.category}`)
          }else {
            history.push(`/schools/ge/all/courses`)
          }
          setIsGEFilter(!isGEFilter);
          setIsMajorFilter(false);
          props.updateFinishedLoading();
          props.initPageNum();
          props.handleChangeSearch('');
      }

    return (
        <div>
            <Content>

            
            <FilterSubtitle>Filter by 
                {
                    isMajorFilter ?
                    <FilterLinkBold onClick={handleMajorClick}>Major</FilterLinkBold> 
                    :
                    <FilterLink onClick={handleMajorClick}>Major</FilterLink> 

                }
                | 
                {
                    isGEFilter ?
                    <FilterLinkBold onClick={handleGEClick}>GE</FilterLinkBold>
                    :
                    <FilterLink onClick={handleGEClick}>GE</FilterLink>
                }
                </FilterSubtitle>
            <FilterContainer>
                {
                    isMajorFilter ?
                        <Form inline={!props.isMobile} onSubmit={submitHandler}>
                            <FormGroup controlId="exampleForm.ControlSelect4" onChange={handleSchoolChange}>
                                <FormLabel>College</FormLabel>
                                {getSchools()}
                            </FormGroup>
                            <FormGroup controlId="exampleForm.ControlSelect5" onChange={handleDepartmentChange}>
                                <FormLabel>Department</FormLabel>
                                {getDepartments()}
                            </FormGroup>   
                        </Form>
                        :
                    isGEFilter ?
                    <Form inline={!props.isMobile} onSubmit={submitHandler}>
                        <FormGroup controlId="exampleForm.ControlSelect5" onChange={handleDepartmentChange}>
                            <FormLabel>GE Requirement</FormLabel>
                            {getGE()}
                        </FormGroup>   
                    </Form>
                        :
                        <></>
                }
            
            </FilterContainer>

            
            </Content>
        </div>
    )
}

export default FilterMobile;
