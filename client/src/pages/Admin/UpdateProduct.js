import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Select } from 'antd'
const { Option } = Select

function UpdateProduct() {
    const navigate = useNavigate()
    const params = useParams()
    const [categories, setCategories] = useState([])
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [quantity, setQuantity] = useState("")
    const [photo, setPhoto] = useState(null)
    const [shipping, setShipping] = useState("")
    const [id, setId] = useState("")

    // Get single product
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`)
            setName(data?.product.name)
            setId(data?.product._id)
            setCategory(data?.product.category._id)  // Set category ID
            setDescription(data?.product.description)
            setPrice(data?.product.price)
            setQuantity(data?.product.quantity)
            setShipping(data?.product.shipping ? "1" : "0") // Set shipping value as "1" for true and "0" for false
        } catch (error) {
            console.log(error)
            toast.error("Error in getting product")
        }
    }
    useEffect(() => {
        getSingleProduct()
        // eslint-disable-next-line
    }, [])

    // Get all categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`)
            if (data?.success) {
                setCategories(data?.category)
            } else {
                toast.error("Error in getting categories")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error in getting categories")
        }
    }
    useEffect(() => {
        getAllCategory()
    }, [])

    // Update product function
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData()
            productData.append('name', name)
            productData.append('description', description)
            productData.append('price', price)
            if (photo) {
                productData.append('photo', photo)
            }
            productData.append('category', category)
            productData.append('quantity', quantity)
            productData.append('shipping', shipping === "1") // Convert shipping to boolean

            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`, productData)
            if (data?.success) {
                toast.success("Product updated successfully")
                navigate('/dashboard/admin/products')
            } else {
                toast.error("Error in updating product")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error in updating product")
        }
    }

    //delete product
    const handleDelete = async () => {
        try {
            let answer = window.prompt("Are you sure you want to delete this product ? ")
            if (!answer) return;
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`)
            toast.success("Product Deleted Successfully")
            navigate('/dashboard/admin/products')
        } catch (error) {
            console.log(error)
            toast.error("Error in deleting product")
        }
    }

    return (
        <Layout title={"Dashboard - Update Product"}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h1>Update Product</h1>
                        <div className='m-1 w-full md:w-3/4'>
                            <Select
                                bordered={false}
                                placeholder="Select a category"
                                size='large'
                                showSearch
                                className='form-select mb-3 w-75'
                                onChange={(value) => {
                                    setCategory(value)
                                }}
                                value={category}  // Ensure value is category ID
                            >
                                {categories.map((c) => (
                                    <Option key={c._id} value={c._id}>{c.name}</Option>
                                ))}
                            </Select>
                            {/* Photo Button */}
                            <div className='mb-3'>
                                <label className='btn btn-outline-secondary col-md-9'>
                                    {photo ? photo.name : "Upload Photo"}
                                    <input type='file' name='photo' accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                </label>
                            </div>

                            {/* Preview */}
                            <div className='mb-3'>
                                {photo ? (
                                    <div>
                                        <img src={URL.createObjectURL(photo)} height={"300px"} className='img img-responsive' />
                                    </div>
                                ) : (
                                    <div>
                                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${id}`} height={"300px"} className='img img-responsive' />
                                    </div>
                                )}
                            </div>

                            {/* Name */}
                            <div className='mb-3 col-md-9'>
                                <input type='text' className='form-control' placeholder='Product Name' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            {/* Description */}
                            <div className='mb-3 col-md-9'>
                                <textarea type="text" value={description} className='form-control' placeholder='Description' onChange={(e) => setDescription(e.target.value)} />
                            </div>

                            {/* Price */}
                            <div className='mb-3 col-md-9'>
                                <input type='number' className='form-control' placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>

                            {/* Quantity */}
                            <div className='mb-3 col-md-9'>
                                <input type='number' className='form-control' placeholder='Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                            </div>

                            {/* Shipping */}
                            <div className='mb-3 col-md-9'>
                                <Select
                                    bordered={false}
                                    placeholder="Shipping"
                                    size='large'
                                    showSearch
                                    className='form-select mb-3'
                                    onChange={(value) => {
                                        setShipping(value)
                                    }}
                                    value={shipping}  // Ensure value is correctly set
                                >
                                    <Option value="0">No</Option>
                                    <Option value="1">Yes</Option>
                                </Select>
                            </div>
                            <div className='mb-3 col-md-9'>
                                <button className='btn btn-primary' onClick={handleUpdate}>UPDATE PRODUCT</button>
                            </div>
                            <div className='mb-3 col-md-9'>
                                <button className='btn btn-danger' onClick={handleDelete}>DELETE PRODUCT</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProduct
