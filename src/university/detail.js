import React, { useEffect, useState, useContext } from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch, useHistory, useLocation } from 'react-router-dom'
import { getProfessor, getCourse, listRatings, ratingsByContent } from '../graphql/queries'
import { API, Auth } from 'aws-amplify'
import AppContext from '../context/context'
import Table from './table'
import DataLineChart from '../components/linechart'
import DataPieChart from '../components/piechart'
import DataBarChart from '../components/BarChart'
import CreateModalClass from '../components/createclassmodal'
import CreateModalClassProf from '../components/createclassmodalprof'
import DifficultyRater from '../components/DifficultyRater'
import { ratingsByUserAndContent } from '../graphql/queries';
import { createRating as createRatingMutation } from '../graphql/mutations';
import { updateRating as updateRatingMutation } from '../graphql/mutations';
import { deleteRating as deleteRatingMutation } from '../graphql/mutations';
import { updateCourse as updateCourseMutation } from '../graphql/mutations';
import { updateProfessor as updateProfessorMutation } from '../graphql/mutations';
import { createProfessorComment as createProfessorCommentMutation } from '../graphql/mutations';
import { createCourseComment as createCourseCommentMutation } from '../graphql/mutations';
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import objGE from '../geobject'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import img1 from '../images/detailplaceholders/one.jpg'
import img2 from '../images/detailplaceholders/two.jpg'
import img3 from '../images/detailplaceholders/three.jpg'
import img4 from '../images/detailplaceholders/four.jpg'
import img5 from '../images/detailplaceholders/five.jpg'
import img6 from '../images/detailplaceholders/six.jpg'
import img7 from '../images/detailplaceholders/seven.jpg'

const CLASS_VOTE_UP = "tableSelectedUp";
const CLASS_VOTE_DOWN = "tableSelectedDown";
const CLASS_NO_VOTE_DOWN = "tableNotSelectedDown";
const CLASS_NO_VOTE_UP = "tableNotSelectedUp";
const VOTE_UP  = "up";
const VOTE_DOWN = "down";

const Title = styled.h2`
    @media(max-width: 759px){
        font-size: 1.3rem;
        font-weight: 600;
    }
`
const Subtitle = styled.h4`
    @media(max-width: 759px){
        font-size: 1.1rem;
        font-weight: 550;
    }
`
const Description = styled.h6`
    @media(max-width: 759px){
        font-size: 1rem;
        font-weight: 500;
    }
`

const BackButton = styled(bs.Button)`
    @media(max-width: 759px){
        font-size: .9rem;
    }
`

const DetailTabs = styled(bs.Tabs)`
    @media(max-width: 759px){
        padding-top: 2rem;
    }
`
const TabItem = styled(bs.Tab)`
    @media(max-width: 759px){
        padding: 0 0 2rem;
    }
    @media(min-width: 760px){
        padding: 2rem 0;
    }
`
const TabItemContainer = styled.div`
    margin: 0 8rem;
    padding-top: 2rem;
    text-align: left;
    max-height: 600px;
    overflow-y: scroll;
    @media(max-width: 759px){
        width: 90%;
        margin: 0;
    }
`

const AddItemText = styled.h5`
    @media(max-width: 759px){
        font-size: 1rem;
        padding-top: 2rem;
    }
`

const ChartTitle = styled.h6`
    font-weight: 600;
`

const RankingsTitle = styled.h5`
    font-weight: 600;
    border-bottom: 2px solid gray;
`

const CommentItem = styled.div`
    background-color: #d6d6d6;
    border-radius: 10px;
    padding: 1.5rem 0 .25rem;
    margin: 1rem 0 1rem;
`

const CommentItemOwner = styled.div`
    background-color: #3c83e0;
    border-radius: 10px;
    padding: 1.5rem 0 .25rem;
    margin: 1rem 0 1rem;    
`

const CommentContent = styled.p`
    font-size: 1.15rem;
    padding:  0 4rem;
    @media(max-width: 759px){
        padding: 0 1rem;
        font-size: 1rem;
    }
`
const CommentUser = styled.p`
    font-size: 1.1rem;
    font-weight: 600;
    line-height: .3rem;
    padding:  0 4rem;
    @media(max-width: 759px){
        padding: 0 1rem;
        font-size: 1rem;
    }
`
const CommentDate = styled.p`
    font-size: .8rem;
    color: #939393;
    line-height: .3rem;
    padding:  0 4rem;
    @media(max-width: 759px){
        padding: 0 1rem;
    }
`
const CommentDateOwner = styled.p`
    font-size: .8rem;
    color: #305ab5;
    line-height: .3rem;
    padding:  0 4rem;
    @media(max-width: 759px){
        padding: 0 1rem;
    }
`

const CommentFormContainer = styled.div`
    padding: 2rem 8rem;
    @media(max-width: 759px){
        padding: 1rem 0;
    }
`
const CommentSubmitContainer = styled.div`
    display: flex;
    @media(max-width: 759px){
        flex-direction: column;
        align-items: center;
    }
    @media(min-width: 760px){
        justify-content: flex-end;
        align-items: center;
    }
`
const Checkbox = styled(bs.Form.Check)`
    
    @media(max-width: 759px){
        padding-bottom: 1rem
    }
    @media(min-width: 760px){
        padding-right: 2rem
    }
`
const TabTitle = styled.h3`
    text-align: center;
    padding-top: 2rem;
    font-weight: 600;
    @media(max-width: 759px){
        font-size: 1.2rem;
        font-weight: 500;
    }
`



