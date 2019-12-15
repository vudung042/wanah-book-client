import {getEnv} from '../helper/env/getEnv'
import {getCookie} from './storage/cookies'
import axios from 'axios'
import {COOKIE_KEY} from './storage/sessionStorage'
import {logout} from './auth/auth'
import Paths from '../routes/Paths'

const baseUrl = getEnv("BACKEND_URL")
console.log(baseUrl)
export const createApiRequest = async ({ url, method, data, params }) => {
    try {
        const { data: resp } = await axios({
            method,
            url: `${baseUrl}${url}`,
            data,
            params,
        })
        console.log(`${baseUrl}`)
        return {
            success: true,
            data: resp,
        }
    } catch (e) {
        const { response } = e
        console.log(response)
        const message = response ? response.data.message : e.message || e

        return {
            success: false,
            data: message,
        }
    }
}
 
export const createAuthApiRequest = async ({ url, method, data, params, isFormData , props}) => {
    try {
        const token = getCookie(COOKIE_KEY.TOKEN)
        if (token) {
            const { data: resp } = await axios({
                method,
                url: `${baseUrl}${url}`,
                data,
                params,
                headers: {
                    'x-access-token': `${token}`,
                    ...isFormData && {'Content-Type': 'multipart/form-data'},
                }
            })
    
            return {
                success: true,
                data: resp,
            }
        }
    } catch (e) {
        const { response } = e
        console.log(e)
        const errorMessage = response ? response.statusText : e.message || e
        if (response.status && [401,403].includes(response.status)) {
            logout()
            window.location.href = Paths.Login
        }

        return {
            success: false,
            errorMessage,
        }
    }
}


