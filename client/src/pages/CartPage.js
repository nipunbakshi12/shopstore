import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout.js'
import axios from 'axios'
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import '../styles/CartPage.css'
import { load } from "@cashfreepayments/cashfree-js";


function CartPage() {
    const [auth] = useAuth()
    const [cart, setCart] = useCart()
    // const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    let cashfree;

    // Initialize Cashfree SDK
    useEffect(() => {
        const initializeSDK = async () => {
            cashfree = await load({ mode: "sandbox" });
            console.log("Cashfree SDK loaded:", cashfree);
        };
        initializeSDK();
    }, []);

    // Initialize cart from localStorage
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);
    }, [setCart]);

    // Ensure items have a default quantity of 1 if not already set
    useEffect(() => {
        if (cart.every(item => item.quantity === undefined)) {
            const initializedCart = cart.map(item => ({
                ...item,
                quantity: item.quantity || 1
            }));
            setCart(initializedCart);
            localStorage.setItem('cart', JSON.stringify(initializedCart));
        }
    }, [cart, setCart]);

    // Update quantity of an item
    const updateQuantity = (id, delta) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item => {
                if (item._id === id) {
                    const newQuantity = Math.max(item.quantity + delta, 1);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    // Calculate total price
    const totalPrice = () => {
        try {
            let total = 0;
            cart.forEach((item) => { total += item.price * item.quantity })
            return total.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR"
            })
        } catch (error) {
            console.log(error)
            return '₹0';
        }
    }

    // Handle item removal from cart
    const removeCardItem = (pid) => {
        try {
            let myCart = cart.filter(item => item._id !== pid);
            toast.success('Item removed successfully!');
            setCart(myCart)
            localStorage.setItem('cart', JSON.stringify(myCart))
        } catch (error) {
            console.error(error)
        }
    }

    // Handle payment through Cashfree
    const handlePayment = async () => {
        try {
            const orderData = {
                order_id: `order_${Date.now()}`, // Unique order ID
                order_amount: cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2),
                order_currency: 'INR',
                username: auth?.user?.name,
                customer_phone: auth?.user?.phone
            };

            // Fetch payment session ID from the backend
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/cashfree/payment-session`, orderData);
            const paymentSessionId = data.sessionId;

            console.log("API CALLING", data)

            // Redirect to Cashfree checkout
            if (paymentSessionId) {
                let checkoutOptions = {
                    paymentSessionId: paymentSessionId,
                    redirectTarget: "_self", // Redirect in the same tab
                };
                cashfree = await load({ mode: "sandbox" });
                cashfree.checkout(checkoutOptions);
                console.log("SUCCESSFUL", checkoutOptions)

                // After successful payment, create the order in the database
                const orderPayload = {
                    products: cart.map(item => item._id),
                    payment: {
                        orderId: orderData.order_id,
                        paymentSessionId: paymentSessionId,
                        amount: parseFloat(orderData.order_amount),
                        status: 'Pending' // Initially set to pending
                    },
                    buyer: auth.user._id
                };

                await axios.post(`${process.env.REACT_APP_API}/api/v1/dashboard/user/orders`, orderPayload); // Save order details
                navigate('/orders');

            } else {
                toast.error('Failed to initiate payment session.');
            }
        } catch (error) {
            console.error('Payment Error: ', error);
            toast.error('Payment failed. Please try again.');
        }
    };

    return (
        <Layout>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <h1 className='text-center bg-light p-2 mb-1'>
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h1>
                        <h4 className='text-center'>
                            {cart?.length ?
                                `You have ${cart?.length} items in your cart ${auth?.token ? "" : "please login to checkout"}` : "Your cart is empty"}
                        </h4>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-8'>
                        {cart?.map((p) => (
                            <div className='row mb-2 p-3 card flex-row' key={p._id}>
                                <div className='col-md-4'>
                                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} width="100px" />
                                </div>
                                <div className='col-md-8'>
                                    <h4>{p.name}</h4>
                                    <p>{p.description.substring(0, 30)}</p>
                                    <h4>Price: ₹{p.price}</h4>
                                    <div>
                                        <button className='btn btn-secondary quantity-btns' onClick={() => updateQuantity(p._id, -1)}>-</button>
                                        <span className='mx-2'>{p.quantity}</span>
                                        <button className='btn btn-secondary quantity-btns' onClick={() => updateQuantity(p._id, 1)}>+</button>
                                    </div>
                                    <button className='btn btn-danger remove-btn' onClick={() => removeCardItem(p._id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='col-md-4 text-center'>
                        <h2>Cart Summary</h2>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        <h4>Total: {totalPrice()}</h4>
                        <button className='btn btn-primary' onClick={handlePayment}>
                            Pay Now
                        </button>

                        {auth?.user?.address ? (
                            <>
                                <div className='mb-3'>
                                    <h4>Current Address</h4>
                                    <h5>{auth?.user?.address}</h5>
                                    <button className='btn btn-outline-warning'
                                        onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
                                </div>
                            </>
                        ) : (
                            <div className='mb-3'>
                                {
                                    auth?.token ? (
                                        <button className='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
                                    ) : (
                                        <button className='btn btn-outline-warning' onClick={() => navigate('/login', {
                                            state: '/cart',
                                        })}>Please Login to checkout</button>
                                    )
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CartPage;

















// import { load } from "@cashfreepayments/cashfree-js";
// function CartPage() {
//     let cashfree;
//     var initializeSDK = async function () {
//         cashfree = await load({
//             mode: "sandbox"
//         });
//     }
//     initializeSDK();

//     const doPayment = async () => {
//         let checkoutOptions = {
//             paymentSessionId: "session_UskYzl8eRuveFI6tbov-K9DCv13LJknOxypTdQXMAg2CL7wZbMD9UbvPJBQahKGvBcPmHT7WNelurhZI_zZEFMVU50gf4pV_tE856eFzXmur",
//             redirectTarget: "_self",
//         };
//         cashfree.checkout(checkoutOptions);
//     };

//     return (
//         <div class="row">
//             <p>Click below to open the checkout page in current tab</p>
//             <button type="submit" class="btn btn-primary" id="renderBtn" onClick={doPayment}>
//                 Pay Now
//             </button>
//         </div>
//     );
// }
// export default CartPage;



// import React, { useEffect, useState } from 'react'
// import Layout from '../components/Layout/Layout.js'
// import axios from 'axios'
// import { useCart } from '../context/cart'
// import { useAuth } from '../context/auth'
// import { useNavigate } from 'react-router-dom'
// import toast from 'react-hot-toast';
// import cartImgs from './1413908.png'
// // import paymentImg from './gracy_payment.png'
// import '../styles/CartPage.css'
// // import DropIn from "braintree-web-drop-in-react"

// function CartPage() {
// const [auth, setAuth] = useAuth()
// const [cart, setCart] = useCart()
// const [clientToken, setClientToken] = useState("");
// const [instance, setInstance] = useState(null)
// const [loading, setLoading] = useState(false)
// const navigate = useNavigate()

//     // Initialize cart from localStorage
//     useEffect(() => {
//         const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
//         setCart(savedCart);
//     }, [setCart]);

//     // Ensure items have a default quantity of 1 if not already set
//     useEffect(() => {
//         // Only update if cart items have not been initialized
//         if (cart.every(item => item.quantity === undefined)) {
//             const initializedCart = cart.map(item => ({
//                 ...item,
//                 quantity: item.quantity || 1 // Set default quantity to 1
//             }));
//             setCart(initializedCart);
//             localStorage.setItem('cart', JSON.stringify(initializedCart));
//         }
//     }, [cart, setCart]);

//     // Update quantity of an item
//     const updateQuantity = (id, delta) => {
//         setCart(prevCart => {
//             const updatedCart = prevCart.map(item => {
//                 if (item._id === id) {
//                     // Update quantity, but ensure it does not go below 1
//                     const newQuantity = Math.max(item.quantity + delta, 1);
//                     return { ...item, quantity: newQuantity };
//                 }
//                 return item;
//             });
//             localStorage.setItem('cart', JSON.stringify(updatedCart));
//             return updatedCart;
//         });
//     };

//     //total Price
//     const totalPrice = () => {
//         try {
//             let total = 0;
//             cart?.forEach((item) => { total += item.price * item.quantity })
//             return total.toLocaleString("en-IN", {
//                 style: "currency",
//                 currency: "INR"
//             })
//         } catch (error) {
//             console.log(error)
//             return '₹0';
//         }
//     }

//     // Calculate total amount in paisa for Razorpay (1 INR = 100 paisa)
//     // const totalAmountInPaisa = () => {
//     //     try {
//     //         let total = 0;
//     //         cart?.forEach((item) => { total += item.price * item.quantity; });
//     //         return total * 100; // Convert to paisa
//     //     } catch (error) {
//     //         console.error('Error calculating total amount:', error);
//     //         return 0;
//     //     }
//     // };

//     //delete item
//     const removeCardItem = (pid) => {
//         try {
//             let myCart = cart.filter(item => item._id !== pid);
//             // let index = myCart.findIndex((item) => item._id === pid)
//             // myCart.splice(index, 1)
//             toast.success('Item removed successfully!');
//             setCart(myCart)
//             localStorage.setItem('cart', JSON.stringify(myCart))
//         } catch (error) {
//             console.error(error)
//         }
//     }

//     //get payment gateway token
//     // useEffect(() => {
//     //     const getToken = async () => {
//     //         try {
//     //             const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`);
//     //             setClientToken(data?.clientToken);
//     //             console.log("Client Token:", data?.clientToken); // Log client token
//     //         } catch (error) {
//     //             console.error("Error fetching Braintree client token:", error);
//     //         }
//     //     };

