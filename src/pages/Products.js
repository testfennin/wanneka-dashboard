import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Select,
  Input,
  Button,
  Card,
  CardBody,
  Pagination,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";

import useAsync from "hooks/useAsync";
import useToggleDrawer from "hooks/useToggleDrawer";
import UploadManyTwo from "components/common/UploadManyTwo";
import NotFound from "components/table/NotFound";
import ProductServices from "services/ProductServices";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
import ProductTable from "components/product/ProductTable";
import SelectCategory from "components/form/SelectCategory";
import MainDrawer from "components/drawer/MainDrawer";
import ProductDrawer from "components/drawer/ProductDrawer";
import CheckBox from "components/form/CheckBox";
import useProductFilter from "hooks/useProductFilter";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import DeleteModal from "components/modal/DeleteModal";
import BulkActionDrawer from "components/drawer/BulkActionDrawer";
import TableLoading from "components/preloader/TableLoading";
import SettingServices from "services/SettingServices";
import ModalWrapper from "components/common/ModalWrapper";
import CategoryServices from "services/CategoryServices";
import BulkUpdateProduct from "components/product/BulkUpdata";

const Products = () => {
  const { title, allId, serviceId } = useToggleDrawer();

  const { t } = useTranslation();
  const {
    toggleDrawer,
    lang,
    currentPage,
    handleChangePage,
    category,
    setCategory,
    searchRef,
    handleSubmitForAll,
    sortedField,
    setSortedField,
    limitData,
  } = useContext(SidebarContext);

  const [data, setData] = useState({})
  const loading = false;

  const fetchData = (page, params) =>{
    ProductServices.getAllProducts(page||0, params)
    .then(res=>{
      setData(res.data)
      setDisplay(res.data?.results)
      console.log(res)
    }).catch(err=>{
      console.log(err)
    })
  }
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState('')
  const [searchText, setSearchText] = useState('')
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(0)

  useEffect(()=>{
    fetchData();
    CategoryServices.getAllCategories().then(res=>setCategories(res.data?.results))
  }, [])

  const [display, setDisplay] = useState([])
  useEffect(()=>{
    let res = []
    if(searchText.length>3){
      res = data?.results?.filter(val=>(val?.name)?.toLowerCase().includes(searchText.toLowerCase()))
      setDisplay(()=>res);
    }else{
      setDisplay(data?.results)
    }
  },[searchText])

  useEffect(()=>{
    let res = []
    if(selectedCat){
      res = data?.results?.filter(val=>val?.category?.uid === selectedCat);
      setDisplay(()=>res);
    }else{
      setDisplay(data.results)
    }
  },[selectedCat])

  // useEffect(()=>{
  //   if(priceMax && priceMin){
  //     fetchData(null, priceMin, priceMax)
  //   }
  // },[priceMax, priceMin])

  const handleFilterSearch = (e)=>{
    e.preventDefault();
    let param = ''
    if(selectedCat) param += `&category=${selectedCat}`
    if(priceMin) param += `&min_price=${priceMin}`
    if(priceMax) param += `&max_price=${priceMax}`
    fetchData(null, param)
  }

  const currency = "$";

  // react hooks
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(display.map((li) => li.uid));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  

  // console.log('productss',products)
  const {
    serviceData,
    filename,
    isDisabled,
    handleSelectFile,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useProductFilter(data?.products);

  const [modal, setModal] = useState(null)
  const closeModal = () => setModal(null)


  const [isBulkDelete, setBulkDelete] = useState(false)
  const [isBulkUpdate, setBulkUpdate] = useState(false)
  const handleDeleteMany = () =>{
    setBulkDelete(true)
  }
  const handleUpdateMany = () =>{
    setBulkUpdate(true)
  }

  return (
    <>
      <PageTitle>{t("ProductsPage")}</PageTitle>
      <BulkActionDrawer ids={allId} title="Products" />

      {isBulkUpdate && <ModalWrapper center close={()=>setBulkUpdate(false)} content={<BulkUpdateProduct close={()=>setBulkUpdate(false)} fetchData={fetchData} ids={isCheck} setIsCheck={val=>setIsCheck(val)} />}/>}

      {isBulkDelete && <ModalWrapper center close={()=>setBulkDelete(false)} content={<DeleteModal fetchData={fetchData} ids={isCheck} setIsCheck={val=>setIsCheck(val)} close={()=>setBulkDelete(false)} title={`${isCheck.length} selected products`} />}/>}

      {modal && <ModalWrapper content={modal} close={()=>closeModal()}/>}

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody className="">
          <form
            onSubmit={handleSubmitForAll}
            className="py-3 md:pb-0 grid gap-4 lg:gap-6 xl:gap-6  xl:flex"
          >
            <div className="flex justify-start xl:w-1/2  md:w-full">
              <UploadManyTwo
                title="Products"
                filename={filename}
                isDisabled={isDisabled}
                totalDoc={data?.totalDoc}
                handleSelectFile={handleSelectFile}
                handleUploadMultiple={handleUploadMultiple}
                handleRemoveSelectFile={handleRemoveSelectFile}
              />
            </div>
            <div className="lg:flex  md:flex xl:justify-end xl:w-1/2  md:w-full md:justify-start flex-grow-0">
              <div className="w-full md:w-40 lg:w-40 xl:w-40 mr-3 mb-3 lg:mb-0">
                <Button
                  disabled={isCheck.length < 1}
                  onClick={() => handleUpdateMany()}
                  className="w-full rounded-md h-12 btn-gray text-gray-600 sm:mb-3"
                >
                  <span className="mr-2">
                    <FiEdit />
                  </span>
                  {t("BulkAction")}
                </Button>
              </div>

              <div className="w-full md:w-32 lg:w-32 xl:w-32 mr-3 mb-3 lg:mb-0">
                <Button
                  disabled={isCheck?.length < 1}
                  onClick={() => handleDeleteMany()}
                  className="w-full rounded-md h-12 bg-red-300 disabled btn-red"
                >
                  <span className="mr-2">
                    <FiTrash2 />
                  </span>

                  {t("Delete")}
                </Button>
              </div>
              <div className="w-full md:w-48 lg:w-48 xl:w-48">
                <Button
                  onClick={()=>setModal(<ProductDrawer close={()=>setModal(null)} fetchData={()=>fetchData()}/>)}
                  className="w-full rounded-md h-12"
                >
                  <span className="mr-2">
                    <FiPlus />
                  </span>
                  {t("AddProduct")}
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
        <CardBody>
          <form
            onSubmit={handleFilterSearch}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >

            {/* Search Product ... */}
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <input
                value={searchText}
                onChange={e=>setSearchText(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-transparent rounded-lg px-2 text-gray-200"
                type="search"
                name="search"
                placeholder="Search Product"
              />
            </div>
            {/* Select Category ... */}
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow ">
              <select value={selectedCat} onChange={e=>{
                setSelectedCat(e.target.value)
              }} name="" id="" className="border text-gray-200 h-12 text-sm focus:outline-none block w-full bg-transparent rounded-lg px-2">
                <option value="">Select Category</option>
                {
                  categories.map(cat=><option key={cat?.uid+'cat'} value={cat.uid}>{cat.name}</option>)
                }
              </select>
            </div>

            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <div style={{width: '200px'}} className="flex justify-between h-12 text-gray-200 border rounded-lg px-2 items-center">
                <small>Price</small>
                <input type="number" value={priceMin} onChange={e=>setPriceMin(e.target.value)} defaultValue={0} className="w-full text-center bg-transparent outline-none border-none h-full" />
                <div className="w-10">--</div>
                <input type="number" value={priceMax} onChange={e=>setPriceMax(e.target.value)} defaultValue={0} className="w-full text-center bg-transparent outline-none border-none h-full" />
              </div>
            </div>
            <button className="h-12 rounded-xl text-white bg-green-600 px-8">Search</button>
          </form>
        </CardBody>
      </Card>

      {loading ? (
        <TableLoading row={12} col={7} width={160} height={20} />
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>
                  <CheckBox
                    type="checkbox"
                    name="selectAll"
                    id="selectAll"
                    isChecked={isCheckAll}
                    handleClick={handleSelectAll}
                  />
                </TableCell>
                <TableCell>{t("ProductNameTbl")}</TableCell>
                <TableCell>{t("CategoryTbl")}</TableCell>
                <TableCell>{t("PriceTbl")}</TableCell>
                <TableCell>Sale Price</TableCell>
                <TableCell>{t("StockTbl")}</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell className="text-center">Classic</TableCell>
                <TableCell className="text-center">
                  {t("PublishedTbl")}
                </TableCell>
                <TableCell className="text-right">{t("ActionsTbl")}</TableCell>
              </tr>
            </TableHeader>
            <ProductTable
              lang={lang}
              isCheck={isCheck}
              products={display}
              fetchData={()=>fetchData()}
              setIsCheck={setIsCheck}
              currency={currency}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={data?.count}
              resultsPerPage={limitData}
              onChange={(p)=>fetchData(p>1?((10*p)-10):0)}
              label="Product Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Product" />
      )}
    </>
  );
};

export default Products;
