import React from 'react'
import PropagateLoader from "react-spinners/PropagateLoader"

function Loading() {
  return (
    <div>
    <div className="bg-[#091B18] h-screen flex flex-col items-center justify-center">
    <div className="flex items-center space-x-2 mb-10">
      <img className="rounded-full h-20 w-20" src="https://assets.devfolio.co/hackathons/816e9a65e49d4f1cbce272f86a59890f/projects/b986f8bfbf40490f8f768b789b9edc1d/55028a12-0139-4b59-abb2-371d37dc218b.jpeg"></img>
    </div>
    <PropagateLoader color="white" size={30}></PropagateLoader>
    </div>
      
    </div>
  )
}

export default Loading
