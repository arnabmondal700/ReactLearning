import "./Cards.css";
type CardProps = {
    title: string;
    description: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
    productCount?: number;
    addtoCart?: (value?: boolean) => void;
    onDetailsClick?: () => void;
};

export default function Card({ title, description, image, rating, productCount, addtoCart, onDetailsClick }: CardProps) {
    const handleAddToCart = () => {
        if (addtoCart) {
        addtoCart();
        } else {
            console.log(`Added ${title} to cart`);
        }
    }
    return (
        <div className="card" onClick={onDetailsClick}>
            <img src={image} alt={title} className="card-image" />
            <h2 className="card-title">{title}</h2>
            <div className="card-rating">
                <span className="card-stars">{"★".repeat(Math.floor(rating.rate))}</span>
                <span className="card-rate">{rating.rate.toFixed(1)}</span>
                <span className="card-count">({rating.count} reviews)</span>
            </div>
            {productCount !== undefined && (
                <p className="card-productCount">Stock: {productCount}</p>
            )}
            <p className="card-description">{description.length > 100 ? description.slice(0, 100) + '...' : description}</p>
            <button className="card-button" onClick={handleAddToCart}>
                Add to Cart
            </button>
        </div>
    );
}
