import React from 'react'

//Basic loading spinner, to be used everywhere

export default function LoadingSpinner() {
  return (
    <div className='min-h-screen flex flex-col justify-center text-center'>
        <div>
            <span className="loading loading-bars loading-lg"></span>
        </div>
        <p className='text-lg font-bold'>Loading</p>
    </div>
  )
}