//     //     if (auth?.token) {
//     //         getToken();
//     //     }
//     // }, [auth?.token]);

//     const handlePayment = async () => {
//         try {
//             setLoading(true);
//             const orderData = {
//                 order_id: `order_${Date.now()}`, // Unique order ID
//                 order_amount: totalPrice().replace(/[^0-9]/g, ""), // Convert to number
//                 order_currency: 'INR',
//                 customer_details: {
//                     customer_id: auth?.user?._id,
//                     customer_email: auth?.user?.email,
//                     customer_phone: auth?.user?.phone,
//                 },
//             };

//             const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/cashfree/payment`, orderData);
//             const { paymentLink } = response.data;

//             // Redirect to Cashfree payment page
//             window.location.href = paymentLink;
//         } catch (error) {
//             console.error('Payment Error: ', error);
//             toast.error('Payment failed. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     //handlePayment
//     // const handlePayment = async () => {
//     //     try {
//     //         if (!instance) {
//     //             // If instance is not available, show an error or alert
//     //             toast.error("Payment instance not available.");
//     //             return;
//     //         }
//     //         setLoading(true);
//     //         const { nonce } = await instance.requestPaymentMethod()
//     //         console.log('Nonce:', nonce);
//     //         console.log('Cart:', cart);
//     //         const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment`, {
//     //             nonce, cart
//     //         });

