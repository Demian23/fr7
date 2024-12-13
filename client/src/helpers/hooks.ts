import { useState, useEffect } from 'react'
import { Fr7Error } from './errors'

export const useAsyncData = (dataRetriver: any) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Fr7Error | null>(null)
    useEffect(() => {
        const getter = async () => {
            try {
                setLoading(true)
                const res = await dataRetriver()
                setData(res)
            } catch (error) {
                if (error instanceof Fr7Error) setError(error)
                else setError(new Fr7Error(error as string, 0))
            } finally {
                setLoading(false)
            }
        }
        getter()
    }, [dataRetriver])
    return { data, loading, error }
}
