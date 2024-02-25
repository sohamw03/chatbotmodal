import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import { GlobalProvider } from "./context/GlobalContext";

function App() {
  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route // This is the default route
              exact
              path="/"
              element={
                <GlobalProvider>
                  <Chatbot />
                </GlobalProvider>
              }
            />
            <Route exact path="/page1" element={<Chatbot />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
