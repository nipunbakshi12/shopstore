import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import toast from 'react-hot-toast';
import axios from 'axios'



function Profile() {
    //context
    const [auth, setAuth] = useAuth()

    //state
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")

    //get user data
    useEffect(() => {
        const { email, name, phone, address } = auth.user
        setName(name)
        setEmail(email)
        setPhone(phone)
        setAddress(address)
    }, [auth?.user])

    //form function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/profile`, {
                name,
                email,
                password,
                address,
                phone
            })
            if (data?.error) {
                toast.error(data.error)
            }
            else {
                setAuth({ ...auth, user: data?.updatedUser })
                let ls = localStorage.getItem("auth")
                ls = JSON.parse(ls)
                ls.user = data.updatedUser
                localStorage.setItem('auth', JSON.stringify(ls))
                toast.success("Profile Updated Successfully")
            }
        } catch (error) {
            console.log(error)
            toast.error("Registration Failed")
        }
    }

    return (
        <Layout title={"Your Profile"}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <UserMenu />
                    </div>
                    <div className='col-md-9'>
                        <div className='form-container'>
                            <form onSubmit={handleSubmit}>
                                <h4 className='title'>User Profile</h4>
                                <div class="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="exampleInputName"
                                        placeholder="Enter Your Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <div class="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="exampleInputEmail"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} disabled />
                                </div>

                                <div class="mb-3">
                                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>

                                <div class="mb-3">
                                    <input type="text" className="form-control" id="exampleInputAddress" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                                </div>

                                <div class="mb-3">
                                    <input type="text" className="form-control" id="exampleInputMobile" placeholder="Mobile No." value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>

                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile