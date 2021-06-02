import React from 'react'
import * as bs from 'react-bootstrap'
import { useRouteMatch, useHistory } from 'react-router-dom'
import CreateProfModal from './createprofmodal'
import CreateCourseModal from './createcoursemodal'

function TableFooter (props) {
    let match = useRouteMatch("/schools/:sid/:did/:type");
    let history = useHistory();

    let returnButton = () => {
        if(match.params.type === "professors"){
            return(
                <CreateProfModal getDepartments={props.getDepartments}/>
            )
        } else {
            return(
                <CreateCourseModal getDepartments={props.getDepartments}/>
            )
        }
    }
    
    let returnCreateButton = () => {
        if(match.params.sid === "ge" && match.params.type === "professors"){
            return(
                <div>
                    <h5>You can only filter Courses by GEs</h5>
                </div>
        )
        }
        else if(props.itemCount === 0 && props.isSearched){
            return(
                <div style={{textAlign: 'center'}}>
                    <h5>No items found</h5>
                </div>
            )
        }
        else if(match.params.sid === "all" && props.isSearched && (props.numPages === 1 || props.numPages === 0 || props.pageNum === props.numPages)){
            return (
                <></>
            )
        }
        else if(match.params.sid === "all" && props.savedNextToken){
            return (
                <bs.Button onClick={() => props.nextPage(props.myIndex)}>See More</bs.Button>
            )
        }
        else if (props.numPages === 1 || props.numPages === 0 || props.pageNum === props.numPages){
            return(
                    <div>
                        {/* <h5>Don't see what you're looking for?</h5>
                        {returnButton()} */}
                    </div>
            )
        } else {
            return (
                <bs.Button onClick={() => props.nextPage(props.myIndex)}>See More</bs.Button>
            )
        }
    }

    if (match.params.sid === "ge" && match.params.type === "professors"){
        return(
            <div style={{textAlign: 'center', padding: '5rem 0'}}>
                <h5>You can only filter Courses by GEs</h5>
            </div>
        )
    }
    else if(props.itemCount === 0){
        return(
            <div style={{textAlign: 'center', padding: '5rem 0'}}>
                <h5>No items found</h5>
            </div>
        )
    }else {
        return(
  
                <div className="tableFooter">
                    
                        <div className="footerResults">
                            <div className="footerDetail">
                                {   
                                    match.params.sid === "all" && !props.isSearched ?
                                    `Showing Results 1 -  ${props.myIndex}`
                                    :
                                    props.totalItemsCount > 0 ?
                                    `Showing Results 1 -  ${props.myIndex} of ${props.totalItemsCount}`
                                    : null
                                }   
                            </div>
                            <div className="footerButton" onClick={() => window.scrollTo(0, 0)}>
                            {props.totalItemsCount > 0 ?
                                    "Back to Top"
                                    : null
                                }
                            </div>
                        </div>
                    
                    <div className="footerExtra">
                        {returnCreateButton()}
                    </div>
                    <div>
    
                    </div>
                </div>  
        )   
    }
    
}

export default TableFooter;