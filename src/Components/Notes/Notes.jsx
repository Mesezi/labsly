import React, {useState, useEffect} from 'react'
import './Notes.css'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Note, PenAdd } from 'iconsax-react';
import { useAuth } from '../authContext';
import { database } from '../../fireBaseConfig';
import { updateDoc, doc } from 'firebase/firestore'

const Notes = () => {
const navigate = useNavigate()
const location = useLocation()

const{userData} = useAuth()


async function deleteNote(id){
  console.log(id)
  let userRef = doc(database, "users", userData.uid);
  let dbNotes = userData.notes

  dbNotes.forEach((note, index)=>{
    if(note.id === id){
        dbNotes.splice(index,1)
    } 
    })

  try{
    console.log(dbNotes)
    await updateDoc(userRef, {notes: dbNotes});  
    console.log('deleted')
    navigate('/notes')
 }

 catch(err){ console.log(err) }

}

console.log(userData.notes)

  return (
    <div className='notes-page'>
      <div className='flex justify-between header items-center'> <h3>Notes <Note /> </h3>
      {location.pathname === '/notes' && <button className='note-btn' onClick={()=>navigate('/notes/editor')}>
         <span className='hidden md:inline'> New note</span> <PenAdd/> </button>}</div>
      

<section>
 <Outlet  context={[deleteNote]} />
</section>


    </div>
  )
}

export default Notes