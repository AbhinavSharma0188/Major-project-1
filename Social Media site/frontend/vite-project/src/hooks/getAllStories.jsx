import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setStoryList } from '../redux/storySlice'

function useAllStories() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
     const {storyData}=useSelector(state=>state.story)
     
  useEffect(()=>{
const fetchStories=async ()=>{
    try {
        const result=await axios.get(`${serverUrl}/api/story/getAll`,{withCredentials:true})
         dispatch(setStoryList(result.data))
         
    } catch (error) {
        console.log(error)
    }
}
fetchStories()
  },[userData,storyData])
}

export default useAllStories
