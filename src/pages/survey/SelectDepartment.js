import React, { useState, useEffect } from 'react'
import { useRouteMatch, useHistory  } from 'react-router-dom'
import Form from "react-bootstrap/Form"
import { listDepartments} from '../../graphql/queries';
import { API } from 'aws-amplify';
import Button from 'react-bootstrap/Button'
import SelectForm from './Components/SelectForm'

function SelectDepartment() {
    const [departments, setDepartments] = useState();
    const [selected, setSelected] = useState();
    const match = useRouteMatch("/survey/major/:sid")
    const history = useHistory();

    useEffect(() => {
        fetchDepartments();
    }, [])

    async function fetchDepartments() {
        const apiData = await API.graphql({ query: listDepartments, variables: {filter: { schoolID: {eq: match.params.sid}} }});
        setDepartments(apiData.data.listDepartments.items)
    }

    const handleClick = () => {
        if(selected){
            history.push(`${match.url}/${selected}/courses`)
        }
    }

    return (
        <div>
                    <h2>Major Survey</h2>
                    <p>What department is your major in?</p>
                    <SelectForm >
                        {
                            departments ?
                                <Form.Group controlId="exampleForm.ControlDropdown1" onChange={e => setSelected(e.target.value)}>
                                    <Form.Control
                                        as="select"
                                        className="my-1 mr-sm-2"
                                        custom
                                    >
                                        <option key='select' disabled selected hidden>Select a Department</option>
                                        {
                                            departments.map((department) => {
                                                return(
                                                    <option value={department.id} key={department.id}>{department.name}</option>
                                                )
                                            })
                                        }
                        
                                    </Form.Control>
                                </Form.Group>
                                :
                                <></>
                        }
                    </SelectForm>

                    <Button onClick={handleClick}>Next</Button>
                    
                </div>
    )
}

export default SelectDepartment
