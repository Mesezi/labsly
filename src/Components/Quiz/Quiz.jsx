import React, {useEffect, useState, useRef, useMemo} from 'react'
import quizImg from '../../assets/lady.png'
import './Quiz.css'
import wordsData from '../../assets/index.json'
import { Timer1, Heart } from 'iconsax-react'
import { updateDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { database } from '../../fireBaseConfig'
import { useAuth } from '../authContext'
import { useOutletContext } from 'react-router-dom'


const Quiz = ({setShowModal, setModalMessage}) => {
  const [question, setQuestion] = useState()
  const [options, setOptions] = useState()
  const [loading, setLoading] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [currentScore, setCurrentScore]= useState(0)
  const [health, setHealth]= useState(3)
  const [timer, setTimer] = useState(10)
  const answer = useRef()
  const dbUserHighScore = useRef()
  const {userData, auth} =  useAuth();
  const [quizPage, setQuizPage] = useState('home')
  const [rankData] = useOutletContext()
  const [leaderboard, setLeaderboard] = useState(null)
  const [intervalId, setIntervalId] = useState(0)

  let timerId  // store id to be cleared here

  useMemo(() => {

    if(health === 0){
     clearInterval(intervalId)
    }
    
    if(timer < 1 && health > 0){
      checkAnswer()
    }
     
  }, [timer])

  async function setDbScore(){
        clearInterval(intervalId)
        setTimer(10)

        let userRef = doc(database, "users", userData.uid);

        if(currentScore > userData.highscore){
          try{
            await updateDoc(userRef, {highscores: currentScore});  
         }
 
         catch(err){ console.log(err) }
        }

        
      }


  async function generateQuestion(){
    let found = false
    while(!found){
setLoading(true)
      // generate random words 
      let randomArr = []
      for(let i = 0; i < 4; i++){
       let randomWord = wordsData[Math.floor(Math.random() * wordsData.length)]
       if(randomArr.includes(randomWord)) return
       randomArr.push(randomWord)
      }

      let num = 0
      while(num < randomArr.length && !found){
        try{
              
          let data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomArr[num].toLowerCase()}`)
          let res = await data.json()

          if(res.message){num++}

          else{
            setLoading(false)
          setQuestion({meaning:res[0].meanings[0].definitions[0],
          partOfSpeech: res[0].meanings[0].partOfSpeech, word: randomArr[num]})
          answer.current = randomArr[num]
          // randomize options before setting to state
          for(let i = randomArr.length -1; i > 0; i--){
            const j = Math.floor(Math.random()*(i+1));
            [randomArr[i], randomArr[j]] = [randomArr[j], randomArr[i]]
          }

          setOptions(randomArr)
          
          found = true

      
            const id = setInterval(() => {
              setTimer(prev=> prev - 1)
            }, 1000);
  
            setIntervalId(id)
          }
        }
      catch(err){}
      }
    }
    
  
  }

  useEffect(() => { // check back memo or effect
  if(quizPage === 'quiz'){
    setHealth(3)
    setCurrentScore(0)
    generateQuestion()
  } 
  }, [quizPage])



useEffect(() => {
  if(rankData){
    let arr = []
    let userRank = rankData.filter(el=>el.username === userData.username)[0]

   if(userRank.num < 16){
    rankData.forEach((el, index)=>{
      if(index < 16) arr.push(el)
    })
   }

   else{
rankData.forEach((el, index)=>{
  if(index < 15){
    arr.push(el)
  }
})
arr.push(userRank)
   }

 setLeaderboard(arr)
  }
  
}, [rankData])





  function checkAnswer(option, e){
    clearInterval(intervalId)
    setTimer(10)
    const optionBtn = document.querySelectorAll('.option')

    optionBtn.forEach(el=>{
      if(el.getAttribute('option') === answer.current){
        el.style.backgroundColor = 'var(--theme)'
      }
    else{
      el.style.opacity = '.3'
    }
    })

if(option === answer.current){setCurrentScore(score=>score + 1)}

else{setHealth(score=>score - 1)}

setShowAnswer(true)


setTimeout(() => {
  optionBtn.forEach(el=>{
      el.style.backgroundColor = ''
      el.style.opacity = ''
  })
  setShowAnswer(false)
  generateQuestion()
}, 1500);
  }




  useEffect(()=>{
if(health < 1){
  clearInterval(intervalId)
  setTimeout(() => {
  setQuizPage('game over')
  setDbScore()
  }, 500);
  
}
  },[health])

  let healthBar = []
  for(let i=0; i<health; i++){
    healthBar.push(<Heart variant="Bold"/>)
  }




  
  return (
    <section className=' quiz rounded-xl'>
     {quizPage === 'home' && <article className='flex gap-2 flex-col md:flex-row justify-center items-center h-[70vh]'>

<div className='w-full md:w-1/2 blob'>
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path className='blob-color' d="M71.3,-21.5C79.7,2.5,64.8,35.6,43.9,47.8C23.1,59.9,-3.8,51.1,-22.7,36.3C-41.5,21.4,-52.2,0.5,-47.1,-19.1C-42,-38.7,-21,-56.9,5.3,-58.6C31.5,-60.3,63,-45.5,71.3,-21.5Z" transform="translate(100 100)" />
</svg>
<img src={quizImg} alt="" className=''/>
</div>
     
    

    <div className='flex flex-col gap-3 items-center justify-center md:w-1/2'>
    <h3>WORD QUIZ</h3>
    <button className='start-quiz w-fit mx-auto px-12 py-2 rounded-xl text-white' onClick={()=>{setQuizPage('quiz')}}>Start</button>
    <button onClick={()=>{setQuizPage('rank')}}>Rank</button>
    </div>
   
    </article>}

    
    {quizPage === 'quiz' && <>
    <div className='mb-5 flex items-center'>
      <div className='w-[30%]'><p className='current-score'><span>{currentScore}</span></p></div>
        
        <div className='flex flex-col items-center timer grow'>
        <Timer1 />
          <p>{timer}</p>
          </div>
        <p className="health justify-end w-[30%]">
          {healthBar}
        </p>
        </div>
     { loading ?  <div className='flex h-[50vh] justify-center items-center'>
      
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  
        </div> : question && <article className=''>
        
        <div>
          <h4 className='text-2xl'>{question.meaning.definition} <span className='text-sm'>({question.partOfSpeech})</span></h4>
          <p>{question.meaning.definition.example}</p>
          </div>


<div className='grid grid-cols-1 md:grid-cols-2 max-w-[50rem]  options mt-5'>
  {options.map((option, index)=>(
  <div key={index}><button disabled={showAnswer} className='option flex justify-between' option={option} onClick={(e)=>checkAnswer(option,e)}> 
  
  {option} 
  </button>
  </div>
  ))}
</div>
      </article>}</>}



      {
        quizPage === 'game over' && <div className='game-over text-center flex flex-col items-center gap-8'>
          <h4 className='current-score mx-auto mt-4'><span>{currentScore}</span></h4>


           <div className='w-full blob mx-auto'>
           <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path className='blob-color' d="M71.3,-21.5C79.7,2.5,64.8,35.6,43.9,47.8C23.1,59.9,-3.8,51.1,-22.7,36.3C-41.5,21.4,-52.2,0.5,-47.1,-19.1C-42,-38.7,-21,-56.9,5.3,-58.6C31.5,-60.3,63,-45.5,71.3,-21.5Z" transform="translate(100 100)" />
</svg>
          <img src={quizImg} alt="" className=''/>
            </div>
            

            <div className='flex gap-3 flex-col items-center'>
              <button onClick={()=>setQuizPage('quiz')}>Play again</button>
              <button onClick={()=>{setQuizPage('home')}}>Home</button>
              </div>
        
         </div>
      }

{
        quizPage === 'rank' && <section className='flex flex-col rank-modal w-full max-w-[40rem] mx-auto'>
        <button onClick={()=>setQuizPage('home')} className='self-end mr-2 sticky top-0'>Close</button>

        <h2>Leaderboard</h2>
        <article className='leaderboard'>
       {leaderboard?.map((el, index)=><div key={index} className={`${el.username === userData.username ? 'userScore': ''}`}>
        <p className='rank-position'>{el.num}</p>
        <img src={el.imageUrl} alt="" className='rank-image'/>
        <p className='rank-username'>{el.username}</p>
        <p className='highscore'>{el.highscore}</p>
       </div>)}
        </article>
      </section>
      }
      
      
    </section>
    
  )
}

export default Quiz
