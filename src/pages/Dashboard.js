import {
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  WindmillContext,
} from "@windmill/react-ui";
import LineChart from "components/chart/LineChart/LineChart";
import PieChart from "components/chart/Pie/PieChart";
import CardItem from "components/dashboard/CardItem";
import CardItemTwo from "components/dashboard/CardItemTwo";
import ChartCard from "components/chart/ChartCard";
import OrderTable from "components/order/OrderTable";
import TableLoading from "components/preloader/TableLoading";
import NotFound from "components/table/NotFound";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
import * as dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import useAsync from "hooks/useAsync";
import useFilter from "hooks/useFilter";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiRefreshCw, FiShoppingCart, FiTruck } from "react-icons/fi";
import { ImCreditCard, ImStack } from "react-icons/im";
import OrderServices from "services/OrderServices";
//internal import

const Dashboard = () => {
  const { globalSetting } = useFilter();
  const { mode } = useContext(WindmillContext);

  dayjs.extend(isBetween);
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);

  const { currentPage, handleChangePage, lang } = useContext(SidebarContext);

  // react hook
  const [todayCashPayment] = useState(0);
  const [todayCardPayment] = useState(0);
  const [todayCreditPayment] = useState(0);
  const [yesterdayCashPayment] = useState(0);
  const [yesterdayCardPayment] = useState(0);
  const [yesterdayCreditPayment] = useState(0);
  
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [salesReport, setSalesReport] = useState([]);
  const [orderSales, setOrderSales] = useState({
    today: 0, yesterday: 0, month: 0, all: 0
  })
  const [ordersCount, setOrdersCount] = useState({
    total: 0, pending: 0, processing: 0, delivered: 0
  })
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(()=>{
    OrderServices.getOrdersOverview()
    .then(res=>{
      setOrderSales(prev=>{
        return {...prev, 
          today: res.sales?.today_sales,
          yesterday: res.sales?.yesterday_sales,
          month: res.sales?.current_month_sales,
          all: res.sales?.all_time_sales
        }
      })
      setOrdersCount(prev=>{
        return {...prev, 
          total: res?.today_orders?.total_orders,
          pending: res?.today_orders?.pending_orders,
          processing: res.today_orders?.processing_orders,
          delivered: res?.today_orders?.delivered_orders,
        }
      })
    }).catch(err=>{})
    
    OrderServices.getRecentOrders()
    .then(res=>{
      setRecentOrders(res.results)
    }).catch(err=>{
      console.log(err)
    })

    OrderServices.getWeeklySales()
    .then(res=>{
      setSalesReport(res)
    }).catch(err=>{
      console.log(err)
    })

    OrderServices.getTopSellingProducts()
    .then(res=>{
      console.log(res)
      setTopSellingProducts(res)
    }).catch(err=>{
      console.log(err)
    })

    
  }, [])

  const { loading: loadingBestSellerProduct } =
    useAsync(OrderServices.getBestSellerProductChart);

  const { data: dashboardRecentOrder, loading: loadingRecentOrder } = useAsync(
    () => OrderServices.getDashboardRecentOrder({ page: currentPage, limit: 8 })
  );

  const { data: dashboardOrderCount, loading: loadingOrderCount } = useAsync(
    OrderServices.getDashboardCount
  );

  const { loading: loadingOrderAmount } = useAsync(
    OrderServices.getDashboardAmount
  );

  const currency = globalSetting?.default_currency || "$";

  // console.log("dashboardOrderCount", dashboardOrderCount);

  const { serviceData } = useFilter(dashboardRecentOrder?.orders);

  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t("DashboardOverview")}</PageTitle>

      <div className="grid gap-4 mb-8 md:grid-cols-4 xl:grid-cols-4">
        <CardItemTwo
          mode={mode}
          currency={currency}
          title="Today Order"
          title2="TodayOrder"
          Icon={ImStack}
          cash={todayCashPayment || 0}
          card={todayCardPayment || 0}
          credit={todayCreditPayment || 0}
          price={orderSales.today || 0}
          className="text-white dark:text-green-100 bg-teal-500"
          loading={loadingOrderAmount}
        />
        

        <CardItemTwo
          mode={mode}
          currency={currency}
          title="Yesterday Order"
          title2="YesterdayOrder"
          Icon={ImStack}
          cash={yesterdayCashPayment || 0}
          card={yesterdayCardPayment || 0}
          credit={yesterdayCreditPayment || 0}
          price={orderSales.yesterday || 0}
          className="text-white dark:text-orange-100 bg-orange-400"
          loading={loadingOrderAmount}
        />

        <CardItemTwo
          mode={mode}
          currency={currency}
          title2="ThisMonth"
          Icon={FiShoppingCart}
          price={orderSales.month || 0}
          className="text-white dark:text-green-100 bg-blue-500"
          loading={loadingOrderAmount}
        />

        <CardItemTwo
          mode={mode}
          currency={currency}
          title2="AllTimeSales"
          Icon={ImCreditCard}
          price={orderSales.all || 0}
          className="text-white dark:text-green-100 bg-green-500"
          loading={loadingOrderAmount}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CardItem
          title="Total Order"
          Icon={FiShoppingCart}
          loading={loadingOrderCount}
          quantity={ordersCount.total || 0}
          className="text-orange-600 dark:text-orange-100 bg-orange-100 dark:bg-orange-500"
        />
        <CardItem
          title={t("OrderPending")}
          Icon={FiRefreshCw}
          loading={loadingOrderCount}
          quantity={ordersCount.pending || 0}
          amount={dashboardOrderCount?.totalPendingOrder?.total || 0}
          className="text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500"
        />
        <CardItem
          title={t("OrderProcessing")}
          Icon={FiTruck}
          loading={loadingOrderCount}
          quantity={ordersCount.processing || 0}
          className="text-teal-600 dark:text-teal-100 bg-teal-100 dark:bg-teal-500"
        />
        <CardItem
          title={t("OrderDelivered")}
          Icon={FiCheck}
          loading={loadingOrderCount}
          quantity={ordersCount.delivered || 0}
          className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 my-8">
        <ChartCard
          mode={mode}
          loading={loadingOrderAmount}
          title={t("WeeklySales")}
        >
          <LineChart salesReport={salesReport} />
        </ChartCard>

        <ChartCard
          mode={mode}
          loading={loadingBestSellerProduct}
          title={t("BestSellingProducts")}
        >
          <PieChart data={topSellingProducts} />
        </ChartCard>
      </div>

      <PageTitle>{t("RecentOrder")}</PageTitle>

      {/* <Loading loading={loading} /> */}

      {loadingRecentOrder ? (
        <TableLoading row={5} col={4} />
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Order ID</TableCell>
                <TableCell>{t("TimeTbl")}</TableCell>
                <TableCell>{t("CustomerName")} </TableCell>
                <TableCell> {t("MethodTbl")} </TableCell>
                <TableCell> {t("AmountTbl")} </TableCell>
                <TableCell>{t("OderStatusTbl")}</TableCell>
                <TableCell>{t("ActionTbl")}</TableCell>
                <TableCell className="text-right">{t("InvoiceTbl")}</TableCell>
              </tr>
            </TableHeader>

            <OrderTable
              lang={lang}
              orders={recentOrders}
              globalSetting={globalSetting}
              currency={globalSetting?.default_currency || "$"}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={dashboardRecentOrder?.totalOrder}
              resultsPerPage={8}
              onChange={handleChangePage}
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

export default Dashboard;
