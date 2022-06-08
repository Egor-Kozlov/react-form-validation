import React from 'react'
import './RedStar.css'

const RedStar = ({ disabled }) => {
    return (
        <span className={disabled ? 'star--disabled' : 'star--active'} >*</span>
    )
}

export default RedStar