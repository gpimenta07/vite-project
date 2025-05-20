import { Link } from "react-router"
import logo from "../../assets/logo.svg"


export function Header() {
    return (
        <header className="flex justify-center items-center h-35">
            <Link to="/">
                <img src={logo} alt="" />
            </Link>
        </header>
    )
}