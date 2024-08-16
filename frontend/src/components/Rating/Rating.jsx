import React from 'react'
import { useEffect,useState } from "react"
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Stars from '../Stars/Stars'
import './ratingsView.css'




const Rating=({ratings,averageRatings})=>{

    const [numbers,setNumbers]=useState([0,0,0,0,0])
    const [totalRatings, setTotalRatings]=useState(1)
    const [avg,setAvg]=useState(0);
    const [isInitialRender, setIsInitialRender] = useState(true);
    console.log(ratings)
    console.log("tani"+averageRatings)

    useEffect(()=>{

      console.log(ratings)

        if (isInitialRender) {
         setIsInitialRender(false);

        try{
        setTotalRatings(ratings.length)
        }
        catch(error)
        {
          console.log(error.message)
        }
        
        let tmp=[0,0,0,0,0]
        for(let i=0;i<ratings.length;i++)
            {
                tmp[ratings[i].rating-1]++
            }
        setNumbers(tmp)
        let sum=0;
            for(let i=0;i<tmp.length;i++)
            {
                sum+=tmp[i]*(i+1);
                console.log(sum);
            }
          setAvg(averageRatings)
          console.log("n"+numbers)
    }},[])

    

    return(
      <div className='content'>
      <div className='feedback'>
        <h1 className='head'>Student feedback</h1>
        <div className='ratings'>
          <div className="average">
            <span className='a'>{averageRatings}</span>
            <br/>
            <Stars value={averageRatings}/>
            <span className='b'>Course Rating</span>
          </div>
        <div className="cards">
         <div className='card'>
               <StarIcon  className='icon'/> <StarIcon className='icon' /> <StarIcon className='icon' /> <StarIcon className='icon' /> <StarIcon className='icon' />
               <span >{numbers[4]}</span>
          </div>

          <div className='card'>
               <StarIcon className='icon' /> <StarIcon className='icon' /> <StarIcon className='icon'  /> <StarIcon className='icon' /> <StarBorderIcon className='icon'/>
               <span >{numbers[3]}</span>
          </div>

          <div className='card'>
               <StarIcon className='icon' /> <StarIcon className='icon' /> <StarIcon className='icon' />  <StarBorderIcon className='icon'/> <StarBorderIcon className='icon'/>
               <span>{numbers[2]}</span>
          </div>
           
          <div className='card'>
               <StarIcon className='icon' /> <StarIcon className='icon' /> <StarBorderIcon className='icon'/> <StarBorderIcon className='icon'/> <StarBorderIcon className='icon'/>
                <span >{numbers[1]}</span>
          </div>

          <div className='card'>
               <StarIcon className='icon' /> <StarBorderIcon className='icon'/> <StarBorderIcon className='icon'/> <StarBorderIcon className='icon'/> <StarBorderIcon className='icon'/>
               <span >{numbers[0]}</span>
          </div>

        </div>
        </div>
        </div>
        <div className="reviews">
          <h1>Reviews</h1>
          { ratings.map((item, index) =>
            
              <div className='rater'>
               <span>{item.raterName}</span>
               <Stars value={item.rating}/>
               <p>{item.review}</p>
              </div>
            
          ) }
        </div>
        </div>
    )

}

export default Rating