//     //         if (data.ok) {
//     //             localStorage.removeItem('cart')
//     //             setCart([])
//     //             navigate('/dashboard/user/orders')
//     //             toast.success('Payment successful!');
//     //         }
//     //         else {
//     //             toast.error('Payment failed. Please try again.');
//     //         }
//     //     } catch (error) {
//     //         console.log('Payment Error: ', error)
//     //         toast.error('Payment failed. Please try again.');
//     //     }
//     //     finally {
//     //         setLoading(false)
//     //     }
//     // }

//     // razorpay
//     // function loadScript(src) {
//     //     return new Promise((resolve) => {
//     //         const script = document.createElement("script");
//     //         script.src = src;
//     //         script.onload = () => {
//     //             resolve(true);
//     //         };
//     //         script.onerror = () => {
//     //             resolve(false);
//     //         };
//     //         document.body.appendChild(script);
//     //     });
//     // }

//     // async function displayRazorpay() {

//     //     if (!auth?.token) {
//     //         // Redirect to login page if not logged in
//     //         toast.error("Please login to proceed with payment.");
//     //         navigate('/login', { state: '/cart' });
//     //         return; // Stop the function here
//     //     }

//     //     const res = await loadScript(
//     //         "https://checkout.razorpay.com/v1/checkout.js"
//     //     );

//     //     if (!res) {
//     //         alert("Razorpay SDK failed to load. Are you online?");
//     //         return;
//     //     }

