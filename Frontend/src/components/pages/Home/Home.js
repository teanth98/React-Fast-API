import React, { useState, useCallback, useMemo } from "react";
import "./Home.css";
import User from "../../ui/User";
import axios from "axios";

const Home = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const handleQueryInput = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
  }, []);

  const handlePrevPage = useCallback(() => {
    setPage((page) => {
      if (page === 1) return page;
      else return page - 1;
    });
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((page) => page + 1);
  }, []);

  const handlePageLimit = useCallback((e) => {
    const value = e.target.value;
    setLimit(parseInt(value));
  }, []);

  const handleSearchUsers = useCallback(async (e) => {
    e.preventDefault();
    if (query) {
      try {
        const { data } = await axios.get("http://localhost:8000/api/user", {
          params: {
            search: query,
            page: page,
            limit: limit,
          },
        });
        setUsers(data?.usernames);
      } catch (error) {
        console.error(error);
        setUsers([]);
      }
    } else {
      console.log("Your query is empty...");
      setUsers([]);
    }
  }, [query, page, limit]);

  const displayedUsers = useMemo(() => {
    if (users && users.length) {
      return users.map((user) => <User user={user} key={user.id} />);
    } else {
      return <h2>There is nothing to display...</h2>;
    }
  }, [users]);

  return (
    <div className="container">
      <div className="search-form">
        <h2>Search GitHub User</h2>
        <form>
          <input value={query} onChange={handleQueryInput} type="text" />
          <button onClick={handleSearchUsers}>Search</button>
        </form>
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
        {displayedUsers}
      </div>
    </div>
  );
};

export default Home;