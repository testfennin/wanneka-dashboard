import { FormSection } from 'components/drawer/ProductDrawer'
import React, { useState } from 'react'
import CategoryServices from 'services/CategoryServices';
import styled from 'styled-components';

function BulkUpdateCategory({close, fetchData, ids, setIsCheck}) {

    const [details, setDetails] = useState({
        "is_active":null
    });


    const handleFormSubmit =async (e) => {
        e.preventDefault();
        
        const res = await CategoryServices.bulkUpdateCategory(ids, details)
        if(res){
            close();
            fetchData();
            setIsCheck([])
        }
    }

  return <MainContainer style={{height: '300px'}} className=" flex flex-col">
        <div className="flex flex-col w-full sticky top-0">
            <div className="w-full p-6 border-b border-gray-500 bg-gray-800 text-gray-300">
                <aside className="flex flex-col">
                    <h1 className="font-semibold text-lg">Update Selected Categories</h1>
                    <p>Update categories info, combinations and extras.</p>
                </aside>
            </div>
        </div>
        <FormSection onSubmit={handleFormSubmit} className="w-full h-fit bg-gray-700 flex flex-col">
            <section className="h-full w-full overflow-y-auto text-gray-300" id="">
                <div className="px-6 pt-8 flex flex-col">
                    <h1 className="text-lg mb-3">Is Active</h1>
                    <div onClick={()=>setDetails({...details, is_active: !details.is_active})} className={`w-16 h-6 rounded-xl border cursor-pointer flex ${details.is_active ? 'justify-end bg-green-500':'justify-start bg-red-500'}`}>
                        <div className="h-full w-6 rounded-full bg-white"></div>
                    </div>
                    {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                        <LabelArea label={'Is Active'} />
                        <div className="col-span-8 sm:col-span-4">
                            <div className={`w-16 h-6 rounded-xl border flex ${details.is_active ? 'justify-end bg-green-500':'justify-start bg-red-500'}`}>
                                <div className="h-full w-6 rounded-full bg-white"></div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </section>
            <div className="formButtons w-full grid grid-cols-2 bg-gray-800 gap-3 items-center py-6 px-3">
                <div onClick={()=>close()} className="w-full h-12 cursor-pointer hover:bg-gray-600 rounded-lg flex justify-center items-center bg-gray-700 text-gray-500">Cancel</div>
                <button className="w-full h-12 rounded-lg flex justify-center items-center bg-green-500 text-white">Bulk Update Categories</button>
            </div>
        </FormSection>

  </MainContainer>
}

const MainContainer = styled.div`
    width: 500px
`

export default BulkUpdateCategory