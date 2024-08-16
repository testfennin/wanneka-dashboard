import React, { useEffect, useState } from 'react'
import { IoIosSend } from "react-icons/io";


function MessageInput({mes, setMes, hideAttach, limitheight, setSendData, user}) {
    const [inputHeight, setInputHeight] = useState(40);
    const [innerWidth, setInnerWidth] = useState(window.innerWidth)
    

    useEffect(()=>{
        if(mes.length > (innerWidth - (innerWidth > 1200 ? 150 : 70)) && inputHeight < limitheight){
            setInputHeight(Math.ceil(mes.length/(innerWidth-(innerWidth > 1200 ? 100 : 70))) * 100)
        }
        if(mes.length <= (innerWidth - (innerWidth > 1200 ? 150 : 70))){
            setInputHeight(40)
        }
        if(innerWidth<777){
            setInputHeight(40)
        }
        // eslint-disable-next-line
    }, [mes]);
    
    useEffect(()=>{
        setInnerWidth(window.innerWidth);
        window.addEventListener('resize', ()=>{
            setInnerWidth(window.innerWidth);
        })
    }, [])

    const handleSend =async (e) =>{
        e.preventDefault();
        setSendData && setSendData({
            content: mes,
            image: '',
            sender: user.id
        })
    }
  return <form onSubmit={e=>handleSend(e)} className="w-full h-fit rounded-2xl p-1 px-3 bg-white flex items-center">
        {/* {
            !hideAttach && <aside className="min-w-10 h-10 hidden md:flex items-center justify-center bg-gray-200 text-white rounded-full">
                <i className="fa fa-plus"></i>
            </aside>
        } */}
        

        <aside className="w-full h-fit">
            <textarea required style={{maxHeight: '50px'}} autoFocus value={mes} onChange={e=>setMes(e.target.value)} name="" id="" className={`w-full md:p-3 outline-none border-none text-xs sm:text-sm`} placeholder='Type here...'></textarea>
        </aside>
        
        <button style={{minWidth: '40px', height: '40px'}} className=" flex items-center justify-center bg-green-600 text-white rounded-2xl">
            <IoIosSend className='text-lg'/>
        </button>

        {/* <section className="w-full flex md:hidden items-center justify-between">
            {
                !hideAttach && <aside className="min-w-8 h-8 flex items-center justify-center bg-gray-200 text-white rounded-full">
                    <small className="fa fa-plus "></small>
                </aside>
            }
            
            <button className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-2xl cursor-pointer">
                <IoIosSend/>
            </button>
        </section> */}
    </form>
}

export default MessageInput