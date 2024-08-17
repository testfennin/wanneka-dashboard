import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { IoIosSend } from "react-icons/io";
import { socketBaseUrl } from 'services/AdminServices';
import { convertDate, convertTime } from 'components/common/DateConversion';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

function SupportChat({user, refetch}) {
    let param = useParams()
    let [url, setUrl] = useState(`${socketBaseUrl}/ws/chat/${param.room}/?admin_pass=admin`)
    let socket = useRef(new WebSocket(url));
    const [messages, setmessages] = useState([])
    const sendBtn = useRef(null)
    const inputRef = useRef(null)

    
    useEffect(()=>{
        socket.current.close();
        setmessages([])
        setmessages(user?.messages)
        if(param.room){
            setUrl(`${socketBaseUrl}/ws/chat/${param.room}/?admin_pass=admin`)
        }else{
            setUrl(`${socketBaseUrl}/ws/chat/${user.room_id}/?admin_pass=admin`)
        }
        // eslint-disable-next-line
    },[user.room_id, param.room])

    useEffect(()=>{
        let board = document.getElementById('messageBorder')
        if (board && board.lastElementChild) {
            board.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        }
    },[messages])
    
    useEffect(()=>{
        const connectSocker = () => {
            socket.current = new WebSocket(url);
            socket.current.addEventListener('open', (event) => {
                console.log('Connected to server.')
            });
            socket.current.addEventListener('close', (event) => {
                console.log('Connection closed.');
                // socket.close();
            });
            
            socket.current.onmessage = (event) => {
                console.log(url)
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
                socket.current.send(JSON.stringify(data))
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
        
        setTimeout(()=>{
            connectSocker();
        },200)
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