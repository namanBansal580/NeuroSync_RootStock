"use client"
import { OpenOrders } from '@/app/trade/OrdersTable';
import { useParams, useSearchParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const params=useParams();
    console.log("my Params are:::::",params);
    
  return (  
    <div className='mt-16'>
      <h1>Your Current Trade Requests are</h1>
    <div className=''><OpenOrders selectedTokenId={"BINANCE:RIFBTC"}></OpenOrders></div>
    </div>
  )
}

export default page