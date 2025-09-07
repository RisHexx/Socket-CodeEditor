import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import {v4 as uuidV4} from 'uuid' 
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Footer from '../Components/Footer'
import { useUserContext } from '../context/user'

const Home = () => {
  const [roomId , setRoomId] = useState("");
  const [userName , setUserName] = useState("");
  // const {userName , setUserName} = useUserContext();
  const navigate = useNavigate()
  const createNewRoom = () => {
    const id = uuidV4();
    setRoomId(id)
    toast('Room Created !', {
    icon: '🏠',
    });
  }

  const joinRoom = ()=>{
    if(!roomId || !userName){
      toast.error("All fields are required")
      return;
    }
    navigate(`/editor/${roomId}` , {
      state : {
        userName,  // so we can acess the value on routed page too
      }
    })
    
  }
  const handelEnterKey = (e) => {
    if(e.code === 'Enter'){
      joinRoom();
    }
  }
  return (
    <>
    <div className="h-screen flex justify-center items-center bg-gray-900">
      <div className="w-100 bg-gray-800 shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-white">Welcome To CodeEditor</h1>
        <div className="mt-6 space-y-4">
          <input
            type="text"
            value={roomId}
            onChange={e=>setRoomId(e.target.value)}
            placeholder="Enter Id"
            onKeyUp={handelEnterKey}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          <input
            type="text"
            placeholder="UserName"
            value={userName}
            onKeyUp={handelEnterKey}
            onChange={e=>setUserName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          onClick={joinRoom}>
            Join Room
          </button>
          <p className=" text-gray-400 mt-1 mx-auto cursor-pointer">don't have an invite,create a &nbsp;
          <span 
          className="text-blue-500 underline"
          onClick={createNewRoom}
          >new room</span>
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </>
  )
}

export default Home
