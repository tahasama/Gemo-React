import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import TimeAgo from "timeago-react";

function App() {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setmessage] = useState(false);

  // Fires first page of API and then at page updating
  useEffect(() => {
    getUsers();
  }, [page]);

  // get data from API and update rpository array
  const getUsers = async () => {
    const res = await axios
      .get(
        `https://api.github.com/search/repositories?q=created:2017-10-22&sort=stars&order=desc&page=${page}`
      )
      .then((res) => setRepos([...repos, ...res.data.items]))
      .catch((err) => setmessage(true));

    setLoading(false);
  };

  // Fires once scroll arrives to the end of page, then go to next page
  const scrollToEnd = () => {
    setPage(page + 1);
    setLoading(true);
  };

  // Detects the end of page while scrolling
  window.onscroll = function () {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      scrollToEnd();
    }
  };

  return (
    <div>
      {repos.map((repository) => (
        <div className="screen" key={repository.id}>
          <img className="avatar" src={repository.owner.avatar_url} />
          <div className="infos">
            <div className="upper-infos">
              <h3 className="texty">{repository.name}</h3>
              <p className="texty">{repository.description}</p>
            </div>
            <div className="bottom-infos">
              <div className="row1">
                <p className="boxed">Stars: {repository.stargazers_count}</p>
                <p className="boxed">Issues: {repository.open_issues_count}</p>
              </div>
              <div className="row2">
                <p>
                  Submitted &nbsp;
                  <TimeAgo datetime={repository.created_at} />
                  &nbsp; by {repository.owner.login}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {loading && <p className="loading">...loading</p>}
      {message && <p className="loading">...you have reached the limit </p>}
    </div>
  );
}

export default App;
