import React, { useState, useEffect } from 'react'
import './Spinner.css'
import { useNavigate, useLocation } from 'react-router-dom'

function Spinner({ path = "login" }) {
    const [count, setCount] = useState(3)
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue)
        }, 1000)
        count === 0 && navigate(`/${path}`, {
            //agar user login se pehle dashboard page ko access karna chah raha tha toh login ke baad direct dashboard pe hi aayega na ki home pe jaayega
            state: location.pathname
        })
        return () => clearInterval(interval)

    }, [count, navigate, location, path])
    return (
        <div className="loader">
            <h1 className='Text-center mb-2'>redirecting to you in {count} seconds</h1>
            <div className="justify-content-center jimu-primary-loading" />
        </div>

    )
}

export default Spinner