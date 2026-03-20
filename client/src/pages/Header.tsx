import "./css/header.css";
import {Link} from "react-router-dom"

export default function Header() {
  return (
    <header className="header">
      <div className="logo">ArcSil</div>

      <nav className="nav">
        <Link to="/shop/all">iStore</Link>
        <Link to="/shop/iphone">iPhone</Link>
        <Link to="/shop/macbook">Macbook</Link>
        <Link to="/shop/watch">Watch</Link>
        <Link to="/shop/airpods">AirPods</Link>
        <Link to="/shop/ipad">iPad</Link>
      </nav>

      <div className="icons-s">
        <Link to="/profile"><i className="fas fa-shopping-bag"></i></Link>
      </div>
    </header>
  );
}