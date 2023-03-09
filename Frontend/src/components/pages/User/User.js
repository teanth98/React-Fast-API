import React, { useState, useEffect } from "react";
import "./User.css";
import { Link, useParams } from "react-router-dom";
import axios from "../../../axios";
import Repo from "../../ui/Repo";

const User = () => {
  // console.log("useParams",useParams);
  const { login } = useParams();
  // console.log("login",login)

  //UserInformation
  const [userInfo, setUserInfo] = useState({});
  //User repos
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  
  const [limit, setLimit] = useState(10);


  const handlePrevPage = () => {
    setPage((page) => {
      if (page === 1) return page;
      else return page - 1;
    });
  };

  const handleNextPage = () => {
    setPage((page) => page + 1);
  };

  const handlePageLimit = (e) => {
    const value = e.target.value;
    console.log("value",value);
    setLimit(parseInt(value));
  };

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const response = await Promise.all([
          axios.get(
            'http://localhost:8000/api/user/repos', {
            params: {
              search: login,
              page: page,
              limit: limit
            }
          }
          ),
          axios.get(
            'http://localhost:8000/api/user/user-details', {
            params: {
              search: login
            }
          }
          )

        ]);
        setUserInfo(response[1].data.userinfo[0]);
        setRepos(response[0].data.repositories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserInformation();
  }, [page, limit]);
  return (
    <div className="container">
      <Link to="/" className="back">
        Back
      </Link>
      <div className="user-information">
        <div className="user-content">
          <h3>{userInfo?.username}</h3>
          <div className="more-data">
            <p>
              <a href={userInfo?.profile_link}>View GitHub Profile</a>
            </p>
          </div>
        </div>
      </div>
      <div className="search-results">
        <div className="more-options">
          <label>
            <small>Per Page</small>
            <select onChange={handlePageLimit}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
          <div className="pagination">
            <button onClick={handlePrevPage}>{page}</button>
            <button onClick={handleNextPage}>{page + 1}</button>
          </div>
        </div>
        {repos ? (
          repos.map((repo) => {
            return <Repo repo={repo} userInfo={userInfo} key={repo.id} />;
          })
        ) : (
          <h2>No repos for this user...</h2>
        )}
      </div>
    </div>
  );
};

export default User;
