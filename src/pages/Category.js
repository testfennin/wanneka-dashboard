import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";

//internal import

import useAsync from "hooks/useAsync";
import { SidebarContext } from "context/SidebarContext";
import CategoryServices from "services/CategoryServices";
import useToggleDrawer from "hooks/useToggleDrawer";
import useFilter from "hooks/useFilter";
import DeleteModal from "components/modal/DeleteModal";
import BulkActionDrawer from "components/drawer/BulkActionDrawer";
import PageTitle from "components/Typography/PageTitle";
import MainDrawer from "components/drawer/MainDrawer";
import CategoryDrawer from "components/drawer/CategoryDrawer";
import UploadManyTwo from "components/common/UploadManyTwo";
import SwitchToggleChildCat from "components/form/SwitchToggleChildCat";
import TableLoading from "components/preloader/TableLoading";
import CheckBox from "components/form/CheckBox";
import CategoryTable from "components/category/CategoryTable";
import NotFound from "components/table/NotFound";
import ModalWrapper from "components/common/ModalWrapper";
import BulkUpdateCategory from "components/category/BulkUpdate";

const Category = () => {
  const { toggleDrawer, lang } = useContext(SidebarContext);
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchData = (page, params) => {
    CategoryServices.getAllCategories(page||0, params)
    .then(res=>{
      console.log(res)
      setData(res.data)
    }).catch(err=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    fetchData();
  },[])
  // const { data, loading } = useAsync(CategoryServices.getAllCategory);
  const { data: getAllCategories } = useAsync(CategoryServices.getAllCategories);

  const { allId, serviceId } = useToggleDrawer();

  const { t } = useTranslation();

  const {
    handleSubmitCategory,
    categoryRef,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleChangePage,
    filename,
    isDisabled,
    handleSelectFile,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(data[0]?.children ? data[0]?.children : data);

  // react hooks
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [showChild, setShowChild] = useState(false);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data[0]?.children.map((li) => li.uid));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const [isAdd, setAdd] = useState(false)
  const [isDelete, setDelete] = useState(null)

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
      <PageTitle>{t("Category")}</PageTitle>

      {isBulkUpdate && <ModalWrapper center close={()=>setBulkUpdate(false)} content={<BulkUpdateCategory close={()=>setBulkUpdate(false)} fetchData={fetchData} ids={isCheck} setIsCheck={val=>setIsCheck(val)} />}/>}
      {isBulkDelete && <ModalWrapper center close={()=>setBulkDelete(false)} content={<DeleteModal fetchData={fetchData} ids={isCheck} setIsCheck={val=>setIsCheck(val)} close={()=>setBulkDelete(false)} title={`${isCheck.length} selected categories`} />}/>}
      
      {isDelete && <ModalWrapper center close={()=>setDelete(null)} content={<DeleteModal fetchData={()=>fetchData()} ids={isDelete} setIsCheck={setIsCheck} close={()=>setDelete(null)} />}/>}
      

      <BulkActionDrawer ids={allId} title="Categories" lang={lang} data={data} isCheck={isCheck} />
      {
        isAdd && <ModalWrapper close={()=>setAdd(false)} content={<CategoryDrawer close={()=>setAdd(false)} fetchData={()=>fetchData()} data={data} lang={lang} />}/>
      }
      <MainDrawer>
        <CategoryDrawer fetchData={()=>fetchData()} id={serviceId} data={data} lang={lang} />
      </MainDrawer>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody className="">
          <form onSubmit={handleSubmitCategory} className="py-3  grid gap-4 lg:gap-6 xl:gap-6  xl:flex">
            <div className="flex justify-start w-1/2 xl:w-1/2 md:w-full">
              <UploadManyTwo
                title="Categories"
                exportData={getAllCategories}
                filename={filename}
                isDisabled={isDisabled}
                handleSelectFile={handleSelectFile}
                handleUploadMultiple={handleUploadMultiple}
                handleRemoveSelectFile={handleRemoveSelectFile}
              />
            </div>

            <div className="lg:flex  md:flex xl:justify-end xl:w-1/2  md:w-full md:justify-start flex-grow-0">
              <div className="w-full md:w-40 lg:w-40 xl:w-40 mr-3 mb-3 lg:mb-0">
                <Button
                  disabled={isCheck?.length < 1}
                  onClick={() => handleUpdateMany()}
                  className="w-full rounded-md h-12 text-gray-600 btn-gray"
                >
                  <span className="mr-2">
                    <FiEdit />
                  </span>

                  {t("BulkAction")}
                </Button>
              </div>
              <div className="w-full md:w-32 lg:w-32 xl:w-32  mr-3 mb-3 lg:mb-0">
                <Button
                  disabled={isCheck?.length < 1}
                  onClick={() => handleDeleteMany()}
                  className="w-full rounded-md h-12 bg-red-500 disabled  btn-red"
                >
                  <span className="mr-2">
                    <FiTrash2 />
                  </span>

                  {t("Delete")}
                </Button>
              </div>
              <div className="w-full md:w-48 lg:w-48 xl:w-48">
                <Button onClick={()=>setAdd(true)} className="rounded-md h-12 w-full">
                  <span className="mr-2">
                    <FiPlus />
                  </span>

                  {t("AddCategory")}
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
        <CardBody>
          <form
            onSubmit={handleSubmitCategory}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={categoryRef}
                type="search"
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                placeholder={t("SearchCategory")}
              />
            </div>
          </form>
        </CardBody>
      </Card>

      <SwitchToggleChildCat
        title=" "
        handleProcess={setShowChild}
        processOption={showChild}
        name={showChild}
      />
      {loading ? (
        <TableLoading row={12} col={6} width={190} height={20} />
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>
                  <CheckBox
                    type="checkbox"
                    name="selectAll"
                    id="selectAll"
                    handleClick={handleSelectAll}
                    isChecked={isCheckAll}
                  />
                </TableCell>

                <TableCell>NAME</TableCell>
                <TableCell>PRODUCTS</TableCell>
                <TableCell className="text-center">{t("catPublishedTbl")}</TableCell>
                <TableCell className="text-right">{t("catActionsTbl")}</TableCell>
              </tr>
            </TableHeader>

            <CategoryTable
              data={data}
              lang={lang}
              isCheck={isCheck}
              categories={data?.results}
              fetchData={()=>fetchData()}
              setIsCheck={setIsCheck}
              showChild={showChild}
            />
          </Table>

          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={(p)=>fetchData(p>1?((10*p)-10):0)}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no categories right now." />
      )}
    </>
  );
};

export default Category;
