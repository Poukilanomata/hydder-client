import params from "../variables"

import Cookies from 'js-cookie'
import axios from "axios"

import store from "../app/store"
import { initUser, changeStatus, changeLoadingStatus } from "../app/auth"
import { toast } from 'react-toastify'


axios.defaults.withCredentials = true


//Request manager
export function handleResponse(res){
    let data  = res.data
    if(data.status === 'ok'){
        return data.data
    } else {
        console.log(data)
        return false
    }
}

export function getPP(pp) {
    if(pp === 'false') {
        return params.server+'/regular/default/profile_picture.jpg'
    } else {
      return params.server+'/regular/image/account/full/'+pp
    }
}
 
export function get_user(dispatch){
    
    let connected = Cookies.get('connected')

    if(connected && !store.getState().auth.isLoaded && !store.getState().isLoadding){
        store.dispatch(changeLoadingStatus(true))
        axios.post(params.server+"/auth/fetch_user").then(
            (response) => {
                if(response.data.success){
                    store.dispatch(changeStatus(true))
                    store.dispatch(initUser(response.data.user))
                    store.dispatch(changeLoadingStatus(false))
                    return true
                }else{
                  return false
                }
            }
        )
    }
    return false
}

export function toastAll(e){
    for (const [key, value] of Object.entries(e)) {

        value.forEach(element => {

            toast.error(element, {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        })
    }
    
}