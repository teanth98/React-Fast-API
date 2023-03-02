import React from "react";

const Repo = ({ repo }) => {
  const { name, repo_url, size, language } = repo;
  return (
    <div className="repo">
      <h3>
        <a href={repo_url}>{name}</a>
      </h3>
      <p>Size:{size}kB</p>
      {language && <small>Written in {language}</small>}
    </div>
  );
};

export default Repo;
