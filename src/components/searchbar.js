import React, { useState, useEffect } from 'react';
import * as bs from 'react-bootstrap'
import { useRouteMatch } from 'react-router-dom'
import * as BsIcons from 'react-icons/bs'


function SearchBar(props) {
    const match = useRouteMatch("/schools/:sid/:did/:type")
    const [searchVal, setSearchVal] = useState('');

    useEffect(() => {
        setSearchVal('')
    }, [match.url])
    
    const handleSubmit = (e) => {
        e.preventDefault()
        if(searchVal){
            props.handleChangeSearch(searchVal);
        } else {
            props.handleChangeSearch();
        }
    }
    const handleChange = (e) => {
        setSearchVal(e.target.value)
    }
    return(
        <div className="headerSearchBar">
            <bs.Form onSubmit={handleSubmit}>
                <bs.InputGroup className="searchBar" controlId="exampleForm.ControlInput1" onChange={handleChange}>
                    {
                       (match.params.type === "professors" && !props.classModal) || (match.params.type === "courses" && props.classModal) ?
                        <bs.Form.Control type="text" placeholder={`Search by First or Last Name`} value={searchVal}/>
                        :
                        props.classModal ?
                        <bs.Form.Control type="text" placeholder={`Search by Course Code`} value={searchVal}/>
                        :
                        <bs.Form.Control type="text" placeholder={`Search by Title or Course Code`} value={searchVal}/>
                    }
                    
                    {/* <bs.InputGroup.Append > */}
                    <bs.InputGroup.Append onClick={(e) => props.handleChangeSearch(searchVal)}>
                        <bs.InputGroup.Text id="basic-addon2" style={{backgroundColor: "#2077B0", border: "none"}}><BsIcons.BsSearch style={{color: "white", cursor: "pointer"}}/></bs.InputGroup.Text>
                    </bs.InputGroup.Append>
                </bs.InputGroup>
            </bs.Form>
        </div>
        
    )
}

export default SearchBar;