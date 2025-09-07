import React from "react";
import Avatar from "react-avatar";

const Client = ({ username }) => {
  return (
    <div className="client flex flex-col items-center w-25 mt-2">
      <Avatar name={username} size="50" round="14px" />
      <span className="text-md truncate">{username}</span>
    </div>
  );
};

export default Client;
