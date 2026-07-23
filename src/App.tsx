import { useState, useEffect } from 'react'
import './App.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import ProductList from './Components/Products/Products';
import type { Product } from './Components/Products/Products';

function App() {
  let nameString = "Vite + React";
  let headerLinks: { name: string; href: string }[] = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: Product[] = await response.json();
        const productsWithCount = data.map((product) => ({
          ...product,
          productCount: 10,
        }));
        setProducts(productsWithCount);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product, value: boolean) => {
    if (value) {
      // Decrease stock of the product
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id && p.productCount > 0
            ? { ...p, productCount: p.productCount - 1 }
            : p
        )
      );

      // Add to cart or increase cart quantity
      setCartItems((prevCart) => {
        const existingIndex = prevCart.findIndex((item) => item.title === product.title);
        if (existingIndex !== -1) {
          return prevCart.map((item, index) =>
            index === existingIndex ? { ...item, productCount: item.productCount + 1 } : item
          );
        } else {
          return [...prevCart, { ...product, productCount: 1 }];
        }
      });
    }
  };

  const removeFromCart = (product: Product) => {
    // Increase stock of the product
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === product.id
          ? { ...p, productCount: p.productCount + 1 }
          : p
      )
    );

    // Decrease cart quantity or remove if 0
    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.title === product.title);
      if (existingIndex !== -1) {
        const existingItem = prevCart[existingIndex];
        if (existingItem.productCount > 1) {
          return prevCart.map((item, index) =>
            index === existingIndex ? { ...item, productCount: item.productCount - 1 } : item
          );
        } else {
          return prevCart.filter((item) => item.title !== product.title);
        }
      }
      return prevCart;
    });
  };

  return (
    <>
      <Header links={headerLinks} title={nameString} />
      <div>
        <h2>Shopping Cart</h2>
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>{item.title} - {item.productCount}
              <button className="remove-button" onClick={() => removeFromCart(item)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Product List</h2>
        <ProductList products={products} loading={loading} error={error} addToCart={addToCart} />
      </div>
      <Footer />
    </>
  )
}

export default App