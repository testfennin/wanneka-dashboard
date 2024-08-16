import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Pagination,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext, useEffect, useState } from "react";
import { IoCloudDownloadOutline, IoFilterOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import exportFromJSON from "export-from-json";

//internal import
import useFilter from "hooks/useFilter";
import OrderServices from "services/OrderServices";
import NotFound from "components/table/NotFound";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
import OrderTable from "components/order/OrderTable";
import TableLoading from "components/preloader/TableLoading";
import { notifyError } from "utils/toast";
import spinnerLoadingImage from "assets/img/spinner.gif";
import { orderStatuses } from "components/form/SelectStatus";


export const orderItemStatus = {
  pending: 'Pending', 
  confirmed: 'Confirmed', 
  processing: 'Processing', 
  awaiting_shipping: 'Awaiting Shipping', 
  shipped: 'Shipped', 
  delivered: 'Delivered', 
  cancelled: 'Cancelled', 
  returned: 'Returned'
}

const Orders = () => {
  const {
    // setStatus,
    // handleChangePage,
    handleSubmitForAll,
    setStartDate,
    setEndDate,
    lang,
  } = useContext(SidebarContext);

  const { t } = useTranslation();
  const [loadingExport, setLoadingExport] = useState(false);

  
  let loading = false;
  const [data, setData] = useState({});
  const { serviceData, globalSetting } = useFilter(data?.orders);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const fetchData =async (page = 0, params = null,) => {
    const orderData = await OrderServices.getAllOrders(page, params);
    console.log(orderData);
    setData(orderData)
    setFilterData(orderData.results)
  }

  const fetchByLimit = async (limit) =>{
    const orderData = await OrderServices.getAllOrders(null, `&limit=${limit}`);
    setFilterData(orderData.results)
  }

  useEffect(()=>{
    fetchData();
  },[])

  const handleDownloadOrders = async () => {
    try {
      setLoadingExport(true);

      const exportData = data?.results?.map((order) => {
        return {
          "Order ID": order.order_id,
          "Items": `${[...order.items].map((item, idx)=>`${idx+1}. ${item?.product?.name} - ${item?.unit_price}\n`)}`,
          "Status": orderStatuses[order.status],
          "Shipping Fee ($)": order.shipping_fee,
          "Discount ($)": order?.discount || 'N/A',
          "Sub Total ($)": order.sub_total,
          "Total Amount ($)": order.total_amount,
          "Payment Method": order.payment_method,
          "Order Date": `${order.order_date?.split('T')[0]}, ${order.order_date?.split('T')[1]?.split('.')[0]}`,
        };
      });

      exportFromJSON({
        data: exportData,
        fileName: "orders",
        exportType: exportFromJSON.types.csv,
      });
      setLoadingExport(false);
    } catch (err) {
      setLoadingExport(false);

      notifyError(err ? err?.response?.data?.message : err.message);
    }
  };

  useEffect(()=>{
    if(filterData.length === 0){
      setFilterData(data?.results)
    }
    // eslint-disable-next-line
  }, [status, search])



  return (
    <>
      <PageTitle>{t("Orders")}</PageTitle>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form onSubmit={handleSubmitForAll}>

            <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 py-2">
              <div>
                <Label style={{ visibility: "hidden" }}>{t("Download")}</Label>
                <input
                  value={search}
                  onChange={e=>{
                    setFilterData(prev=>{
                      return e.target.value.length>2 ?  prev.filter(order=>(order?.order_id)?.toLowerCase()?.includes(e.target.value.toLowerCase())) : data.results;
                    })
                    setSearch(e.target.value)
                  }}
                  type="text"
                  name="search"
                  className="border border-gray-500 h-12 text-sm focus:outline-none block outline-none  w-full bg-gray-700 text-gray-200 px-3 rounded-lg"
                  placeholder="Search by order ID"
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  onChange={(e) => {
                    setFilterData(()=>{
                      return e.target.value ? [...data.results].filter(order=>order.status === e.target.value) : data?.results
                    })
                    if(filterData.length<1) setFilterData(data.results)
                    setStatus(e.target.value)
                  }}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                >
                  <option value="" defaultValue >
                    All
                  </option>
                  <option value="delivered">Delivered</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </Select>
              </div>

              <div>
                <Label style={{ visibility: "hidden" }}>{t("Download")}</Label>
                <Select
                  onChange={(e) => fetchByLimit(e.target.value)}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                >
                  <option value={null} defaultValue >
                    {/* {t("Orderlimits")} */}
                    All Time
                  </option>
                  <option value="5">{t("DaysOrders5")}</option>
                  <option value="7">{t("DaysOrders7")}</option>
                  <option value="15">{t("DaysOrders15")}</option>
                  <option value="30">{t("DaysOrders30")}</option>
                </Select>
              </div>

            </div>

            <div className="grid gap-4 lg:gap-6 xl:gap-6 md:grid-cols-2 lg:grid-cols-4 sm:grid-cols-1 py-2">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div>
                <Label style={{ visibility: "hidden" }}>{t("Download")}</Label>
                <button
                  onClick={()=>{}}
                  disabled={data?.orders?.length <= 0 || loadingExport}
                  type="button"
                  className={`${
                    (data?.orders?.length <= 0 || loadingExport) &&
                    "opacity-50 cursor-not-allowed bg-red-300"
                  } flex items-center justify-center text-sm leading-5 h-12 w-full text-center transition-colors duration-150 font-medium focus:outline-none px-6 py-2 rounded-md text-white bg-green-500 border border-transparent active:bg-green-600 hover:bg-green-600 focus:ring focus:ring-purple-300`}
                >
                  Apply Filter
                  <span className="ml-2 mt-[0.2rem] text-base">
                    <IoFilterOutline />
                  </span>
                </button>
              </div>

              <div>
                <Label style={{ visibility: "hidden" }}>{t("Download")}</Label>
                {loadingExport ? (
                  <Button disabled={true} type="button" className="h-12 w-full">
                    <img
                      src={spinnerLoadingImage}
                      alt="Loading"
                      width={20}
                      height={10}
                    />{" "}
                    <span className="font-serif ml-2 font-light">
                      Processing
                    </span>
                  </Button>
                ) : (
                  <button
                    onClick={()=>handleDownloadOrders()}
                    disabled={data?.orders?.length <= 0 || loadingExport}
                    type="button"
                    className={`${
                      (data?.orders?.length <= 0 || loadingExport) &&
                      "opacity-50 cursor-not-allowed bg-red-300"
                    } flex items-center justify-center text-sm leading-5 h-12 w-full text-center transition-colors duration-150 font-medium focus:outline-none px-6 py-2 rounded-md text-white bg-green-500 border border-transparent active:bg-green-600 hover:bg-green-600 focus:ring focus:ring-purple-300`}
                  >
                    Download All Orders
                    <span className="ml-2 text-base">
                      <IoCloudDownloadOutline />
                    </span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      {loading ? (
        <TableLoading row={12} col={7} width={160} height={20} />
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 dark:bg-gray-900">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Order ID</TableCell>
                <TableCell>{t("TimeTbl")}</TableCell>
                <TableCell className="text-center">Total Items</TableCell>
                {/* <TableCell>{t("CustomerName")}</TableCell> */}
                <TableCell>{t("MethodTbl")}</TableCell>
                <TableCell>{t("AmountTbl")}</TableCell>
                <TableCell>{t("OderStatusTbl")}</TableCell>
                <TableCell>{t("ActionTbl")}</TableCell>
                <TableCell className="text-right">{t("InvoiceTbl")}</TableCell>
              </tr>
            </TableHeader>

            <OrderTable
              lang={lang}
              orders={filterData}
              globalSetting={globalSetting}
              fetchData={fetchData}
              currency={globalSetting?.default_currency || "$"}
            />
          </Table>

          <TableFooter>
            <Pagination
              totalResults={data?.count}
              resultsPerPage={10}
              onChange={(p) => fetchData(p > 1 ? (10 * p - 10) : 0)}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no orders right now." />
      )}
    </>
  );
};

export default Orders;
