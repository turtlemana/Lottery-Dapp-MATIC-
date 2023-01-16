import React from 'react'
import {StarIcon,CurrencyDollarIcon,ArrowPathIcon,ArrowUturnDownIcon} from "@heroicons/react/24/solid"
import {useContract,useMetamask,useDisconnect,useAddress,useContractRead, useContractWrite} from "@thirdweb-dev/react"
import {ethers} from "ethers"
import {currency} from "../constants"
import toast from "react-hot-toast"
function AdminControls() {

const {contract,isLoading}=useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS)

const {data:totalCommission}=useContractRead(contract,"operatorTotalCommission")
const {data:lotteryOperator}=useContractRead(contract, "lotteryOperator")
const {data:ticketPrice}=useContractRead(contract, "ticketPrice")
const { data:remainingTickets } = useContractRead(contract, "RemainingTickets")

const {mutateAsync:DrawWinnerTicket}=useContractWrite(contract,"DrawWinnerTicket")
const {mutateAsync:RefundAll}=useContractWrite(contract,"RefundAll")
const {mutateAsync:restartDraw}=useContractWrite(contract,"restartDraw")
const {mutateAsync:WithdrawCommission}=useContractWrite(contract,"WithdrawCommission")


const drawWinner=async()=>{
  console.log(ticketPrice)
    const notification=toast.loading("Picking a Lucky Winner...");
    try{
      const data=await DrawWinnerTicket([{}])
      toast.success("A Winner has been selected!",{id:notification})
      console.info("contract call success",data)

    }catch(err){
      toast.error("Something went wrong!",{id:notification})
    }
}
const onWithdrawCommission=async()=>{
    const notification=toast.loading("Withdrawing commission...");
    try{
      const data=await WithdrawCommission([{}])
      toast.success("Your Commission has been withdrawn successfully!",{id:notification})
      console.info("contract call success",data)

    }catch(err){
      toast.error("Something went wrong!",{id:notification})
    }
}
const onRefundAll=async()=>{
    const notification=toast.loading("Refunding All...");
    try{
      const data=await RefundAll([{}])
      toast.success("Your Commission has been withdrawn successfully!",{id:notification})
      console.info("contract call success",data)

    }catch(err){
      toast.error("Something went wrong!",{id:notification})
    }
}
const onRestartDraw=async()=>{
    const notification=toast.loading("Restarting draw...");
    try{
      const data=await restartDraw([{}])
      toast.success("Your Commission has been withdrawn successfully!",{id:notification})
      console.info("contract call success",data)

    }catch(err){
      toast.error("Something went wrong!",{id:notification})
    }
}
// const prize=ethers.utils.formatEther(ticketPrice?.toString())

  return (
    <div className="text-white text-center px-5 py-5 rounded-md border-emerald-300/20 border">
      <h2 className="font-bold">{lotteryOperator=="0x0000000000000000000000000000000000000000" ? "" : "This Round's Operator" }</h2>
      <h2 className="font-bold">{lotteryOperator=="0x0000000000000000000000000000000000000000" ? "Operate Lottery by pressing Start Lottery" : lotteryOperator }</h2>
      <p className="mb-5">Total Prize of this round: {ticketPrice && (100-remainingTickets?.toNumber()) * 0.01}{" "}{currency}</p>
      {/* <p className="mb-5">Total Commision to be withdrawn: {totalCommission && ethers.utils.formatEther(totalCommission?.toString())}{" "}{currency}</p> */}
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
      <button onClick={onRestartDraw} className="admin-button">
        <ArrowPathIcon className="h-6 mx-auto mb-2"></ArrowPathIcon>Start Lottery</button>
        <button onClick={drawWinner} className="admin-button">
            <StarIcon className="h-6 mx-auto mb-2"></StarIcon>
            Draw Winner</button>
        {/* <button onClick={onWithdrawCommission} className="admin-button">
        <CurrencyDollarIcon className="h-6 mx-auto mb-2"></CurrencyDollarIcon>Withdraw Commission</button> */}

        <button onClick={onRefundAll} className="admin-button">
        <ArrowUturnDownIcon className="h-6 mx-auto mb-2"></ArrowUturnDownIcon>Refund All</button>
    </div>
    </div>
  )
}

export default AdminControls
