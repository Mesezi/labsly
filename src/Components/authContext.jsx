import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../fireBaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { database } from '../fireBaseConfig'
import { getDoc, doc, onSnapshot } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function useAuth (){
    return useContext(AuthContext)
}

export const AuthProvider = ({children}) => {
  // const navigate = useNavigate()

const [currentUser , setCurrentUser] = useState({})
const [userData, setUserData] = useState(null)

useEffect( ()=>{
  if(currentUser && currentUser.uid){
  async function fetchData(){
  const docRef = doc(database, "users", currentUser.uid);

  // const unsub = onSnapshot(doc(database, 'users', currentUser.uid), doc=>{
  //   console.log('change')
  // })
  try{
    const docSnap = await getDoc(docRef); 
    docSnap.exists() ? setUserData(docSnap.data()) : console.log("No such document!");
  }
  catch(err){
console.log(err)
  }
    }
    fetchData();
  }
    }, [currentUser, auth])


    useEffect(()=>{
      let unsub
     if(currentUser && currentUser.uid){
       unsub = onSnapshot(doc(database, 'users', currentUser.uid), doc=>{
        setUserData(doc.data())
      })
     }
return unsub
    }, [currentUser])


const value = {
    auth,
    currentUser,
    userData,
    setUserData,
}

useEffect(()=>{
 const unsubscribe = auth.onAuthStateChanged(user=>{
    setCurrentUser(user)
    })
    return unsubscribe
}, [])



  return (
    <AuthContext.Provider value={value}>
    {children}
    </AuthContext.Provider>

  )
}
