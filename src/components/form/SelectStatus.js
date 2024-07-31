import React, { useContext } from "react";
import { Select } from "@windmill/react-ui";

import OrderServices from "services/OrderServices";
import { notifySuccess } from "utils/toast";
import { SidebarContext } from "context/SidebarContext";

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

const SelectStatus = ({ id, order, fetchData, item }) => {
  // console.log('id',id ,'order',order)
  const { setIsUpdate } = useContext(SidebarContext);
  const handleChangeStatus =async (id, status) => {
    // return notifyError("CRUD operation is disabled for this option!");
    if(item){
      const res =await OrderServices.updateItem(id, {status});
      if(res){
        setIsUpdate(true);
        fetchData && fetchData();
      }
    }
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
          Object.keys(orderStatuses(item?'item':'')).map((key, idx)=>{
            return <option defaultValue={(order?.status || item?.status) === key} value={key}>
              {orderStatuses(item?'item':'')[key]}
            </option>
          })
        }
      </Select>
    </>
  );
};

export default SelectStatus;
