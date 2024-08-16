import SupportChat from 'components/support/supportChat'
import React, { Fragment, useEffect, useState } from 'react'
import styled from 'styled-components'
import axiosInstance from 'utils/axios';

function Support() {
    const [activeUser, setActiveUser] = useState(null);    
    const fetchUserChat = async () => {

    }

    useEffect(()=>{
        if(activeUser){
            fetchUserChat()
        }
    },[activeUser])

    const [customers, setCustomers] = useState([])
    useEffect(()=>{
        axiosInstance.get(`/support/chats`)
        .then(res=>{
            console.log(res)
            setCustomers(res.data.results)
        }).catch(err=>{})
    },[])
  return (
    <Container className='w-full full flex flex-col py-4 dark:text-gray-400 sticky top-32'>
        <ChatHead className="p-4 w-full dark:bg-gray-700 bg-gray-100 flex flex-col mb-4 sticky top-0 z-10 ">
            {
                activeUser ? <div className='flex items-center'>
                    <div className="w-10 h-10 rounded-full mr-3 border overflow-hidden">
                        {
                            activeUser.user?.avatar ? <img src={activeUser.user?.avatar} alt="" className="w-full h-full object-cover" /> :
                            <small className="fa fa-user"></small>
                        }
                    </div>
                    <div className="flex flex-col">
                        <p className='dark:text-white font-bold'>{activeUser.user?.first_name} {activeUser.user?.last_name}</p>
                        <small>
                            {activeUser.messages[activeUser.messages.length-1]?.created_at?.split('T')[0]},
                            {activeUser.messages[activeUser.messages.length-1]?.created_at?.split('T')[1]?.split('.')[0]?.split(':').slice(0,2).join(':')}
                        </small>
                    </div>
                </div> : <>
                    <h1 className="text-xl dark:text-gray-100 font-bold">Contact Support</h1>
                    <p>Reply customer messages</p>
                </>
            }
        </ChatHead>
        <ChatSection className="w-full flex dark:bg-gray-700 bg-gray-100 sticky">
            <CustomerList className='border-r relative overflow-y-auto'>
                <div className="py-4 px-2 flex items-center justify-between mb-4 border-b dark:border-gray-500 sticky top-0 dark:bg-gray-700">
                    <b>Customers</b>
                    {/* <b>4323</b> */}
                </div>
                {
                    customers.map((customer, idx, arr)=>{
                        if(customer.messages?.length>0){
                            return <div key={`customer-chat-${idx}`} onClick={()=>setActiveUser(customer)} className={`w-full flex items-center justify-between py-3 px-2 dark:hover:bg-gray-400 border-b dark:border-gray-500 ${activeUser === customer ? `dark:bg-gray-400 bg-gray-200 dark:text-black`:`hover:bg-gray-100 hover:text-black`} cursor-pointer`}>
                                <section className="flex items-center">
                                    <aside className="w-10 h-10 min-w-10 flex items-center justify-center rounded-full mr-3 border overflow-hidden">
                                        {
                                            customer.user?.avatar ? <img src={customer.user?.avatar} alt="" className="w-full h-full object-cover" /> :
                                            <small className="fa fa-user"></small>
                                        }
                                    </aside>
                                    <aside className="flex flex-col">
                                        <p className='font-bold dark:text-gray-100'>{customer.user?.first_name} {customer.user?.last_name}</p>
                                        <small className='text-green-600'>{customer.issue_type?.charAt(0)?.toUpperCase()}{customer.issue_type?.slice(1)}</small>
                                    </aside>
                                </section>
                                <aside className="flex flex-col items-end">
                                    {customer.unread_messages>0 && <small className='bg-green-500 px-2 h-5 flex items-center rounded-2xl'><b className='text-white text-xs'>{customer.unread_messages}</b></small>}
                                    
                                    <small className='text-xs mt-1 flex-no-wrap'>
                                        {customer.messages[customer.messages.length-1]?.created_at?.split('T')[0]},
                                        {customer.messages[customer.messages.length-1]?.created_at?.split('T')[1]?.split('.')[0]?.split(':').slice(0,2).join(':')}
                                    </small>
                                </aside>
                            </div>
                        }
                        return <Fragment key={`customer-chat-${idx}`}/>
                    })
                }
            </CustomerList>
            <ChatBoard className='flex items-center justify-center h-full p-4'>
                {
                    activeUser ? <SupportChat user={activeUser}/> : <b className="text-2xl">Select a customer</b>
                }
            </ChatBoard>
        </ChatSection>
    </Container>
  )
}

const Container = styled.div`
    height: calc(100%-100px) !important;
`

const ChatSection = styled.section`
    height: 600px;
    max-height: 600px !important;
`

const ChatHead = styled.section`
    min-height: 90px;
`


const CustomerList = styled.div`
    min-width: 300px;
`

const ChatBoard = styled.div`
    width: 100%;
    height: 100%;
`
export default Support