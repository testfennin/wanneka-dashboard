import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { IoIosSend } from "react-icons/io";
import { socketBaseUrl } from 'services/AdminServices';

function SupportChat({user}) {
    const [messages, setmessages] = useState([])
    const [textMessage, setTextMessage] = useState('')
    const sendBtn = useRef(null)
    const inputRef = useRef(null)
    
    useEffect(()=>{
        setmessages(user?.messages)
    },[user])

    function convertToJson(data){
			let jsonString = data.replace(/'/g, '"').replace(/None/g, "null").replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false");
			return JSON.parse(jsonString)
		}
    
    useEffect(()=>{
        let url = `${socketBaseUrl}/ws/chat/${user.room_id}/?admin_pass=admin`
        const socket = new WebSocket(url);
        const connectSocker = () => {
            socket.addEventListener('open', (event) => {
                console.log('Connected to server.')
            });
            socket.addEventListener('close', (event) => {
                console.log('Connection closed.');
                socket.close();
            });
            
            socket.onmessage = (event) => {
                console.log(event.data)
                setmessages(prev=>{
                    return [...prev, convertToJson(event.data)]
                })
                inputRef.current.value = ''
            }
        };
        connectSocker();
        
        const sendMessage = (inputValue) => {
            if(inputRef && inputRef.current.value){
                let data = {
                        "message": inputValue,
                        "sender": "admin",
                        "is_image": false,
                        "image_url": ""
                }
                socket.send(JSON.stringify(data))
                inputRef.current.value = ''
            }
        }
        
        if(sendBtn.current){
            sendBtn.current.addEventListener('click', (e)=>{
                if(inputRef.current && inputRef.current.value){
                    sendMessage(inputRef.current.value);
                }
            })
        }
        
        return () => {
            // socket.close()
        }
        // eslint-disable-next-line
    }, [textMessage])

    const handleSend = (e)=>{
        e.preventDefault();

        sendBtn.current && sendBtn.current.click();
    }


  return (
    <div className={`w-full h-full flex flex-col`}>
        <section className="w-full h-full min-h-52 overflow-y-auto">
            {
                messages.map((message, idx)=>{
                    return <aside key={`message-${idx}`} className={`w-full flex mb-4 ${message?.sender === 'admin' ? `justify-end`:``}`}>
                            <MessageContent className={`p-2 text-theme ${message?.sender === 'user' ? `bg-gray-200 text-black`:`bg-green-600 text-white`} rounded-xl flex `}>
                                {/* <div className="min-w-10 h-10 border rounded-full bg-theme flex justify-center items-center mr-2 text-black">
                                    {
                                        message?.image_url ? <img src={message.image_url} alt="" className="w-full h-full object-cover" /> :
                                        <i className="fa fa-user"></i>
                                    }
                                </div> */}
                                <div className="w-full flex-wrap">
                                    {
                                        message.is_image ? <MessageImage><img src={message.message} alt="" className='w-full h-full object-cover'/></MessageImage> : 
                                        <small className='whitespace-pre-wrap'>{message.message}</small>
                                    }
                                </div>
                            </MessageContent>
                        </aside>
                })
            }
        </section>
        <form onSubmit={e=>handleSend(e)} className="w-full h-fit rounded-2xl p-1 px-3 bg-white flex items-center">
            <aside className="w-full h-fit">
                <textarea ref={inputRef} required style={{maxHeight: '50px'}} autoFocus value={textMessage} onChange={e=>setTextMessage(e.target.value)} name="" id="" className={`w-full md:p-3 outline-none border-none text-xs sm:text-sm`} placeholder='Type here...'></textarea>
            </aside>
            
            <button ref={sendBtn} style={{minWidth: '40px', height: '40px'}} className=" flex items-center justify-center bg-green-600 text-white rounded-2xl">
                <IoIosSend className='text-lg'/>
            </button>
        </form>
    </div>
  )
}

const MessageContent = styled.div`
    max-width: 80%;
    min-width: 50%;

`

const MessageImage = styled.div`
    min-width: 80%;
    max-width: 100%;
    height: 250px;
    border-radius: 20px;
    margin: auto;
    overflow: hidden;
`

export default SupportChat