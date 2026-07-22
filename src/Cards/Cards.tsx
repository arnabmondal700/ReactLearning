import "./Cards.css";
type CardProps = {
    title: string;
    description: string;
    productCount?: number;
    addtoCart?: (value?: any) => void;
};

export default function Card({ title, description, productCount, addtoCart }: CardProps) {
    const handleAddToCart = () => {
        if (addtoCart) {
        addtoCart();
        } else {
            console.log(`Added ${title} to cart`);
        }
    }
    return (
        <div className="card">
            <h2 className="card-title">{title}</h2>
            {productCount !== undefined && (
                <p className="card-productCount">Products: {productCount}</p>
            )}
            <p className="card-description">{description}</p>
            <button className="card-button" onClick={handleAddToCart}>
                Add to Cart
            </button>
        </div>
    );
}
