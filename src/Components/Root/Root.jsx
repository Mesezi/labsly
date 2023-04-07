import React, {useEffect, useState} from 'react'
import { Outlet,NavLink, useNavigate, useLocation } from 'react-router-dom'
import {Home2, Book, Game, Setting3, Profile, Message,
   Logout, HambergerMenu, CloseCircle, Note} from 'iconsax-react'
import './Root.css'
import { signOut } from 'firebase/auth'
import { useAuth } from '../authContext'
import labslyLogo from '../../assets/default-monochrome-white.svg'
import { database } from '../../fireBaseConfig'
import { collection, getDocs, where, query, onSnapshot } from 'firebase/firestore'


const Root = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {currentUser, auth, userData} =  useAuth();
  const [rankData, setRankData] = useState(null)


  useEffect(()=>{
    !currentUser && navigate('/login')
  }, [currentUser])


  useEffect(() => {
 

    const q = query(collection(database, 'users'), where('highscore', '>=', 0))

    const unsub = onSnapshot(q, (querySnapshot) => {
      let rank = []
      querySnapshot.forEach((doc) => {
        rank.push(doc.data())
      });

       rank.sort(function(a, b){return b.highscore-a.highscore});

       rank = rank.map(doc=> ({username:doc.username, imageUrl:doc.imageUrl, highscore:doc.highscore}))

      

    let num = 1

  rank =  rank.map((el, index)=>{
      if(index === 0){
        return {...el, num}
      }

      if(rank[index].highscore === rank[index - 1].highscore){
        return {...el, num}
      }

      else{
        num++
        return {...el, num}
      }

    })

    setRankData(rank)
    })

    
  
    

  }, []);



  useEffect(()=>{
    menuToggle()
  },[location])

//   const [mode, setMode] = useState(JSON.parse(sessionStorage.getItem('mode')))


//   function toggleMode(){
//    setMode(!mode)
//   }

  useEffect(()=>{
    if(userData){
document.documentElement.style.setProperty('--theme', userData.theme)
    }
    // userData && document.documentElement.style.setProperty('--theme', userData.theme)
  }, [userData])



  const signOutUser = ()=>{
    signOut(auth).then(() => {
      console.log('signed out')
    }).catch((error) => {
      // An error happened.
      console.log('could not sign out user')
    });
  }

  const menuToggle = (arg)=>{
   const aside = document.querySelector('aside')
   arg === 'toggle' ? aside.classList.toggle('active') :  aside.classList.remove('active')
  }



  return (
    <div className='flex'>
      <aside className='h-screen block fixed lg:w-[16%] max-w-[16rem] w-full'>
        <div className='flex p-3 flex-col lg:flex-row gap-2 min-h-20 md:py-6'>
           <img src={labslyLogo} alt="labsly logo" className='hidden lg:block object-contain h-12'/>
          {userData && <img src={userData.imageUrl} alt="avatar" className='lg:hidden object-contain h-10 w-10 rounded-full bg-white'/>}
          <h2 className='lg:hidden text-xl font-bold'>{userData && userData.username}</h2>
           {/* <CloseCircle variant="Broken" onClick={()=>menuToggle()} className='lg:hidden'/> */}
           </div>
        <nav className='mt-3'>
          <ul className='flex flex-col gap-5'>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active ' : '')}><Home2 variant="TwoTone"/> Home</NavLink>
          <NavLink to="/dictionary" className={({ isActive }) => (isActive ? 'active ' : '')}><Book variant="TwoTone"/> Dictionary</NavLink>
          <NavLink to='/notes' className={({ isActive }) => (isActive ? 'active ' : '')}>  <Note variant="TwoTone"/>Notes</NavLink>
          <NavLink to='/quiz' className={({ isActive }) => (isActive ? 'active ' : '')}><Game variant="TwoTone"/>Word Quiz</NavLink>
          <NavLink to='/chat' className={({ isActive }) => (isActive ? 'active ' : '')}>  <Message variant="TwoTone"/>Chat</NavLink>
          <NavLink to='/settings' className={({ isActive }) => (isActive ? 'active ' : '')}><Setting3 variant="TwoTone"/>Settings</NavLink>
          <a onClick={signOutUser} className= ' cursor-pointer' ><Logout variant="TwoTone"/>Log out</a>
          </ul>
        </nav>
        </aside>
      <section className="w-full lg:ml-[16%] px-4 md:px-10">
        <header className='flex h-20 justify-between lg:justify-end gap-8 items-center mb-5 lg:mb-2'>
        <img src={labslyLogo} alt="labsly logo" className='lg:hidden object-contain h-10'/>
        <HambergerMenu className='menu-btn lg:hidden' onClick={()=>menuToggle('toggle')} variant="Broken"/>

        <h2 className='hidden lg:block text-2xl font-semibold'>{userData && userData.username}</h2>
           {userData && <img src={ userData.imageUrl} alt="avatar" className='hidden lg:block object-contain h-12 w-12 rounded-full bg-white'/>}

          {/* <input type="checkbox" name="" id="" onChange={()=>{toggleMode()}}/> */}
        </header>
        
        { userData ? <Outlet context={[rankData]} /> : <div className='flex h-[80vh] justify-center items-center'>
      
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  
        </div>
          
          }</section>
    </div>
  )
}

export default Root