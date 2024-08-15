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
import { proofStatus, proofTypes } from "./Proofs";


export const walletStatus = {
    completed: 'Completed',
    pending: 'Pending',
}

const ProofsTable = ({ lang, isCheck, coupons: proofs, setIsCheck, fetchData }) => {

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };


  const [isEdit, setEdit] = useState('')
  const [data] = useState({})
  const [isDelete, setDelete] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState('')


  return (
    <>

      {
        isDelete && <ModalWrapper center close={()=>setDelete(null)} content={<DeleteModal fetchData={()=>fetchData()} close={()=>setDelete(null)} id={isDelete} title={deleteTitle} />}/>
      }

      {
        isEdit && <ModalWrapper close={()=>setEdit('')} content={<CouponDrawer data={data} fetchData={()=>fetchData()} close={()=>setEdit('')} id={isEdit} lang={lang} />}/>
      }

      <TableBody>
        {proofs?.map((proof, i) => (
          <TableRow key={i + 1} className="text-sm" >
            <TableCell>
              <CheckBox
                type="checkbox"
                name={proof?.title?.en}
                id={proof.uid}
                handleClick={handleClick}
                isChecked={isCheck?.includes(proof.uid)}
              />
            </TableCell>

            <TableCell>
              <Link to={`/customer/${proof.user.uid}`} className="flex items-center text-blue-500">
                <aside className="w-10 min-w-10 h-10 rounded-full overflow-hidden mr-2 border">
                    {
                        proof.user?.avatar ? <img src={proof.user?.avatar} alt="" /> :
                        <small className="fa fa-user"></small>
                    }
                </aside>
                <aside className="flex flex-col">
                    <small>{proof.user?.first_name} {proof.user?.last_name}</small>
                    <small className="dark:text-gray-300">{proof.user?.email}</small>
                </aside>
              </Link>
            </TableCell>
            
            <TableCell>
                <aside className="w-10 min-w-10 h-10 rounded-2xl overflow-hidden mr-2 border">
                    {
                        proof.proof ? <img src={proof.proof} alt="" /> :
                        <small className="fa fa-circle text-black"></small>
                    }
                </aside>
            </TableCell>

            <TableCell>
                {
                    proofTypes[proof.type] === proofTypes.order ? <Link to={`/order/${proof.object_id}`} className="text-blue-500"><small>{proof.object_id}</small></Link> :
                    proofTypes[proof.type] === proofTypes.gift_card ? <Link to={`/gift-cards/${proof.object_id}`} className="text-blue-500"><small>{proof.object_id}</small></Link> :
                    <small>{proof.object_id}</small>
                }
            </TableCell>


            <TableCell>
                <small>{proofTypes[proof.type]}</small>
            </TableCell>
            <TableCell>
                <small>{proof.note || 'N/A'}</small>
            </TableCell>
            
            <TableCell className="text-cnter">
                <div className={`h-6 font-light flex items-cener rounded-xl text-sm ${
                    proofStatus[proof.status] === proofStatus.completed ? `text-green-600`: `text-orange-400`
                }`}>
                    {proofStatus[proof.status]}
                </div>
            </TableCell>
            <TableCell>
                <small>{proof.created_at?.split('T')[0]}</small>
            </TableCell>
            <TableCell className="text-center">
              {/* <ShowHideButton id={card.uid} val={card.status === 'active'?true:false} /> */}
              <SelectStatus id={proof.uid} transaction={proof} fetchData={()=>fetchData()} />
            </TableCell>

            <TableCell>
              <div className="flex items-center justify-end">
                <i onClick={()=>{
                    setEdit(proof.uid)
                }} className="fa fa-edit mr-4 cursor-pointer hover:text-green-600"></i>
                <i onClick={()=>{
                    setDelete(proof.uid)
                    setDeleteTitle(proof.object_id)
                }} className="fa fa-trash cursor-pointer hover:text-red-600"></i>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default ProofsTable;