//     //     // creating a new order
//     //     try {
//     //         const result = await axios.post("http://localhost:7000/orders", {
//     //             amount: totalAmountInPaisa(),
//     //             currency: 'INR',
//     //             receipt: 'receipt_order_74394',
//     //         });
//     //         if (!result) {
//     //             alert("Server error. Are you online?");
//     //             return;
//     //         }
//     //         // Getting the order details back
//     //         const { amount, id: order_id, currency } = result.data;
//     //         const options = {
//     //             key: "rzp_test_qeuXdVkQfgPPe3", // Enter the Key ID generated from the Dashboard
//     //             amount: amount.toString(),
//     //             currency: currency,
//     //             name: "E-Commerce Platform",
//     //             description: "Test Transaction",
//     //             image: cartImgs,
//     //             order_id: order_id,
//     //             handler: async function (response) {
//     //                 const data = {
//     //                     orderCreationId: order_id,
//     //                     razorpayPaymentId: response.razorpay_payment_id,
//     //                     razorpayOrderId: response.razorpay_order_id,
//     //                     razorpaySignature: response.razorpay_signature,
//     //                 };
//     //                 console.log(data)
//     //             },
//     //             prefill: {
//     //                 name: "Nipun Bakshi",
//     //                 email: "ni***.**********@gmail.com",
//     //                 contact: "+91-98********",
//     //             },
//     //             notes: {
//     //                 address: "Delhi,Office",
//     //             },
//     //             theme: {
//     //                 color: "#61dafb",
//     //             },
//     //         };
//     //         const paymentObject = new window.Razorpay(options);
//     //         paymentObject.open();
//     //     }
//     //     catch (error) {
//     //         console.error('Error during payment process:', error);
//     //         alert('There was an issue with the payment process. Please try again.');
//     //     }
//     // }

//     return (
//         <Layout>
//             <div className='container'>
//                 <div className='row'>
//                     <div className='col-md-12'>
//                         <h1 className='text-center bg-light p-2 mb-1'>
//                             {`Hello ${auth?.token && auth?.user?.name}`}
//                         </h1>
//                         <h4 className='text-center'>
//                             {cart?.length ?
//                                 `You have ${cart?.length} items in your cart ${auth?.token ? "" : "please login to checkout"}` : "Your cart is empty"}
//                         </h4>
//                     </div>
//                 </div>
//                 <div className='row'>
//                     <div className='col-md-8'>
//                         {cart?.map((p) => (
//                             <div className='row mb-2 p-3 card flex-row' key={p._id}>
//                                 <div className='col-md-4'>
//                                     <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} width="100px" />
//                                 </div>
//                                 <div className='col-md-8'>
//                                     <h4>{p.name}</h4>
//                                     <p>{p.description.substring(0, 30)}</p>
//                                     <h4>Price: ₹{p.price}</h4>
//                                     <div>
//                                         <button className='btn btn-secondary quantity-btns' onClick={() => updateQuantity(p._id, -1)}>-</button>
//                                         <span className='mx-2'>{p.quantity}</span>
//                                         <button className='btn btn-secondary quantity-btns' onClick={() => updateQuantity(p._id, 1)}>+</button>
//                                     </div>
//                                     <button className='btn btn-danger remove-btn' onClick={() => removeCardItem(p._id)}>Remove</button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                     <div className='col-md-4 text-center'>
//                         <h2>Cart Summary</h2>
//                         <p>Total | Checkout | Payment</p>
//                         <hr />
//                         <h4>Total: {totalPrice()}</h4>
//                         <button className='btn btn-primary' onClick={handlePayment} disabled={loading}>
//                             {loading ? "Processing..." : "Make Payment"}
//                         </button>
//                         {/* <button onClick={displayRazorpay} className='place-order-button App-link'>
//                             Pay {totalPrice()}
//                         </button> */}

//                         {auth?.user?.address ? (
//                             <>
//                                 <div className='mb-3'>
//                                     <h4>Current Address</h4>
//                                     <h5>{auth?.user?.address}</h5>
//                                     <button className='btn btn-outline-warning'
//                                         onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
//                                 </div>
//                             </>
//                         ) : (
//                             <div className='mb-3'>
//                                 {
//                                     auth?.token ? (
//                                         <button className='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
//                                     ) : (
//                                         <button className='btn btn-outline-warning' onClick={() => navigate('/login', {
//                                             state: '/cart',
//                                         })}>Please Login to checkout</button>
//                                     )
//                                 }
//                             </div>
//                         )}

//                         {/* <div className='mt-2'>
//                             {
//                                 !clientToken || !cart?.length ? ("") : (
//                                     <>
//                                         <DropIn options={{
//                                             authorization: clientToken,
//                                             paypal: {
//                                                 flow: 'vault'
//                                             }
//                                         }}
//                                             onInstance={instance => {
//                                                 console.log("Braintree instance:", instance)
//                                                 setInstance(instance)
//                                             }}
//                                         />
//                                         <button className='btn btn-primary' onClick={handlePayment}
//                                             disabled={loading || !instance || !auth?.user?.address}
//                                         >
//                                             {loading ? "Processing..." : "Make Payment"}
//                                         </button>
//                                     </>
//                                 )
//                             }
//                         </div> */}

//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     )
// }

// export default CartPage