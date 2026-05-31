import axios from 'axios'

//alamat TMS API yang sudah live di railway
//semua request dikirim ke sini
const API_URL = 'https://tms-api-production-1ff8.up.railway.app'

const api = axios.create({
    baseURL : API_URL, //alamat default untuk api
    headers : {
        'Content-Type' : 'application/json' // isi paket akan berupa format json
    }
})


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})


export default api