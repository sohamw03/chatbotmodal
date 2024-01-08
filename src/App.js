import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Chatbot from "./components/Chatbot";

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
