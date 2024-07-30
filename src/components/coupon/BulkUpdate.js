import { Container, FormSection } from 'components/drawer/ProductDrawer';
import LabelArea from 'components/form/LabelArea';
import React, { useState } from 'react'
import CouponServices from 'services/CouponServices';

function BulkUpdateCoupon({close, fetchData, ids, setIsCheck}) {
  const [details, setDetails] = useState({
        status:false,
        apply_to:'order',
        discount_type: 'amount',
        discount: '',
        min_order_amount: ''
    });


    const handleFormSubmit =async (e) => {
        e.preventDefault();
        let data = {};
        Object.keys(details).forEach(key=>{
            if(details[key]){
                data[key] = details[key]
            }
        })
        data.status = details.status

        const res = await CouponServices.bulkUpdateCoupon(ids, data)
        if(res){
            close();
            fetchData();
            setIsCheck([])
        }
    }

    return <Container className=" flex flex-col">
            <div className="flex flex-col w-full sticky top-0">
                <div className="w-full p-6 border-b border-gray-500 bg-gray-800 text-gray-300">
                    <aside className="flex flex-col">
                        <h1 className="font-semibold text-lg">Update Selected Promocodes</h1>
                        <p>Update promocodes info, combinations and extras.</p>
                    </aside>
                </div>
            </div>
            <FormSection onSubmit={handleFormSubmit} className="w-full h-fit bg-gray-700 flex flex-col p-4">
                <section className="h-full w-full overflow-y-auto text-gray-300" id="">
                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                        <LabelArea label={'Status'} />
                        <div className="col-span-8 sm:col-span-4">
                            <div style={{width: '60px'}} onClick={()=>setDetails({...details, status: !details.status})} className={`w-20 cursor-pointer h-6 border rounded-2xl flex ${details.status?'bg-green-500 justify-end':'bg-red-500'}`}>
                            <div className="h-full w-6 rounded-full bg-white"></div>
                        </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                        <LabelArea label={'Apply to'} />
                        <div className="col-span-8 sm:col-span-4">
                            <select value={details.apply_to} onChange={e=>setDetails({...details, apply_to: e.target.value, title: e.target.value})} name="title" className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent">
                                <option value="">Select apply to</option>
                                <option value="order">Order</option>
                                <option value="delivery_fee">Delivery Fee</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                        <LabelArea label={'Discount type'} />
                        <div className="col-span-8 sm:col-span-4">
                            <select value={details.discount_type} onChange={e=>setDetails({...details, discount_type: e.target.value, title: e.target.value})} name="title" className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent">
                                <option value="">Select discount type</option>
                                <option value="amount">Amount</option>
                                <option value="percentage">Percentage</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                        <LabelArea label={'Discount'} />
                        <div className="col-span-8 sm:col-span-4">
                            <input value={details.discount} onChange={e=>setDetails({...details, discount: e.target.value, title: e.target.value})} name="title"
                                type="number"
                                placeholder={'Discount'} className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent"/>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                        <LabelArea label={'Minimum order amount'} />
                        <div className="col-span-8 sm:col-span-4">
                            <input value={details.min_order_amount} onChange={e=>setDetails({...details, min_order_amount: e.target.value, title: e.target.value})} name="title"
                                type="number"
                                placeholder={'Minimum order amount'} className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent"/>
                        </div>
                    </div>
                </section>

                <div className="formButtons w-full grid grid-cols-2 bg-gray-800 gap-3 items-center py-6 px-3">
                    <div onClick={()=>close()} className="w-full h-12 cursor-pointer hover:bg-gray-600 rounded-lg flex justify-center items-center bg-gray-700 text-gray-500">Cancel</div>
                    <button className="w-full h-12 rounded-lg flex justify-center items-center bg-green-500 text-white">Bulk Update Promocodes</button>
                </div>
            </FormSection>

    </Container>
}

export default BulkUpdateCoupon