import { useEffect } from "react";
import { useIsMobile } from "./hooks";
import { HomePage } from "./pages/home-page";
import { useDispatch } from "react-redux";
import { setIsMobile } from "./redux";

function App() {
  const { isMobile } = useIsMobile();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setIsMobile(isMobile));
  }, [isMobile]);

  return (
    <>
      <HomePage />
    </>
  );
}

export default App;
