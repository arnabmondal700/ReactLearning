import Card from "../../Cards/Cards";

type Product = {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
    productCount: number;
    rating: {
        rate: number;
        count: number;
    };
};

type ProductListProps = {
    products: Product[];
    loading: boolean;
    error: string;
    addToCart?: (product: Product, value: boolean) => void;
};

export type { Product };

export default function ProductList({ products, loading, error, addToCart }: ProductListProps) {
    return (
        <div className="product-list">
            {loading ? (
                <p>Loading products...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="hero">
                    {products.map((product) => (
                        <Card
                            key={product.id}
                            title={product.title}
                            description={product.description}
                            image={product.image}
                            rating={product.rating}
                            productCount={product.productCount}
                            addtoCart={() => addToCart ? addToCart(product, true) : undefined}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}