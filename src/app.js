import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
const allowedProtocols = ["http:", "https:", "mailto:"];

const App = () => {
  const [results, setResults] = useState([]);
  const listRef = useRef(null);
  const searchInputRef = useRef(null);
  useEffect(() => {
    searchInputRef.current.focus();
  }, []);
  const searchBrowser = (event) => {
    const searchQuery = event.currentTarget.value;
    const historySearch = browser.history.search({
      text: searchQuery,
      startTime: 0,
    });
    const bookmarkSearch = browser.bookmarks.search(searchQuery);
    Promise.all([bookmarkSearch, historySearch]).then((values) => {
      const [bookmarkResults, historyResults] = values;
      const allResults = [].concat(bookmarkResults, historyResults);
      processResults(allResults);
    });
  };
  const processResults = (items) => {
    const byURL = new Map();
    items.forEach((item) => {
      if (item.title) {
        byURL.set(item.url, item);
      }
    });
    const results = [];
    const entries = byURL.keys();
    let i = 0;
    let result = entries.next();
    while (!result.done && i < 30) {
      results.push(byURL.get(result.value));
      result = entries.next();
      i++;
    }
    const filteredResults = results
      .filter((item) => {
        if (typeof item.url === "undefined") {
          return false;
        }
        const itemUrl = new URL(item.url);
        if (allowedProtocols.indexOf(itemUrl.protocol) === -1) {
          return false;
        }
        return true;
      })
      .slice(0, 10);
    setResults(filteredResults);
  };
  const handleShortcuts = (event) => {
    const resultsList = listRef.current;
    const search = searchInputRef.current;
    switch (event.key) {
      case "Enter":
        if (event.target.tagName === "INPUT") {
          browser.search.query({
            disposition: "CURRENT_TAB",
            text: event.target.value,
          });
          return;
        }
        break;
      case "ArrowDown":
        if (event.target.tagName === "INPUT") {
          const firstResult = document.querySelector("li:first-child > a");
          if (firstResult) {
            firstResult.focus();
          }
        } else {
          const nextResult =
            event.target?.parentElement?.nextSibling?.querySelector("a");
          if (nextResult) {
            nextResult.focus();
          } else {
            search.focus();
          }
        }
        break;
      case "ArrowUp":
        if (event.target.tagName === "A") {
          const previousResult =
            event.target?.parentElement?.previousSibling?.querySelector("a");
          if (previousResult) {
            previousResult.focus();
          } else {
            search.focus();
          }
        } else if (event.target.tagName === "INPUT") {
          const lastResult = resultsList.querySelector("li:last-child > a");
          if (lastResult) {
            lastResult.focus();
          }
        }
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        if (event.ctrlKey) {
          const theIndex = parseInt(event.key, 10) + 1;
          const theResult = resultsList.querySelector(
            `li:nth-child(${theIndex}) > a`
          );
          if (theResult) {
            document.location = theResult.href;
          }
        }
        break;
    }
  };
  return (
    <main onKeyDown={(event) => handleShortcuts(event)}>
      <form>
        <label htmlFor="search">
          Search your browser history and bookmarks:
        </label>
        <div className="search-input__container">
          <input
            ref={searchInputRef}
            type="search"
            id="search"
            autoComplete="off"
            onChange={(event) => searchBrowser(event)}
          />
        </div>
      </form>
      <div>
        {results.length > 0 && (
          <ul className="results" ref={listRef}>
            {results.map((item, index) => {
              return (
                <li key={item.id}>
                  <a className="result" href={item.url ? item.url : "#"}>
                    <span className="result__index">{index}</span>
                    <span className="result__title">{item.title}</span>
                    <span className="result__url">{item.url}</span>
                    {item?.type === "bookmark" ? (
                      <span className="result__icon result__icon--bookmark">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fillRule="evenodd"
                          strokeLinejoin="round"
                          strokeMiterlimit="2"
                          clipRule="evenodd"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="nonzero"
                            d="M11.322 2.923a.754.754 0 0 1 1.356 0l2.65 5.44 6.022.829a.749.749 0 0 1 .419 1.283c-1.61 1.538-4.382 4.191-4.382 4.191l1.069 5.952a.751.751 0 0 1-1.097.793L12 18.56l-5.359 2.851a.751.751 0 0 1-1.097-.793l1.07-5.952-4.382-4.191a.75.75 0 0 1 .419-1.283l6.021-.829 2.65-5.44z"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span className="result__icon">&#9166;</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
};

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
