import axios from "axios"
import baseURL from "./baseUrl"

const axiosInstance = axios.create({
    baseURL,
    timeout: 1000,
})

apiOptions = {
    data: object,
    method: 'get' | 'put' | 'post' | 'delete',
    params: object
}

export const api = async (url, options) => {
    const { data, method = 'get', params } = options

    const acccessToken = 'ACCESS_TOKEN'

    try {
        const response = await axiosInstance.request({
            data,
            headers: {
                'Authorization' : `Bearer ${acccessToken}`
            },
            method,
            params,
            responseType: 'json',
            url,
        })

        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.errors)
    }
}

export default api