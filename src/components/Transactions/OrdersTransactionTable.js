import {
  TableBody,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
// import * as dayjs from "dayjs";

//internal import

import { useState } from "react";
import {Link} from 'react-router-dom'
import DeleteModal from "components/modal/DeleteModal";
import CouponDrawer from "components/drawer/CouponDrawer";
import CheckBox from "components/form/CheckBox";
import ModalWrapper from "components/common/ModalWrapper";
import SelectStatus from "components/form/SelectStatus";


export const orderTransStatus = {
    "pending": 'Pending', 
    "completed": 'Completed', 
    "refunded": 'Refunded', 
    "reversed": 'Reversed'
}

const OrdersTransactionTable = ({ lang, isCheck, transactions, setIsCheck, fetchData }) => {

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };


  const [isEdit, setEdit] = useState('')
  const [data] = useState({})
  const [isDelete, setDelete] = useState(null)


  return (
    <>

      {
        isDelete && <ModalWrapper center close={()=>setDelete(null)} content={<DeleteModal fetchData={()=>fetchData()} close={()=>setDelete(null)} id={isDelete?.uid} title={isDelete?.uid} />}/>
      }

      {
        isEdit && <ModalWrapper close={()=>setEdit('')} content={<CouponDrawer data={data} fetchData={()=>fetchData()} close={()=>setEdit('')} id={isEdit} lang={lang} />}/>
      }

      <TableBody>
        {transactions?.map((trans, i) => (
          <TableRow key={i + 1} className="text-sm" >
            <TableCell>
              <CheckBox
                type="checkbox"
                name={trans?.title?.en}
                id={trans.uid}
                handleClick={handleClick}
                isChecked={isCheck?.includes(trans.uid)}
              />
            </TableCell>

            <TableCell>
                <Link to={`/order/${trans?.uid}`} className="text-blue-500">{trans.uid}</Link>
            </TableCell>

            <TableCell className="">
              <Link to={`/order/${trans?.order?.uid}`} className="text-blue-500">{trans.order?.order_id}</Link>
            </TableCell>
            <TableCell className="">
                <p className="text-">{trans.amount}</p>
            </TableCell>
            <TableCell className="text-center">
              <p>{trans.created_at?.split('T')[0]}</p>
            </TableCell>

            <TableCell className="text-center">
                <div className={`font-light text-sm ${
                    orderTransStatus[trans.status] === orderTransStatus.completed ? `text-green-600`:
                    orderTransStatus[trans.status] === orderTransStatus.pending ? `text-orange-400`: `text-red-600`
                }`}>
                    {orderTransStatus[trans.status]}
                </div>
              {/* <p className="mx-auto text-center">{trans.apply_to}</p> */}
            </TableCell>

            <TableCell className="text-center">
              {/* <ShowHideButton id={card.uid} val={card.status === 'active'?true:false} /> */}
              <SelectStatus id={trans.uid} transaction={trans} fetchData={()=>fetchData()} />
            </TableCell>

            <TableCell>
              <div className="flex items-center justify-end">
                <i onClick={()=>{
                    setEdit(trans.uid)
                }} className="fa fa-edit mr-4 cursor-pointer hover:text-green-600"></i>
                <i onClick={()=>{
                    setDelete(trans)
                }} className="fa fa-trash cursor-pointer hover:text-red-600"></i>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default OrdersTransactionTable;
