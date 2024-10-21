import { useIsMobile } from "./hooks";
import { HomePage } from "./pages/home-page";

function App() {
  useIsMobile();
  return (
    <>
      <HomePage />
    </>
  );
}

export default App;
