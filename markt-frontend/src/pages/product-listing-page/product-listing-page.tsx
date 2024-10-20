import { useSearchParams } from "react-router-dom";
import { Navbar, ProductListingComponent } from "../../components";

const ProductListingPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  //  we can check for listing id here with an api call to make sure if it's valid or not
  //  if valid then we can show the listing details
  return (
    <div>
      <Navbar />
      <ProductListingComponent />
    </div>
  );
};

export { ProductListingPage };
