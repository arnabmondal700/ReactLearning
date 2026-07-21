import "./Cards.css";
type CardProps = {
    title: string;
    description: string;
};
export default function Card({ title, description }: CardProps) {
    const addtoCart = () => {
        console.log(`Added ${title} to cart`);
    }
    return (
        <div className="card">
            <h2 className="card-title">{title}</h2>
            <p className="card-description">{description}</p>
            <button className="card-button" onClick={addtoCart}>
                Add to Cart
            </button>
        </div>
    );
}
