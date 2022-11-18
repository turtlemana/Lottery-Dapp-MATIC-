import type { NextPage } from 'next'
import {useEffect, useState} from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import {useContract,useMetamask,useDisconnect,useAddress,useContractRead, useContractWrite} from "@thirdweb-dev/react"
import Login from '../components/Login'
import Loading from '../components/Loading'
import {ethers} from 'ethers'
import { currency } from '../constants'
import CountdownTimer from '../components/CountdownTimer'
import toast from 'react-hot-toast'
import Marquee from 'react-fast-marquee'
import AdminControls from '../components/AdminControls'

const Home: NextPage = () => {
  const [quantity, setQuantity]=useState<number>(1)
  const [userTickets,setUserTickets]=useState<number>(0)
  const address=useAddress();
  const {contract,isLoading}=useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS)
  const { data:remainingTickets } = useContractRead(contract, "RemainingTickets")
  const { data:currentWinningReward } = useContractRead(contract, "CurrentWinningReward")
  const { data:ticketPrice } = useContractRead(contract, "ticketPrice")
  const { data:ticketCommission } = useContractRead(contract, "ticketCommission")
  const { data:expiration } = useContractRead(contract, "expiration")
  const { data:tickets } = useContractRead(contract, "getTickets")
  const { data:winnings } = useContractRead(contract, "getWinningsForAddress",address)
  const { data:lastWinner } = useContractRead(contract, "lastWinner")
  const { data:lastWinnerAmount } = useContractRead(contract, "lastWinnerAmount")
  const { data:isLotteryOperator } = useContractRead(contract, "lotteryOperator")

  const {mutateAsync:BuyTickets}=useContractWrite(contract,"BuyTickets")
  const {mutateAsync:WithdrawWinnings}=useContractWrite(contract,"WithdrawWinnings")

  useEffect(()=>{if(!tickets)return
  const totalTickets:string[]=tickets;
  const noOfUserTickets=totalTickets.reduce((total,ticketAddress)=>(ticketAddress===address ? total+1:total),0)
  setUserTickets(noOfUserTickets)
  },[tickets,address])

  const handleClick=async()=>{
    if (!ticketPrice) return; 
    const notification = toast.loading("Buying your tickets...")
    try{
      const data=await BuyTickets([{value:ethers.utils.parseEther((Number(ethers.utils.formatEther(ticketPrice))*quantity).toString())}])
      toast.success("Tickets purchased successfully",{id:notification})
      console.info("contract call success",data)
    } catch(err){
      toast.error("Something went wrong",{
        id:notification
      })
      console.error("contract call failure",err)
    }

  }
  const onWithdrawWinnings=async()=>{
    const notification=toast.loading("Withdrawing winnings...");
    try{
      const data=await WithdrawWinnings([{}])
      toast.success("Winnings withdrawn successfully",{id:notification})
      console.info("contract call success",data)

    }catch(err){
      toast.error("Something went wrong!",{id:notification})
    }
  }
  if(!address) return <Login/>
  if(isLoading) return (<Loading/>)
  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>Lottery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex-1">
      <Header></Header>
      <Marquee className="bg-[#0A1F1C] p-5 mb-5" gradient={false} speed={100}>
        <div className="flex space-x-2 mx-10">
          <h4 className="text-white font-bold">Last Winner: {lastWinner?.toString()}{"    "}</h4>
          <h4 className="text-white font-bold">Previous Winner: {" "}{lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}{currency}</h4>
        </div>
      </Marquee>
      {isLotteryOperator===address && (<div className="flex justify-center">
        <AdminControls/>
        
      </div>)}

    
        {winnings>0 && (
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">

          <button onClick={onWithdrawWinnings} className="p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full">
            <p className="font-bold">Winner Winner Chicken Dinner!</p>
            <p>Total Winnings:{ethers.utils.formatEther(winnings.toString())}{" "}{currency}</p>
            <br/>
            <p className="font-semibold">Click here to withdraw</p>
          </button>
        </div>)}
      

      <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
        <div className="stats-container">
          <h1 className="text-5xl text-white font-semibold text-center">The Next Draw</h1>
        
        <div className="flex justify-between p-2 space-x-2">
        <div className="stats">
          <h2 className="text-sm">Total Pool</h2>
          <p className="text-xl">{currentWinningReward && ethers.utils.formatEther(currentWinningReward?.toString())}{" "}{currency}</p>
        </div>
        <div className="stats">
          <h2 className="text-xs">Tickets Remaining</h2>
          <p className="text-xl">{remainingTickets?.toNumber()}</p>
        </div>
        </div>
        <div className="mt-5 mb-3"><CountdownTimer/></div>
        </div>
        <div className="stats-container space-y-2">
          <div className="stats-container">
            <div className="flex justify-between items-center text-white pb-2">
              <h2>Price per tickets</h2>
              <p>{ticketPrice && ethers.utils.formatEther(ticketPrice?.toString())}{" "}{currency}</p>
            </div>
            <div className="flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4">
              <p>TICKETS</p>
              <input type="number" min={1} max={10} value={quantity} onChange={e=>setQuantity(Number(e.target.value))} className="flex w-full bg-transparent text-right outline-none"/>
            </div>
            <div className="space-y-2 mt-5">
              <div className="flex items-center justify-between text-emerald-300 text-sm italic font-extrabold">
                <p>Total cost of tickets</p>
                <p>{ticketPrice && Number(ethers.utils.formatEther(ticketPrice?.toString()))*quantity}{" "}{currency}</p>
              </div>
              <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                <p>Service fees</p>
                <p>{ticketCommission && ethers.utils.formatEther(ticketCommission?.toString())}{" "}{currency}</p>
              </div>
              <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                <p>+Network Fees</p>
                <p>TBC</p>
              </div>
            </div>
        
            <button onClick={handleClick}disabled={expiration?.toString()<Date.now().toString()||remainingTickets?.toNumber()===0} className="mt-5 w-full bg-gradient-to-br font-semibold from-orange-500 to-emerald-600 px-10 py-5 rounded-md text-white shadow-xl disabled:from-gray-600 disabled:to-gray-600 disabled:text-gray-100 disabled:cursor-not-allowed">Buy {quantity} tickets for {ticketPrice && Number(ethers.utils.formatEther(ticketPrice.toString()))*quantity}{" "}{currency}</button>
          </div>
          {userTickets >0 && (<div className="stats"><p className="text-lg mb-2">You have {userTickets} Tickets in this draw</p>
          <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">{Array(userTickets).fill("").map((_,index)=>(<p key={index} className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic">{index+1}</p>))}</div>
          </div>)}
        </div>
      </div>

      <div>

      </div>
      </div>
      <footer className="border-t border-emerald-500/20 flex items-center text-white justify-between p-5">
        <img className="h-10 w-10 filter hue-rotate-90 opacity-20 rounded-full" alt="" src="https://assets.devfolio.co/hackathons/816e9a65e49d4f1cbce272f86a59890f/projects/b986f8bfbf40490f8f768b789b9edc1d/55028a12-0139-4b59-abb2-371d37dc218b.jpeg"></img>
        <p className="text-xs text-emerald-900 pl-5">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt, animi. Rem quos rerum adipisci, obcaecati et ipsa iure aut culpa excepturi ullam possimus repellendus alias quae autem, non accusantium vitae?
        </p>
      </footer>

   

    </div>
  )
}

export default Home
