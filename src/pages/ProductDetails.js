import {
  Badge,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
//internal import
import AttributeList from "components/attribute/AttributeList";
import MainDrawer from "components/drawer/MainDrawer";
import ProductDrawer from "components/drawer/ProductDrawer";
import Loading from "components/preloader/Loading";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
import useAsync from "hooks/useAsync";
import useFilter from "hooks/useFilter";
import ProductServices from "services/ProductServices";
import SettingServices from "services/SettingServices";
import ModalWrapper from "components/common/ModalWrapper";
import styled from "styled-components";
import AddGallery from "components/product/AddGallery";

const ProductDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [variantTitle, ] = useState([]);
  const { lang } = useContext(SidebarContext);

  const [data,setData] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchData = () => {
    setLoading(true)
    ProductServices.getProductById(id)
    .then(res=>{
      setLoading(false)
      setData(res)
      console.log(res)
    }).catch(err=>{
      setLoading(false)
      console.log(err)
    })
  }

  useEffect(()=>{
    fetchData();
    // eslint-disable-next-line
  },[])


  const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);

  const currency = globalSetting?.default_currency || "$";

  const { handleChangePage, totalResults, resultsPerPage } =
    useFilter(data?.variants || "[]");

  const [isModal, setModal] = useState(null);

  const handleDeleteImage =async (id)=>{
    const res = await ProductServices.deleteGallery(id)
    if(res){
      fetchData()
    }
  }

  // const handleAddGallery = async ()=>{
  //   const res = await ProductServices.addGallery(data)
  //   if(res){
  //     fetchData();
  //   }
  // }


  return (
    <>
      {
        isModal && <ModalWrapper content={isModal} close={()=>setModal(null)}/>
      }

      <MainDrawer product>
        <ProductDrawer id={id} />
      </MainDrawer>

      <PageTitle>{t("ProductDetails")}</PageTitle>
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <div className="inline-block overflow-y-auto h-full align-middle transition-all transform">
          <div className="flex flex-col lg:flex-row md:flex-row items-start w-full overflow-hidden">
            <div className="flex-shrink-0 flex items-center justify-center h-auto">
              {data?.thumbnail ? (
                <img src={data?.thumbnail || ''} alt="product" className="h-64 w-64" />
              ) : (
                <img
                  src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                  alt="product"
                />
              )}
            </div>
            <div className="w-full flex flex-col px-5 md:px-8 pt-5 md:pt-0 text-left">
              <div className="mb-5 block ">
                <div className="font-serif font-semibold py-1 text-sm">
                  <p className="text-sm text-gray-500 pr-4">
                    {t("Status")}:{" "}
                    {data.is_active ? (
                      <span className="text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-400">
                        Inactive
                      </span>
                    )}
                  </p>
                </div>
                <h2 className="text-heading text-lg md:text-xl lg:text-2xl font-semibold font-serif dark:text-gray-400">
                  {data.name}
                </h2>
                <p className="uppercase font-serif font-medium text-gray-500 dark:text-gray-400 text-sm">
                  {t("Sku")} :{" "}
                  <span className="font-bold text-gray-500 dark:text-gray-500">
                    {/* {data?._id !== undefined && data?._id.substring(18, 24)} */}
                    {data?.sku}
                  </span>
                </p>
              </div>
              <div className="font-serif product-price font-bold dark:text-gray-400">
                <span className="inline-block text-2xl">
                  {currency}
                  {data?.price}
                  {parseFloat(data?.discount) >= 1 && (
                    <del className="text-gray-400 dark:text-gray-500 text-lg pl-2">
                      {currency}
                      {data?.sale_price}
                    </del>
                  )}
                </span>
              </div>
              <div className="mb-3">
                {!data?.in_stock ? (
                  <Badge type="danger">
                    <span className="font-bold">{t("StockOut")}</span>{" "}
                  </Badge>
                ) : (
                  <Badge type="success">
                    {" "}
                    <span className="font-bold">{t("InStock")}</span>
                  </Badge>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium pl-4">
                  {t("Quantity")}: {data?.stock || 'N/A'}
                </span>
              </div>
              <p dangerouslySetInnerHTML={{__html: data?.brief_description}} className="text-sm leading-6 text-gray-500 dark:text-gray-400 md:leading-7"></p>
              <div className="flex flex-col mt-4">
                <p className="font-serif font-semibold py-1 text-gray-500 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    {t("Category")}:{" "}
                  </span>{" "}
                  {data?.category?.name}
                  {/* {showingTranslateValue(data?.category?.name, lang)} */}
                </p>
                <div className="flex flex-row">
                  {data.styles?.map((t, i) => (
                    <span
                      key={i + 1}
                      className="bg-gray-200 mr-2 border-0 text-gray-500 rounded-full inline-flex items-center justify-center px-2 py-1 text-xs font-semibold font-serif mt-2 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setModal(<ProductDrawer fetchData={()=>fetchData()} id={id} close={()=>setModal(null)} />)}
                  className="cursor-pointer leading-5 transition-colors duration-150 font-medium text-sm focus:outline-none px-5 py-2 rounded-md text-white bg-green-500 border border-transparent active:bg-green-600 hover:bg-green-600 focus:ring focus:ring-purple-300"
                >
                  {t("EditProduct")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {
        data?.gallery?.length>0 && <>
          <div className="flex items-center my-3">
            <p className="text-2xl text-gray-300">Gallery</p>
          </div>
          <div className="w-full flex overflow-x-auto">
            {
              data?.gallery?.map((val, idx)=>{
                return <ImageView key={'gallery-'+idx} className="min-w-[200px] h-[250px] bg-gray-200 mr-3 overflow-hidden rounded-lg relative">
                  <div className="delHover absolute w-12 h-12 top-0 right-0 cursor-pointer bg-[rgba(0,0,0)] flex justify-center items-center">
                    <i onClick={()=>handleDeleteImage(val.uid)} className="fa fa-trash text-xl text-white hover:text-red-500 ml-2 mb-1"></i>
                  </div>
                  <img src={val.file} alt="" className="w-full h-full object-cover" />
                </ImageView>
              })
            }
            <ImageView onClick={()=>setModal(<AddGallery close={()=>setModal(null)} fetchData={fetchData} product={data}/>)} className="min-w-[200px] h-[250px] text-white bg-gray-400 hover:bg-gray-600 cursor-pointer mr-3 overflow-hidden rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500 cursor-pointer rounded-lg justify-center items-center flex mr-2">
                <i className="fa fa-plus"></i>
              </div>
              Add New
            </ImageView>
          </div>
        </>
      }

      {data?.variants?.length > 0 && !loading && (
        <>
          <PageTitle>{t("ProductVariantList")}</PageTitle>
          <TableContainer className="mb-8 rounded-b-lg">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>{t("SR")}</TableCell>
                  <TableCell>{t("Image")}</TableCell>
                  <TableCell>{t("Combination")}</TableCell>
                  <TableCell>{t("Sku")}</TableCell>
                  <TableCell>{t("Barcode")}</TableCell>
                  <TableCell>{t("OrginalPrice")}</TableCell>
                  <TableCell>{t("SalePrice")}</TableCell>
                  <TableCell>{t("Quantity")}</TableCell>
                </tr>
              </TableHeader>
              <AttributeList
                lang={lang}
                variants={data?.variants}
                currency={currency}
                variantTitle={variantTitle}
              />
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onChange={handleChangePage}
                label="Product Page Navigation"
              />
            </TableFooter>
          </TableContainer>
        </>
      )}
    </>
  );
};

const ImageView = styled.div`
  width: 200px;
  height: 250px;
  .delHover{
    display: none;
    background-color: rgb(0,0,0,.8);
    border-bottom-left-radius: 50%;
  }
  &:hover{
    .delHover{
      display: flex !important;
    }
  }
`

export default ProductDetails;
