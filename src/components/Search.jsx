import React from "react";

const Search = ({ query, setQuery }) => {
  return (
    <input
      type="text"
      placeholder="Search..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="border border-gray-300 rounded-md p-2 w-full"
    />
  );
};

export default Search;
