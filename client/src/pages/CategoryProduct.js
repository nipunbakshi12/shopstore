import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'



function CategoryProduct() {
    const params = useParams()
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])

    const getproductByCat = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`)
            setProducts(data?.products)
            setCategory(data?.category)
        } catch (error) {
            console.log(error)

        }
    }

    useEffect(() => {
        if (params?.slug) getproductByCat()
    }, [params.slug])

    return (
        <Layout>
            <div className='container mt-3'>
                <h1 className='text-center'>Category - {category?.name}</h1>
                <h3 className='text-center'>{products?.length} result found</h3>
                <div className='row'>
                    <div className='d-flex flex-wrap'>
                        {products?.map(p => (
                            <div className="card m-2" style={{ width: '18rem' }}>
                                <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description}</p>
                                    <p className="card-text">₹{p.price}</p>
                                    <button className='btn btn-primary ms-1' onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                    <button className='btn btn-secondary ms-1'>ADD TO CART</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CategoryProduct