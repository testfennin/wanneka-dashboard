import React, { useEffect } from 'react'

function ModalWrapper({content, close, title, center}) {

    useEffect(()=>{

    },[])

    return (
        <div style={{background: 'rgba(0,0,0,.8)', zIndex: '100'}} className='w-screen h-screen absolute top-0 left-0 flex items-center justify-center '>
            <div onClick={()=>close()} className="absolute z-10 top-0 left-0 w-full h-full"></div>
            <div className={`w-fit scaleanimate relative z-20 overflow-y-auto ${center ? `flex flex-col`:`h-full`}`}>
                <aside className="w-full min-h-fit flex md:hidden items-center z-10 justify-between sticky top-0">
                    <b className="font-semibold text-lg text-deepTheme">{title}</b>
                    <div className="w-10 h-10 rounded-full cursor-pointer bg-white flex items-center justify-center m-4">
                        <i onClick={()=>close()} className="fa fa-times text-red-600"></i>
                    </div>
                </aside>
                <aside className={`w-full ${center && `flex flex-col items-center justify-center h-fit `}`}>
                    {content}
                </aside>
            </div>
        </div>
    )
}

export default ModalWrapper