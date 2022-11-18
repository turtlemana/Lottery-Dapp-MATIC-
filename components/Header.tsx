import React from 'react'
import NavButton from './NavButton'
import {Bars3BottomRightIcon} from "@heroicons/react/24/solid"
import {useAddress,useDisconnect} from '@thirdweb-dev/react'


function Header() {
    const address=useAddress();
    const disconnect=useDisconnect();
  return (
    <header className="grid grid-cols-2 md:grid-cols-5 justify-between items-center p-5">
      <div className="flex items-center space-x-2">
        <img className="rounded-full h-20 w-20" alt="" src="https://assets.devfolio.co/hackathons/816e9a65e49d4f1cbce272f86a59890f/projects/b986f8bfbf40490f8f768b789b9edc1d/55028a12-0139-4b59-abb2-371d37dc218b.jpeg"></img>
      
      <div>
        <h1 className="text-lg text-white text-bold">MATIC LOTTERY</h1>
        <p className="text-xs text-emerald-500 truncate">User:{address?.substring(0,5)}...{address?.substring(address.length,address.length-5)}</p>
        </div>
      </div>
      <div className="hidden md:flex md:col-span-3 items-center justify-center rounded-md">
        <div className="bg-[#0A1F1C] p-4 space-x-2">
            <NavButton isActive title="Buy Tickets"></NavButton>
            <NavButton onClick={disconnect} title="LogOut"></NavButton>

        </div>
      </div>
      <div className="flex flex-col ml-auto text-right">
        <Bars3BottomRightIcon className="h-8 w-8 mx-auto text-white cursor-pointer"></Bars3BottomRightIcon>
        <span className="md:hidden">
        <NavButton onClick={disconnect} title="Logout"></NavButton>
      </span>
      </div>

    </header>
  )
}

export default Header
