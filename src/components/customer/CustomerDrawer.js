import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axiosInstance from 'utils/axios';
import { notifyError } from 'utils/toast';

function CustomerDrawer({fetchData, data, close}) {
    console.log(data)
    const [detail, setDetail] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        user_type: '',
        is_suspended: null
    });

    useEffect(()=>{
        Object.keys(data).forEach(key=>{
            setDetail(prev=>{
                return {...prev, [key]:data[key]}
            })
        })
    },[data])

    const handleSubmit = e=>{
        e.preventDefault();
        axiosInstance.patch(`/customers/${data?.uid}/`, detail)
        .then(res=>{
            close();
            fetchData();
        }).catch(err=>{
            notifyError('Something went wrong')
        })
    }

  return (
    <Container onSubmit={e=>handleSubmit(e)} className='dark:bg-gray-800 dark:text-gray-400 p-4 flex flex-col'>
        <div className="w-full p-4 flex flex-col mb-4 bg-gray-900">
            <h1 className="text-xl">Update Customer</h1>
            <p className='text-green-600'>{data.first_name} {data.last_name}</p>
        </div>

        <div className="w-full">
            <div className="flex items-center justify-between gap-6 mb-6">
                <label className='mr-4'>First name</label>
                <input type="text" value={detail.first_name} onChange={e=>setDetail({...detail, first_name: e.target.value})} placeholder='First name' className="h-10 text-sm border rounded-lg p-4 w-full bg-transparent dark:border-gray-500" />
            </div>
            <div className="flex items-center justify-between gap-6 mb-6">
                <label className='mr-4'>Last name</label>
                <input type="text" value={detail.last_name} onChange={e=>setDetail({...detail, last_name: e.target.value})} placeholder='Last name' className="h-10 text-sm border rounded-lg p-4 w-full bg-transparent dark:border-gray-500" />
            </div>
            <div className="flex items-center justify-between gap-6 mb-6">
                <label className='mr-4'>Phone number</label>
                <input type="text" value={detail.phone} onChange={e=>setDetail({...detail, phone: e.target.value})} placeholder='Phone' className="h-10 text-sm border rounded-lg p-4 w-full bg-transparent dark:border-gray-500" />
            </div>
            <div className="flex items-center justify-between gap-6 mb-6">
                <label className='mr-4'>User type</label>
                <select type="text" value={detail.user_type} onChange={e=>setDetail({...detail, user_type: e.target.value})} className="h-10 text-sm border rounded-lg p-4 w-full bg-transparent dark:border-gray-500">
                    <option value="">Change user type</option>
                    <option value="Admin">Admin</option>
                    <option value="Customer">Customer</option>
                    <option value="Agent">Agent</option>
                </select>
            </div>
            <div className="flex items-center justify-between gap-6 mb-6">
                <label className='mr-4'>Suspend</label>
                <section className="w-full">
                    <div onClick={()=>setDetail({...detail, is_suspended: !detail.is_suspended})} className={`h-10 cursor-pointer rounded-3xl w-20 flex ${detail.is_suspended ? `bg-green-500 justify-end`:`bg-red-500`}`}>
                        <div className="rounded-full bg-white w-10 h-10"></div>
                    </div>
                </section>
            </div>
        </div>
        <br />
        <div className="w-full grid grid-cols-2 gap-4 h-12">
            <div onClick={()=>close()} className="h-full w-full cursor-pointer rounded-xl bg-gray-500 text-black flex justify-center items-center">Cancel</div>
            <button className='bg-green-600 text-white rounded-xl'>Update</button>
        </div>
    </Container>
  )
}

const Container = styled.form`
    width: 600px;
    min-height: 400px;

    label{
        min-width: 100px;
    }
`

export default CustomerDrawer