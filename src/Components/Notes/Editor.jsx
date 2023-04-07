import React, {useEffect, useState} from 'react'
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom'
import { useAuth } from '../authContext'
import { database } from '../../fireBaseConfig'
import { updateDoc, doc } from 'firebase/firestore'
import { Trash } from 'iconsax-react'
import uuid from 'react-uuid'



const Editor = () => {

    const location = useLocation()
const {userData, auth} =  useAuth();
const [notePad, setNotePad] = useState({
    title:'',
    text:''
})
const navigate = useNavigate()
const [deleteNote] = useOutletContext()

  



    useEffect(()=>{
        if(location.state){
            const getSelectedNote =  userData.notes.filter(note=>note.id === location.state.noteId)
            setNotePad(...getSelectedNote) 
        } 
    }, [location])

    // useEffect(()=>{
    //     console.log(notePad)
    // },[notePad])

    
    function inputHandler(e) {
        const {name, value} = e.target
        setNotePad(prev=>{
          return {...prev, [name]:value}
        })
      }
    
    
      async function newNote(e) {
        e.preventDefault()
        let timestamp = Date.now(); // This would be the timestamp you want to format
    
        timestamp = new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit',
         minute: '2-digit', second: '2-digit'}).format(timestamp);

         let dbNotes = userData.notes
         let userRef = doc(database, "users", userData.uid);

         let newNoteData
    
         if(notePad.id){
            dbNotes.forEach((note, index)=>{
            if(note.id === notePad.id){
                dbNotes.splice(index,1)
            } 
            })
            
            newNoteData = {...notePad, modifiedAt: timestamp}
            delete newNoteData.createdAt
         }

         else{
             newNoteData = {...notePad, id:uuid(), createdAt: timestamp}
         }
           
        dbNotes.unshift(newNoteData)
    
        try{
          await updateDoc(userRef, {notes: dbNotes});  
          setNotePad({
            title:'',
            text:''
          })
          navigate('/notes')
       }
    
       catch(err){ console.log(err) }
    
      }

    


  return (
    <>
    {notePad ?
         <div className='flex flex-col-reverse md:flex-row'>

<div className={'hidden md:block w-full md:w-[26rem] preview-box text-white'} >

<article> 
  <h2 className='text-2xl font-bold'>{notePad.title}</h2>
  <p className='mt-3'>{notePad.text}</p></article>
    
  </div>
<div className='w-full md:w-auto md:grow'>
{notePad.id && <div className='flex justify-end px-5 pt-2'><button><Trash type='Bold' onClick={()=>deleteNote(notePad.id)} className='h-5 w-5'/></button></div>} 

<form onSubmit={(e)=>newNote(e)} className=' flex flex-col gap-5'>
  <article className='flex flex-col gap-2 '>
    {/* <p>Title :</p> */}
    <input type="text" value={notePad.title} placeholder='Title' name='title' onChange={(e)=>inputHandler(e)} maxLength={20}/>
  </article>

<article className='flex flex-col gap-2'>
    {/* <p className='self-start'>Note :</p> */}
    <textarea type="text" value={notePad.text} name='text' placeholder='Note'  rows={7} maxLength={200} onChange={(e)=>inputHandler(e)} required/>
  </article>

 <div className='flex'><button className='add-btn ml-auto'>{notePad.id ?"Save +" : 'Add +'}</button></div> 
  
  </form>
</div>
  


 


  </div> : <p>loading..</p> }
  </>
  )
}

export default Editor