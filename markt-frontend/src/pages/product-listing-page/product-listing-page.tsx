// import { useSearchParams } from "react-router-dom";
import { Navbar, ProductListingComponent } from "../../components";

const ProductListingPage = () => {
  // const [searchParams] = useSearchParams();
  // const id = searchParams.get("id");

  return (
    <div>
      <Navbar />
      <ProductListingComponent />
    </div>
  );
};

export { ProductListingPage };
