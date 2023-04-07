import React, {useEffect} from 'react'
import { useAuth } from '../authContext'
import {  useNavigate, useOutletContext } from 'react-router-dom'
import './Home.css'
import { SearchNormal1, Rank, Note } from 'iconsax-react'
import getOrdinal from '../../ordinal'

const Home = ({greeting}) => {
const {userData, auth} =  useAuth();
const navigate = useNavigate()
const [rankData] = useOutletContext()

function wordHyperLink(arr){
  let searchItems= arr.map((item, index)=> <span key={index} onClick={()=>{navigate('/dictionary', {state:{keyword: item}})}} 
  className='search-items'>{`${item}, `}</span>)
   return searchItems
 }

 console.log(rankData)

 

  return (
    <>
    { userData &&
    <div className='home'>

<section className=''>

  <div className='flex flex-wrap gap-2 items-end text-3xl'> 
  <h2 className='text-2xl'>{greeting},</h2>
   <p className='font-semibold'>{userData.firstName}</p>
   </div>

</section>

<section className='grid grid-cols-1 md:grid-cols-2 gap-7 user-stats py-5'>
  <article>
  <SearchNormal1 variant="Outline"/>
   <div>
    <h3> Number of words searched </h3>
    <h4>{userData.numberOfSearches}</h4>
    <p>Recent searches: {wordHyperLink(userData.recentWordSearches)} </p>
    </div>
  </article>

  <article>
  <Rank variant="Outline"/>
   <div>
   <h3> Quiz Ranking</h3>
   {rankData?.map((data, index)=>(
    data.username === userData.username && <h4 key={index}>{data.num}<sup>{getOrdinal(data.num)}</sup></h4>))}
  
    <p>Highscore: <span>{ userData?.highscore} pts</span> </p>
    </div>
  </article>

  <article>
  <Note variant="Outline"/>
   <div>
   <h3>Notes</h3>
    <h4>{userData.notes.length}</h4>
    <p>Titles: <span>{
      userData.notes.map((note)=>(
        <span key={note.id} className='mr-1 search-items' onClick={()=>{navigate('/notes/editor', {state:{noteId: note.id}})}}>{note.title},</span>
      ))
      }</span> </p>
    </div>
  </article>

  {/* <article>
  <SearchNormal1 variant="Outline"/>
  <div>
    <h3>Notes</h3>
    <h4>4</h4>
    <p>Recent: <span>Lorem ipsum dolor sit amet consectetur
       adipisicing elit. Odio illo quibusdam sed.</span> </p>
    </div>
  </article> */}

</section>
    </div> }
    </>
  
 
   
  )
}

export default Home




// useEffect( ()=>{
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       async function fetchData(){
//         const docRef = doc(database, "users", user.uid);
//         const docSnap = await getDoc(docRef); 
//         docSnap.exists() ? console.log("Document data:", docSnap.data()) : console.log("No such document!");
//           }
//           fetchData();
//     } 
//        else {
//       console.log('no user')
//       navigate('/login')
//     }
//   });
//   }, [])


