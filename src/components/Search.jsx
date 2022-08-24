import { useEffect, useState } from "react"
import axios from 'axios'

import { useHistory } from "react-router-dom"


const Search = () => {
    const [searchWord, setSearchWord] = useState({})
    const [searchId, setSearchId] = useState([])
    const [formSub, setFormSub] = useState({
        search: 'people',
        id: 1
    })

    const history = useHistory()
    const [errors, setErrors] = useState({
        search: '',
        id: ''
    })


    useEffect(() => {
        axios.get(`https://swapi.dev/api`)
            .then(response => {setSearchWord(response.data)
                setFormSub({...formSub,search : Object.keys(response.data)[0]})
            })
    }, [])

    useEffect(() => {
        axios.get(`https://swapi.dev/api/${formSub.search}`)
            .then(response => {
                setSearchId(response.data.results)
                console.log(response.data.results)
                setFormSub({ ...formSub, id: formSub.id || 1 })
            })
            .catch(()=> console.log("error"))
    },[formSub.search])

    const handleChange = (e) => {
        setFormSub({ ...formSub, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        history.push(`/${formSub.search}/${formSub.id}`)
    }
    return (
        <div className="container w-50 p-3">
            <form className="form" onSubmit={handleSubmit}>
                <div className="d-flex my-3 justify-content-around align-items-center">
                    <div className="d-flex align-items-center w-50">
                        <label className="form-label w-100">Search for :</label>
                        <select className="form-select" name="search" value={formSub.search} onChange={handleChange}>
                            {Object.keys(searchWord).slice(0,3).map((word, index) =>
                                <option key={word} name="search" value={word}>{word}</option>)}
                        </select>
                    </div>
                    <div className="d-flex align-items-center w-50">
                        <label className="form-label w-100" >ID :</label>
                        {/* <input className="form-control" name="id" value={formSub.id} onChange={handleChange} /> */}
                        <select className="form-select" name="id" value={formSub.id} onChange={handleChange}>
                            {searchId? searchId.map((id, index) =>
                                <option key={index} name="id" value={index+1}>{index+1}</option>):''}
                        </select>
                    </div>

                </div>
                <div style={{ color: 'red' }}>{errors.id}</div>
                <div className="mt-3">
                    <input className="btn btn-dark" value="Search" type="submit" />
                </div>
            </form>
        </div>
    )
}

export default Search