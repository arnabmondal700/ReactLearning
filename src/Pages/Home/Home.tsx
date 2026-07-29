import "./Home.css";
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ProductList from './../Products/Products';
import type { Product } from './../Products/Products';
import { useCart } from '../../Context/CartContext';

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { cartItems, addToCart: addToCartContext, removeFromCart } = useCart();

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
        setAllProducts(productsWithCount);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = useCallback((product: Product, value: boolean) => {
    if (value) {
      // decrease stock of the product
      setAllProducts((prevAll) =>
        prevAll.map((p) =>
          p.id === product.id && p.productCount > 0
            ? { ...p, productCount: p.productCount - 1 }
            : p
        )
      );

      // Add to cart via reducer
      addToCartContext(product);
    }
  }, [addToCartContext]);
  const filteredProducts = useMemo(() => {
    return searchQuery
      ? allProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : allProducts;
  }, [searchQuery, allProducts]);

  return (
    <>
      <div>
        <h2 className="cart-title">Shopping Cart</h2>
        <ul className="cart-list">
          {cartItems.map((item, index) => (
            <li key={index}>{item.title} - {item.productCount}
              <button className="remove-button" onClick={() => removeFromCart(item)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          ref={searchInputRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchInputRef.current) {
              setSearchQuery(searchInputRef.current.value);
            }
          }}
        />
      </div>
      <div>
        <h2>Product List</h2>
        <ProductList
          products={filteredProducts}
          loading={loading}
          error={error}
          addToCart={addToCart}
        />
      </div>
    </>
  );
}