function Detail(props) {
    const match = useRouteMatch("/schools/:sid/:did/:type/:oid")
    let history = useHistory();
    const [professor, setProfessor] = useState();
    const [course, setCourse] = useState();
    const [professorsForCourse, setProfessorsForCourse] = useState([]);
    const [coursesForProfessor, setCoursesForProfessor] = useState([]);
    const [ratings, setRatings] = useState();
    const [oidRating, setOidRating] = useState([]);
    const [isLoadingRatings, setIsLoadingRatings] = useState(true);
    const [comments, setComments] = useState();
    const [isLoadingProfessor, setIsLoadingProfessor] = useState(true);
    const [isLoadingProfessors, setIsLoadingProfessors] = useState(true);
    const [isLoadingCourse, setIsLoadingCourse] = useState(true);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [isRatingDifficulty, setIsRatingDifficulty] = useState(false);
    const [isRatedDifficulty, setIsRatedDifficulty] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState({})
    const [commentText, setCommentText] = useState('')
    const [name, setName] = useState("");
    const [isAnonymousComment, setIsAnonymousComment] = useState(false);
    const context = useContext(AppContext)
    const VOTE_UP  = "up";
    const VOTE_DOWN = "down";
    const location = useLocation();
    const isMobile = useMediaQuery({ query: '(max-width: 759px)' })

    useEffect(() => {
        //navigates user to the top of the page on page load
        window.scrollTo(0, 0);
        fetchData();
        fetchRatings();
        props.getRatings(context.userid)
        getProfessors();
    }, []);


    useEffect(() => {
        if(professor){
            addBreadcrumb(match.params.oid, professor.name, 'professors')
        }
        else if (course){
            addBreadcrumb(match.params.oid, course.code, 'courses')
        }
    }, [professor, course]);

    useEffect(() => {
        fetchRatings();
        setIsRatingDifficulty(false);
        setIsRatedDifficulty(false);
    }, [match.params.oid]);

    useEffect(() => {
        fetchData();
        getRating();
        setProfessor(null);
        setCourse(null);
    }, [location]);

    useEffect(() => {
        getRating();
    }, [context, match.params.oid]);

    let getRating = async() => {
        if(context.user){
            const ratingData = await API.graphql({ query: ratingsByUserAndContent, variables: { "userID": context.user.username, "contentID": {eq: match.params.oid }, sortDirection: "ASC" }});
            const itemRating = ratingData.data.ratingsByUserAndContent.items[0]
            if(itemRating){
                setOidRating([itemRating.id, itemRating.ratingType])
            }
        }
    }


   let getMonthName = (monthNum) => {
    let currDate = new Date();
    currDate.setMonth(currDate.getMonth()-monthNum);
    const previousMonth = currDate.toLocaleString('default', { month: 'long' });

    return previousMonth;
 }

    let getRatingCount = (monthNum, type) => {
        const myRegex = /^(.*)-(.*)-(.*)$/
        if (Number.isInteger(monthNum)) {
            //the getMonth() method gets the index and not the actual month number
            //subtracting one will offset this in the comparison below
            monthNum -= 1;
        }
        let currDate = new Date();
        let count = 0;
        ratings.forEach(rating => {
            //parse the date from the database
            //date: "YYY-MM-DD"
            let date = rating.updatedAt.split('T')[0];
            let match = myRegex.exec(date);
            //year: "YYYY"
            let year = match[1];
            //month: "MM"
            let month = match[2];
            //day: "DD"
            let day = match[3];

            if(type === "getUpVotes" && rating.ratingType === "up"){
                if(parseInt(year) < currDate.getFullYear()){
                    count++
                }
                else if (parseInt(year) === currDate.getFullYear() && parseInt(month) <= currDate.getMonth()-monthNum) {
                    count++;
                }    
            }
            if(type === "getDownVotes" && rating.ratingType === "down"){
                if(parseInt(year) < currDate.getFullYear()){
                    count++
                }
                else if (parseInt(year) === currDate.getFullYear() && parseInt(month) <= currDate.getMonth()-monthNum) {
                    count++;
                }   
            }
        })
        return count;
    }

   const dataProfessors = [
    {
      name: 'May',
      'Degan Kettles': 400,
      'Greg Andersen': 240,
      'Stephen Liddle': 240,
      'Gove Allen': 240
    },
    {
      name: 'June',
      'Degan Kettles': 300,
      'Greg Andersen': 139,
      'Stephen Liddle': 221,
      'Gove Allen': 221,
    },
    {
      name: 'July',
      'Degan Kettles': 200,
      'Greg Andersen': 980,
      'Stephen Liddle': 229,
      'Gove Allen': 229,
    },
    {
      name: 'August',
      'Degan Kettles': 278,
      'Greg Andersen': 390,
      'Stephen Liddle': 200,
      'Gove Allen': 200
    }
  ];

    let initChartData = () => {
        if(!isLoadingRatings){
            const dataElement = [
                // {
                //   name: getMonthName(6),
                //   [name]: getRatingCount(6, "getUpVotes") - getRatingCount(6, "getDownVotes"),
                // //   'TODO: Avg Score': 0
                // },
                // {
                //   name: getMonthName(5),
                //   [name]: getRatingCount(5, "getUpVotes") - getRatingCount(5, "getDownVotes"),
                // //   'TODO: Avg Score': 2
                // },
                // {
                //   name: getMonthName(4),
                //   [name]: getRatingCount(4, "getUpVotes") - getRatingCount(4, "getDownVotes"),
                // //   'TODO: Avg Score': -1
                // },
                {
                  name: getMonthName(3),
                  [name]: getRatingCount(3, "getUpVotes") - getRatingCount(3, "getDownVotes"),
                //   'TODO: Avg Score': -2
                },
                {
                  name: getMonthName(2),
                  [name]: getRatingCount(2, "getUpVotes") - getRatingCount(2, "getDownVotes"),
                //   'TODO: Avg Score': 1
                },
                {
                    name: getMonthName(1),
                    [name]: getRatingCount(1, "getUpVotes") - getRatingCount(1, "getDownVotes"),
                    // 'TODO: Avg Score': 4
                },
                {
                  name: getMonthName(0),
                  [name]: getRatingCount(0, "getUpVotes") - getRatingCount(0, "getDownVotes"),
                //   'TODO: Avg Score': 6
                }
                
              ]; 
              return dataElement;
        }
        else {
            return(
                [
                    {
                        "name": "invalid",
                        "datapoint": 2

                    }
                ]
            )
        }
    }
    let initBarData = () => {
        if(!isLoadingCourse){
            const bardata = [
                {
                  name: '1',
                  votes: course.difficultyOne,
                  pv: 2400,
                  amt: 2400,
                },
                {
                  name: '2',
                  votes: course.difficultyTwo,
                  pv: 1398,
                  amt: 2210,
                },
                {
                  name: '3',
                  votes: course.difficultyThree,
                  pv: 9800,
                  amt: 2290,
                },
                {
                  name: '4',
                  votes: course.difficultyFour,
                  pv: 3908,
                  amt: 2000,
                },
                {
                  name: '5',
                  votes: course.difficultyFive,
                  pv: 4800,
                  amt: 2181,
                },
              ];
              return bardata;
        }
        else {
            return(
                [
                    {
                        "name": "invalid",
                        "datapoint": 2

                    }
                ]
            )
        }
    }
    let initBarDataProf = () => {
        if(!isLoadingProfessor){
            const bardata = [
                {
                  name: '1',
                  votes: professor.difficultyOne,
                  pv: 2400,
                  amt: 2400,
                },
                {
                  name: '2',
                  votes: professor.difficultyTwo,
                  pv: 1398,
                  amt: 2210,
                },
                {
                  name: '3',
                  votes: professor.difficultyThree,
                  pv: 9800,
                  amt: 2290,
                },
                {
                  name: '4',
                  votes: professor.difficultyFour,
                  pv: 3908,
                  amt: 2000,
                },
                {
                  name: '5',
                  votes: professor.difficultyFive,
                  pv: 4800,
                  amt: 2181,
                },
              ];
              return bardata;
        }
        else {
            return(
                [
                    {
                        "name": "invalid",
                        "datapoint": 2

                    }
                ]
            )
        }
    }

    let initPieData = () => {
        if(!isLoadingRatings){
            const dataPie = [
                { name: "Up", value: getRatingCount(0, "getUpVotes") },
                { name: "Down", value: getRatingCount(0, "getDownVotes") }
              ]; 
            return dataPie;
        }
        else {
            return(
                [
                    { name: "Up", value: 8 },
                    { name: "Down", value: 3 }
                ]
            )
        }  
    }

    async function updateScore(id, score, increment, mutationName) {
        try{
            if (increment === VOTE_UP) {
                await API.graphql({ query: mutationName, variables: { input: {"id": id, "score": score + 1} } });
            }    
            else if (increment === VOTE_DOWN){
                await API.graphql({ query: mutationName, variables: { input: {"id": id, "score": score - 1} } });
            }
        }
        catch (e) {
            return e;
        }
      }

    async function createRating(contentID, type, mutationName, score) {
        let ratingIdFromAPI;
        if (!context.userid) return;
        try {
            const ratingData = await API.graphql({ query: ratingsByUserAndContent, variables: { "userID": context.userid, "contentID": {eq: contentID } }});
            ratingIdFromAPI = ratingData.data.ratingsByUserAndContent.items;
        } catch (e) {
            return e;
        }
        if(ratingIdFromAPI[0] === undefined){
            try {
                await API.graphql({ query: createRatingMutation, variables: { input: { "contentID": contentID, "userID": context.userid, "ratingType": type } }});
                updateScore(contentID, score, type, mutationName);
                //getRatings(userid);
            } catch (e) {
                return e;
            } finally {
                fetchData();
            }
        } else if (ratingIdFromAPI[0].ratingType === type){
            type === VOTE_UP ? type = VOTE_DOWN : type = VOTE_UP;
            try {
                await API.graphql({ query: deleteRatingMutation, variables: { input: { "id": ratingIdFromAPI[0].id } }});
                updateScore(contentID, score, type, mutationName);
                //getRatings(userid);
            } catch (e) {
                return e;
            }finally {
                fetchData();
            }
        } else {
            type === VOTE_UP ? score += 1 : score -= 1;
            try {
                await API.graphql({ query: updateRatingMutation, variables: { input: { "id": ratingIdFromAPI[0].id, "ratingType": type } }});
                updateScore(contentID, score, type, mutationName);
                //getRatings(userid);
            } catch (e) {
                return e;
            }finally {
                fetchData();
            }
        }
    }

    const getTimeStamp = (created) => {
        let timestamp;
        timestamp = new Date(Date.parse(created)).getTime()
        return timestamp;
    }

   async function fetchData() {
       if(match.params.type === "professors") {
            setIsLoadingCourses(true);
            try{ 
                const apiData = await API.graphql({ query: getProfessor, authMode: 'API_KEY', variables: { id: match.params.oid }  });
                setProfessor(apiData.data.getProfessor)
                setName(apiData.data.getProfessor.name)
                let comments = [];
                apiData.data.getProfessor.comments.items.forEach(comment => {
                    comments.push(comment)
                })
                comments.sort((a,b) => (getTimeStamp(a.createdAt) > getTimeStamp(b.createdAt)) ? 1 : ((getTimeStamp(b.createdAt) > getTimeStamp(a.createdAt)) ? -1 : 0))
                setComments(comments);
                setIsLoadingComments(false);
                setIsLoadingProfessor(false);

                if(apiData.data.getProfessor.classes) {
                    let coursesFromAPI = apiData.data.getProfessor.classes.items;
                    await Promise.all(coursesFromAPI.map(async course => {
                        return course;
                      })).then((values) => {
                        setCoursesForProfessor(values);
                        setIsLoadingCourses(false);
                      }) 
                } else {
                    setIsLoadingCourses(false);
                }

            } catch (e) {
                console.log('Error: ' + e)
            }
       } else if (match.params.type === "courses"){
            setIsLoadingProfessors(true);
            try{ 
                const apiData = await API.graphql({ query: getCourse, authMode: 'API_KEY', variables: { id: match.params.oid } });
                setCourse(apiData.data.getCourse);
                let comments = [];
                apiData.data.getCourse.comments.items.forEach(comment => {
                    comments.push(comment)
                })
                comments.sort((a,b) => (getTimeStamp(a.createdAt) > getTimeStamp(b.createdAt)) ? 1 : ((getTimeStamp(b.createdAt) > getTimeStamp(a.createdAt)) ? -1 : 0))
                setComments(comments);
                setName(apiData.data.getCourse.code)
                setIsLoadingCourse(false);

                if(apiData.data.getCourse.classes) {
                    let profsFromAPI = apiData.data.getCourse.classes.items;
                    await Promise.all(profsFromAPI.map(async professor => {
                        return professor;
                      })).then((values) => {
                        setProfessorsForCourse(values);
                        setIsLoadingProfessors(false);
                      }) 
                } else {
                    setIsLoadingProfessors(false);
                }
            } catch (e) {
                console.log(e)
            }
       } else {
           return (
               <h1>No data</h1>
           )
       }
   }

   let getRanking =  () => {
        let objectsAll = [];
        let rankingAll = 0;
        let rankingSchool = 0;
        let rankingDept = 0;

        if (match.params.type === "courses") {
            for (let i = 0; i < props.courses.length; i++) {
                objectsAll.push(props.courses[i]);
            }
        } else if (match.params.type === "professors"){
            for (let i = 0; i < props.professors.length; i++) {
                objectsAll.push(props.professors[i]);
            }

        } else return null;

        objectsAll.sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((match.params.type === "courses" ? (a.code > b.code) : (a.name > b.name)) ? 1 : -1) : -1 )

        for (let i = 0; i < objectsAll.length; i++){
            rankingAll++;
            if (objectsAll[i].id === match.params.oid){
                break;
            }
        }
        for (let i = 0; i < objectsAll.length; i++){
            if(objectsAll[i].department?.school?.id === (match.params.type === "courses" ? course.department?.school?.id : professor.department?.school?.id)){
                rankingSchool++;
                if (objectsAll[i].id === match.params.oid){
                    break;
                }
            }
        }
        for (let i = 0; i < objectsAll.length; i++){
            if(objectsAll[i].department?.id === (match.params.type === "courses" ? course.department?.id : professor.department?.id)){
                rankingDept++;
                if (objectsAll[i].id === match.params.oid){
                    break;
                }
            }
        }
    
        let strRankingAll =  rankingAll.toString()
        let strRankingDept =  rankingDept.toString()
        let strRankingSchool =  rankingSchool.toString()
            
        return [createOrdinalNumber(strRankingDept), createOrdinalNumber(strRankingSchool), createOrdinalNumber(strRankingAll)];
           
}

    let createOrdinalNumber = (strRanking) => {
        let lastDigit = strRanking[strRanking.length - 1];
        let strRankingWithoutLastDigit = strRanking.substring(0, strRanking.length - 1);
        switch(strRanking){
            case "1":
                return "1st";
            case "2":
                return "2nd";
            case "3":
                return "3rd";
            case "11":
                return "11th";
            case "12":
                return "12th";
            case "13":
                return "13th";
            default:
                if (lastDigit === "1"){
                    return strRankingWithoutLastDigit + "1st";
                }
                else if (lastDigit === "2"){
                    return strRankingWithoutLastDigit + "2nd";
                }
                else if (lastDigit === "3") {
                    return strRankingWithoutLastDigit + "3rd";
                }
                else {
                    return `${strRanking}th`;
                }
        }
    }

   let fetchRatings = async() => {
       try {
        const apiData = await API.graphql({ query: ratingsByContent, authMode: 'API_KEY', variables: {type: "Rating", contentID: { eq: match.params.oid} }});
        const ratingsFromAPI = apiData.data.ratingsByContent.items;

        await Promise.all(ratingsFromAPI.map(async rating => {
          return rating;
        }))
        setRatings(apiData.data.ratingsByContent.items)
        setIsLoadingRatings(false);
       } catch (e) {
           console.log(e);
       }
   }


   let getCourses = async() => {
        let filteredCourses = [];
        let paginatedCourses = [];
        let endingIndex;

        //sorting function details found at https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        (coursesForProfessor).sort((a, b) => (a.course.score < b.course.score) ? 1 : (a.course.score === b.course.score) ? ((a.course.name > b.course.name) ? 1 : -1) : -1 )
                
        for (let i = 0; i < coursesForProfessor.length; i++){
            coursesForProfessor[i].course.ranking = i + 1;
            if(coursesForProfessor[i].course.name.toLowerCase().includes(props.searchFilter.toLowerCase())){
                for(let j = 0; j < props.userRatings.length; j++){
                    if (props.userRatings[j].contentID === coursesForProfessor[i].course.id){
                        coursesForProfessor[i].course.userRating = props.userRatings[j].ratingType;
                    }   
                }
                filteredCourses.push(coursesForProfessor[i].course)
            }
        }

        for (let i = props.pageStartIndex; paginatedCourses.length < 10; i++){
                
            if(filteredCourses[i]){
                paginatedCourses.push(filteredCourses[i])
            } else {
                break;
            }
            endingIndex = i + 1;
        }
        return(paginatedCourses);
    }



    let getProfessors = async() => {
        let filteredProfessors = [];
        let paginatedProfessors = [];
        let endingIndex;
     
        //sorting function details found at https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        (professorsForCourse).sort((a, b) => (a.professor.score < b.professor.score) ? 1 : (a.professor.score === b.professor.score) ? ((a.professor.name > b.professor.name) ? 1 : -1) : -1 )
                
        for (let i = 0; i < professorsForCourse.length; i++){
            professorsForCourse[i].professor.ranking = i + 1;
            if(professorsForCourse[i].professor.name.toLowerCase().includes(props.searchFilter.toLowerCase())){
                for(let j = 0; j < props.userRatings.length; j++){
                    if (props.userRatings[j].contentID === professorsForCourse[i].professor.id){
                        professorsForCourse[i].professor.userRating = props.userRatings[j].ratingType;
                    }   
                }
                filteredProfessors.push(professorsForCourse[i].professor)
            }
        }

        for (let i = props.pageStartIndex; paginatedProfessors.length < 10; i++){    
            if(filteredProfessors[i]){
                paginatedProfessors.push(filteredProfessors[i])
            } else {
                break;
            }
            endingIndex = i + 1;
        }
        return(paginatedProfessors);
    }
        
    let getGoat = () => {
        return(
            <img  alt="Goat" style={{height:"20px", width: "25px"}} src="data:image/png;base64,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" />
        )
    }

    let getImg = (professor) => {
        if (professor.imgsrc){
            return(
                <img className="profile" alt={professor.name} style={{height:"200px", width: "180px", marginLeft: "auto", marginRight: "0"}} src={professor.imgsrc} />
            )
        } else {
            return(
                <img className="profile" alt={professor.name} style={{height:"100px", width: "100px"}} src="https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255626-stock-illustration-avatar-male-profile-gray-person.jpg" />
            )
        }
    }

    const addBreadcrumb = (id, name, type) => {
        if(breadcrumbs[id]){
            delete breadcrumbs[id]
        }
        setBreadcrumbs({...breadcrumbs, [id]: [type, name]})
    }
    
    const postComment = async() => {
        try {
            let userName;
            if(isAnonymousComment){
                userName = "VotingBlock User"
            } else {
                userName = `${context.user.attributes.given_name} ${context.user.attributes.family_name}`
            }
            if(match.params.type === "professors"){
                const comment = await API.graphql({ query: createProfessorCommentMutation, variables: { input:{ "user": context.user.username, "userName": userName, "content": commentText, "professorID": match.params.oid }}});
            } else if (match.params.type === "courses"){
                const comment = await API.graphql({ query: createCourseCommentMutation, variables: { input:{ "user": context.user.username, "userName": userName, "content": commentText, "courseID": match.params.oid }}});
            }
            setCommentText('')
            fetchData();

        } catch (e) {
            console.log(e);
        }
    }
   

   let returnProfessors = () => {
       if (isLoadingCourse || isLoadingProfessors){
            return(
                <div style={{height: "200px"}}>
                    <bs.Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </bs.Spinner>
                </div> 
            )
       } else {   
            if(!isLoadingProfessors){
                return(
                    <bs.Container fluid>
                        <Table 
                            professorsDetail={getProfessors()}
                            refreshProfessors={fetchData}
                            getRatings={props.getRatings}
                            courseid={course.id}
                            getImg={getImg}
                            createRating={createRating} 
                            pageNum={props.pageNum}
                            detail={true}
                            addBreadcrumb={addBreadcrumb}
                        />  
                    </bs.Container>
                )
            }
        } 
    }

   let returnCourses = () => {
       if (isLoadingProfessor || isLoadingCourses){
            return(
                <div style={{height: "200px"}}>
                    <bs.Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </bs.Spinner>
                </div>  
            )
       } else {   
            if(!isLoadingCourses){
                return(
                    <bs.Container fluid>
                        <Table 
                            coursesDetail={getCourses()}
                            refreshProfessors={fetchData}
                            getRatings={props.getRatings}
                            professorid={professor.id}
                            getImg={getImg}
                            createRating={createRating} 
                            pageNum={props.pageNum}
                            detail={true}
                            addBreadcrumb={addBreadcrumb}
                        />  
                    </bs.Container>
                )
            }
        } 
    }

    let updateDifficultyRated = () => {
        setIsRatedDifficulty(true)
    }

    const handleClickBack = (id, category) => {
        if(category == "professors"){
            let tempObj = {};
            for (const [key, value] of Object.entries(breadcrumbs)) {
                if(key === id){
                    break;
                } else {
                    tempObj = {...tempObj, [key]: value}
                }
              }
              setBreadcrumbs(tempObj)
            history.push(`/schools/${match.params.sid}/${match.params.did}/professors/${id}`)
            props.getDataProfessors();
        }
        else if (category === "courses"){
            let tempObj = {};
            for (const [key, value] of Object.entries(breadcrumbs)) {
                if(key === id){
                    break;
                } else {
                    tempObj = {...tempObj, [key]: value}
                }
              }
              setBreadcrumbs(tempObj)
            history.push(`/schools/${match.params.sid}/${match.params.did}/courses/${id}`)
            props.getDataCourses();
        }
        else if(match.params.type === "professors"){
            history.push(`/schools/${match.params.sid}/${match.params.did}/courses`)
            props.getDataProfessors();
        }else {
            history.push(`/schools/${match.params.sid}/${match.params.did}/courses`)
            props.getDataCourses();
        }
        
    }

    const handleRatingClick = async(id, increment, mutation, score, item, category) => {
        if (!context.user){
            window.localStorage.setItem("redirectURL", match.url)
            Auth.federatedSignIn()
        }
        else{
            if(!oidRating[1]){
                try {
                    const response = await API.graphql({ query: createRatingMutation, variables: { input: { "contentID": id, "userID": context.user.username, "ratingType": increment, "type": "Rating", "category": category } }});
                    // if (category === 'professors'){
                    //     await API.graphql({ query: updateCategoryMutation, variables: { input: { "id": "byu-professors", "numRatings": profCategory.numRatings + 1 } }});
                    // }
                    // else if (category === 'courses'){
                    //     await API.graphql({ query: updateCategoryMutation, variables: { input: { "id": "byu-courses", "numRatings": courseCategory.numRatings + 1 } }});

                    // }
                    const newRating = response.data.createRating
                    setOidRating([newRating.id, newRating.ratingType])
                    if(category === 'Course' && increment === 'up'){
                        setCourse({...course, 'score': course.score + 1 })
                    }
                    else if(category === 'Course' && increment === 'down'){
                        setCourse({...course, 'score': course.score - 1 })
                    }
                    else if(category === 'Professor' && increment === 'up'){
                        setProfessor({...professor, 'score': professor.score + 1 })
                    }
                    else if(category === 'Professor' && increment === 'down'){
                        setProfessor({...professor, 'score': professor.score - 1 })
                    }
                    
                    props.updateScore(id, score, increment, mutation);
                    //getRatings(userid);
                } catch (e) {
                    console.log(e);
                } finally {
                    //getData();
                }
            } else if (oidRating[1] === increment){
                increment === VOTE_UP ? increment = VOTE_DOWN : increment = VOTE_UP;
                try {
                    await API.graphql({ query: deleteRatingMutation, variables: { input: { "id": oidRating[0] } }});
                    // if (categoryValue === 'Professors'){
                    //     await API.graphql({ query: updateCategoryMutation, variables: { input: { "id": "byu-professors", "numRatings": profCategory.numRatings - 1 } }});
                    // }
                    // else if (categoryValue === 'Courses'){
                    //     await API.graphql({ query: updateCategoryMutation, variables: { input: { "id": "byu-courses", "numRatings": courseCategory.numRatings - 1 } }});

                    // }
                    setOidRating([])
                    if(category === 'Course' && increment === 'up'){
                        setCourse({...course, 'score': course.score + 1 })
                    }
                    else if(category === 'Course' && increment === 'down'){
                        setCourse({...course, 'score': course.score - 1 })
                    }
                    else if(category === 'Professor' && increment === 'up'){
                        setProfessor({...professor, 'score': professor.score + 1 })
                    }
                    else if(category === 'Professor' && increment === 'down'){
                        setProfessor({...professor, 'score': professor.score - 1 })
                    }
                    props.updateScore(id, score, increment, mutation);
                    //getRatings(userid);
                } catch (e) {
                    return e;
                }finally {
                   //getData();
                }
            } else {
                increment === VOTE_UP ? score += 1 : score -= 1;
                try {
                    await API.graphql({ query: updateRatingMutation, variables: { input: { "id": oidRating[0], "ratingType": increment } }});
                    setOidRating([oidRating[0], increment])
                    if(category === 'Course' && increment === 'up'){
                        setCourse({...course, 'score': course.score + 2 })
                    }
                    else if(category === 'Course' && increment === 'down'){
                        setCourse({...course, 'score': course.score - 2 })
                    }
                    else if(category === 'Professor' && increment === 'up'){
                        setProfessor({...professor, 'score': professor.score + 2 })
                    }
                    else if(category === 'Professor' && increment === 'down'){
                        setProfessor({...professor, 'score': professor.score - 2 })
                    }
                    props.updateScore(id, score, increment, mutation);
                    //getRatings(userid);
                } catch (e) {
                    return e;
                }finally {
                    //getData();
                }
            }
            fetchRatings();
        }
    }


   if (course && match.params.type === "courses"){
       return(
           <div>
               <div className={"backButton"}>
                    <bs.Button variant="link" onClick={handleClickBack}>Back to Catalog</bs.Button>
                    {
                        isMobile ?
                        <></>
                        :
                        Object.entries(breadcrumbs).map(([key, value]) => {
                            return(
                                <>
                                &#x3e;
                                <bs.Button variant="link" key={key} onClick={() => handleClickBack(key, value[0])}>{value[1]}</bs.Button>
                                </>
                            )
                        })
                    }
                 
               </div>
               {
                   isMobile ?
                   <div className={"detailContent"}>
                       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div className="scoreInfoDetail">                               
                                <div className={"ratingButtons"}>
                                    <div className={oidRating[1] === VOTE_UP ? CLASS_VOTE_UP : CLASS_NO_VOTE_UP }  onClick={() => handleRatingClick( course.id, VOTE_UP, updateCourseMutation, course.score, course, "Course")}>
                                    {/* <div> */}
                                    <AiIcons.AiFillUpCircle />
                                    </div>
                                </div>
                                <div className="scoreDisplay">
                                    {course.score}
                                </div>
                                <div className={"ratingButtons"}>
                                    <div className={oidRating[1]  === VOTE_DOWN ? CLASS_VOTE_DOWN : CLASS_NO_VOTE_DOWN }  onClick={() => handleRatingClick(course.id, VOTE_DOWN, updateCourseMutation, course.score, course, "Course")}>
                                    {/* <div> */}
                                    <AiIcons.AiFillDownCircle />                                              
                                    </div>
                                </div>
                                
                            </div>
                            <div className={"detailChildTitle"}>
                                <Title>{course.name}</Title> 
                                <Subtitle>{course.code}</Subtitle>
                                <Description>{ course.description }</Description>
                            </div>
                        </div>
                        {
                            props.isSearched || Object.keys(breadcrumbs).length > 1 ?
                            <div className={"detailRankings"}></div>
                            :
                            match.params.sid === "ge" ?
                            <div className={"detailRankings"}>
                                <RankingsTitle>Rankings</RankingsTitle>
                                <h6>{getRanking()[2] === "1st" ? getGoat() : getRanking()[2]} in <Link to={`/schools/ge/all/courses`}>All GE Courses</Link></h6>
                            </div>
                            :
                            match.params.did !== "all" ?
                            <div className={"detailRankings"}>
                                <RankingsTitle>Rankings</RankingsTitle>
                                <h6>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${course.department.school.id}/${course.department.id}/${match.params.type}`}>{ course.department.name}</Link>{"\n"}</h6> 
                            </div>
                            :
                            match.params.sid !== "all" ?
                            <div className={"detailRankings"}>  
                                <RankingsTitle>Rankings</RankingsTitle>
                                <h6>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${course.department.school.id}/${course.department.id}/${match.params.type}`}>{ course.department.name}</Link>{"\n"}</h6> 
                                <h6>{getRanking()[1] === "1st" ? getGoat() : getRanking()[1]} in <Link to={`/schools/${course.department.school.id}/all/${match.params.type}`}>{ course.department.school.name}</Link></h6>
                            </div>
                            :
                            <div className={"detailRankings"}>
                                <RankingsTitle>Rankings</RankingsTitle>
                                <h6>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${course.department.school.id}/${course.department.id}/${match.params.type}`}>{ course.department.name}</Link>{"\n"}</h6> 
                
                                <h6>{getRanking()[1] === "1st" ? getGoat() : getRanking()[1]} in <Link to={`/schools/${course.department.school.id}/all/${match.params.type}`}>{ course.department.school.name}</Link></h6>

                                <h6>{getRanking()[2] === "1st" ? getGoat() : getRanking()[2]} in <Link to={`/schools/all/all/${match.params.type}`}>All {match.params.type}</Link></h6>
                            </div>
                        }
                    </div>
                   :
                    <div className={"detailContent"}>
                        <div className="scoreInfoDetail">                               
                            <div className={"ratingButtons"}>
                                <div className={oidRating[1] === VOTE_UP ? CLASS_VOTE_UP : CLASS_NO_VOTE_UP }  onClick={() => handleRatingClick( course.id, VOTE_UP, updateCourseMutation, course.score, course, "Course")}>
                                {/* <div> */}
                                <AiIcons.AiFillUpCircle />
                                </div>
                            </div>
                            <div className="scoreDisplay">
                                {course.score}
                            </div>
                            <div className={"ratingButtons"}>
                                <div className={oidRating[1]  === VOTE_DOWN ? CLASS_VOTE_DOWN : CLASS_NO_VOTE_DOWN }  onClick={() => handleRatingClick(course.id, VOTE_DOWN, updateCourseMutation, course.score, course, "Course")}>
                                {/* <div> */}
                                <AiIcons.AiFillDownCircle />                                              
                                </div>
                            </div>
                            
                        </div>
                        <div className={"detailChildTitle"}>
                            <Title>{course.name}</Title>
                            <Subtitle>{course.code}</Subtitle>
                            <Description>{ course.description }</Description>
                        </div>
                        {
                            props.isSearched || Object.keys(breadcrumbs).length > 1 ?
                            <div className={"detailRankings"}></div>
                            :
                            match.params.sid === "ge" ?
                            <div className={"detailRankings"}>
                                <RankingsTitle>Rankings</RankingsTitle>
                                <h6>{getRanking()[2] === "1st" ? getGoat() : getRanking()[2]} in <Link to={`/schools/ge/all/courses`}>All GE Courses</Link></h6>
                            </div>
                            :
                            match.params.did !== "all" ?
                            <div className={"detailRankings"}>
                                <RankingsTitle>Rankings</RankingsTitle>
                                <h6>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${course.department.school.id}/${course.department.id}/${match.params.type}`}>{ course.department.name}</Link>{"\n"}</h6> 
                            </div>
                            :
                            match.params.sid !== "all" ?
                            <div className={"detailRankings"}>  
                                <RankingsTitle>Rankings</RankingsTitle>
                                <h6>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${course.department.school.id}/${course.department.id}/${match.params.type}`}>{ course.department.name}</Link>{"\n"}</h6> 
                                <h6>{getRanking()[1] === "1st" ? getGoat() : getRanking()[1]} in <Link to={`/schools/${course.department.school.id}/all/${match.params.type}`}>{ course.department.school.name}</Link></h6>
                            </div>
                            :
                            <div className={"detailRankings"}>
                                <RankingsTitle>Rankings</RankingsTitle>
                                <h6>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${course.department.school.id}/${course.department.id}/${match.params.type}`}>{ course.department.name}</Link>{"\n"}</h6> 
                
                                <h6>{getRanking()[1] === "1st" ? getGoat() : getRanking()[1]} in <Link to={`/schools/${course.department.school.id}/all/${match.params.type}`}>{ course.department.school.name}</Link></h6>

                                <h6>{getRanking()[2] === "1st" ? getGoat() : getRanking()[2]} in <Link to={`/schools/all/all/${match.params.type}`}>All {match.params.type}</Link></h6>
                            </div>
                        }
                    </div>
            }
                {
                    ratings?.length > 0 ?
                    <div className={"chartContent"}>
                        <div className={"detailChild"}>
                            {/* <h6>Score Trend</h6> */}
                            {
                                course.score !== 0 ?
                                <DataPieChart data={initPieData()}/>
                                :
                                <></>
                            }
                        </div>
                        {
                            isMobile ?
                            <></>
                            :
                            <>
                                <div className={"detailChild"}>
                                    <ChartTitle>Score Trend</ChartTitle>
                                    <DataLineChart data={initChartData()}/>
                                </div>
                                <div className={"detailChild"}>
                                <ChartTitle>
                                    Difficulty: {
                                            
                                            !(
                                                course.difficultyOne + 
                                                course.difficultyTwo + 
                                                course.difficultyThree + 
                                                course.difficultyFour + 
                                                course.difficultyFive
                                            ) ? "N/A" :
                                            ((
                                                course.difficultyOne * 1 + 
                                                course.difficultyTwo * 2 + 
                                                course.difficultyThree * 3 + 
                                                course.difficultyFour * 4 + 
                                                course.difficultyFive * 5
                                            ) /
                                            (
                                                course.difficultyOne + 
                                                course.difficultyTwo + 
                                                course.difficultyThree + 
                                                course.difficultyFour + 
                                                course.difficultyFive
                                            )).toFixed(2)
                                            }
                                    </ChartTitle>
                                    <DataBarChart data={initBarData()}/>
                                    {
                                        isRatedDifficulty ?
                                        <p>Rating Submitted ✔</p>
                                        :
                                        isRatingDifficulty ?
                                        <DifficultyRater 
                                            id={course.id} 
                                            updateDifficultyRated={updateDifficultyRated} 
                                            type="course" 
                                            diffOne={course.difficultyOne} 
                                            diffTwo={course.difficultyTwo} 
                                            diffThree={course.difficultyThree} 
                                            diffFour={course.difficultyFour} 
                                            diffFive={course.difficultyFive} 
                                            fetchData={fetchData}
                                        />
                                        :
                                        <bs.Button variant="secondary" onClick={() => setIsRatingDifficulty(true)}>Rate Difficulty</bs.Button>
                                    }
                                </div>
                            </>
                        }
                    </div>
                    :
                    <></>
                }
                

                     <DetailTabs defaultActiveKey="professors" id="controlled-tab-example">
                        <TabItem eventKey="professors" title="Professors"> 
                            <TabTitle>Professors that teach {course.code}</TabTitle>
                             {returnProfessors()}
                             <AddItemText>Do you know a professor who teaches {course.code}?</AddItemText>
                             <CreateModalClass fetchData={fetchData} courseCode={course.code} courseName={course.name}/>  
                         </TabItem>
                         {/* <bs.Tab eventKey="about" title="About">
                             <h3 style={{paddingTop:"2rem"}}>Description</h3>
                             <p>Write an unbiased description of {course.name}. </p>
                             <bs.Button variant="info">Edit Description</bs.Button>
                         </bs.Tab> */}
                         <TabItem eventKey="discussion" title="Discussion">
                            <TabTitle>Comments</TabTitle>
                            <TabItemContainer>
                                {
                                    comments ?
                                   comments.map(comment => {
                                        let dt = new Date(Date.parse(comment.createdAt))
                                        let dateString = `${dt.toLocaleString('default', { month: 'long' })} ${dt.getDate()}, ${dt.getFullYear()}`
                                        return(
                                            context.user.username === comment.user ?
                                            <CommentItemOwner key={comment.id}>
                                                <CommentUser>{comment.userName}</CommentUser>
                                                <CommentDateOwner>{dateString}</CommentDateOwner>
                                                <CommentContent>{comment.content}</CommentContent>
                                                
                                            </CommentItemOwner>
                                            :
                                            <CommentItem key={comment.id}>
                                                <CommentUser>{comment.userName}</CommentUser>
                                                <CommentDate>{dateString}</CommentDate>
                                                <CommentContent>{comment.content}</CommentContent>
                                                
                                            </CommentItem>
                                        )
                                    })
                                    :
                                    <p>No comments yet for {course.code}</p>
                                }
                             </TabItemContainer>
                            <CommentFormContainer>
                                {
                                    context.user ?
                                    <bs.Form style={{paddingLeft: "1rem"}}>
                                        <bs.Form.Group controlId="exampleForm.ControlInput" >
                                            <bs.Form.Control as="textarea" rows={2} value={commentText} placeholder="Share your thoughts..." onChange={(e) => setCommentText(e.target.value)}/>
                                        </bs.Form.Group>
                                        <CommentSubmitContainer>
                                            <Checkbox type="checkbox" value={isAnonymousComment} onChange={() => setIsAnonymousComment(!isAnonymousComment)} label="Post anonymously" />
                                            <bs.Button variant="primary" disabled={commentText.length === 0 ? true : false} onClick={postComment}>Post Comment</bs.Button>
                                        </CommentSubmitContainer>
                                    </bs.Form>
                                    :
                                    <h6>Sign in to post a comment.</h6>

                                }
                            </CommentFormContainer>
                         </TabItem>
                         {/* <bs.Tab eventKey="pictures" title="Pictures" >
                             <h3 style={{paddingTop:"2rem"}}>Pictures</h3>
                             <div className={"imgContent"}>
                                 <img src={img1} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img2} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img3} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img4} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img5} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img6} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img7} height="200em" width="200em" alt="not found" className={"imgChild"}/>

                             </div>
                         </bs.Tab> */}
                     </DetailTabs>
           </div>   
       );
   }
   else if (professor && match.params.type === "professors"){
    return(
        <div>
            <div className={"backButton"}>
                <bs.Button variant="link" onClick={handleClickBack}>Back to Catalog</bs.Button>
                {
                    isMobile ? 
                    <></>
                    :
                    Object.entries(breadcrumbs).map(([key, value]) => {
                        return(
                            <>
                            &#x3e;
                            <bs.Button variant="link" key={key} onClick={() => handleClickBack(key, value[0])}>{value[1]}</bs.Button>
                            </>
                        )
                    })
                    
                }
               </div>
                
                    {
                        isMobile ?
                        <div className={"detailContent"}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 0'}}>
                                <div className="scoreInfoDetail">                               
                                    <div className={"ratingButtons"}>
                                        <div className={oidRating[1] === VOTE_UP ? CLASS_VOTE_UP : CLASS_NO_VOTE_UP }  onClick={() => handleRatingClick( professor.id, VOTE_UP, updateProfessorMutation, professor.score, professor, "Professor")}>
                                        {/* <div> */}
                                        <AiIcons.AiFillUpCircle />
                                        </div>
                                    </div>
                                    <div className="scoreDisplay">
                                        {professor.score}
                                    </div>
                                    <div className={"ratingButtons"}>
                                        <div className={oidRating[1] === VOTE_DOWN ? CLASS_VOTE_DOWN : CLASS_NO_VOTE_DOWN }  onClick={() => handleRatingClick(professor.id, VOTE_DOWN, updateProfessorMutation, professor.score, professor, "Professor")}>
                                        {/* <div> */}
                                        <AiIcons.AiFillDownCircle />                                              
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className={"detailChildTitle"}>
                                    <Title>{professor.name}</Title>
                                    <Subtitle>{professor.title}</Subtitle>
                                    {/* <Description>{ course.description }</Description> */}
                                </div>
                                {/* {
                                    props.isSearched ?
                                    <div className={"detailRankings"}></div>
                                    :
                                    <div className={"detailRankings"}>
                                        
                                        <h6>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${professor.department.school.id}/${professor.department.id}/${match.params.type}`}>{ professor.department.name}</Link>{"\n"}</h6> 
                        
                                        <h6>{getRanking()[1] === "1st" ? getGoat() : getRanking()[1]} in <Link to={`/schools/${professor.department.school.id}/all/${match.params.type}`}>{professor.department.school.name}</Link></h6>

                                        <h6>{getRanking()[2] === "1st" ? getGoat() : getRanking()[2]} in <Link to={`/schools/all/all/${match.params.type}`}>All {match.params.type}</Link></h6>
                                    </div>
                                } */}
                            </div>
                            {
                                props.isSearched || Object.keys(breadcrumbs).length > 1 ?
                                <div className={"detailRankings"}></div>
                                :
                                match.params.did !== "all" ?
                                <div className={"detailRankings"}>
                                    <RankingsTitle>Rankings</RankingsTitle>
                                    <h6>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${professor.department.school.id}/${professor.department.id}/${match.params.type}`}>{ professor.department.name}</Link>{"\n"}</h6> 
                                </div>
                                :
                                match.params.sid !== "all" ?
                                <div className={"detailRankings"}>  
                                    <RankingsTitle>Rankings</RankingsTitle>
                                    <h6>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${professor.department.school.id}/${professor.department.id}/${match.params.type}`}>{ professor.department.name}</Link>{"\n"}</h6> 
                                    <h6>{getRanking()[1] === "1st" ? getGoat() : getRanking()[1]} in <Link to={`/schools/${professor.department.school.id}/all/${match.params.type}`}>{ professor.department.school.name}</Link></h6>
                                </div>
                                :
                                <div className={"detailRankings"}>
                                    <RankingsTitle>Rankings</RankingsTitle>
                                    <h6>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${professor.department.school.id}/${professor.department.id}/${match.params.type}`}>{ professor.department.name}</Link>{"\n"}</h6> 
                    
                                    <h6>{getRanking()[1] === "1st" ? getGoat() : getRanking()[1]} in <Link to={`/schools/${professor.department.school.id}/all/${match.params.type}`}>{ professor.department.school.name}</Link></h6>
    
                                    <h6>{getRanking()[2] === "1st" ? getGoat() : getRanking()[2]} in <Link to={`/schools/all/all/${match.params.type}`}>All {match.params.type}</Link></h6>
                                </div>
                            }
                        </div>
                        :
                        <div className={"detailContent"}>
                            <div className="scoreInfoDetail">                               
                                <div className={"ratingButtons"}>
                                    <div className={oidRating[1] === VOTE_UP ? CLASS_VOTE_UP : CLASS_NO_VOTE_UP }  onClick={() => handleRatingClick( professor.id, VOTE_UP, updateProfessorMutation, professor.score, professor, "Professor")}>
                                    {/* <div> */}
                                    <AiIcons.AiFillUpCircle />
                                    </div>
                                </div>
                                <div className="scoreDisplay">
                                    {professor.score}
                                </div>
                                <div className={"ratingButtons"}>
                                    <div className={oidRating[1] === VOTE_DOWN ? CLASS_VOTE_DOWN : CLASS_NO_VOTE_DOWN }  onClick={() => handleRatingClick(professor.id, VOTE_DOWN, updateProfessorMutation, professor.score, professor, "Professor")}>
                                    {/* <div> */}
                                    <AiIcons.AiFillDownCircle />                                              
                                    </div>
                                </div>
                                
                            </div>
                            <div className={"detailChildTitle"}>
                                <Title>{professor.name}</Title>
                                <Subtitle>{professor.title}</Subtitle>
                                {/* <Description>{ course.description }</Description> */}
                            </div>
                            {
                            props.isSearched || Object.keys(breadcrumbs).length > 1 ?
                            <div className={"detailRankings"}></div>
                            :
                            match.params.did !== "all" ?
                            <div className={"detailRankings"}>
                                <RankingsTitle>Rankings</RankingsTitle>
                                <h6>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${professor.department.school.id}/${professor.department.id}/${match.params.type}`}>{ professor.department.name}</Link>{"\n"}</h6> 
                            </div>
                            :
                            match.params.sid !== "all" ?
                            <div className={"detailRankings"}>  
                                <RankingsTitle>Rankings</RankingsTitle>
                                <h6>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${professor.department.school.id}/${professor.department.id}/${match.params.type}`}>{ professor.department.name}</Link>{"\n"}</h6> 
                                <h6>{getRanking()[1] === "1st" ? getGoat() : getRanking()[1]} in <Link to={`/schools/${professor.department.school.id}/all/${match.params.type}`}>{ professor.department.school.name}</Link></h6>
                            </div>
                            :
                            <div className={"detailRankings"}>
                                <RankingsTitle>Rankings</RankingsTitle>
                                <h6>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${professor.department.school.id}/${professor.department.id}/${match.params.type}`}>{ professor.department.name}</Link>{"\n"}</h6> 
                
                                <h6>{getRanking()[1] === "1st" ? getGoat() : getRanking()[1]} in <Link to={`/schools/${professor.department.school.id}/all/${match.params.type}`}>{ professor.department.school.name}</Link></h6>

                                <h6>{getRanking()[2] === "1st" ? getGoat() : getRanking()[2]} in <Link to={`/schools/all/all/${match.params.type}`}>All {match.params.type}</Link></h6>
                            </div>
                        }
                        </div >
                    }
                
                {
                    ratings?.length > 0 ?
                <div className={"chartContent"}>
                    <div className={"detailChild"}>
                        {/* <h6>Score Trend</h6> */}
                        
                            <DataPieChart data={initPieData()}/>
                            
                        
                    </div>
                    {
                        isMobile ?
                        <></>
                        :
                        <>
                            <div className={"detailChild"}>
                                <ChartTitle>Score Trend</ChartTitle>
                                <DataLineChart data={initChartData()}/>
                            </div>
                            <div className={"detailChild"}>
                                <ChartTitle>
                                Difficulty: {
                                        
                                        !(
                                            professor.difficultyOne + 
                                            professor.difficultyTwo + 
                                            professor.difficultyThree + 
                                            professor.difficultyFour + 
                                            professor.difficultyFive
                                        ) ? "N/A" :
                                        ((
                                            professor.difficultyOne * 1 + 
                                            professor.difficultyTwo * 2 + 
                                            professor.difficultyThree * 3 + 
                                            professor.difficultyFour * 4 + 
                                            professor.difficultyFive * 5
                                        ) /
                                        (
                                            professor.difficultyOne + 
                                            professor.difficultyTwo + 
                                            professor.difficultyThree + 
                                            professor.difficultyFour + 
                                            professor.difficultyFive
                                        )).toFixed(2)
                                        }
                                </ChartTitle>
                                <DataBarChart data={initBarDataProf()}/>
                                {
                                    isRatedDifficulty ?
                                    <p>Rating Submitted ✔</p>
                                    :
                                    isRatingDifficulty ?
                                    <DifficultyRater 
                                        id={professor.id} 
                                        updateDifficultyRated={updateDifficultyRated} 
                                        type="professor" 
                                        diffOne={professor.difficultyOne} 
                                        diffTwo={professor.difficultyTwo} 
                                        diffThree={professor.difficultyThree} 
                                        diffFour={professor.difficultyFour} 
                                        diffFive={professor.difficultyFive} 
                                        fetchData={fetchData}
                                    />
                                    :
                                    <bs.Button variant="secondary" onClick={() => setIsRatingDifficulty(true)}>Rate Difficulty</bs.Button>
                                }
                            </div>
                        </>
                    }
                </div>
                :
                <></>
                }
                <DetailTabs defaultActiveKey="courses" id="controlled-tab-example">
                        <TabItem eventKey="courses" title="Courses"> 
                            <TabTitle>Courses that {professor.name} Teaches</TabTitle>
                             {returnCourses()}
                             <AddItemText>Do you know a course that {professor.name} teaches?</AddItemText>
                             <CreateModalClass fetchData={fetchData} name={professor.name}/>
                         </TabItem>
                         {/* <bs.Tab eventKey="about" title="About">
                             <h3 style={{paddingTop:"2rem"}}>Description</h3>
                             <p>Write an unbiased description of {course.name}. </p>
                             <bs.Button variant="info">Edit Description</bs.Button>
                         </bs.Tab> */}
                         <TabItem eventKey="discussion" title="Discussion">
                                <TabTitle>Comments</TabTitle>
                            <TabItemContainer>
                                {
                                    comments ?
                                   comments.map(comment => {
                                        let dt = new Date(Date.parse(comment.createdAt))
                                        let dateString = `${dt.toLocaleString('default', { month: 'long' })} ${dt.getDate()}, ${dt.getFullYear()}`
                                        console.log(context.user.username, comment.user)
                                        return(
                                            
                                            context.user.username === comment.user ?
                                            <CommentItemOwner key={comment.id}>
                                                <CommentUser>{comment.userName}</CommentUser>
                                                <CommentDateOwner>{dateString}</CommentDateOwner>
                                                <CommentContent>{comment.content}</CommentContent>
                                                
                                            </CommentItemOwner>
                                            :
                                            <CommentItem key={comment.id}>
                                                <CommentUser>{comment.userName}</CommentUser>
                                                <CommentDate>{dateString}</CommentDate>
                                                <CommentContent>{comment.content}</CommentContent>
                                                
                                            </CommentItem>
                                            
                                            
                                        )
                                    })
                                    :
                                    <p>No comments yet for {professor.name}</p>
                                }
                             </TabItemContainer>
                            <CommentFormContainer>
                                {
                                    context.user ?
                                    <bs.Form style={{paddingLeft: "1rem"}}>
                                        <bs.Form.Group controlId="exampleForm.ControlInput" >
                                            <bs.Form.Control as="textarea" rows={2} value={commentText} placeholder="Share your thoughts..." onChange={(e) => setCommentText(e.target.value)}/>
                                        </bs.Form.Group>
                                        <CommentSubmitContainer>
                                            <Checkbox type="checkbox" value={isAnonymousComment} onChange={() => setIsAnonymousComment(!isAnonymousComment)} label="Post anonymously" />
                                            <bs.Button variant="primary" disabled={commentText.length === 0 ? true : false} onClick={postComment}>Post Comment</bs.Button>
                                        </CommentSubmitContainer>
                                    </bs.Form>
                                    :
                                    <h6>Sign in to post a comment.</h6>

                                }
                            </CommentFormContainer>
                         </TabItem>
                         {/* <bs.Tab eventKey="pictures" title="Pictures" >
                             <h3 style={{paddingTop:"2rem"}}>Pictures</h3>
                             <div className={"imgContent"}>
                                 <img src={img1} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img2} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img3} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img4} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img5} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img6} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img7} height="200em" width="200em" alt="not found" className={"imgChild"}/>

                             </div>
                         </bs.Tab> */}
                     </DetailTabs>
        </div>
    )
   } else{
    return(
     <bs.Spinner animation="border" role="status">
         <span className="sr-only">Loading...</span>
     </bs.Spinner>
 )
}
    

}

export default Detail;