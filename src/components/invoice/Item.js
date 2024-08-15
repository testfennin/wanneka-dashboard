import SelectStatus, { orderStatuses } from 'components/form/SelectStatus'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

function Item({item, fetchData, close}) {
  const [orderItem, setOrderItem] = useState(item)
  useEffect(()=>{
    console.log(item)
    setOrderItem(item)
  },[item])
  return (
    <Container className='dark:text-gray-300 bg-gray-700 p-4 rounded-lg overflow-y-auto'>
      <div className="w-full flex tiems-center justify-between mb-4">
        <h1 className=" p-0 m-0">ORDERITEM#{orderItem?.orderitem_id}</h1>
        <small>Quantity: {orderItem?.quantity}</small>
      </div>
      <div className="flex flex-col">
        <aside className="rounded-lg w-32 h-32 overflow-hidden mb-2 border shadow">
          <img src={orderItem?.product?.thumbnail} alt='OrderItem-thubnail' className="w-full h-full object-cover"/>
        </aside>
        <small>{orderItem?.product?.name}</small>
        <small>Unit Price: ${orderItem?.unit_price}</small>
        <h1 className="text-lg text-green-500">${orderItem?.total_amount}</h1>
        <br />
        <section className='mb-2'>
          <p className='text-green-600'>Promo Codes</p>
          {
            orderItem?.promo_codes?.length>0?<div className="w-full grid grid-cols-2 gap-2">
            <small></small>
            <small className='text-right'></small>
          </div>:<small className='text-gray-500'>No Promo Code used</small>
          }
        </section>
        <br />
        <section className="w-full grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 border border-gray-500 p-4 rounded-lg">
          <div className="flex flex-col">
            <small className='text-gray-100'>Has Wanneka Care</small>
            <small className="text-gray-500">{!orderItem?.order_date ? 'N/A':`${orderItem?.order_date ? 'YES':'NO'}`}</small>
          </div>
          <div className="flex flex-col">
            <small className='text-gray-100'>Order date</small>
            <small className="text-gray-500">{orderItem?.order_date?.split('T')[0] || 'N/A'}</small>
          </div>
          <div className="flex flex-col">
            <small className='text-gray-100'>Shipped date</small>
            <small className="text-gray-500">{orderItem?.shipped_date || 'N/A'}</small>
          </div>
          <div className="flex flex-col">
            <small className='text-gray-100'>Status</small>
            <small className="text-gray-500">{orderStatuses('item')[orderItem?.status] || 'N/A'}</small>
          </div>
          <div className="flex flex-col">
            <small className='text-gray-100'>Estimated delivery date</small>
            <small className="text-gray-500">{orderItem?.estimated_delivery_date || 'N/A'}</small>
          </div>
          <div className="flex flex-col">
            <small className='text-gray-100'>Wanneka Care</small>
            <small className="text-gray-500">{orderItem?.has_wanneka_care ? 'Yes':'No'}</small>
          </div>
          <div className="flex flex-col">
            <small className='text-gray-100'>Awaiting shipping date</small>
            <small className="text-gray-500">{orderItem?.awaiting_shipping_date || 'N/A'}</small>
          </div>
        </section>
        <div className="flex flex-col">
          <small className='mb-1'>Order Item Status</small>
          <SelectStatus id={orderItem?.uid} item={orderItem} fetchData={()=>{
            fetchData();
            close();
          }} />
        </div>
        <br />
        <br />
        <button onClick={()=>close()} className="rounded-lg h-12 text-gray-100 bg-gray-500">Close</button>
      </div>
    </Container>
  )
}

const Container = styled.aside`
    width: 700px;
    min-height: 300px;
    @media only screen and (max-width: 720px){
      width: 100dvw;
      height: 100dvh;
      border-radius: 0;
    }
`

export default Item