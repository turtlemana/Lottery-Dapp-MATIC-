import React from 'react'
import {useMetamask} from "@thirdweb-dev/react"

function Login() {
    const connectWithMetamask=useMetamask()
  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center mb-10">
        <img className="rounded-full h-56 w-56 mb-10"src="https://assets.devfolio.co/hackathons/816e9a65e49d4f1cbce272f86a59890f/projects/b986f8bfbf40490f8f768b789b9edc1d/55028a12-0139-4b59-abb2-371d37dc218b.jpeg"></img>
      </div>
      <h1 className="text-6xl text-white font-bold">LOTTERY DAPP</h1>
      <h2 className="text-white">Get Started by Logging in with your MetaMask</h2>
      <button onClick={connectWithMetamask}className="bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold">Login with MetaMask</button>
    </div>
  )
}

export default Login
