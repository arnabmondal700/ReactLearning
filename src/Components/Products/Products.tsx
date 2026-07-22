import { useState, useEffect } from "react";

type Product = {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
};
export default function ProductList() {
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await fetch("https://fakestoreapi.com/products");
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    fetchProducts();
}, []);

    return (
        <div className="product-list">
            <h2>Product List</h2>
            {loading ? (
                <p>Loading products...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            <h3>{product.title}</h3>

                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <img src={product.image} alt={product.title} width="100" />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}