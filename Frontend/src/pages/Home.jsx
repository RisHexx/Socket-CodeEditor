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
      <div className="h-screen flex justify-center items-center bg-[#0b132b]">
        <div className="w-100 bg-[#1c2541] shadow-lg rounded-2xl p-6">
          <div className="logo flex gap-2 items-center p-4">
            <img src="/code.png" alt="logo" className="w-10" />
            <h3 className="text-center text-white text-2xl font-bold">
              CodeDrip
            </h3>
          </div>
          <div className="mt-6 space-y-4">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room Id"
              onKeyUp={handelEnterKey}
              className="w-full px-4 py-2 bg-[#3a506b] border border-[#3a506b] rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-[#31435a] hover:border-[#31435a]"
            />
            <input
              type="text"
              placeholder="UserName"
              value={userName}
              onKeyUp={handelEnterKey}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 bg-[#3a506b] border border-[#3a506b] rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-[#31435a] hover:border-[#31435a]"
            />
            <button
              className="w-full bg-[#00377e] text-white py-2 rounded-lg hover:bg-[#002a61] transition cursor-pointer"
              onClick={joinRoom}
            >
              Join Room
            </button>
            <p className=" text-gray-400 mt-1 mx-auto cursor-pointer">
              don't have an invite, create a &nbsp;
              <span className="text-blue-500 underline" onClick={createNewRoom}>
                new-room
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
