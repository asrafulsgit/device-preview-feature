import React, { useContext } from 'react'
import {NavLink } from 'react-router'


const Nav = () => {

  const navItems = [
    {
      name : "Home", path : "/"
  }
]


  return (
    <div className='sticky top-0 z-50 bg-white flex justify-between items-center px-5'>
      <h1 className='text-3xl text-center py-2 font-bold'>Builder<span className='text-yellow-500'>X</span></h1>
      <div className='space-x-5 text-lg font-medium'>
        {navItems.map((item)=>(
          <NavLink to={item.path}
            className={({isActive})=>(`${isActive && "border-b-2 border-yellow-500"}`)}
           key={item.path}>{item.name}</NavLink> 
        ))}
      </div>
    </div>
  )
}

export default Nav
