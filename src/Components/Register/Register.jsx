import React, {useEffect, useState} from 'react'
import './Register.css'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeSlash } from 'iconsax-react'
import { app, database } from '../../fireBaseConfig'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {collection, setDoc, doc} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../authContext'




const Register = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    let {auth, currentUser} = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)

    const avatars = ['https://firebasestorage.googleapis.com/v0/b/labsly-d107c.appspot.com/o/afro%20lady.png?alt=media&token=63832d10-647b-4695-b801-d917421e0463',
  'https://firebasestorage.googleapis.com/v0/b/labsly-d107c.appspot.com/o/black%20man.png?alt=media&token=d1edf68b-c713-4f65-914d-5991a14d4e55',
  'https://firebasestorage.googleapis.com/v0/b/labsly-d107c.appspot.com/o/boss.png?alt=media&token=87f38cfc-58be-4f89-8fd3-42b5fcf9264f',
  'https://firebasestorage.googleapis.com/v0/b/labsly-d107c.appspot.com/o/hacker.png?alt=media&token=77c030d9-1cb4-4685-abfc-f7d6a839ba89',
  'https://firebasestorage.googleapis.com/v0/b/labsly-d107c.appspot.com/o/shredder.png?alt=media&token=d966e4f9-0db7-45d0-acf9-aeee8c957708',
  'https://firebasestorage.googleapis.com/v0/b/labsly-d107c.appspot.com/o/woman.png?alt=media&token=1f9f6ba8-bab5-4d8d-8896-f735739679d0'
  ]


  useEffect(()=>{

    if(currentUser && currentUser.uid){
      navigate('/')
      setLoading(false) 
    }
    
      }, [currentUser])


    const addUser = async (data) =>{
        try{
           await setDoc(doc(database, "users", data.uid), data);
           alert('data added')    
    //     setTimeout(() => {
    //     navigate('/')
    //  }, 2000);
        }
        
    catch(err){
        alert(err.message)
    }
    finally{
        
    }
}

      const submitRegistration = async (data) =>{
        setLoading(true)
        try{
            const user =  await createUserWithEmailAndPassword(auth, data.email, data.password)
            addUser({...data,
                highscore: 0,
                recentWordSearches: [], 
                theme:'#556b2f',
                notes: [],
                numberOfSearches: 0,
                uid:user.user.uid,
                password: null})
        }
        catch(err){
            alert(err.message)
        }
        finally{
            setLoading(false)
        }
     
    }


    

  return (
    <main className='min-h-screen md:h-screen w-full flex justify-center items-center register text-black'>
        <article className='flex flex-col md:flex-row shadow-xl rounded-2xl overflow-hidden h-full md:h-[90%] container mx-auto'>
        <div className='h-40 w-full md:h-full md:w-1/2'>
            <img className='object-cover h-full w-full brightness-75'
            src="https://images.unsplash.com/photo-1551225183-94acb7d595b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" alt="" />
        </div>

        <div className='flex justify-center grow md:grow-0 items-center h-full w-full md:w-1/2 bg-white p-5'>

            <form onSubmit={handleSubmit(submitRegistration)} className='flex justify-between gap-4 md:gap-5 flex-col w-full md:h-[30rem] 
            md:overflow-y-scroll max-w-[23rem] text-center'>
          <h1 className='text-3xl font-bold mb-3'>Registration</h1>


 <div className='flex flex-col gap-3 grow'>
     <article className='flex text-sm text-start flex-col font-semibold '>
            <label>First name</label>
            <input type="text" placeholder='First name' name='First name' {...register("firstName", { required: true, maxLength: 10 })} />
            {errors.firstName && <p className='text-red-600 text-xs'>Please check First Name</p>}
          </article>

          <article className='flex text-sm text-start flex-col font-semibold'>
            <label>Last Name</label>
            <input type="text" placeholder='Last name' name='Last name' {...register("lastName", { required: true })}/>
            {errors.firstName && <p className='text-red-600 text-xs'>Please check Last Name</p>}
          </article>

          <article className='flex text-sm text-start flex-col font-semibold'>
            <label>Email</label>
            <input type="mail" placeholder='Email address' name='email' {...register("email", { required: true,  pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })}/>
            {errors.email && <span className='text-red-600 text-xs'>Please enter a valid email</span>}
          </article>

          <article className='flex text-sm text-start flex-col font-semibold'>
            <label>Username</label>
            <input type="text" placeholder='Username' name='username' {...register("username", { required: true })}/>
            {errors.username && <span className='text-red-600 text-xs'>Please enter a username</span>}
          </article>

          <article className='flex text-sm text-start gap-5'>
            <span className='font-semibold'>Gender</span>

            <div className='flex gap-5'> 
          <label className='flex gap-1 items-center'><input type='radio' name="gender" value='male' {...register("gender", { required: true })}/><span>Male</span></label>
          <label  className='flex gap-1 items-center'><input type='radio' name="gender" value='female' {...register("gender", { required: true })}/> <span>Female</span></label>
          {errors.gender && <p className='text-red-600 text-xs'>Please select gender</p>}
          </div>
           
          </article>

          <article className='flex text-sm text-start gap-5'>
            <span className='font-semibold'>Avatar</span>

            <div className='flex gap-5 flex-wrap'> {
              avatars.map(avatar=> <label className='flex items-center'>
                <input type='radio' name="imageUrl" value={avatar} {...register("imageUrl", { required: true })}/><img className='h-10 w-10 rounded-full bg-white' src={avatar} alt='avatar icon' />
                </label>)
            }
          {errors.imageUrl && <p className='text-red-600 text-xs'>Please select an avatar</p>}
          </div>
           
          </article>

    <article className='flex text-sm text-start flex-col font-semibold'>
            <label>Password</label>
            <div className='flex items-center'><input type= {showPassword ? 'text' :'password'} placeholder='Password' className='grow' required 
            {...register("password", { required: true,  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/ })}/>
          <div className='p-3 cursor-pointer' onClick={()=>setShowPassword(!showPassword)}>{showPassword ?  <Eye size="16" variant='Outline'/> : <EyeSlash size="16" variant='Outline'/> }</div>  
            </div>
            
            {errors.password && <p className='text-red-600 text-xs'>Password should be a minimum of 7 characters and contain one letter and one number.</p>}
          </article>

</div>
    
{loading ? <button disabled={loading} className='py-2 w-[8rem] bg-black/90 text-white rounded-full inline-block ml-auto'>Loading...</button>
         :<button className='py-2 w-[8rem] bg-black/90 text-white rounded-full inline-block ml-auto'>Sign up</button>}
    


<p className='text-sm mt-4'>Already have an account? <Link to="/login" className='underline decoration-solid'>Sign in</Link></p>
          
          </form>

          
        
        </div>
    </article>
    </main>
    
  )
}

export default Register




