import { useEffect, useState } from 'react'
import './App.css'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import Home from './Components/Home/Home'
import { Routes, Route, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './Components/authContext'
import Root from './Components/Root/Root'
import Dictionary from './Components/Dictionary/Dictionary'
import Quiz from './Components/Quiz/Quiz'
import Settings from './Components/Settings/Settings'
import Profile from './Components/Profile/Profile'
import Chat from  './Components/Chat/Chat'
import Notes from  './Components/Notes/Notes'
import AllNotes from './Components/Notes/AllNotes'
import Preview from './Components/Notes/Preview'
import Editor from './Components/Notes/Editor'
import { useAuth } from './Components/authContext'
import ModalStyled from './Modal'


function App() {
  const [greeting, setGreeting] = useState('Good day')
  const [word, setWord] = useState(null)
  const date = new Date()
  const [modalMessage, setModalMessage]  = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(()=>{
      const hour = date.getHours()
  const text = hour >= 0 && hour < 11 ? 'Good morning' : hour > 11 && hour < 17 ? 'Good afternoon' : 'Good evening' 
setGreeting(text)
  }, [date])


  const router = createBrowserRouter([
{
  path:'/',
  element: <Root />,
  children:[
    {
      path:'',
      element: <Home greeting={greeting}/>
    },
    {
      path:'/dictionary',
      element: <Dictionary/>
    },
    {
      path:'/notes',
      element: <Notes />,
      children:[
        {
          path:'/notes',
          element: <AllNotes/>
        },
        // {
        //   path:'/notes/preview',
        //   element: <Preview/>
        // },
        {
          path:'/notes/editor',
          element: <Editor setShowModal={setShowModal} setModalMessage={setModalMessage}/>
        },
        
      ]
    },
    {
      path:'/chat',
      element: <Chat setShowModal={setShowModal} setModalMessage={setModalMessage}/>
    },
    {
      path:'/quiz',
      element: <Quiz setShowModal={setShowModal} setModalMessage={setModalMessage}/>
    },
    {
      path:'/settings',
      element: <Settings setShowModal={setShowModal} setModalMessage={setModalMessage}/>
    },
    // {
    //   path:'/profile',
    //   element: <Profile/>
    // },
    
  ]
},
{
  path:'login',
  element: <Login setShowModal={setShowModal} setModalMessage={setModalMessage}/>
},
{
  path:'register',
  element: <Register/>
}
  ])

  return (

    <> 
     <ModalStyled modalMessage={modalMessage} showModal={showModal} setModalMessage={setModalMessage} setShowModal={setShowModal}/>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider></>
   


  )
}

export default App
