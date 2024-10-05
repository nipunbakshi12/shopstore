import React, { useState, useEffect } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

function Products() {
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1) // Current page state
    const [totalPages, setTotalPages] = useState(1) // Total pages state


    //getAllProducts
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`, {
                params: { page, limit: 12 }
            })
            console.log(data)
            setProducts(data?.products)
            setTotalPages(data?.totalPages)
        } catch (error) {
            console.log(error)
            toast.error('Error fetching products')
        }
    }

    useEffect(() => {
        getAllProducts()
    }, [page])

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1)
        }
    }

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }


    return (
        <Layout>
            <div className='row container mt-3'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9'>
                    <h1 className='text-center'>All Products List</h1>
                    <div className='row'>
                        {products?.map(p => (
                            <div key={p._id} className='col-md-4 mb-3'>
                                <Link className='product-link' to={`/dashboard/admin/product/${p.slug}`}>

                                    <div className="card m-2" style={{ width: '18rem' }}>
                                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{p.name}</h5>
                                            <p className="card-text">{p.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className='flex justify-center mt-3 mb-3'>
                        <div className='text-center space-x-6'>
                            <button
                                onClick={handlePreviousPage}
                                disabled={page === 1}
                                className='px-4 py-2 bg-blue-500 text-dark rounded-lg hover:bg-blue-600 disabled:opacity-50'
                            >
                                Previous
                            </button>
                            <span className='px-4 text-gray-700'>
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                                className='px-4 py-2 bg-green-500 text-dark rounded-lg hover:bg-green-600 disabled:opacity-50'
                            >
                                Next
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        </Layout>
    )
}

export default Products