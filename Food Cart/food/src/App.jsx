import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { Viewcart } from "./components/Viewcart";
import { useState ,createContext} from "react";

export const cartContext = createContext();
function App() {
  const [cart,setCart] = useState([]);
  return (
    <cartContext.Provider value={{cart,setCart}}>
      <BrowserRouter>
        <div>
          <Header cart={cart} />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Viewcart  />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </cartContext.Provider>
  );
}

export default App;
