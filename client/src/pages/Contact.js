import React from 'react'
import Layout from '../components/Layout/Layout'
// import { CiMail } from "react-icons/ci";

const Contact = () => {
    return (
        <Layout title={'Contact us - Ecommerece App'}>
            <div className='row contactus'>
                <div className='col-md-6'>
                    <img src='/images/contactus.jpg' alt='contact us' style={{ width: "100%" }} />
                </div>
                <div className='col-md-4'>
                    <h1 className='bg-dark p-2 text-white text-center'>CONTACT US</h1>
                    <p className='text-justify mt-2'>
                        any query and info about product feel free to call anytime we are available 24*7
                    </p>
                    <p className='mt-3'>
                        {/* <CiMail /> : shipshopstoreemails@gmail.com */}
                    </p>
                    {/* <p className='mt-3'>
                        <IoMdCall /> : 012-3456789
                    </p>
                    <p className='mt-3'>
                        <FiHeadphones /> : 1800-309-0012
                    </p> */}
                </div>
            </div>
        </Layout>
    )
}

export default Contact