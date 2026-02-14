import React from "react";
import Avatar from "react-avatar";

const Client = ({ username }) => {
  return (
    <div className="client flex flex-col items-center w-[70px] p-2 rounded-lg hover:bg-white/5 transition-colors" title={username}>
      <Avatar name={username} size="42" round="12px" className="shadow-md" />
      <span className="text-xs text-gray-300 truncate w-full text-center mt-1.5">{username}</span>
    </div>
  );
};

export default Client;
