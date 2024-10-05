import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import '../../../src/styles/AuthStyles.css'

function ForgotPassword() {

    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [answer, setAnswer] = useState("")
    const navigate = useNavigate()

    //To check whether the Toaster is working or not
    useEffect(() => {
        toast.success("Toaster is working!")
    }, [])

    //form function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, { email, newPassword, answer })

            console.log(res)

            if (res.data.success) {
                toast.success(res.data.message)

                //agar user login se pehle dashboard page ko access karna chah raha tha toh login ke baad direct dashboard pe hi aayega na ki home pe jaayega
                navigate('/login')
            }
            else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log("Error details:", error.response ? error.response.data : error.message);
            toast.error(error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : "Something went wrong. Please try again later.")
        }
    }

    return (
        <Layout title={'Forgot Password - Ecommerce App'}>
            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <h4 className='title'>Reset Password FORM</h4>

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
                        <input
                            type="text"
                            className="form-control"
                            id="exampleInputSecretCode"
                            placeholder="What is your secret code to reset password"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)} required />
                    </div>

                    <div class="mb-3">
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Enter your new Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>

                    <button type="submit" className="btn btn-primary">RESET</button>
                </form>
            </div>
        </Layout>
    )
}

export default ForgotPassword