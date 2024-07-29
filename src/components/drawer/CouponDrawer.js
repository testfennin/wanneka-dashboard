import { Input } from "@windmill/react-ui";
import DrawerButton from "components/form/DrawerButton";
import Error from "components/form/Error";
import InputArea from "components/form/InputArea";
import InputValue from "components/form/InputValue";
import LabelArea from "components/form/LabelArea";
import SwitchToggle from "components/form/SwitchToggle";
import SwitchToggleFour from "components/form/SwitchToggleFour";
import Title from "components/form/Title";
import Uploader from "components/image-uploader/Uploader";
import useCouponSubmit from "hooks/useCouponSubmit";
import { t } from "i18next";
import { Scrollbars } from "react-custom-scrollbars-2";
import { FormHeader, FormInputs, FormSection, Container } from "./ProductDrawer";
import { useEffect, useState } from "react";
import CouponServices from "services/CouponServices";

const CouponDrawer = ({ id, close,data, fetchData }) => {

  const [details, setDetails] = useState({
    code:'',status:false,apply_to:'order',discount_type: '',discount: 'amount',min_order_amount: ''
  })

  useEffect(()=>{
    if(data){
      Object.keys(details).forEach(key=>{
        setDetails(prev=>{
          return {...prev, [key]:data[key]}
        })
      })
      setDetails(prev=>{
        return {...prev, status: data.status === 'active'?true:false}
      })
    }
  }, [data])

  const handleSubmit =async (e) => {
    e.preventDefault();

    let data = {
      ...details,
      status: details.status?'active':'inactive'
    }
    if(id){
      const res = await CouponServices.updateCoupon(id, data);
      if(res){
        close();
        fetchData();
      }
    }else{
      const res = await CouponServices.addCoupon(data);
      if(res){
        close();
        fetchData();
      }
    }
  }

  return (
    <Container className="h-full flex flex-col justify-between">
        <div className="w-full p-6 border-b border-gray-500 bg-gray-800 text-gray-300">
          {
            id ? <aside className="flex flex-col">
                  <h1 className="font-semibold text-lg">Update Promocode</h1>
                  <p>Update promocode info, combinations and extras.</p>
                </aside> : <aside className="flex flex-col">
                  <h1 className="font-semibold text-lg">Add Promocode</h1>
                  <p>Add promocode info, combinations and extras.</p>
                </aside>
          }
        </div>

      <FormSection onSubmit={e=>handleSubmit(e)} className="w-full relative dark:bg-gray-700 dark:text-gray-200">
        <FormInputs>
          <div className="w-full p-6 border-b border-gray-500 bg-gray-800 text-gray-300">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={'Promocode code'} />
              <div className="col-span-8 sm:col-span-4">
                  <input required value={details.code} onChange={e=>setDetails({...details, code: e.target.value, title: e.target.value})} name="title"
                    type="text"
                    placeholder={'Promocode Code'} className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent"/>
                </div>
            </div>

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
                  <select required value={details.apply_to} onChange={e=>setDetails({...details, apply_to: e.target.value, title: e.target.value})} name="title" className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent">
                    <option value="">Select apply to</option>
                    <option value="order">Order</option>
                    <option value="delivery_fee">Delivery Fee</option>
                  </select>
                </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={'Discount type'} />
              <div className="col-span-8 sm:col-span-4">
                  <select required value={details.discount_type} onChange={e=>setDetails({...details, discount_type: e.target.value, title: e.target.value})} name="title" className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent">
                    <option value="">Select discount type</option>
                    <option value="amount">Amount</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={'Discount'} />
              <div className="col-span-8 sm:col-span-4">
                  <input required value={details.discount} onChange={e=>setDetails({...details, discount: e.target.value, title: e.target.value})} name="title"
                    type="number"
                    placeholder={'Discount'} className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent"/>
                </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={'Minimum order amount'} />
              <div className="col-span-8 sm:col-span-4">
                  <input required value={details.min_order_amount} onChange={e=>setDetails({...details, min_order_amount: e.target.value, title: e.target.value})} name="title"
                    type="number"
                    placeholder={'Minimum order amount'} className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent"/>
                </div>
            </div>


          </div>
        </FormInputs>
        <div className="formButtons w-full grid grid-cols-2 bg-gray-800 gap-3 items-center py-6 px-3">
          <div onClick={()=>close()} className="w-full h-12 cursor-pointer hover:bg-gray-600 rounded-lg flex justify-center items-center bg-gray-700 text-gray-500">Cancel</div>
          <button className="w-full h-12 rounded-lg flex justify-center items-center bg-green-500 text-white">{id ? 'Update':'Add'} Promocode</button>
        </div>
      </FormSection>
    </Container>
  );
};

export default CouponDrawer;
