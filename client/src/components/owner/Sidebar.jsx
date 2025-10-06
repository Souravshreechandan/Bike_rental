import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Sidebar = () => {
    const {user, axios, fetchUser} = useAppContext()
    const location = useLocation()
    const [image, setImage] = useState('')
    const [collapsed, setCollapsed] = useState(false); // Sidebar toggle state

    const updateImage = async()=>{
       try {
        const formData = new FormData()
        formData.append('image', image)

        const {data} = await axios.post('/api/owner/update-image', formData)
        if (data.success) {
            fetchUser()
            toast.success(data.message)
            setImage('')
        } else {
            toast.error(data.message)
        }
       } catch (error) {
        toast.error(error.message)
       }
    }

    return (
        <div className={`relative min-h-screen flex flex-col items-center pt-4
            border-r border-borderColor text-sm transition-all duration-300
            ${collapsed ? 'w-20' : 'w-60'}`}>

            {/* Hamburger button */}
            <div className='w-full flex justify-start px-4 mb-4'>
                <button 
                    className="p-1 bg-transparent rounded hover:bg-gray-200"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <img src={assets.menu_icon} alt="menu" className="h-4 w-4 opacity-50" />
                </button>
            </div>

            {/* Profile */}
            <div className='group relative mb-4'>
                <label htmlFor="image">
                    <img 
                        src={image ? URL.createObjectURL(image) : user?.image ? user.image : assets.user_profile}
                        alt=""
                        className={`rounded-full mx-auto transition-all duration-300 
                            ${collapsed ? 'h-10 w-10' : 'h-14 w-14'}`} 
                    />
                    <input type="file" id='image' accept='image/*' hidden onChange={e=>setImage(e.target.files[0])} />

                    <div className='absolute hidden top-0 right-0 left-0 bottom-0 
                        bg-black/10 rounded-full group-hover:flex items-center justify-center 
                        cursor-pointer'>
                        <img src={assets.edit_icon} alt="" />
                    </div>
                </label>
            </div>

            {image &&(
                <button className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/10
                text-primary cursor-pointer' onClick={updateImage}>
                    Save <img src={assets.check_icon} width={13} alt="" />
                </button>
            )}

            {!collapsed && <p className='mt-2 text-base'>{user?.name}</p>}

            {/* Menu */}
            <div className='w-full mt-4'>
                {ownerMenuLinks.map((link,index)=>(
                    <NavLink 
                        key={index} 
                        to={link.path} 
                        className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 transition-all duration-300
                            ${link.path === location.pathname ? 'bg-primary/10 text-primary': 'text-gray-600'}
                            ${collapsed ? 'justify-center' : ''}`}
                    >
                        <img 
                            src={link.path === location.pathname ? link.coloredIcon : link.icon} 
                            alt="icon"
                        />
                        {!collapsed && <span>{link.name}</span>}
                        {link.path === location.pathname && !collapsed && (
                            <div className='bg-primary w-1 h-8 rounded-l right-0 absolute'></div>
                        )}
                    </NavLink>
                ))}
            </div>
      
        </div>
    )
}

export default Sidebar
