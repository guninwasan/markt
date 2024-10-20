import { useSearchParams } from "react-router-dom";

const ProductListingPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  return (
    <div>
      <h1>Product Listing Page</h1>
      <p>Query: {id}</p>
    </div>
  );
};

export { ProductListingPage };
