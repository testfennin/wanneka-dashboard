import TextEditor from 'components/common/TextEditor'
import React, { useContext, useState } from 'react'
import { GiftCardServices } from 'services/GiftCardServices';
import styled from 'styled-components'
import { giftcardStatus } from './GiftCardTable';
import { AdminContext } from 'context/AdminContext';

function AddGiftCard({ id, close, data, fetchData }) {
    const { state, dispatch } = useContext(AdminContext);
    const { adminInfo } = state;
    console.log(adminInfo)
    const [detail, setDetail] = useState({
        user: adminInfo?.uid,
        description: '',
        amount: null,
        expiration_date: '',
        status: ''

    })
    const handleSubmit =async e=>{
        e.preventDefault();
        const res = await GiftCardServices.addCard(detail)
        const status = res.status || res.response?.status
        if(status === 201){
            fetchData();
            close();
        }
    }
    
  return (
    <Container className='dark:bg-gray-700 bg-white rounded-lg text-gray-700 dark:text-gray-300'>
        <div className="p-4 py-6 dark:bg-gray-800 bg-gray-100 w-full flex flex-col">
            <h1 className="text-lg">Add Gift Card</h1>
            <small>Add your Product category and necessary information from here</small>
        </div>
        <form onSubmit={(e)=>handleSubmit(e)} className="p-4 py-6 w-full">
            {/* <aside className="flex flex-col w-full mb-5">
                <p className='mb-1 text-sm'>Customer</p>
                <div className="flex items-center w-full border border-gray-500 px-3 rounded-lg">
                    <i className="fa fa-user mr-3"></i>
                    <input required placeholder="Enter customer's name" value={detail.user} onChange={e=>setDetail({...detail, user: e.target.value})} className="w-full border-none outline-none bg-transparent h-10 text-sm"/> */}
                    {/* <select required value={detail.user} onChange={e=>setDetail({...detail, user: e.target.value})} className="w-full border-none outline-none bg-transparent h-10 text-sm">
                        <option value="">Select a Owner</option>

                    </select> */}
                {/* </div>
            </aside> */}
            <aside className="flex flex-col w-full mb-5">
                <p className='mb-1 text-sm'>Amount</p>
                <div className="flex items-center w-full border border-gray-500 px-3 rounded-lg">
                    <i className="fa fa-mountain-sun mr-3"></i>
                    <input required placeholder="Enter amount" type='number' value={detail.amount} onChange={e=>setDetail({...detail, amount: e.target.value})} className="w-full border-none outline-none bg-transparent h-10 text-sm"/>
                    {/* <select required value={detail.user} onChange={e=>setDetail({...detail, user: e.target.value})} className="w-full border-none outline-none bg-transparent h-10 text-sm">
                        <option value="">Select a Owner</option>

                    </select> */}
                </div>
            </aside>
            <aside className="flex flex-col w-full mb-5">
                <p className='mb-1 text-sm'>Description</p>
                <TextEditor required value={detail.description} setValue={val=>setDetail({...detail, description: val})}/>
            </aside>
            <aside className="flex flex-col w-full mb-5">
                <p className='mb-1 text-sm'>Expiration Date</p>
                <div className="flex items-center w-full border border-gray-500 px-3 rounded-lg">
                    <i className="fa fa-calendar mr-3"></i>
                    <input required type="date" value={detail.expiration_date} onChange={e=>setDetail({...detail, expiration_date: e.target.value})} className="w-full border-none outline-none bg-transparent h-10 text-sm"/>
                </div>
            </aside>
            <aside className="flex flex-col w-full mb-5">
                <p className='mb-1 text-sm'>Default Status</p>
                <div className="flex items-center w-full border border-gray-500 px-3 rounded-lg">
                    <i className="fa fa-circle mr-3"></i>
                    <select required value={detail.status} onChange={e=>setDetail({...detail, status: e.target.value})} className="w-full border-none outline-none bg-transparent h-10 text-sm">
                        <option value="">Set Default Status</option>
                        {
                            Object.keys(giftcardStatus).map(key=>{
                                return <option value={key}>{giftcardStatus[key]}</option>
                            })
                        }
                    </select>
                </div>
            </aside>

            <br />
            <div className="w-full grid grid-cols-2 gap-3">
                <button className="w-full h-12 rounded-lg bg-green-500 text-white">Add Gift Card</button>
                <div onClick={close} className="w-full h-12 flex items-center justify-center rounded-lg bg-gray-500 text-gray-600 hover:text-gray-700 cursor-pointer">Cancel</div>
            </div>
        </form>
    </Container>
  )
}

const Container = styled.div`
    width: 500px;
`

export default AddGiftCard