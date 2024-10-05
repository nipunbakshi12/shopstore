import React from 'react'
import { useSearch } from '../../context/search'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function SearchInput() {
    const [values, setValues] = useSearch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/search/${values.keyword}`)
            setValues({ ...values, result: data })
            navigate("/search");
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <form className="d-flex search-form" onSubmit={handleSubmit}>
            <input
                className="form-control me-2 search-input"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={values.keyword}
                onChange={(e) => setValues({ ...values, keyword: e.target.value })}
            />
            <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
    )
}

export default SearchInput