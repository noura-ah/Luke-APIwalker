import { useEffect, useState } from "react"
import axios from 'axios'

import { useHistory } from "react-router-dom"


const Search = () => {
    const [searchWord, setSearchWord] = useState({})
    const [searchId, setSearchId] = useState([])
    const [formSub, setFormSub] = useState({
        search: '',
        id: 'null'
    })

    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory()

    useEffect(() => {
        // fetch types of search
        axios.get(`https://swapi.dev/api`)
            .then(response => {
                setSearchWord(response.data)
            })
    }, [])

    useEffect(() => {
        async function fetchMetaData() {

            // return the count of ids in specific type of search (people or planets or films)
            const response = await fetch(`https://swapi.dev/api/${formSub.search}/`)
                .then(response => response.json(response))
                .then(response => {
                    return response.count
                })

            // collect ids from pages here
            let ids = []
            setIsLoading(true)
            // return arr of all pages objs
            if (response) {
                const responses = await Promise.all(
                    Array.from(
                        Array(Math.ceil(response / 10)),
                        (_, i) => fetch(`https://swapi.dev/api/${formSub.search}/?page=${i + 1}`)
                            .then(response => response.json(response))
                            .then(response => {
                                ids.push(...[...response.results])
                            }).catch("no ids to fetch")
                    )
                );
                setIsLoading(false)
                setSearchId(ids)
            }


        }
        fetchMetaData()
    }, [formSub.search])

    const handleChange = (e) => {
        setFormSub({ ...formSub, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        history.push(`/${formSub.search}/${formSub.id}`)
        // return form values to default
        setFormSub({ search: '', id: 'null' })
        // set ids to empty
        setSearchId([])
    }
    return (
        <div className="container w-50 p-3">
            <form className="form" onSubmit={handleSubmit}>
                <div className="d-flex my-3 justify-content-around align-items-center">
                    <div className="d-flex align-items-center w-50">
                        <label className="form-label w-100">Search for :</label>
                        <select className="form-select" name="search" value={formSub.search} onChange={handleChange}>
                            <option key="none" disabled defaultValue value='' name="search">--select--</option>
                            {Object.keys(searchWord).slice(0, 3).map((word, index) =>
                                <option key={word} name="search" value={word}>{word}</option>)}
                        </select>
                    </div>
                    <div className="d-flex align-items-center w-50">
                        <label className="form-label w-100" >ID :</label>
                        <select className="form-select" name="id" value={formSub.id} onChange={handleChange}>
                            <option key="none" disabled defaultValue value='null' name="id">--select--</option>

                            {formSub.search && isLoading ? <option key="" disabled value='' name="id">Loading...</option> : searchId.map((id, index) =>
                                <option key={index} name="id" value={index + 1}>{index + 1}</option>)}
                        </select>
                    </div>

                </div>
                <div className="mt-3">
                    <input className="btn btn-dark" value="Search" type="submit" />
                </div>
            </form>
        </div>
    )
}

export default Search