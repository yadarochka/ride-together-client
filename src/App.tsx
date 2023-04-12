import { useState } from "react";
import "./App.css";
import AdressInput from "./components/Input/Input";
import LandingPage from "./pages/HomePage/HomePage";

function App() {
  const [count, setCount] = useState(0);
  console.log("render");
  return (
    <div className="App">
      <LandingPage></LandingPage>
    </div>
  );
}

export default App;
