import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function ProductDetails() {
    const params = useParams()
    const [product, setProduct] = useState({})
    const [relatedProduct, setRelatedProduct] = useState([])

    //get product
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`)
            setProduct(data?.product)
            getSimilarProduct(data?.product._id, data?.product.category._id);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (params?.slug) getProduct()
    }, [params.slug])


    //get similar product
    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`)
            setRelatedProduct(data?.products)
        } catch (error) {
            console.log(error)
        }
    }
    // useEffect(() => {
    //     if (product.category?._id) getSimilarProduct()
    // }, [product.category?._id])




    return (
        <Layout>

            <div className='row container mt-2'>
                <div className='col-md-6'>
                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`} className="card-img-top" alt={product.name} style={{ height: "260px", width: "250px" }} />
                </div>
                <div className='col-md-6'>
                    <h1 className='text-center'>Product Details</h1>
                    <h4>Name: {product.name}</h4>
                    <h6>Description: {product.description}</h6>
                    <h6>Price: ₹{product.price}</h6>
                    <h6>Category: {product?.category?.name}</h6>
                    <button className='btn btn-secondary ms-1'>ADD TO CART</button>
                </div>
            </div>

            <hr></hr>

            <div className='row container'>
                <h5>Similar Products</h5>
                {relatedProduct.length < 1 && (
                    <p className='text-center'>No Similar Product found</p>
                )}
                <div className='d-flex flex-wrap'>
                    {relatedProduct?.map(p => (
                        <div className="card m-2" style={{ width: '18rem' }}>
                            <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                            <div className="card-body">
                                <h5 className="card-title">{p.name}</h5>
                                <p className="card-text">{p.description}</p>
                                <p className="card-text">₹{p.price}</p>
                                <button className='btn btn-secondary ms-1'>ADD TO CART</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>











            {/* Development Testing */}
            {/* <h1>Product Details</h1>
            {JSON.stringify(product, null, 4)} */}
        </Layout>
    )
}

export default ProductDetails