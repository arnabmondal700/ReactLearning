import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
type HeaderProps = {
    title?: string;
    links?: { name: string; href: string }[];
};
export default function Header({ title, links }: HeaderProps) {
    const navigate = useNavigate();
    return (
        <header className="header">
            <div className="header-content">
                <h1 className="header-title">{title || "Hello React"}</h1>
                <nav className="header-nav">
                    <ul>
                        {links?.map((link:{ name: string; href: string }) => (
                            <li key={link.href} className={window.location.pathname === link.href ? "active" : ""}>
                                <span onClick={()=> navigate(link.href) }>{link.name}</span>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}