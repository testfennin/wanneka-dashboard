import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import PrintReceipt from "components/form/PrintReceipt";
import SelectStatus from "components/form/SelectStatus";
import Status from "components/table/Status";
import Tooltip from "components/tooltip/Tooltip";
import { useTranslation } from "react-i18next";
import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";

const OrderTable = ({ orders, currency, globalSetting, fetchData }) => {
  // console.log('globalSetting',globalSetting)
  const { t } = useTranslation();
  console.log('orders',orders)

  return (
    <>
      <TableBody className="dark:bg-gray-900">
        {orders?.map((order, i) => (
          <TableRow key={i + 1}>
            <TableCell>
              <span onClick={()=>{
                
              }} className={`font-semibold uppercase text-xs ${order?.order_id && `text-blue-400 cursor-pointer hover:scale-105`}`}>
                {order?.order_id ?? order?.orderitem_id}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {`${order?.order_date?.split('T')[0]} ${order?.order_date?.split('T')[1]?.split('.')[0]}`}
              </span>
            </TableCell>

            <TableCell className="text-xs text-center">
              {
                order?.user ? <div className="flex items-center">
                  <aside className="w-8 h-8 min-w-8 rounded-full overflow-hidden border bg-gray-100 mr-2 flex items-center justify-center">
                    {
                      order?.user?.avatar ? <img src={order?.user?.avatar} className="w-full h-full object-cover" alt="" /> : <i className="fa fa-user"></i>
                    }
                  </aside>
                  {
                    order?.user?.first_name ? <div className="flex flex-col text-left text-sm">
                      <span>{order?.user?.first_name} {order?.user?.last_name}</span>
                      <small>{order?.user?.email}</small>
                    </div> : <span>{order?.user?.email}</span>
                  }
                  
                </div> : <span className="text-sm text-center">
                  {order?.items?.length}
                </span>
              }
              
              
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {order?.payment_method ?? '- -'}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {currency}
                {parseFloat(order?.total_amount)?.toFixed(2)}
              </span>
            </TableCell>

            <TableCell className="text-xs">
              <Status status={order?.status} />
            </TableCell>

            <TableCell className="text-center">
              <SelectStatus id={order.uid} order={order} fetchData={fetchData} />
            </TableCell>

            <TableCell className="text-right flex justify-end">
              <div className="flex justify-between items-center">
                <PrintReceipt orderId={order.uid} />

                <span className="p-2 cursor-pointer text-gray-400 hover:text-green-600">
                  <Link to={`/order/${order.uid}`}>
                    <Tooltip
                      id="view"
                      Icon={FiZoomIn}
                      title={t("ViewInvoice")}
                      bgColor="#059669"
                    />
                  </Link>
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default OrderTable;
