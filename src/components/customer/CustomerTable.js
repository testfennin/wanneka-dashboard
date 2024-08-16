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
import ModalWrapper from "components/common/ModalWrapper";
import CustomerDrawer from "./CustomerDrawer";


export const walletStatus = {
    completed: 'Completed',
    pending: 'Pending',
}

const CustomerTable = ({ lang, isCheck, coupons: proofs, setIsCheck, fetchData }) => {

  // const handleClick = (e) => {
  //   const { id, checked } = e.target;
  //   setIsCheck([...isCheck, id]);
  //   if (!checked) {
  //     setIsCheck(isCheck.filter((item) => item !== id));
  //   }
  // };


  const [isEdit, setEdit] = useState('')
  const [isDelete, setDelete] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState('')


  return (
    <>

      {
        isDelete && <ModalWrapper center close={()=>setDelete(null)} content={<DeleteModal fetchData={()=>fetchData()} close={()=>setDelete(null)} id={isDelete} title={deleteTitle} />}/>
      }

      {
        isEdit && <ModalWrapper center close={()=>setEdit('')} content={<CustomerDrawer data={isEdit} fetchData={()=>fetchData()} close={()=>setEdit('')} lang={lang} />}/>
      }

      <TableBody>
        {proofs?.map((customer, i) => (
          <TableRow key={i + 1} className="text-sm " >
            {/* <TableCell>
              <CheckBox
                type="checkbox"
                name={customer?.title?.en}
                id={customer.uid}
                handleClick={handleClick}
                isChecked={isCheck?.includes(customer.uid)}
              />
            </TableCell> */}

            <TableCell>
              <Link to={`/customer/${customer.uid}`} className="flex items-center text-blue-500">
                <aside className="w-10 min-w-10 h-10 rounded-full overflow-hidden mr-2 border flex items-center justify-center">
                    {
                        customer?.avatar ? <img src={customer?.avatar} alt="" className="w-full h-full object-cover" /> :
                        <small className="fa fa-user dark:text-white text-gray-500"></small>
                    }
                </aside>
                <aside className="flex flex-col">
                    <small>{customer?.first_name} {customer?.last_name}</small>
                    <small className="dark:text-gray-400">{customer?.email}</small>
                </aside>
              </Link>
            </TableCell>
            
            <TableCell>
                <small className={`${customer?.email_verified ? 'text-green-600':'text-red-600'}`}>{customer?.email_verified ? 'YES':'NO'}</small>
            </TableCell>

            <TableCell>
                <small>{customer?.gender || 'N/A'}</small>
            </TableCell>


            <TableCell>
                {customer?.phone || 'N/A'}
            </TableCell>

            <TableCell>
                <small className={`${customer?.phone_verified ? 'text-green-600':'text-red-600'}`}>{customer?.phone_verified ? 'YES':'NO'}</small>
            </TableCell>

            <TableCell>
                <small>{customer.provider || 'N/A'}</small>
            </TableCell>

            <TableCell>
                <small className={`${!customer?.is_suspended ? 'text-green-600':'text-red-600'}`}>{customer?.is_suspended ? 'YES':'NO'}</small>
            </TableCell>

            <TableCell>
                <small>{customer.created_at?.split('T')[0]}</small>
            </TableCell>

            <TableCell>
              <div className="flex items-center justify-end">
                <i onClick={()=>{
                    setEdit(customer)
                }} className="fa fa-edit mr-4 cursor-pointer hover:text-green-600"></i>
                <i onClick={()=>{
                    setDelete(customer.uid)
                    setDeleteTitle(customer.first_name || customer?.email)
                }} className="fa fa-trash cursor-pointer hover:text-red-600"></i>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CustomerTable;
