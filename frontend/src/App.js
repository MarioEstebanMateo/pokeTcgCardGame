import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Batalla5Cartas from "./components/Batalla5Cartas";
import Footer from "./components/Footer";
import AbrirSobre from "./components/AbrirSobre";
import Navbar from "./components/Navbar";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/batalla5cartas" element={<Batalla5Cartas />} />
          <Route path="/abrirsobre" element={<AbrirSobre />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
