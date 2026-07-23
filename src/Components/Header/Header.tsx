import "./Header.css";
import { Link } from "react-router-dom";
type HeaderProps = {
    title?: string;
    links?: { name: string; href: string }[];
};
export default function Header({ title, links }: HeaderProps) {
    return (
        <header className="header">
            <div className="header-content">
                <h1 className="header-title">{title || "Hello React"}</h1>
                <nav className="header-nav">
                    <ul>
                        {links?.map((link:{ name: string; href: string }) => (
                            <li key={link.href}>
                                <Link to={link.href}>{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}