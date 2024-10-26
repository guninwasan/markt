import { ExploreListings, Navbar } from "../../components";
import { SearchBar } from "../../components/searchbar/searchbar";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <SearchBar></SearchBar>
      <img src="/" alt="image" width={"100%"} height={400} />
      <ExploreListings />
    </div>
  );
};
export { HomePage };
