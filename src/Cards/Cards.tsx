import "./Cards.css";
type CardProps = {
    title: string;
    description: string;
    cousreCount?: number;
    addtoCart?: (value: any) => void;
};

export default function Card({ title, description, cousreCount, addtoCart }: CardProps) {
    const handleAddToCart = () => {
        if (addtoCart) {
            addtoCart(title);
        } else {
            console.log(`Added ${title} to cart`);
        }
    }
    return (
        <div className="card">
            <h2 className="card-title">{title}</h2>
            {cousreCount !== undefined && (
                <p className="card-cousreCount">Courses: {cousreCount}</p>
            )}
            <p className="card-description">{description}</p>
            <button className="card-button" onClick={handleAddToCart}>
                Add to Cart
            </button>
        </div>
    );
}
