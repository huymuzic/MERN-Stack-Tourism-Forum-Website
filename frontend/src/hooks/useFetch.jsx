import {useState, useEffect} from 'react';
import {pushError} from '../components/Toast';
import { set } from 'mongoose';

const useFetch = (url) => {

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true)
        
            try {
                const res = await fetch(url)

                if(!res.ok) {
                    setError('Failed to fetch data')
                    pushError('Failed to fetch data')
                }
                const result = await res.json()
                setData(result.data)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        
        };

        fetchData();

    }, [url])

    return {
        data,
        error,
        loading,
    }

}

export default useFetch;