import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { IoIosSend } from "react-icons/io";
import { socketBaseUrl } from 'services/AdminServices';
import { convertDate, convertTime } from 'components/common/DateConversion';

function SupportChat({user, refetch}) {
    const [messages, setmessages] = useState([])
    const sendBtn = useRef(null)
    const inputRef = useRef(null)
    
    useEffect(()=>{
        setmessages(user?.messages)
    },[user])

    useEffect(()=>{
        let board = document.getElementById('messageBorder')
        if (board && board.lastElementChild) {
            board.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        }
    },[messages])
    
    let url = `${socketBaseUrl}/ws/chat/${user.room_id}/?admin_pass=admin`
    const socket = new WebSocket(url);
    useEffect(()=>{
        console.log(user.room_id)
        const connectSocker = () => {
            socket.addEventListener('open', (event) => {
                console.log('Connected to server.')
            });
            socket.addEventListener('close', (event) => {
                console.log('Connection closed.');
                // socket.close();
            });
            
            socket.onmessage = (event) => {
                console.log('request sent')
                setmessages(prev=>{
                    return [...prev, JSON.parse(event.data)]
                });
                refetch();
                // inputRef.current.value = ''
            }
        };
        
        
        const sendMessage = (inputValue) => {
            if(inputRef && inputRef.current.value){
                let data = {
                        "message": inputValue,
                        "sender": "admin",
                        "is_image": false,
                        "image_url": ""
                }
                socket.send(JSON.stringify(data))
                inputRef.current.value = '';
            }
        }
        
        if(sendBtn.current){
            sendBtn.current.addEventListener('click', (e)=>{
                if(inputRef.current && inputRef.current.value){
                    sendMessage(inputRef.current.value);
                }
            })
        }
        
        connectSocker();
        return () => {
            // socket.close()
        }
        // eslint-disable-next-line
    }, [user.room_id])



  return (
    <div className={`w-full h-full flex flex-col`}>
        <section id='messageBorder' className="w-full h-full min-h-52 overflow-y-auto">
            {
                messages.map((message, idx)=>{
                    return <aside key={`message-${idx}`} className={`w-full flex mb-4 ${message?.sender === 'admin' ? `justify-end`:``}`}>
                            <MessageContent className={`p-2 text-theme ${message?.sender === 'user' ? `bg-gray-200 text-black`:`bg-green-600 text-white`} rounded-xl flex flex-col `}>
                                <div className="w-full flex-wrap">
                                    {
                                        message.is_image ? <MessageImage><img src={message.message} alt="" className='w-full h-full object-cover'/></MessageImage> : 
                                        <small className='whitespace-pre-wrap'>{message.message}</small>
                                    }
                                    <MessageDate className={`w-full flex justify-end font-thin ${message?.sender !== 'admin' ? `text-gray-500` : `text-gray-300`}`}>
                                        {convertDate(message?.created_at)}, {convertTime(message?.created_at)}
                                    </MessageDate>
                                </div>
                            </MessageContent>
                        </aside>
                })
            }
        </section>
        <div className="w-full h-fit rounded-2xl p-1 px-3 bg-white flex items-center">
            <aside className="w-full h-fit">
                <textarea ref={inputRef} required style={{maxHeight: '50px'}} autoFocus name="" id="" className={`w-full md:p-3 outline-none border-none text-xs sm:text-sm`} placeholder='Type here...'></textarea>
            </aside>
            
            <button ref={sendBtn} style={{minWidth: '40px', height: '40px'}} className=" flex items-center justify-center bg-green-600 text-white rounded-2xl">
                <IoIosSend className='text-lg'/>
            </button>
        </div>
    </div>
  )
}

const MessageContent = styled.div`
    max-width: 80%;
    min-width: 20%;

`

const MessageImage = styled.div`
    min-width: 80%;
    max-width: 100%;
    height: 250px;
    border-radius: 20px;
    margin: auto;
    overflow: hidden;
`

const MessageDate = styled.aside`
    font-size: 10px;
`

export default SupportChat