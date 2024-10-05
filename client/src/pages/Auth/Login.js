import React, { useEffect, useState } from 'react'
import Layout from './../../components/Layout/Layout'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast';
import '../../../src/styles/AuthStyles.css'
import { useAuth } from '../../context/auth'

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [auth, setAuth] = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    //To check whether the Toaster is working or not
    useEffect(() => {
        toast.success("Toaster is working!")
    }, [])

    //form function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, { email, password })
            if (res.data.success) {
                toast.success(res.data.message)
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                })
                localStorage.setItem('auth', JSON.stringify(res.data))

                //agar user login se pehle dashboard page ko access karna chah raha tha toh login ke baad direct dashboard pe hi aayega na ki home pe jaayega
                navigate(location.state || '/')
            }
            else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log("Error details:", error.response ? error.response.data : error.message);
            toast.error("Login Failed")
        }
    }

    return (
        <Layout title="Login - Ecommerce App">
            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <h4 className='title'>LOGIN FORM</h4>

                    <div class="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="exampleInputEmail"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div class="mb-3">
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <div className='mb-3'>
                        <button type="button" className="btn btn-primary" onClick={() => { navigate('/forgot-password') }}>Forgot Password</button>
                    </div>

                    <button type="submit" className="btn btn-primary">LOGIN</button>
                </form>
            </div>
        </Layout>
    )
}

export default Login