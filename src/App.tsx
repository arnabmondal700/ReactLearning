import './App.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import { Route, Router, Routes } from 'react-router-dom';
import ProductDetails from './Pages/ProductDetails/ProductDetails';
import Home from './Pages/Home/Home';
import About from './Pages/About/About';
import Registration from './Pages/Registration/Registration';
import Cart from './Pages/Cart/Cart';

function App() {
  let nameString = "Vite + React";
  let headerLinks: { name: string; href: string }[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Registration", href: "/registration" },
    { name: "Cart", href: "/cart" }
  ];

  return (
    <>
      <Header links={headerLinks} title={nameString} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
      </Routes>
      
      <Footer />
    </>
  )
}

export default App