import {
  TableBody,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
// import * as dayjs from "dayjs";

//internal import

import { useState } from "react";
import {Link} from 'react-router-dom'
import useToggleDrawer from "hooks/useToggleDrawer";
import DeleteModal from "components/modal/DeleteModal";
import CouponDrawer from "components/drawer/CouponDrawer";
import CheckBox from "components/form/CheckBox";
import ModalWrapper from "components/common/ModalWrapper";
import SelectStatus from "components/form/SelectStatus";


export const giftcardStatus = {
    active: 'Active',
    inactive: 'Inactive',
    expired: 'Expired'
}

const GiftCardTable = ({ lang, isCheck, coupons: giftcards, setIsCheck, fetchData }) => {
  const { title, } = useToggleDrawer();

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
        isDelete && <ModalWrapper center close={()=>setDelete(null)} content={<DeleteModal fetchData={()=>fetchData()} close={()=>setDelete(null)} id={isDelete} title={title} />}/>
      }

      {
        isEdit && <ModalWrapper close={()=>setEdit('')} content={<CouponDrawer data={data} fetchData={()=>fetchData()} close={()=>setEdit('')} id={isEdit} lang={lang} />}/>
      }

      <TableBody>
        {giftcards?.map((card, i) => (
          <TableRow key={i + 1} className="text-sm" >
            <TableCell>
              <CheckBox
                type="checkbox"
                name={card?.title?.en}
                id={card.uid}
                handleClick={handleClick}
                isChecked={isCheck?.includes(card.uid)}
              />
            </TableCell>

            <TableCell>
              <div className="flex items-center">
                <Link to={`/gift-cards/${card?.uid}`}>{card.access_code}</Link>
              </div>
            </TableCell>

            <TableCell>
              <p>{card.amount}</p>
            </TableCell>
            <TableCell>
                <div className="min-w-[200px] max-h-[100px] overflow-y-auto">
                    {
                        card.description ? <small dangerouslySetInnerHTML={{__html: card.description}}></small> : 'N/A'
                    }
                </div>
            </TableCell>
            <TableCell>
              <p>{card.expiration_date?.split('T')[0]}</p>
            </TableCell>
            <TableCell>
                <div className={`px-3 h-6 font-light flex items-center rounded-xl text-sm ${
                    giftcardStatus[card.status] === giftcardStatus.active ? `text-green-600`:
                    giftcardStatus[card.status] === giftcardStatus.inactive ? `text-orange-400`: `text-red-600`
                }`}>
                    {giftcardStatus[card.status]}
                </div>
              <p className="mx-auto text-center">{card.apply_to}</p>
            </TableCell>

            <TableCell className="text-center">
              {/* <ShowHideButton id={card.uid} val={card.status === 'active'?true:false} /> */}
              <SelectStatus id={card.uid} card={card} fetchData={()=>fetchData()} />
            </TableCell>

            <TableCell>
              <div className="flex items-center justify-end">
                <i onClick={()=>{
                    setEdit(card.uid)
                }} className="fa fa-edit mr-4 cursor-pointer hover:text-green-600"></i>
                <i onClick={()=>{
                    setDelete(card.uid)
                }} className="fa fa-trash cursor-pointer hover:text-red-600"></i>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default GiftCardTable;
