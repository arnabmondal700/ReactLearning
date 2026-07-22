import { useState } from 'react'
import './App.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Card from './Cards/Cards';
import ProductList from './Components/Products/Products';
type Product = {
  name: string;
  description: string;
  productCount: number;
};

function App() {
  const [count, setCount] = useState(0);
  let nameString = "Vite + React";
  let productNames = [{ name: "Potato", description: "Potatoes are a starchy vegetable that are a staple food in many cultures. They can be prepared in a variety of ways, including boiling, baking, and frying.", productCount: 5 },
  { name: "Ginger", description: "Ginger is a flowering plant whose rhizome, ginger root or ginger, is widely used as a spice and a folk medicine. It is a herbaceous perennial which grows annual pseudostems about one meter tall bearing narrow leaf blades.", productCount: 3 },
  { name: "Tomato", description: "The tomato is the edible berry of the plant Solanum lycopersicum, commonly known as a tomato plant. The species originated in western South America and Central America.", productCount: 8 },
  { name: "Onion", description: "The onion (Allium cepa L., from Latin cepa 'onion') is a vegetable that is the most widely cultivated species of the genus Allium. Its close relatives include the garlic, shallot, leek, chive, and Chinese onion.", productCount: 4 },
  { name: "Carrot", description: "The carrot (Daucus carota subsp. sativus) is a root vegetable, usually orange in color, though purple, black, red, white, and yellow cultivars exist. Carrots are a domesticated form of the wild carrot, Daucus carota, native to Europe and southwestern Asia.", productCount: 6 }];
  let headerLinks: { name: string; href: string }[] = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [products, setProducts] = useState(productNames);
  const addToCart = (product: Product, value: boolean) => {
    if (value) {
      console.log(`$cartItems: `, cartItems);
      if (cartItems.length === 0) {
        setCartItems([...cartItems, { name: product.name, description: product.description, productCount: 1 }]);
      } else {
        const existingIndex = cartItems.findIndex((item) => item.name === product.name);
        if (existingIndex !== -1 && products[products.findIndex((p) => p.name === product.name)].productCount > 0) {
          const updatedCartItems = cartItems.map((item, index) =>
            index === existingIndex ? { ...item, productCount: item.productCount + 1 } : item
          );
          setCartItems(updatedCartItems);
        } else if (products[products.findIndex((p) => p.name === product.name)].productCount > 0) {
          setCartItems([...cartItems, { name: product.name, description: product.description, productCount: 1 }]);
        }
      }
      if (products.length > 0) {
        const updatedProducts = products.map((item) => {
          if (item.name === product.name && item.productCount > 0) {
            return { ...item, productCount: item.productCount - 1 };
          }
          return item;
        });
        setProducts(updatedProducts);
        console.log(`$products: `, products);
      }
    }
  };
  const removeFromCart = (product: Product) => {
    setCartItems(cartItems.filter((item) => item.name !== product.name));
    const updatedProducts = products.map((item) => {
      if (item.name === product.name) {
        return { ...item, productCount: item.productCount + product.productCount };
      }
      return item;
    });
    setProducts(updatedProducts);
  };
  return (
    <>
      <Header links={headerLinks} title={nameString} />
      <section id="center">

        <div className="hero">
          {products.map((product, index) => (
            <Card key={index}
              title={product.name}
              description={product.description}
              productCount={product.productCount}
              addtoCart={() => addToCart(product, true)}
            />
          ))}
        </div>
      </section>
      <div>
        <h2>Shopping Cart</h2>
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>{item.name} - {item.productCount}
              <button className="remove-button" onClick={() => removeFromCart(item)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Product List</h2>
        <ProductList />
      </div>
      <Footer />
    </>
  )
}

export default App
