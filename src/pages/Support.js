import { convertDate, convertTime } from 'components/common/DateConversion';
import SupportChat from 'components/support/supportChat'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import styled from 'styled-components'
import axiosInstance from 'utils/axios';


function Support() {
    const history = useHistory();
    const [customersData, setCustomersData] = useState({})
    const [activeUser, setActiveUser] = useState(null);    
    const fetchUserChat = async (url) => {
        axiosInstance.get(url || `/support/chats`)
        .then(res=>{
            console.log(res)
            setCustomersData(res.data)
            setCustomers(res.data.results)
        }).catch(()=>{setLoading(false)})
    }

    useEffect(()=>{
        if(activeUser){
            fetchUserChat()
        }
    },[activeUser])


    const [customers, setCustomers] = useState([])
    useEffect(()=>{
        fetchUserChat();
    },[])

    const observerRef = useRef();
    const [loading, setLoading] = useState(false)
    const lastItemRef = (node) => {
        if (loading) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            console.log('Fetch now', customersData.next)
            if(customersData.next){
                setLoading(true)
                let next = `${customersData.next}`.replace('http://', 'https://');
                axiosInstance.get(next)
                .then(res=>{
                    console.log(res)
                    setCustomersData(res.data)
                    setCustomers(prev=>{
                        return [...prev, ...res.data.results]
                    })
                    setLoading(false)
                }).catch(err=>{setLoading(false)})
            }
        }
        });

        if (node) observerRef.current.observe(node);
    };

    const [isSearch, setSearch] = useState(false)
    const [searchText, setSearchText] = useState('');
    useEffect(()=>{
        if(searchText.length>0){
            let url = `support/chats?search=${searchText}`
            fetchUserChat(url);
        }
    },[searchText])

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
                            {convertDate(activeUser.messages[activeUser.messages.length-1]?.created_at)},
                            {convertTime(activeUser.messages[activeUser.messages.length-1]?.created_at)}
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
                <div style={{minHeight: '65px'}} className=" px-2 flex items-center justify-between mb-4 border-b dark:border-gray-500 sticky top-0 dark:bg-gray-700">
                    {
                        !isSearch ? <b>Customers</b> : 
                        <div className="w-full rounded-2xl overflow-hidden h-10 px-2 flex items-center border mr-2 dark:border-gray-500 ">
                            <input type="text" value={searchText} onChange={e=>setSearchText(e.target.value)} placeholder='Search here ...' className="h-full w-full text-sm bg-transparent border-none outline-none" />
                            <i onClick={()=>setSearch(false)} className="fa -times cursor-pointer"></i>
                        </div>
                    }

                    {!isSearch && <i role='button' onClick={()=>setSearch(true)} className={`fa fa-search cursor-pointer`}></i>}
                    {isSearch && <small role='button' onClick={()=>setSearch(false)} className='text-blue-500 cursor-pointer'>Cancel</small>}
                </div>
                {
                    customers?.map((customer, idx, arr)=>{
                        if(idx === customers.length-1){
                            return <div ref={lastItemRef} key={`customer-chat-${idx}`} onClick={()=>{
                                history.push(`/support/${customer?.room_id}`)
                                setActiveUser(customer);
                                setSearch(false);
                            }} className={`w-full flex items-center justify-between py-3 px-2 dark:hover:bg-gray-400 border-b dark:border-gray-500 ${activeUser?.room_id === customer?.room_id ? `dark:bg-gray-400 bg-gray-200 dark:text-black`:`hover:bg-gray-100 hover:text-black`} cursor-pointer`}>
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
                                        {/* {convertDate(customer.messages[customer.messages.length-1]?.created_at)}, */}
                                        {convertTime(customer.messages[customer.messages?.length-1]?.created_at)}
                                    </small>
                                </aside>
                            </div>
                        }
                        return <div key={`customer-chat-${idx}`} onClick={()=>{
                                history.push(`/support/${customer?.room_id}`)
                                setActiveUser(customer);
                                setSearch(false);
                            }} className={`w-full flex items-center justify-between py-3 px-2 dark:hover:bg-gray-400 border-b dark:border-gray-500 ${activeUser?.room_id === customer?.room_id ? `dark:bg-gray-400 bg-gray-200 dark:text-black`:`hover:bg-gray-100 hover:text-black`} cursor-pointer`}>
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
                                        {/* {convertDate(customer.messages[customer.messages.length-1]?.created_at)}, */}
                                        {convertTime(customer.messages[customer.messages.length-1]?.created_at)}
                                    </small>
                                </aside>
                            </div>
                    })
                }
                {
                    loading && <div className="py-4 w-full px-3 text-sm">Loading chats ...</div>
                }
            </CustomerList>
            <ChatBoard className='flex items-center justify-center h-full p-4'>
                {
                    activeUser ? <SupportChat user={activeUser} customers={customers} refetch={fetchUserChat}/> : <b className="text-2xl">Select a chat</b>
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