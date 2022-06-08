import React from 'react'
import './ActionsFooter.css'

const ActionsFooter = ({ children }) => {
    return (
        <div className='action-footer'>
            {children}
        </div>
    )
}

export default ActionsFooter