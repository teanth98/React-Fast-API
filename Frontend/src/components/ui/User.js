import React from "react";
import { Link } from "react-router-dom";
const User = ({ user }) => {
  const { username, id } = user;

  return (
    <div className="user">
      <div className="user-info">
        <h3>{username}</h3>
        <Link to={`/user/${id}`}>View profile</Link>
      </div>
    </div>
  );
};

export default User;
