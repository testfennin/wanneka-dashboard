import React, { useState } from "react";
import { TableCell, TableBody, TableRow } from "@windmill/react-ui";
import SelectStatus from "components/form/SelectStatus";
import ModalWrapper from "components/common/ModalWrapper";
import Item from "./Item";

const Invoice = ({ data, currency, fetchData }) => {
  const [item, setItem] = useState(null)
  return (
    <>
    {item && <ModalWrapper center close={()=>setItem(null)} title={item?.orderitem_id} content={<Item fetchData={fetchData} item={item} close={()=>setItem(null)}/>}/>}
      <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 text-serif text-sm ">
        {data?.map((item, i) => (
          <TableRow key={i} className="dark:border-gray-700 dark:text-gray-400">
            <TableCell className="px-6 py-1 whitespace-nowrap font-normal text-gray-500 text-left">
              {i + 1}{" "}
            </TableCell>
            <TableCell onClick={()=>setItem(item)} className="px-4 py-1 whitespace-nowrap text-left font-normal cursor-auto text-blue-400">
              <span className="cursor-pointer">{item.product?.name?.slice(0,20)}
              {item.product?.name?.length>20 ? '...':''}</span>
              
            </TableCell>
            <TableCell className="px-6 py-1 whitespace-nowrap font-bold text-center">
              {item.quantity}{" "}
            </TableCell>
            <TableCell className="px-6 py-1 whitespace-nowrap font-bold text-center">
              {currency}
              {parseFloat(item.unit_price).toFixed(2)}
            </TableCell>

            <TableCell className="px-4 py-1 whitespace-nowrap text-left font-bold">
              <SelectStatus id={item?.product?.uid} item={item} fetchData={fetchData} />
            </TableCell>

            <TableCell className="px-6 py-1 whitespace-nowrap text-right font-bold text-red-500 dark:text-green-500">
              {currency}
              {parseFloat(item.total_amount).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default Invoice;
