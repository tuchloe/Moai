import "./Header.scss";
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <h1 className="header__title" onClick={() => navigate("/dashboard")}>
        Moai
      </h1>
      <nav className="header__nav">
        <button className="header__nav-link" onClick={() => navigate("/dashboard")}>
          Home
        </button>
        <button className="header__nav-link" onClick={() => navigate("/help")}>
          Help
        </button>
      </nav>
    </header>
  );
};

export default Header;
