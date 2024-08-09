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
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";

import { useTranslation } from "react-i18next";
import { SidebarContext } from "context/SidebarContext";
import CouponServices from "services/CouponServices";
import useToggleDrawer from "hooks/useToggleDrawer";
import useFilter from "hooks/useFilter";
import PageTitle from "components/Typography/PageTitle";
import DeleteModal from "components/modal/DeleteModal";
import BulkActionDrawer from "components/drawer/BulkActionDrawer";
import MainDrawer from "components/drawer/MainDrawer";
import CouponDrawer from "components/drawer/CouponDrawer";
import TableLoading from "components/preloader/TableLoading";
import CheckBox from "components/form/CheckBox";
import CouponTable from "components/coupon/CouponTable";
import NotFound from "components/table/NotFound";
import  UploadManyTwo  from 'components/common/UploadManyTwo';
import ModalWrapper from "components/common/ModalWrapper";
import BulkUpdateCoupon from "components/coupon/BulkUpdate";

const Coupons = () => {
  const {  lang } = useContext(SidebarContext);

  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  // const { data, loading } = useAsync(CouponServices.getAllCoupons);

  const fetchData = (page, params, load) => {
    if(load){
      setLoading(true)
    }
    CouponServices.getAllCoupons(page||0, params)
    .then(res=>{
      setLoading(false)
      console.log(res)
      setData(res.data)
    }).catch(err=>{
      setLoading(false)
      console.log(err)
    })
  }

  useEffect(()=>{
    fetchData(null, null, true);
  }, [])

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const { allId, serviceId } = useToggleDrawer();

  const {
    handleSubmitCoupon,
    couponRef,
    serviceData,
    handleSelectFile,
    filename,
    isDisabled,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(data);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data.results?.map((li) => li.uid));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const { t } = useTranslation();

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
      <PageTitle>{t("CouponspageTitle")}</PageTitle>

      {
        isDelete && <ModalWrapper center close={()=>setDelete(null)} content={<DeleteModal fetchData={()=>fetchData()} close={()=>setDelete(null)} setIsCheck={setIsCheck} title="Selected Coupon" />}/>
      }
      {isBulkUpdate && <ModalWrapper center close={()=>setBulkUpdate(false)} content={<BulkUpdateCoupon close={()=>setBulkUpdate(false)} fetchData={fetchData} ids={isCheck} setIsCheck={val=>setIsCheck(val)} />}/>}
      {isBulkDelete && <ModalWrapper center close={()=>setBulkDelete(false)} content={<DeleteModal fetchData={fetchData} ids={isCheck} setIsCheck={val=>setIsCheck(val)} close={()=>setBulkDelete(false)} title={`${isCheck.length} selected promocodes`} />}/>}


      <BulkActionDrawer ids={allId} title="Coupons" />

      {
        isAdd && <ModalWrapper close={()=>setAdd(false)} content={<CouponDrawer close={()=>setAdd(false)} fetchData={()=>fetchData()} data={data} lang={lang} />}/>
      }
      <MainDrawer>
        <CouponDrawer id={serviceId} />
      </MainDrawer>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form onSubmit={handleSubmitCoupon} className="py-3 grid gap-4 lg:gap-6 xl:gap-6  xl:flex">
            <div className="flex justify-start xl:w-1/2  md:w-full">
              <UploadManyTwo
                title="Coupon"
                exportData={data}
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
                  disabled={isCheck.length < 1}
                  onClick={() => handleUpdateMany()}
                  className="w-full rounded-md h-12 btn-gray text-gray-600"
                >
                  <span className="mr-2">
                    <FiEdit />
                  </span>
                  {t("BulkAction")}
                </Button>
              </div>

              <div className="w-full md:w-32 lg:w-32 xl:w-32 mr-3 mb-3 lg:mb-0">
                <Button
                  disabled={isCheck.length < 1}
                  onClick={() => handleDeleteMany()}
                  className="w-full rounded-md h-12 bg-red-500 btn-red"
                >
                  <span className="mr-2">
                    <FiTrash2 />
                  </span>

                  {t("Delete")}
                </Button>
              </div>

              <div className="w-full md:w-48 lg:w-48 xl:w-48">
                <Button onClick={()=>setAdd(true)} className="w-full rounded-md h-12">
                  <span className="mr-2">
                    <FiPlus />
                  </span>
                  {t("AddCouponsBtn")}
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitCoupon}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={couponRef}
                type="search"
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                placeholder={t("SearchCoupon")}
              />
            </div>
          </form>
        </CardBody>
      </Card>

      {loading ? (
        // <Loading loading={loading} />
        <TableLoading row={12} col={8} width={140} height={20} />
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
                <TableCell>USER</TableCell>
                <TableCell>CODE</TableCell>
                <TableCell>MIN ORDER</TableCell>
                <TableCell>DISCOUNT</TableCell>

                <TableCell className="text-center">APPLY TO</TableCell>
                <TableCell className="text-center">STATUS</TableCell>
                <TableCell className="text-right">{t("CoupTblActions")}</TableCell>
              </tr>
            </TableHeader>
            <CouponTable lang={lang} isCheck={isCheck} coupons={data.results} setIsCheck={setIsCheck} fetchData={()=>fetchData()} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={data?.count}
              resultsPerPage={10}
              onChange={(p)=>fetchData(p>1?((10*p)-10):0)}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no coupons right now." />
      )}
    </>
  );
};

export default Coupons;
