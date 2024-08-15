import {
  Button,
  Card,
  CardBody,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext, useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import { useTranslation } from "react-i18next";
import { SidebarContext } from "context/SidebarContext";
import useFilter from "hooks/useFilter";
import PageTitle from "components/Typography/PageTitle";
import DeleteModal from "components/modal/DeleteModal";
import CheckBox from "components/form/CheckBox";
import NotFound from "components/table/NotFound";
import UploadManyTwo from 'components/common/UploadManyTwo';
import ModalWrapper from "components/common/ModalWrapper";
import BulkUpdateCoupon from "components/coupon/BulkUpdate";
import AddGiftCard from "components/GiftCard/AddGiftCard";
import CustomerTable from "components/customer/CustomerTable";
import CustomerServices from "services/CustomerServices";

const Customers = () => {
  const { lang } = useContext(SidebarContext);

  const [data, setData] = useState({});
  const [display, setDisplay] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page = 0, params = {}, load = false) => {
    if (load) setLoading(true);
    
    try {
      const res = await CustomerServices.getAllCustomers(page, params);
      setData(res.data);
      setDisplay(res.data.results);
      console.log(res.data)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(0, {}, true);
  }, []);

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
    if (!isCheckAll) {
      setIsCheck(data.results?.map((li) => li.uid));
    } else {
      setIsCheck([]);
    }
  };

  const { t } = useTranslation();

  const [isAdd, setAdd] = useState(false);
  const [isBulkDelete, setBulkDelete] = useState(false);
  const [isBulkUpdate, setBulkUpdate] = useState(false);

  const handleDeleteMany = () => setBulkDelete(true);
  const handleUpdateMany = () => setBulkUpdate(true);

  const [search, setSearch] = useState('');
  useEffect(() => {
    if (search.length > 0) {
      const searchText = search.toLowerCase();
      const filteredResults = data.results?.filter(user => {
        const userFirstName = user?.first_name?.toLowerCase() || '';
        const userLastName = user?.last_name?.toLowerCase() || '';
        const userEmail = user?.email?.toLowerCase() || '';
        const phone = user.phone?.toLowerCase() || '';
        const gender = user.gender?.toLowerCase() || '';
        const user_type = user.user_type?.toLowerCase() || '';
        const provider = user.provider?.toString() || '';

        return userFirstName.includes(searchText) ||
               userLastName.includes(searchText) ||
               userEmail.includes(searchText) ||
               phone.includes(searchText) ||
               gender.includes(searchText) ||
               user_type.includes(searchText) ||
               provider.includes(searchText);
      });
      setDisplay(filteredResults.length > 0 ? filteredResults : data.results);
    } else {
      setDisplay(data.results);
    }
  }, [search, data.results]);

  return (
    <>
      <PageTitle>Transactions - Payment Proofs</PageTitle>

      {isBulkUpdate && (
        <ModalWrapper
          center
          close={() => setBulkUpdate(false)}
          content={
            <BulkUpdateCoupon
              close={() => setBulkUpdate(false)}
              fetchData={fetchData}
              ids={isCheck}
              setIsCheck={setIsCheck}
            />
          }
        />
      )}
      {isBulkDelete && (
        <ModalWrapper
          center
          close={() => setBulkDelete(false)}
          content={
            <DeleteModal
              fetchData={fetchData}
              ids={isCheck}
              setIsCheck={setIsCheck}
              close={() => setBulkDelete(false)}
              title={`${isCheck.length} selected customers`}
            />
          }
        />
      )}
      {isAdd && (
        <ModalWrapper
          center
          close={() => setAdd(false)}
          content={
            <AddGiftCard
              close={() => setAdd(false)}
              fetchData={() => fetchData()}
              data={data}
              lang={lang}
            />
          }
        />
      )}

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitCoupon}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 xl:flex"
          >
            <div className="flex justify-start xl:w-1/2 md:w-full">
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

            <div className="lg:flex md:flex xl:justify-end xl:w-1/2 md:w-full md:justify-start flex-grow-0">
              <div className="w-full md:w-40 lg:w-40 xl:w-40 mr-3 mb-3 lg:mb-0">
                <Button
                  disabled={isCheck.length < 1}
                  onClick={handleUpdateMany}
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
                  onClick={handleDeleteMany}
                  className="w-full rounded-md h-12 bg-red-500 btn-red"
                >
                  <span className="mr-2">
                    <FiTrash2 />
                  </span>
                  {t("Delete")}
                </Button>
              </div>

              {/* <div className="w-full md:w-48 lg:w-48 xl:w-48">
                <Button onClick={() => setAdd(true)} className="w-full rounded-md h-12">
                  <span className="mr-2">
                    <FiPlus />
                  </span>
                  Add Gift Card
                </Button>
              </div> */}
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <div className="w-full flex items-center border border-gray-500 rounded-lg px-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by customer's name, gender, phone number, email, provider or user type"
              className="text-sm outline-none bg-transparent border-none text-gray-500 dark:text-gray-100 w-full h-10"
            />
            {search.length > 0 && (
              <i
                onClick={() => setSearch('')}
                className="cursor-pointer fa fa-times text-gray-500 dark:text-gray-100"
              />
            )}
          </div>
        </CardBody>
      </Card>

      {loading ? (
        "Loading"
        // You can add a spinner or loading component here
      ) : display.length !== 0 ? (
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
                <TableCell>CUSTOMER</TableCell>
                <TableCell>EMAIL VERIFIED</TableCell>
                <TableCell>GENDER</TableCell>
                <TableCell>PHONE</TableCell>
                <TableCell>PHONE VERIFIED</TableCell>
                <TableCell>PROVIDER</TableCell>
                <TableCell>USER TYPE</TableCell>
                <TableCell>DATE JOINED</TableCell>
                <TableCell className="text-right">{t("CoupTblActions")}</TableCell>
              </tr>
            </TableHeader>
            <CustomerTable
              lang={lang}
              isCheck={isCheck}
              coupons={display}
              setIsCheck={setIsCheck}
              fetchData={() => fetchData()}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={data?.count || 0}
              resultsPerPage={10}
              onChange={(p) => fetchData(p > 1 ? (10 * p - 10) : 0)}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, Nothing here." />
      )}
    </>
  );
};

export default Customers;
