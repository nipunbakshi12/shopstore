import React, { useEffect, useState } from 'react'
import Layout from './../../components/Layout/Layout'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import '../../../src/styles/AuthStyles.css'

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [address, setAddress] = useState("")
    const [answer, setAnswer] = useState("")
    const [phone, setPhone] = useState("")
    const navigate = useNavigate()

    //To check whether the Toaster is working or not
    useEffect(() => {
        toast.success("Toaster is working!")
    }, [])

    //form function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, {
                name,
                email,
                password,
                address,
                answer,
                phone
            })
            if (res.data.success) {
                toast.success(res.data.message)
                navigate('/login')
            }
            else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Registration Failed")
        }
    }

    return (
        <Layout title="Register - Ecommerce App">
            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <h4 className='title'>REGISTERATION FORM</h4>
                    <div class="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="exampleInputName"
                            placeholder="Enter Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)} required
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
                            onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div class="mb-3">
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <div class="mb-3">
                        <input type="text" className="form-control" id="exampleInputAddress" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>

                    <div class="mb-3">
                        <input type="text" className="form-control" id="exampleInputMobile" placeholder="Mobile No." value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>

                    <div class="mb-3">
                        <select className="form-control" id="exampleInputQuestion" value={answer} onChange={(e) => setAnswer(e.target.value)} required>
                            <option value="" disabled>Select a security question</option>
                            <option value="stuffed_animal">What was the name of your first stuffed animal?</option>
                            <option value="childhood_pet">What was the name of your favorite childhood pet?</option>
                            <option value="childhood_hero">Who was your childhood hero?</option>
                            <option value="first_concert">What was the first concert you attended?</option>
                            <option value="first_car">What is the make and model of your first car?</option>
                        </select>
                    </div>


                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </Layout>
    )
}

export default Register