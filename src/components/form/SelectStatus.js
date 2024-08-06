import React, { useContext } from "react";
import { Select } from "@windmill/react-ui";

import OrderServices from "services/OrderServices";
import { notifySuccess } from "utils/toast";
import { SidebarContext } from "context/SidebarContext";
import { giftcardStatus } from "components/GiftCard/GiftCardTable";
import { GiftCardServices } from "services/GiftCardServices";

export const orderStatuses = (type) => {
  return type === 'item' ? {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      awaiting_shipping: 'Awaiting Shipping',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      returned: 'Returned',
  }:{
      pending: 'Pending',
      in_progress: 'In Progress',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      returned: 'Returned'
    }
  }

const SelectStatus = ({ id, order, card, fetchData, item }) => {
  // console.log('id',id ,'order',order)
  const { setIsUpdate } = useContext(SidebarContext);
  const handleChangeStatus =async (id, status) => {

    if(item){
      const res =await OrderServices.updateItem(id, {status});
      if(res){
        setIsUpdate(true);
        fetchData && fetchData();
      }
    }
    if(order){
      OrderServices.updateOrder(id, { status: status })
        .then((res) => {
          notifySuccess(res.message);
          setIsUpdate(true);
          fetchData && fetchData();
        })
        .catch((err) => {
          setTimeout(() => {
            fetchData && fetchData();
          }, 2000);
        });
    }
    if(card){
      const res =await GiftCardServices.updateCard(id, {status});
      if(res){
        setIsUpdate(true);
        fetchData && fetchData();
      }
    }
  };


  return (
    <>
      <Select value={(order?.status || item?.status)}
        onChange={(e) => handleChangeStatus(id, e.target.value)}
        className="border border-gray-50 bg-gray-50 h-8 rounded-md text-xs focus:border-gray-400 outline-none"
      >
        <option value="" >
          Set Status
        </option>

        {
          order ? Object.keys(orderStatuses(item?'item':'')).map((key, idx)=>{
            return <option key={`status-${idx}`} defaultValue={(order?.status || item?.status) === key} value={key}>
              {orderStatuses(item?'item':'')[key]}
            </option>
          }) : Object.keys(giftcardStatus).map((key, idx)=>{
            return <option key={`status-${idx}`} defaultValue={(card?.status) === key} value={key}>
              {giftcardStatus[key]}
            </option>
          })
        }
      </Select>
    </>
  );
};

export default SelectStatus;
