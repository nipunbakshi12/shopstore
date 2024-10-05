import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Select } from 'antd'
const { Option } = Select

function CreateProduct() {
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [quantity, setQuantity] = useState("")
    const [photo, setPhoto] = useState("")
    const [shipping, setShipping] = useState("")

    //get all categories
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

    //create product function
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData()
            productData.append('name', name)
            productData.append('description', description)
            productData.append('price', price)
            productData.append('photo', photo)
            productData.append('category', category)
            productData.append('quantity', quantity)
            // productdata.append('shipping', shipping)
            const { data } = axios.post(`${process.env.REACT_APP_API}/api/v1/product/create-product`, productData)
            if (data?.success) {
                toast.error("Error in creating product")
            }
            else {
                toast.success("Product created successfully")
                navigate('/dashboard/admin/products')
            }
        } catch (error) {
            console.log(error)
            toast.error("Error in creating product")
        }
    }


    return (
        <Layout title={"Dashboard - Create Product"}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h1>Create Product</h1>
                        <div className='m-1 w-full md:w-3/4'>
                            <Select bordered={false} placeholder="Select a category" size='large' showSearch className='form-select mb-3 w-75' onChange={(value) => {
                                setCategory(value)
                            }}>
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
                                {photo && (
                                    <div>
                                        <img src={URL.createObjectURL(photo)} height={"300px"} className='img img-responsive' />
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
                                    }}>
                                    <Option value="0">No</Option>
                                    <Option value="1">Yes</Option>
                                </Select>
                            </div>
                            <div className='mb-3 col-md-9'>
                                <button className='btn btn-primary' onClick={handleCreate}>CREATE PRODUCT</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct