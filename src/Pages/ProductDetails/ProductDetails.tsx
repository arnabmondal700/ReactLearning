import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Product } from "../Products/Products";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [productDetails, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (productDetails) {
      console.log(`Added ${productDetails.title} to cart`);
      alert(`${productDetails.title} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="product-details">
        <h1>Product Details</h1>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details">
        <h1>Product Details</h1>
        <p className="error">{error}</p>
        <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="product-details">
        <h1>Product Details</h1>
        <p>No product found.</p>
        <button className="back-button" onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  return (
    <div className="product-details">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <div className="product-details-container">
        <img
          src={productDetails.image}
          alt={productDetails.title}
          className="product-details-image"
        />
        <div className="product-details-info">
          <h1 className="product-details-title">{productDetails.title}</h1>
          <div className="product-details-rating">
            <span className="card-stars">{"★".repeat(Math.floor(productDetails.rating.rate))}</span>
            <span className="card-rate">{productDetails.rating.rate.toFixed(1)}</span>
            <span className="card-count">({productDetails.rating.count} reviews)</span>
          </div>
          {productDetails.productCount !== undefined && (
            <p className="product-details-stock">Stock: {productDetails.productCount}</p>
          )}
          <p className="product-details-price">${productDetails.price.toFixed(2)}</p>
          <p className="product-details-category">Category: {productDetails.category}</p>
          <p className="product-details-description">{productDetails.description}</p>
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
