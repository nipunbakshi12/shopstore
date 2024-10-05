import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout.js'
import axios from 'axios';
import { Checkbox, Radio } from 'antd'
import { Prices } from '../components/Prices.js';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart.js';
import '../styles/HomePage.css'
import toast from 'react-hot-toast';
import { Carousel } from 'react-bootstrap';  // Import Carousel
import PopupMessage from './PopupMessage.js';
// import { gsap } from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';

const HomePage = () => {
    const navigate = useNavigate()
    const [cart, setCart] = useCart()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [checked, setChecked] = useState([])
    const [radio, setRadio] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [showPopup, setShowPopup] = useState(true);

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    // Initialize cart from localStorage
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);
    }, [setCart]);

    // console.log("Auth:", auth)

    //get all categories
    const getAllCategories = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`)
            if (data?.success) {
                setCategories(data?.category)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getAllCategories()
        getTotal()
    }, [])

    //get Products
    const getAllProducts = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`)
            setLoading(false)
            setProducts(data.products)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }


    //get total count
    const getTotal = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`)
            console.log("Toatl Products count", data)
            setTotal(data?.total)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (page === 1) return;
        loadMore()
    }, [page])
    //load more 
    const loadMore = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`)
            setLoading(false)
            setProducts([...products, ...data?.products])
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }



    //filter by category
    const handleFilter = (value, id) => {
        let all = [...checked]
        if (value) {
            all.push(id)
        }
        else {
            all = all.filter(c => c !== id)
        }
        setChecked(all)
    }
    useEffect(() => {
        if (!checked.length || !radio.length) getAllProducts()
    }, [checked.length, radio.length])

    useEffect(() => {
        if (checked.length || radio.length) filterProduct()
    }, [checked, radio])

    //get filtered product
    const filterProduct = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filters`, { checked, radio })
            setProducts(data?.products)
        } catch (error) {
            console.log(error)
        }
    }

    // Add to Cart
    const handleAddToCart = (product) => {
        const isProductInCart = cart.some(item => item._id === product._id);
        if (isProductInCart) {
            toast.error("Item is already in the cart.");
            return;
        }
        const updatedCart = [...cart, { ...product, quantity: 1 }];
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        toast.success("Item added to cart successfully.");
    };

    // useEffect(() => {
    //     gsap.registerPlugin(ScrollTrigger);

    //     gsap.to("#scroller h1", {
    //         // transform: "translate(-100%)",
    //         xPercent: -100,
    //         scrollTrigger: {
    //             trigger: "#scroller",
    //             // scroller: "body",
    //             // markers: true,
    //             start: "top top",
    //             end: "bottom top",
    //             scrub: 1,
    //             pin: true
    //         }
    //     });
    // }, []);

    //Debugging steps
    // useEffect(() => {
    //     console.log("Products:", products)
    //     console.log("Total:", total)
    //     console.log("Page:", page)
    //     console.log("Loading:", loading)
    // }, [products, total, page, loading])

    return (
        <Layout title={'All products - Best offers'}>

            {/* Popup Message */}
            {showPopup && <PopupMessage onClose={handleClosePopup} />}

            {/* Carousel Section */}
            <Carousel className='carousel'>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        // src='https://images.unsplash.com/photo-1643536768014-0756fa85ca4f?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        src="https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        {/* <h3>Tech</h3> */}
                        <p>Random image from Unsplash.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        // src='https://images.unsplash.com/photo-1560243563-062bfc001d68?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        src="https://plus.unsplash.com/premium_photo-1686878940830-9031355ec98c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        {/* <h3 style={{
                            color: "yellow",
                            fontSize: "40px",
                        }}>Clothing</h3> */}
                        <p>Another random image from Unsplash.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        // src='https://plus.unsplash.com/premium_photo-1673502752899-04caa9541a5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        src="https://images.unsplash.com/photo-1498579397066-22750a3cb424?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        {/* <h3>Sale</h3> */}
                        <p>Explore the city through this random image.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://plus.unsplash.com/premium_photo-1687131786869-dc26efcbc405?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        // src='https://images.unsplash.com/photo-1571204829887-3b8d69e4094d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        alt="Fourth slide"
                        style={{
                            objectFit: 'cover'
                        }}
                    />
                    <Carousel.Caption>
                        {/* <h3 style={{
                            color: "yellow",
                            fontSize: "40px",
                        }}>Thank you for shopping</h3> */}
                        <p>Delicious food shots from Unsplash.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            {/* Scroller Section */}
            {/* <div id="scroller">
                <h1>CURATE&nbsp;YOUR&nbsp;OWN&nbsp;HAPPINESS</h1>
            </div> */}

            <div className='row mt-3 container'>
                <div className='col-md-3'>

                    {/* Filter by Category */}
                    <h4 className='text-center'>Filter by Category</h4>
                    <div className='d-flex flex-column'>
                        {categories?.map(c => (
                            <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>

                    {/* Filter by Price */}
                    <h4 className='text-center mt-4'>Filter by Price</h4>
                    <div className='d-flex flex-column'>
                        <Radio.Group onChange={e => setRadio(e.target.value)}>
                            {Prices?.map(p => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>

                    {/* Reset Button */}
                    <div className='d-flex flex-column'>
                        <button className='btn btn-danger' onClick={() => window.location.reload()}>RESET FILTERS</button>
                    </div>

                </div>
                <div className='col-md-9'>
                    {/* {JSON.stringify(radio, null, 4)} */}
                    <h1 className='text-center'>All Products</h1>
                    <div className='row'>
                        {products?.map(p => (
                            <div className="col-6 col-md-4 col-lg-3 mb-3" key={p._id}>
                                <div className="card" style={{ width: '100%' }}>
                                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} height={250} />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {truncateText(p.name, 15)}
                                        </h5>
                                        <p className="card-text">
                                            {truncateText(p.description, 30)}
                                        </p>
                                        <p className="card-text card-price">
                                            ₹{p.price}
                                        </p>
                                        <div className="d-flex justify-content-between">
                                            <button
                                                className='btn btn-primary me-1 w-50'
                                                onClick={() => navigate(`/product/${p.slug}`)}>
                                                More Details
                                            </button>
                                            <button
                                                className='btn btn-warning ms-1 w-50'
                                                onClick={() => handleAddToCart(p)}>
                                                ADD TO CART
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='m-2 p-3'>
                        {products && products.length < total && (
                            <button className='btn btn-warning' onClick={(e) => {
                                e.preventDefault();
                                setPage(page + 1);
                            }}>
                                {loading ? "Loading..." : "Load More..."}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* <h1>Home Page</h1>
            <pre>{JSON.stringify(auth, null, 4)}</pre> */}
        </Layout>
    )
}

export default HomePage