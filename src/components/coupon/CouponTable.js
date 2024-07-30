import {
  TableBody,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
// import * as dayjs from "dayjs";

//internal import

import { useEffect } from "react";
import { useState } from "react";
import useToggleDrawer from "hooks/useToggleDrawer";
import DeleteModal from "components/modal/DeleteModal";
import CouponDrawer from "components/drawer/CouponDrawer";
import CheckBox from "components/form/CheckBox";
import ShowHideButton from "components/table/ShowHideButton";
import EditDeleteButton from "components/table/EditDeleteButton";
import { showingTranslateValue } from "utils/translate";
import ModalWrapper from "components/common/ModalWrapper";

const CouponTable = ({ lang, isCheck, coupons, setIsCheck, fetchData }) => {
  const { title, } = useToggleDrawer();

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };


  const [isEdit, setEdit] = useState('')
  const [data, setData] = useState({})
  const [isDelete, setDelete] = useState(null)

  useEffect(()=>{
    console.log(coupons)
    // eslint-disable-next-line
  },[])

  return (
    <>

      {
        isDelete && <ModalWrapper center close={()=>setDelete(null)} content={<DeleteModal fetchData={()=>fetchData()} close={()=>setDelete(null)} id={isDelete} title={title} />}/>
      }

      {
        isEdit && <ModalWrapper close={()=>setEdit('')} content={<CouponDrawer data={data} fetchData={()=>fetchData()} close={()=>setEdit('')} id={isEdit} lang={lang} />}/>
      }

      <TableBody>
        {coupons?.map((coupon, i) => (
          <TableRow key={i + 1}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name={coupon?.title?.en}
                id={coupon.uid}
                handleClick={handleClick}
                isChecked={isCheck?.includes(coupon.uid)}
              />
            </TableCell>

            <TableCell>
              <div className="flex items-center">
                {
                  coupon?.used_by?.avatar ? 
                  <div className="min-w-10 w-10 h-10 overflow-hidden mr-2 rounded-full">
                    <img src={coupon?.used_by?.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                   :
                  <div className="min-w-10 w-10 h-10 overflow-hidden mr-2 rounded-full">
                    <img src={'https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png'} alt="" className="w-full h-full object-cover" />
                  </div>
                }
                <div className="flex flex-col">
                  <small>{coupon.used_by?.first_name||''} {coupon.used_by?.last_name||''}</small>
                  <small>{coupon.used_by?.email||''}</small>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <p>{coupon.code}</p>
            </TableCell>
            <TableCell>
              <p>${coupon.min_order_amount}</p>
            </TableCell>
            <TableCell>
              <p>${coupon.discount}</p>
            </TableCell>
            <TableCell>
              <p className="mx-auto text-center">{coupon.apply_to}</p>
            </TableCell>


            <TableCell className="text-center">
              <ShowHideButton id={coupon.uid} val={coupon.status === 'active'?true:false} />
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={coupon?._id}
                isCheck={isCheck}
                handleUpdate={()=>{
                  setEdit(coupon.uid);
                  setData(coupon)
                }}
                // handleUpdate={handleUpdate}
                handleModalOpen={()=>setDelete(coupon?.uid)}
                title={showingTranslateValue(coupon?.title, lang)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CouponTable;
