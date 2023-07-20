import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Batalla5Cartas from "./components/Batalla5Cartas";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/batalla5cartas" element={<Batalla5Cartas />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
