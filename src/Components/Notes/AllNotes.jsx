import React from 'react'
import { useAuth } from '../authContext'
import { Trash, Edit } from 'iconsax-react';
import { useNavigate, useOutletContext } from 'react-router-dom';


const AllNotes = () => {
    const navigate = useNavigate()
    const {userData, auth} =  useAuth();
    const [deleteNote] = useOutletContext()

    function editor(id){
        navigate('/notes/editor', {state:{noteId: id}})
    }


      
  return (
    <div className='w-full'>


{userData && userData.notes.length > 0 ? 

<div className='notes py-5'>
{userData.notes.map(note=> <article key={note.id}className='flex flex-col note-item'>
  <div className='flex justify-between text-sm px-3 pt-3'><p>27th April,2023</p> <button onClick={()=>deleteNote(note.id)}><Trash type='Bold'/></button></div>
  <div onClick={()=>editor(note.id)} className='h-28 p-3'> <h4 className='font-semibold text-xl mt-2'>{note.title} </h4>
  <p className='note-text'>{note.text}</p></div>
  </article>)}
</div>

:
<div className='flex justify-center mt-10'>No notes</div>}

</div>
  )
}

export default AllNotes