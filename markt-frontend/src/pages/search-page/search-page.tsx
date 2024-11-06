import { useState } from "react";
import { ExploreListings, Navbar, SearchResults } from "../../components";

const SearchPage = () => {
  return (
    <>
      <Navbar />
      <SearchResults />
      <ExploreListings />
    </>
  );
};

export { SearchPage };
