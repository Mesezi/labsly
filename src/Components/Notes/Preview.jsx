import React, {useEffect} from 'react'

const Preview = () => {

const location = useLocation()
const {userData, auth} =  useAuth();

let userRef 
  if(userData){
     userRef = doc(database, "users", userData.uid);
  }

    useEffect(()=>{
        location.state && console.log(location.state.noteId)
    }, [location])



  return (
    <div>Preview</div>
  )
}

export default Preview