import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../authContext'
import { SearchNormal1, PlayCircle, PauseCircle } from 'iconsax-react'
import './Dictionary.css'
import { updateDoc, doc } from 'firebase/firestore'
import { database } from '../../fireBaseConfig'
import { useLocation, useParams } from 'react-router-dom'



const Dictionary = () => {
  const {userData, auth} =  useAuth();
  const [searchData, setSearchData] = useState(null)
  const [wordOfday, setWordOfday] = useState(null)
  const [play, setPlay] = useState(false)
  const searchInput = useRef()
  const [audioSrc, setAudioSrc] = useState('')
  const searchDataAudio = useRef()
  const location = useLocation()

   

useEffect(()=>{
  console.log(location.state)
  location.state && antSynSearch(location.state.keyword)
  }, [location])



  useEffect(()=>{

    if(!location.state){
  async function searchWordofDay(){

    var today = new Date();
var year = today.getFullYear();
var month = today.getMonth()+1;
var day = today.getDate();
var date =year+"-"+month+"-"+day;


  


setSearchData('loading')

   
    try{
      let data = await fetch(`https://api.wordnik.com/v4/words.json/wordOfTheDay?date=${date}&api_key=${import.meta.env.VITE_WORDPIK_API}`)
      let res = await data.json()
      let wordDetails = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${res.word}`)
      let wordDetailsRes = await wordDetails.json()

      if(wordDetailsRes.message){
        let fallBack = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/impact`)
        let fallBackRes = await fallBack.json()
        setSearchData(fallBackRes[0])
        setWordOfday(fallBackRes[0].word)
      }

      else{
        setSearchData(wordDetailsRes[0])
        setWordOfday('impact')
      }
      
    }
    catch(err){console.log(err)}
  }
  searchWordofDay()

}

  }, [])



  async function search (e){
   let userRef = doc(database, "users", userData.uid);

    setSearchData('loading')
    e.preventDefault()
    const keyword = searchInput.current.value

    try{
      let data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${keyword.toLowerCase()}`)
      let res = await data.json()
      if(res.message){
        setSearchData(res)
      }
      else{
        setSearchData(res[0])
        // Set the "capital" field of the city 'DC'
          try{
        let searchArr = userData.recentWordSearches 
        let number = userData.numberOfSearches
        if(searchArr.length < 5){
            if(searchArr.includes(keyword)) return
            searchArr.push(keyword)
            number++
        } 
        else {
          if(searchArr.includes(keyword)) return
          searchArr.pop()
          searchArr.unshift(keyword)
          number++
        }
        
        await updateDoc(userRef, {numberOfSearches: number, recentWordSearches: searchArr});
        
      }
      catch(err){
          console.log(err)
      }
  }
        
}
    catch(err){
      console.log(err)
    }
  }

  async function antSynSearch (antSynKeyword){
    searchInput.current.value = ''
    setSearchData('loading')
   
    try{
      let data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${antSynKeyword.toLowerCase()}`)
      let res = await data.json()
       setSearchData(res[0])
      
    }
    catch(err){
      console.log(err)
    }
  }

  function antSyn(arr){
   let searchItems= arr.map((item, index)=> {

    if(item.includes(' ')){
      return <span key={index} 
      className='text-sm'>{`${item}, `}</span>
    }
    
    else {
      return <span key={index} onClick={()=>{antSynSearch(item)}} 
      className='search-items'>{`${item}, `}</span>
    }
  }

    )
    return searchItems
  }

  useEffect(()=>{
    if(searchDataAudio.current){
      play ? searchDataAudio.current.play() : searchDataAudio.current.pause()
    }
  }, [play, searchData])


  
  useEffect(()=>{
    if(searchData && searchData !== 'loading'){
    
      if (searchData.message) return
    
      else if(searchData.phonetics.length > 0){
          let audio = searchData.phonetics.filter(el=> el.audio !== '')
    
          if(audio[0]){
            searchDataAudio.current.src = audio[0].audio
            searchDataAudio.current.load()
          }
          else{
            const btn = document.querySelector('.audioBtn')
            btn.classList.add('hidden')
          }
    
      }
      else{
        const btn = document.querySelector('.audioBtn')
      }
    
    }
      
}, [searchData])


  return (
   <>
   { userData &&
    <div className='dictionary'>
<section>
  
  <form onSubmit={(e)=>search(e)}>
    <input type="text" placeholder='Enter keyword' name="" ref={searchInput} className='p-1 h-12' id="" required/>
    <button type='submit' className='p-3'><SearchNormal1 variant="Outline"/></button>
  </form>
 
</section>



{/* SEARCH DATA */}
{searchData ? searchData === 'loading' ? <div className='flex h-[80vh] justify-center items-center'>
      
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  
        </div> : searchData.message ?
<div>
  <p className='text-xl text-center mt-10 max-w-2xl mx-auto'>
  {searchData.message } {searchData.resolution}</p>
  <p onClick={()=>antSynSearch(wordOfday)} className='text-center mt-5 cursor-pointer'>Back</p>
  </div> 
   :
   <section>

    
  {/* {dictionarySearch ? <div className='flex justify-end mt-5'>
    <p onClick={()=>antSynSearch(wordOfday)} className='clear-search'>word of the day</p>
  </div> : <h3 className='text-xl font-semibold mt-7'>Word of day</h3> } */}


<div className='word-details flex-wrap'>
  <div>
  <h4>{searchData.word} </h4>
  <p>{searchData?.phonetic}</p>
  </div>

  <div>
    <button className='audioBtn' onClick={()=>setPlay(!play)}>{play ? <PauseCircle variant="Bold"/> : <PlayCircle  variant="Bold"/>}</button>
  <audio className='hidden' src='' controls ref={searchDataAudio} onEnded={()=>setPlay(false)}/>
  </div>
</div> 
{searchData?.meanings.map((el, index)=> <article key={index} className='meanings mt-4'>
  <div className='speech p-2'> <p>{el.partOfSpeech}</p>
    </div>

<section className='flex-col flex desc gap-3'>   {el.definitions.map((def, defIndex)=>(defIndex < 5 && <div key={defIndex} className='p-2'>
  <p className='text-xl'>{defIndex+1}. {def.definition}</p>
  <span className='text-md'>{def.example}</span>
</div>))}</section>
 
<div className='ant-syn p-2 flex flex-col gap-2'>
  <p>antonyms: {antSyn(el.antonyms)}</p>
  <p>synonyms: {antSyn(el.synonyms)}</p>
    </div>


  </article>)}
</section>: ''}

 
    </div>}
    </>
  )
}


export default Dictionary


