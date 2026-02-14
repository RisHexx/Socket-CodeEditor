import React, { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  // const {userName , setUserName} = useUserContext();
  const navigate = useNavigate();
  const createNewRoom = () => {
    const id = uuidV4();
    setRoomId(id);
    toast("Room Created !", {
      icon: "🏠",
    });
  };

  const joinRoom = () => {
    if (!roomId || !userName) {
      toast.error("All fields are required");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        userName, // so we can acess the value on routed page too
      },
    });
  };
  const handelEnterKey = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };
  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-[#0b132b] px-4 py-8">
        <div className="w-full max-w-md bg-[#1c2541] shadow-2xl rounded-2xl p-8 border border-[#3a506b]/30">
          <div className="logo flex gap-3 items-center justify-center mb-2">
            <img src="/code.png" alt="logo" className="w-12 drop-shadow-lg" />
            <h3 className="text-white text-3xl font-bold tracking-tight">
              CodeDrip
            </h3>
          </div>
          <p className="text-center text-gray-400 text-sm mb-6">Real-time collaborative code editor</p>
          <div className="space-y-4">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              onKeyUp={handelEnterKey}
              className="w-full px-4 py-3 bg-[#3a506b] border border-[#3a506b] rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-[#31435a]"
            />
            <input
              type="text"
              placeholder="Your Username"
              value={userName}
              onKeyUp={handelEnterKey}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 bg-[#3a506b] border border-[#3a506b] rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-[#31435a]"
            />
            <button
              className="w-full bg-[#00377e] text-white py-3 rounded-lg font-semibold hover:bg-[#004ba0] active:scale-[0.98] transition-all cursor-pointer shadow-lg hover:shadow-xl"
              onClick={joinRoom}
            >
              Join Room
            </button>
            <p className="text-gray-400 text-sm text-center pt-2">
              Don't have an invite?{" "}
              <span className="text-blue-400 hover:text-blue-300 underline cursor-pointer" onClick={createNewRoom}>
                Create new room
              </span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
