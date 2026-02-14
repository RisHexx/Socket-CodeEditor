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
  
  // BUG FIX: useState must be called before any conditional returns (React hooks rules)
  // Moved useState above the redirect check to prevent "Rendered fewer hooks than expected" error
  const [clients, setClients] = useState([]);

  // BUG FIX: Redirect in useEffect instead of render phase to avoid React warnings
  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location.state, navigate]);

  const handleErr = (err) => {
    console.log("Socket Error : ", err);
    // BUG FIX: Separated statements properly (comma operator was being used incorrectly)
    toast.error("Error While Connecting");
    navigate("/");
  };

  useEffect(() => {
    // BUG FIX: Early return if no location state to prevent socket initialization without username
    if (!location.state) return;
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
      // BUG FIX: Check if socket exists before cleanup to prevent errors
      // Also removed event listeners BEFORE disconnecting (correct order)
      if (socketRef.current) {
        socketRef.current.off(Actions.JOINED);
        socketRef.current.off(Actions.DISCONNECTED);
        socketRef.current.disconnect();
      }
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="aside w-[220px] min-w-[200px] text-white bg-[#0b132b] h-screen flex flex-col justify-between border-r border-[#1c2541]">
        <div className="asideInner flex-1 overflow-hidden flex flex-col">
          <Link to="/" className="hover:opacity-90">
            <div className="logo flex gap-2 items-center p-4 border-b border-[#1c2541]">
              <img src="/code.png" alt="logo" className="w-9" />
              <h3 className="text-xl font-bold tracking-tight">CodeDrip</h3>
            </div>
          </Link>
          <div className="px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Connected ({clients.length})</p>
          </div>

          <div className="clients-list flex-1 px-3 flex flex-wrap content-start gap-2 overflow-y-auto scrollbar-thin">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col gap-2 p-4 border-t border-[#1c2541]">
          <button
            className="w-full py-2.5 bg-white/90 text-gray-900 rounded-lg font-medium hover:bg-white active:scale-[0.98] transition-all cursor-pointer text-sm"
            onClick={handleCopy}
          >
            Copy Room ID
          </button>
          <button
            className="w-full py-2.5 bg-red-500/90 text-white rounded-lg font-medium hover:bg-red-500 active:scale-[0.98] transition-all cursor-pointer text-sm"
            onClick={handleLeave}
          >
            Leave
          </button>
        </div>
      </div>

      <div className="Editor flex-1 h-screen text-gray-200 max-h-screen overflow-y-auto scrollbar-thin bg-[#272822]">
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
