import React, { useState, useEffect } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import SelectForm from './Components/SelectForm'
import Form from "react-bootstrap/Form"
import { listSchools} from '../../graphql/queries';
import { API } from 'aws-amplify';
import Button from 'react-bootstrap/Button'

function SelectCollege() {
    const [colleges, setColleges] = useState();
    const [selected, setSelected] = useState();
    const match = useRouteMatch("/survey/major/:sid")
    const history = useHistory();

    useEffect(() => {
        fetchColleges();
    }, [])

    async function fetchColleges() {
        const apiData = await API.graphql({ query: listSchools });
        setColleges(apiData.data.listSchools.items)
    }
    const handleClick = () => {
        if(selected){
            history.push(`/survey/major/${selected}`)
        }
    }

    return (
        <div>
            <div>
                    <h5>What college is your major in?</h5>
                    <SelectForm >
                        {
                            colleges ?
                                <Form.Group 
                                    controlId="exampleForm.ControlDropdown1" 
                                    onChange={e => setSelected(e.target.value)}
                                >
                                    <Form.Control
                                        as="select"
                                        className="my-1 mr-sm-2"
                                        custom
                                    >
                                        <option key='select' disabled selected hidden>Select a College</option>
                                        {
                                            colleges.map((college) => {
                                                return(
                                                    <option value={college.id} key={college.id}>{college.name}</option>
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
        </div>
    )
}

export default SelectCollege
