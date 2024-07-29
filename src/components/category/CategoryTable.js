import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { Link } from "react-router-dom";

//internal import
import { IoRemoveSharp } from "react-icons/io5";
import useToggleDrawer from "hooks/useToggleDrawer";
import DeleteModal from "components/modal/DeleteModal";
import MainDrawer from "components/drawer/MainDrawer";
import CategoryDrawer from "components/drawer/CategoryDrawer";
import CheckBox from "components/form/CheckBox";
import ShowHideButton from "components/table/ShowHideButton";
import EditDeleteButton from "components/table/EditDeleteButton";
import { showingTranslateValue } from "utils/translate";
import { useState } from "react";
import ModalWrapper from "components/common/ModalWrapper";

const CategoryTable = ({
  lang,
  isCheck,
  categories,
  setIsCheck,
  useParamId,
  showChild,
  fetchData,
}) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

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

  return (
    <>
      {
        isDelete && <ModalWrapper center close={()=>setDelete(null)} content={<DeleteModal fetchData={()=>fetchData()} close={()=>setDelete(null)} useParamId={useParamId} id={isDelete} title={title} />}/>
      }

      {
        isEdit && <ModalWrapper close={()=>setEdit('')} content={<CategoryDrawer data={data} fetchData={()=>fetchData()} close={()=>setEdit('')} id={isEdit} lang={lang} />}/>
      }
      <MainDrawer>
        <CategoryDrawer id={serviceId} data={data} lang={lang} />
      </MainDrawer>

      <TableBody>
        {categories?.map((category, idx) => (
          <TableRow key={category._id || idx}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name="category"
                id={category.uid}
                handleClick={handleClick}
                isChecked={isCheck?.includes(category.uid)}
              />
            </TableCell>
            <TableCell className="font-medium text-sm ">
              <span>{category?.name}</span>
            </TableCell>
            <TableCell className="text-sm">
              {category?.product_count || '0'}
            </TableCell>
            <TableCell className="text-center">
              <ShowHideButton
                id={category.uid}
                category
                val={category.is_active}
              />
            </TableCell>
            <TableCell>
              <EditDeleteButton
                id={category?._id}
                parent={category}
                isCheck={isCheck}
                children={category?.children}
                handleUpdate={()=>{
                  setEdit(category.uid);
                  setData(category)
                }}
                // handleUpdate={handleUpdate}
                handleModalOpen={()=>setDelete(category?.uid)}
                title={category?.name}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CategoryTable;
