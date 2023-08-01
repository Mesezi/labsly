import React, {useEffect, useState} from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeSlash } from 'iconsax-react'
import { useForm } from 'react-hook-form'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from '../authContext'



const Login = ({setShowModal, setModalMessage}) => {
  const navigate = useNavigate()
  let {auth, currentUser} = useAuth()
  let googleProvider = new GoogleAuthProvider()
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [isloading, setIsloading] = useState (false)

  useEffect(()=>{

if(currentUser){
  navigate('/')
  setLoginError('')
  setIsloading(false) 
}

  }, [currentUser])


  const { register, handleSubmit, formState: { errors } } = useForm()
    
  const login = async (data) =>{
    setLoginError('')
    setIsloading(true)

    try {
    await signInWithEmailAndPassword(auth, data.email, data.password)
    }

    catch(err){
      console.log(err.message)
      setLoginError('Email and password do not match')
      setIsloading(false)  
    }
}

const loginGuest = async (data) =>{
  setLoginError('')
  setIsloading(true)

  try {
  await signInWithEmailAndPassword(auth, 'guest@gmail.com', 'guestmode1')
  }

  catch(err){
    console.log(err.message)
    setLoginError('Email and password do not match')
    setIsloading(false)  
  }
}


const googleSignIn = () =>{
  signInWithPopup(auth, googleProvider).then(res=>console.log(res.user))
  .catch(err=>alert(err.message))
}


const signOutUser = ()=>{
  signOut(auth).then((res) => {
    
  }).catch((error) => {
    // An error happened.
    console.log('could not sign out user')
  });
}

const forgotPassword = () => {

  function reset(e){
    e.preventDefault()
console.log(forgotEmail)
    // setModalMessage(<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>)

sendPasswordResetEmail(auth, forgotEmail).then(() => {
    // 
    // ..
    setModalMessage(
    <> 
    <p className='text-center'>Password reset email sent!<br />(check spam)</p>
    <p className=' text-sm text-center block text-gray-300 mt-10 cursor-pointer' onClick={()=>setShowModal(false)}>Close</p>
    </>
   )
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage)
    alert('No user found with this email, try again')
    

    // ..
  });

   
    }


  setShowModal(true)
  setModalMessage(
  
  <>
  <form onSubmit={(e)=>reset(e)} className='flex flex-col gap-2 w-[80vw] max-w-[400px] mx-auto'>
    <label className='text-md'>Enter email</label>
    <input type="email" onChange={(e)=>setForgotEmail(e.target.value)} name="" id="" className='border-0 px-2 py-1 outline-none text-black'/>
    <button className='text-sm p-2 bg-zinc-800 ease-in duration-200'>Reset</button>
  </form>

  <p className=' text-sm text-center block text-gray-300 mt-10 cursor-pointer' onClick={()=>setShowModal(false)}>Close</p>

  </>)



}

  return (
    <main className='h-screen w-full flex justify-center items-center login text-black'>
        <article className='flex flex-col md:flex-row shadow-xl md:rounded-2xl overflow-hidden h-full md:h-[90%] container mx-auto'>
        <div className='h-36 w-full md:h-full md:w-1/2'>
            <img className='object-cover h-full w-full brightness-75'
            src="https://images.unsplash.com/photo-1551225183-94acb7d595b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" alt="" />
        </div>

        <div className='flex justify-center grow md:grow-0 items-center w-full md:w-1/2 bg-white p-5'>

            <form onSubmit={handleSubmit(login)} className='flex gap-4 flex-col w-full max-w-[20rem] justify-center text-center'>
          <h1 className='text-3xl font-bold mb-3'>Login to Labsly</h1>

          <article className='flex flex-col text-sm text-start'>
            <label>Email</label>
            <input type="mail" placeholder='Email address' name='email' {...register("email", { required: true,  pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })}/>
            {errors.email && <span className='text-red-600 text-xs'>Please enter a valid email</span>}
          </article>

          <article className='flex flex-col text-sm text-start'>
            <label>Password</label>
            <div className='flex items-center'><input type= {showPassword ? 'text' :'password'} placeholder='Password' className='grow' {...register("password", { required: true})}/>
          <div className='p-3 cursor-pointer' onClick={()=>setShowPassword(!showPassword)}>{showPassword ?  <Eye size="16" variant='Outline'/> : <EyeSlash size="16" variant='Outline'/> }</div>  
            </div>
          </article>
          <div>
          <p className='text-end text-sm cursor-pointer' onClick={forgotPassword}>Forgot password?</p>
          <p className='text-red-600 text-sm mt-2'>{loginError}</p>
          </div>
          

         

          <div className=' mt-5'>
         {isloading ? <button disabled={isloading} className='py-2 w-[8rem] bg-black/90 text-white rounded-full'>Loading...</button> 
         :<button className='py-2 w-[8rem] bg-black/90 text-white rounded-full'>Sign in</button>}
            </div>

           <div className='flex justify-center'>
         <p onClick={loginGuest} disabled={isloading} className='py-2 cursor-pointer w-[8rem] underline 
         text-black text-xl font-bold disabled:opacity-30'>
        Guest
          </p>
            </div>

          {/* <article className='flex justify-center mt-4 items-center gap-2'><hr /><span>or</span> <hr /></article>

          <p className='flex items-center justify-center gap-2' onClick={googleSignIn}>
             <img src="https://cdn.freebiesupply.com/logos/large/2x/google-g-2015-logo-png-transparent.png" className='h-4' alt="" /> Sign in with Google</p> */}

          <p className='text-sm'>New to Labsly? <Link to="/register" className='underline decoration-solid'>Create Account</Link></p>
          </form>

        </div>
    </article>
    </main>
    
  )
}

export default Login