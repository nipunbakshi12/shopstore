import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import SearchInput from '../Form/SearchInput';
import useCategory from './../../hooks/useCategory';
import { useCart } from '../../context/cart';
import { Badge } from 'antd';
import logo from './Shipshopstore.png';

const Header = () => {
    const [auth, setAuth] = useAuth();
    const [cart] = useCart();
    const categories = useCategory();

    const handleLogout = () => {
        setAuth({ ...auth, user: null, token: '' });
        localStorage.removeItem('auth');
        toast.success('Logged out successfully!');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">
                <img
                    src={logo}
                    // src='https://banner2.cleanpng.com/20180519/jjs/avq0lgq0t.webp'
                    alt="ShipShopStore"
                    className="nav-logo"
                    style={{ width: '40px', height: 'auto', marginRight: '10px' }}
                />
                ShipShopStore
                {/* Clarity Cart */}
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <NavLink to="/" className="nav-link">
                            Home
                        </NavLink>
                    </li>
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            Categories
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link className="dropdown-item" to="/categories">
                                All categories
                            </Link>
                            {categories?.map((c) => (
                                <Link key={c.slug} className="dropdown-item" to={`/category/${c.slug}`}>
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                    </li>
                    {!auth.user ? (
                        <>
                            <li className="nav-item">
                                <NavLink to="/register" className="nav-link">
                                    Register
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/login" className="nav-link">
                                    Login
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {auth?.user?.name}
                            </a>
                            <div className="dropdown-menu">
                                <Link
                                    to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}
                                    className="dropdown-item"
                                >
                                    Dashboard
                                </Link>
                                <Link onClick={handleLogout} to="/login" className="dropdown-item">
                                    Logout
                                </Link>
                            </div>
                        </li>
                    )}
                    <li className="nav-item">
                        <Badge count={cart?.length} showZero>
                            <NavLink to="/cart" className="nav-link">
                                Cart
                            </NavLink>
                        </Badge>
                    </li>
                </ul>
                <form className="form-inline my-2 my-lg-0 ms-auto">
                    <SearchInput />
                </form>
            </div>
        </nav>
    );
};

export default Header;
