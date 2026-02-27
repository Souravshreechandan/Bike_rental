import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from "react-hot-toast";
import {useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext();
 
export const AppProvider = ({children})=>{

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY 
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [user, setUser] = useState(null)
    const [isOwner,setIsOwner] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [pickupDate, setPickupDate] = useState('')
    const [returnDate, setReturnDate] = useState('')
    
    const [bikes, setBikes] = useState([])

    //function to check if user is iogged in
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/data');
        if (data.success) {
        //  Blocked user check
        if (data.user.isBlocked) {
            toast.error("Your account has been blocked. Logging out...");
            logout(); // logs out and navigates to login
            return;
        }

        // Save user state
        setUser(data.user);
        setIsOwner(data.user.role === 'owner');

        // Conditional redirect
        if (data.user.role === 'owner') {
            navigate('/owner');
        } else {
            navigate('/');
        }

        } else {
        navigate('/'); 
        }

    } catch (error) {
        toast.error(error.message);
    }
};

    //function to fetch all bike from the server
    const fetchBikes = async()=>{
        try {
            const {data} = await axios.get('/api/user/bikes')
            data.success ? setBikes(data.bikes) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }
    // function to log out the user
    const logout = ()=>{
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization'] = ""
        toast.success("You have been logged out")
        navigate("/login");
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
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = token
            fetchUser()
            fetchBikes();
        }
    },[token])
     
    const value ={
        navigate, currency, axios, user,setUser,
        token, setToken, isOwner, setIsOwner, fetchUser, showLogin,
        setShowLogin, logout, fetchBikes, bikes, setBikes, pickupDate,
        setPickupDate, returnDate,setReturnDate,
    }

    return(
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
    )
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}