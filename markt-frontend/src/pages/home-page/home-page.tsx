import { ExploreListings, Navbar } from "../../components";
import { SearchBar } from "../../components/searchbar/searchbar";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <img
        src="/cover-image3.jpg"
        alt="Cover Image"
        style={{
          width: "100%",
          height: "400px",
          objectFit: "cover",
          objectPosition: "bottom",
        }}
      />

      <ExploreListings />
    </div>
  );
};
export { HomePage };
