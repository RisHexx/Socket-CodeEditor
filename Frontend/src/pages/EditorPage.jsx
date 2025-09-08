import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import Client from "../Components/Client";
import CodeEditor from "../Components/CodeEditor";
// import { useUserContext } from "../context/user";
import toast from "react-hot-toast";
import { initSocket } from "../socket";
import Actions from "../Actions";

const EditorPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const navigate = useNavigate();
  // const { userName } = useUserContext();
  if (!location.state) {
    return navigate("/");
  }
  const [clients, setClients] = useState([]);

  const handleErr = (err) => {
    console.log("Socket Error : ", err), toast.error("Error While Connecting");
    navigate("/");
  };
  useEffect(() => {
    async function init() {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErr(err));
      socketRef.current.on("connect_failed", (err) => handleErr(err));
      socketRef.current.emit(Actions.JOIN, {
        roomId: id,
        username: location.state?.userName,
      });

      //Joined

      socketRef.current.on(
        Actions.JOINED,
        ({ clients: newClients, username, socketId }) => {
          // console.log(`${username} ${socketId}`);
          if (username !== location.state?.userName) {
            toast.success(`${username} joined the room`);
          }
          setClients(newClients);
          if (codeRef.current) {
            socketRef.current.emit(Actions.SYNC_CODE, {
              code: codeRef.current,
              socketId,
            });
          }
        }
      );

      socketRef.current.on(Actions.DISCONNECTED, ({ username, socketId }) => {
        toast.success(`${username} left the room`);
        setClients((prevClients) =>
          prevClients.filter((client) => client.socketId !== socketId)
        );
      });
    }
    init();
    // whaterver we return in useEffect is called when component unmounts or cleanup function
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(Actions.JOINED);
      socketRef.current.off(Actions.DISCONNECTED);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("Copied");
    } catch {
      toast.error("Error While Copy");
    }
  };

  const handleLeave = () => {
    navigate("/");
  };
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="aside w-[15%]  text-white bg-[#0b132b] h-screen  flex flex-col justify-between">
        <div className="asideInner">
          <Link to="/">
            <div className="logo flex gap-2 items-center p-4">
              <img src="/code.png" alt="logo" className="w-10" />
              <h3 className="text-center text-2xl font-bold">CodeDrip</h3>
            </div>
          </Link>
          <p className="px-4 text-md text-gray-100 mt-2">Connected Clients</p>

          <div className="clients-list mt-4 flex flex-wrap gap-2 max-h-120 overflow-y-auto pr-2 scrollbar-thin">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col gap-3 p-4">
          <button
            className="px-6 py-2 bg-gray-100 text-black rounded-md font-semibold hover:bg-gray-200 transition cursor-pointer"
            onClick={handleCopy}
          >
            Copy room ID
          </button>
          <button
            className="px-6 py-2 bg-[#00377e] text-white rounded-md font-semibold hover:bg-[#002a61] transition cursor-pointer"
            onClick={handleLeave}
          >
            Leave
          </button>
        </div>
      </div>

      <div className="Editor flex-1 h-screen text-gray-200 max-h-screen overflow-y-auto scrollbar-thin">
        <CodeEditor
          socketRef={socketRef}
          roomId={id}
          onCodeChange={(code) => (codeRef.current = code)}
        />
      </div>
    </div>
  );
};

export default EditorPage;
