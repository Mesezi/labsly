import React from 'react'
import { useAuth } from '../authContext'
import './Settings.css'
import { updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { Setting3, Edit } from 'iconsax-react'
import { database } from '../../fireBaseConfig'
import { signOut, updatePassword, deleteUser } from 'firebase/auth'
import { useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

const Settings = ({setShowModal, setModalMessage}) => {

  const navigate = useNavigate()

  const {userData, currentUser, auth} = useAuth()

  const themes = ['#556b2f', "#b22222", '#272AB0', '#e9967a']

  const passwordChangeRef = useRef()

  async function updateTheme(newTheme){
    if(userData.theme !== newTheme){
      let userRef = doc(database, "users", userData.uid);

     try{
       await updateDoc(userRef, {theme: newTheme});  
       console.log('changed')
    }

    catch(err){ console.log(err) }
    }
  }


  function changePassword(){
    setShowModal(true)
    setModalMessage(
    
    <><form onSubmit={(e)=>validatePassword(e)} className='flex flex-col gap-3 text-center password-form'>
      <h3 className='max-w-sm'>You will be required to log back into <span className='font-semibold'>Labsly</span> after changing your password</h3>
      <div className='flex flex-col items-center mt-4 gap-2'><label className=' font-semibold text-lg '>New password:</label> 
      <input type='password' ref={passwordChangeRef} className='text-black password-input' required/></div>
      
      
      <button type='submit' className='password-btn'>Change Password</button>
    </form>
    
    <p className='text-sm text-center mt-8 cursor-pointer underline decoration-solid' onClick={()=>{setShowModal(false)}}>Close</p>

    </>)

    function validatePassword(e){
      e.preventDefault()
setModalMessage(<p>loading</p>)

      updatePassword(currentUser, passwordChangeRef.current.value).then(() => {
        setModalMessage(<p>Password successfully changed</p>)

        setTimeout(() => {
          setShowModal(false)
        }, 500);

        signOut(auth).then(() => {
          console.log('signed out') 
        }).catch((error) => { console.log('could not sign out user')});
  

      }).catch((error) => {
        // An error ocurred
        // ...
      });
    }
  }

  function clearData(){
    setShowModal(true)
    setModalMessage(
    <div className='max-w-sm text-center clear-data mx-auto'>
      <p>This will clear your user data i.e notes, game scores and dictionary searches
        <br />
        <span>Continue?</span>
      </p>
      
      <article className='flex gap-3 justify-center confirm-btn'>
        <button id='yes' onClick={clearUserData}>Yes</button>
        <button id='no' onClick={()=>setShowModal(false)}>No</button>
         </article>

    </div>)

async function clearUserData(){
  let userRef = doc(database, "users", userData.uid);

  try{
     await updateDoc(userRef, {highscores: [0], notes: [], numberOfSearches: 0, recentWordSearches: [], theme: '#556b2f'});  
  }

  catch(err){ console.log(err) }
  setModalMessage(<p className='text-center'>Data Cleared</p>)
  setTimeout(() => {
    setShowModal(false)
    navigate('/')
  }, 1000);
  
}


  }

  function deleteUserDetails(){
    setShowModal(true)
    setModalMessage(
    <div className='max-w-sm text-center clear-data mx-auto'>
      <p>This will delete your profile from Labsly
        <br />
        <span>Continue?</span>
      </p>
      
      <article className='flex gap-3 justify-center confirm-btn'>
        <button id='yes' onClick={deleteUserData}>Yes</button>
        <button id='no' onClick={()=>setShowModal(false)}>No</button>
         </article>

    </div>)

async function deleteUserData(){
  try{

    let res = await deleteUser(userData.uid)

    console.log(res)
    
  //   await deleteDoc(doc(database, "users", userData.uid));

  //   deleteUser(currentUser.uid)
  // .then(() => {
  //   console.log('Successfully deleted user');
  // })
  // .catch((error) => {
  //   console.log('Error deleting user:', error);
  // });

    setShowModal(false)
  }

  catch(err){ console.log(err) }
}
  }

 

  return (

     <section className='settings'>
      <h3>Settings <Setting3 /></h3>

<article className='flex flex-col md:flex-row gap-3 w-full md:w-[90%] justify-between mx-auto mt-5'>
  <div className='w-full md:w-auto flex flex-col gap-16'>
    <article className='flex gap-2 items-end justify-center'>
      <img src={userData.imageUrl} className='h-40 w-40 rounded-full object-cover bg-white' alt="" />
    <p className='text-2xl font-semibold'>{userData.username}</p>
    </article>
    
      
<article className='flex gap-4 flex-col'>    
  <div className='flex gap-2 justify-center'> {themes.map((theme, index)=>{
    if(theme === userData.themme){
     return <p key={index} className='rounded-xl active' onClick={()=>updateTheme(theme)}><span style={{backgroundColor: `${theme}`}} className="h-8 block w-8 rounded-lg"></span></p> 
    }
    else{
      return <p key={index} className='rounded-xl' onClick={()=>updateTheme(theme)}><span style={{backgroundColor: `${theme}`}} className="h-8 block w-8 rounded-lg"></span></p> 
    }
  
  }
  )}
 </div>
{/*    
    <button className='clear self-start md:self-center'>Clear data</button> */}
  </article>

  </div>
      
     <div className='p-5 md:w-[60%]'>
      <div className='flex justify-end mb-3' title='Edit details'><Edit /></div>

      <form>
      <div><label>First Name: </label><input value={userData.firstName} disabled={true} type='text'></input> </div>
      <div><label>Last Name: </label><input value={userData.lastName} disabled={true} type='text'></input> </div>
      <div><label>Username: </label> <input value={userData.username} disabled={true} type='text'></input> </div>
      <div><label>Email: </label> <input value={userData.email} disabled={true} type='text'></input> </div>
      </form>

<article className='flex flex-col gap-5 text-sm mt-8 text-end more'>
      <p onClick={changePassword}>Change Password</p>
      <p onClick={clearData}>Clear User Data</p>
      {/* <p onClick={deleteUserDetails}>Delete Account</p> */}
      </article>
     
      </div> 
      
</article> 
      
    

    </section>
    
  )
}

export default Settings