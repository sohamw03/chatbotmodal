import Chatbot from "./components/Chatbot";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<Chatbot />} />
            <Route exact path="/page1" element={<Chatbot />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
