import {
  Avatar,
  Badge,
  TableBody,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import ModalWrapper from "components/common/ModalWrapper";
import ProductDrawer from "components/drawer/ProductDrawer";
import CheckBox from "components/form/CheckBox";
import DeleteModal from "components/modal/DeleteModal";
import ShowHideButton from "components/table/ShowHideButton";
import useToggleDrawer from "hooks/useToggleDrawer";
import { useState } from "react";
import { Link } from "react-router-dom";

//internal import

const ProductTable = ({ products, isCheck, setIsCheck, currency, lang, fetchData }) => {
  const { title,  } = useToggleDrawer();

  const handleClick = (e) => {
    const { id, checked } = e.target;
    console.log("id", id, checked);

    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const [isEdit, setEdit] = useState(null)
  const [isDelete, setDelete] = useState(null)

  return (
    <>
      {isDelete && <ModalWrapper center close={()=>setDelete(null)} content={<DeleteModal fetchData={fetchData} id={isDelete} close={()=>setDelete(null)} title={title} />}/>}

      {
        isEdit && <ModalWrapper close={()=>setEdit(null)} content={isEdit}/>
      }
      {/* {isCheck?.length < 2 && (
        <MainDrawer>
          <ProductDrawer currency={currency} id={serviceId} />
        </MainDrawer>
      )} */}

      <TableBody>
        {products?.map((product, i) => (
          <TableRow key={i + 1}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name={product?.title?.en}
                id={product.uid}
                handleClick={handleClick}
                isChecked={isCheck?.includes(product.uid)}
              />
            </TableCell>

            <TableCell>
              <Link to={`/product/${product?.uid}`} className="text-blue-400">
                <div className="flex items-center">
                  {product?.thumbnail ? (
                    <Avatar
                      className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                      src={product?.thumbnail}
                      alt="product"
                    />
                  ) : (
                    <Avatar
                      src={`https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png`}
                      alt="product"
                    />
                  )}
                  <div>
                    <h2 className="text-sm font-medium">
                      {product.name?.slice(0,25)}{product.name?.length>25 && '...'}
                    </h2>
                  </div>
                </div>
              </Link>
            </TableCell>

            <TableCell>
                <span className="text-sm">
                  {product?.category?.name}
                  {/* {showingTranslateValue(product?.category?.name, lang)} */}
                </span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {currency}
                {Number(product?.price).toFixed(2)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {currency}
                {parseFloat(product?.sale_price).toFixed(2)}
              </span>
            </TableCell>

            <TableCell>
              {product?.in_stock ? (
                <Badge type="success">In Stock</Badge>
              ) : (
                <Badge type="danger">Out of Stock</Badge>
              )}
            </TableCell>
            <TableCell>
              {product?.is_featured ? <p className="text-green-500">Yes</p>:<p className="text-red-500">No</p>}
            </TableCell>
            <TableCell>
              {product?.is_classic ? <p className="text-green-500">Yes</p>:<p className="text-red-500">No</p>}
            </TableCell>
            <TableCell className="text-center">
              <ShowHideButton id={product?.uid} item={product} fetchData={()=>fetchData()} value={product?.is_active} />
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <i onClick={()=>setEdit(<ProductDrawer id={product?.uid} close={()=>setEdit(null)} fetchData={()=>fetchData()} />)} className="fa fa-edit mr-4 hover:text-green-600 cursor-pointer text-lg"></i>
                <i onClick={()=>setDelete(product?.uid)} className="fa fa-trash hover:text-red-600 cursor-pointer text-lg"></i>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default ProductTable;
