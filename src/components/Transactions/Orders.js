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
import { GiftCardServices } from "services/GiftCardServices";
import GiftCardTable from "components/GiftCard/GiftCardTable";
import AddGiftCard from "components/GiftCard/AddGiftCard";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import TransactionServices from "services/TransactionsServices";
import OrdersTransactionTable from "./OrdersTransactionTable";

const OrdersTransactions = () => {
  const {  lang } = useContext(SidebarContext);
  const params = useParams();

  const [data, setData] = useState({})
  const [display, setDisplay] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = (page, params, load) => {
    if(load){
      setLoading(true)
    }

    TransactionServices.getOrdersPayments(page||0, params)
    .then(res=>{
      setLoading(false)
      console.log(res)
      setData(res.data)
      setDisplay(res.data.results)
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


  const {
    handleSubmitCoupon,
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
  const [isBulkDelete, setBulkDelete] = useState(false)
  const [isBulkUpdate, setBulkUpdate] = useState(false)
  const handleDeleteMany = () =>{
    setBulkDelete(true)
  }
  const handleUpdateMany = () =>{
    setBulkUpdate(true)
  }

  const [search, setSearch] = useState('');
  useEffect(()=>{
    if(search.length>0){
      let cards = data.results
      let res = cards?.filter(card=>{
        let code = `${card.access_code}`?.toLowerCase();
        let amount = `${card.amount}`;
        let searchText = search.toLowerCase();

        if(code.includes(searchText) || amount.includes(searchText)){
          return card
        }
      });

      if(res.length>0){
        setDisplay(res)
      }else{
        setDisplay(data.results)
      }
    }else{
      setDisplay(data.results)
    }
  },[search])

  const transactionType = {
    "gift-cards":"Gift Cards",
    "wallets":'Wallets'
  }

  return (
    <>
      <PageTitle>{`Transactions - Orders Payments`}</PageTitle>

      {isBulkUpdate && <ModalWrapper center close={()=>setBulkUpdate(false)} content={<BulkUpdateCoupon close={()=>setBulkUpdate(false)} fetchData={fetchData} ids={isCheck} setIsCheck={val=>setIsCheck(val)} />}/>}
      {isBulkDelete && <ModalWrapper center close={()=>setBulkDelete(false)} content={<DeleteModal fetchData={fetchData} ids={isCheck} setIsCheck={val=>setIsCheck(val)} close={()=>setBulkDelete(false)} title={`${isCheck.length} selected gift card`} />}/>}


      {
        isAdd && <ModalWrapper center close={()=>setAdd(false)} content={<AddGiftCard close={()=>setAdd(false)} fetchData={()=>fetchData()} data={data} lang={lang} />}/>
      }

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
                  Add Gift Card
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
            <div className="w-full flex items-center border border-gray-500 rounded-lg px-4">
              <input value={search} onChange={e=>setSearch(e.target.value)} type="text" placeholder="Search by gift card's code/amount" 
                className="text-sm outline-none bg-transparent border-none text-gray-500 dark:text-gray-100 w-full h-10" />
              {search.length>0 && <i onClick={()=>setSearch('')} className="cursor-pointer fa fa-times text-gray-500 dark:text-gray-100"></i>}
            </div>
        </CardBody>
      </Card>

      {loading ? (
        "Loading"
        // <Loading loading={loading} />
        // <TableLoading row={12} col={8} width={140} height={20} />
      ) : display?.length !== 0 ? (
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
                <TableCell>TRANSACTION ID</TableCell>
                <TableCell >ORDER</TableCell>
                <TableCell className="">AMOUNT</TableCell>
                <TableCell className="text-center">DATE</TableCell>
                <TableCell className="text-center">STATUS</TableCell>
                <TableCell className="text-center">UPDATE STATUS</TableCell>
                <TableCell className="text-right">{t("CoupTblActions")}</TableCell>
              </tr>
            </TableHeader>
            <OrdersTransactionTable lang={lang} isCheck={isCheck} transactions={display} setIsCheck={setIsCheck} fetchData={()=>fetchData()} />
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
        <NotFound title="Sorry, Nothin here." />
      )}
    </>
  );
};

export default OrdersTransactions;
