import { useParams } from "react-router-dom"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const PeopleResults = () => {
    const { search, id } = useParams()
    const [results, setResults] = useState({})
    const [homeworld, setHomewrold] = useState({})
    const [chars, setChars] = useState([])
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        // get wanted item object
        axios.get(`https://swapi.dev/api/${search}/${id}`)
            .then(response => {
                setError(false)
                setResults(response.data)

                // if obj is person 
                if (search == 'people')
                    // get homeworld obj that related to the selected obj
                    axios.get(response.data.homeworld)
                        .then(response => {
                            setError(false)
                            setIsLoading(false)
                            setHomewrold(response.data)
                        })
                        .catch(() => console.log('planets here'))
                
                // if obj is film
                else if (search == 'films') {
                    let urls = []

                    // get url for each char in the film
                    for (let i of response.data.characters) {
                        urls.push(axios.get(i));
                    }

                    // get all char objs 
                    axios.all(urls)
                        .then(response => {
                            setIsLoading(false)
                            setChars(response)
                        })
                        .catch(() => console.log('search for people is not successful'))
                }


            })
            .catch(() => setError(true))

        setIsLoading(true)

    }, [search, id])

    // get planet id to pass it tp homeworld link
    if (results.homeworld) {
        var location1 = results.homeworld.split('/')
        location1 = location1[location1.length - 2]
    }

    return (
        <div className="container w-50 mt-4">
            {error && <div>These aren't the droids you're looking for
                <img src="https://sm.ign.com/ign_mear/news/o/obi-wan-ke/obi-wan-kenobi-star-wars-series-release-date-announced_2yrk.jpg" height="300px" /></div>}

            <div>
                {!error && search == 'people' &&
                    <>
                        <h3>{results.name}</h3>
                        <ul className="d-flex flex-column align-items-start">
                            <li><b>Height: </b>{results.height}</li>
                            <li><b>Mass: </b>{results.mass}</li>
                            <li><b>Hair color: </b>{results.hair_color}</li>
                            <li><b>Eye color: </b>{results.eye_color}</li>
                            <li><b>HomeWorld: </b>{isLoading ? "Loading..." : <Link to={location => `/planets/${location1 || null}`}>{homeworld.name} </Link>}</li>

                        </ul>
                    </>}

                {!error && search == 'planets' &&
                    <>
                        <h3>{results.name}</h3>
                        <ul style={{ textAlign: 'left' }} className="d-flex flex-column align-items-start">
                            <li><b>Climate: </b>{results.climate}</li>
                            <li><b>Terrain: </b>{results.terrain}</li>
                            <li><b>Surface Water: </b>{results.surface_water}</li>
                            <li><b>Population: </b>{results.population}</li>
                        </ul>
                    </>
                }

                {!error && search == 'films' &&
                    <>
                        <h3>{results.name}</h3>
                        <ul style={{ textAlign: 'left' }} className="d-flex flex-column align-items-start">
                            <li><b>Title: </b>{results.title}</li>
                            <li><b>Producer: </b>{results.producer}</li>
                            <li><b>Director: </b>{results.director}</li>
                            <li><b >Characters: </b>
                                {isLoading ? "Loading..." :
                                    <ul>
                                        {chars.map((char, index) => <li key={index}>{char.data.name}</li>)}
                                    </ul>
                                }
                            </li>
                        </ul>
                    </>
                }


            </div>

        </div>
    )
}

export default PeopleResults