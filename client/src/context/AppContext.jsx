import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from "react-hot-toast";
import { data, useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext();
 
export const AppProvider = ({Children})=>{

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY 
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [isOwner,setIsOwner] = useState(false)
    const [showing, setShowing] = useState(false)
    const [pickupDate, setPickupDate] = useState('')
    const [returnDate, setReturnDate] = useState('')
    
    const [bike, setBikes] = useState([])

    //function to check if user is iogged in
    const fetchUser = async()=>{
        try {
            const {data} = await axios.get('/api/user/data')
            if(data.success){
                setUser(data.user)
                setIsOwner(data.user.role === 'owner')
            }else{
                navigate('/')
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }
    //function to fetch all bike from the server
    const fetchBikes = async()=>{
        try {
            const {data} = await axios.get('/api/user/bikes')
            data.success ? setBikes(data.bike) : toast.error(data.message)
        } catch (error) {
            toast.error(data.message)
        }
    }
    // function to log out the user
    const logout = ()=>{
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization'] = ''
        toast.success("you have been logged out")
    }

    //useEffect to retrieve the token from localStorage
    useEffect(()=>{
        const token = localStorage.getItem('token')
        setToken(token)
        fetchBikes()
    },[])

    //useEffect to fetch user data when token is available
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['Authorization'] = `${token}`
            fetchUser()
        }
    },[token])
     
    const value ={
        navigate, currency, axios, user,setUser,
        token,setToken,isOwner,setIsOwner,fetchUser,
    }

    return(
    <AppContext.Provider value={value}>
        {Children}
    </AppContext.Provider>
    )
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}