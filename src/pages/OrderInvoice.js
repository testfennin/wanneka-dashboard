import dayjs from "dayjs";
import { useParams } from "react-router";
import ReactToPrint from "react-to-print";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FiPrinter } from "react-icons/fi";
import { IoCloudDownloadOutline } from "react-icons/io5";
import {
  TableCell,
  TableHeader,
  Table,
  TableContainer,
  WindmillContext,
  TableBody,
  TableRow,
} from "@windmill/react-ui";
import { PDFDownloadLink } from "@react-pdf/renderer";

import useAsync from "hooks/useAsync";
import Status from "components/table/Status";
import OrderServices from "services/OrderServices";
import Invoice from "components/invoice/Invoice";
import Loading from "components/preloader/Loading";
import logoDark from "assets/img/logo/logo-dark.svg";
import logoLight from "assets/img/logo/logo-light.svg";
import PageTitle from "components/Typography/PageTitle";
import InvoiceForDownload from "components/invoice/InvoiceForDownload";
import SettingServices from "services/SettingServices";
import { useTranslation } from "react-i18next";
import { giftcardStatus } from "components/GiftCard/GiftCardTable";
import { Link } from "react-router-dom/cjs/react-router-dom";

const OrderInvoice = () => {
  const params = useParams();
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);
  const printRef = useRef();

  const loading = false;
  // const { data, loading } = useAsync(() => OrderServices.getOrderById(id));
  const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);

  const currency = globalSetting?.default_currency || "$";



  const [data, setData] = useState({})
  const fetchData =async ()=>{
    const res = await OrderServices.getOrderById(params.id);
    console.log("order detail", res.data)
    setData(res.data)
  }

  useEffect(()=>{
    fetchData();
    // eslint-disable-next-line
  },[])



  return (
    <>
      <PageTitle> {t("InvoicePageTittle")} </PageTitle>

      <div
        ref={printRef}
        className="bg-white dark:bg-gray-800 mb-4 p-6 lg:p-8 rounded-xl shadow-sm overflow-hidden"
      >
        {!loading && (
          <div className="">
            <div className="flex lg:flex-row md:flex-row flex-col lg:items-center justify-between pb-4 border-b border-gray-50 dark:border-gray-700 dark:text-gray-300">
              <h1 className="font-bold font-serif text-xl uppercase">
                {t("InvoicePageTittle")}
                <p className="text-xs mt-1 text-gray-500">
                  {t("InvoiceStatus")}
                  <span className="pl-2 font-medium text-xs capitalize">
                    {" "}
                    <Status status={data.status} />
                  </span>
                </p>
              </h1>
              <div className="lg:text-right text-left">
                <h2 className="lg:flex lg:justify-end text-lg font-serif font-semibold mt-4 lg:mt-0 lg:ml-0 md:mt-0">
                  {mode === "dark" ? (
                    <img src={logoLight} alt="Shop Wanneka" width="110" />
                  ) : (
                    <img src={logoDark} alt="Shop Wanneka" width="110" />
                  )}
                </h2>
                <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <small>{data?.shipping_address?.recipient_name}</small>
                  <small>{data?.shipping_address?.address}</small>
                  <small>{data?.shipping_address?.recipient_number}</small>
                  <small>{`${data?.shipping_address?.city?.name}, ${data?.shipping_address?.region?.name}, ${data?.shipping_address?.country?.name}`}</small>
                </div>
              </div>
            </div>
            <div className="flex lg:flex-row md:flex-row flex-col justify-between border-b border-gray-50 dark:border-gray-700 py-4">
              <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoiceDate")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 block">
                  {data.order_date !== undefined && (
                    <span>{dayjs(data?.order_date).format("MMMM D, YYYY")}</span>
                  )}
                </span>
              </div>
              <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  Order ID
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 block">
                  #{data?.order_id}
                </span>
              </div>
              <div className="flex flex-col lg:text-right text-left">
                <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoiceTo")}
                </span>
                <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <small>{data?.shipping_address?.recipient_name}</small>
                  <small>{data?.shipping_address?.address}</small>
                  <small>{data?.shipping_address?.recipient_number}</small>
                  <small>{`${data?.shipping_address?.city?.name}, ${data?.shipping_address?.region?.name}, ${data?.shipping_address?.country?.name}`}</small>
                </div>
              </div>
            </div>
            
          </div>
        )}
        <div className="my-8">
          <p className="dark:text-gray-500 mb-2 text-sm font-bold">ORDER ITEMS</p>
          {loading ? (
            <Loading loading={loading} />
          ) : (
            <TableContainer className="">
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>{t("Sr")}</TableCell>
                    <TableCell className="">Product Title</TableCell>
                    <TableCell className="text-center">
                      {t("Quantity")}
                    </TableCell>
                    <TableCell className="text-center">
                      {t("ItemPrice")}
                    </TableCell>
                    <TableCell className="text-left">
                      {t("Status")}
                    </TableCell>
                    <TableCell className="text-right">{t("Amount")}</TableCell>
                  </tr>
                </TableHeader>
                <Invoice
                  data={data?.items}
                  currency={currency}
                  globalSetting={globalSetting}
                  fetchData={fetchData}
                />
              </Table>
            </TableContainer>
          )}
        </div>

        <div className="my-8">
          <p className="dark:text-gray-500 mb-2 text-sm font-bold">GIFT CARDS USED</p>
          {loading ? (
            <Loading loading={loading} />
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {
                data?.gift_cards?.map((card, idx)=>{
                  return <aside key={`order-gift-cards-${idx}`} className=" dark:border-gray-500 dark:text-gray-800 dark:bg-gray-300 bg-gray-100 shadow flex flex-col rounded-xl p-4">
                    <div className="w-full flex items-center justify-between mb-3">
                      <Link to={`/gift-cards/${card?.uid}`}>#{card?.access_code}</Link>
                      <small>{giftcardStatus[card?.status]}</small>
                    </div>
                    <h1 className="text-2xl font-bold text-green-700">${card?.amount}</h1>
                    <small>Expiry: {card?.expiration_date?.split('T')[0]}</small>
                  </aside>
                })
              }
              {data?.gift_cards?.length === 0 && <p className="text-green-600">No Gift Card Used</p>}
            </div>
          )}
        </div>

        <div className="my-8">
          <p className="dark:text-gray-500 mb-2 text-sm font-bold">PROMO CODES USED</p>
          {loading ? (
            <Loading loading={loading} />
          ) : <>
              {
                data?.gift_cards?.length === 0 ? <p className="text-green-600">No Gift Card Used</p> :
                <TableContainer className="">
                  <Table>
                    <TableHeader>
                      <tr>
                        <TableCell>{t("Sr")}</TableCell>
                        <TableCell className="">Code</TableCell>
                        <TableCell className="text-center">
                          Discount Type
                        </TableCell>
                        <TableCell className="text-center">
                          Discount
                        </TableCell>
                        <TableCell className="text-left">
                          Min Order Amount
                        </TableCell>
                        <TableCell className="text-left">
                          Status
                        </TableCell>
                        <TableCell className="text-right">Apply To</TableCell>
                      </tr>
                    </TableHeader>
                    <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 text-serif text-sm ">
                      {data?.promo_codes?.map((item, i) => (
                        <TableRow key={i} className="dark:border-gray-700 dark:text-gray-400">
                          <TableCell className="px-6 py-1 whitespace-nowrap font-normal text-gray-500 text-left">
                            {i + 1}{" "}
                          </TableCell>
                          <TableCell className="px-4 py-1 whitespace-nowrap text-left font-normal cursor-auto text-blue-400">
                            <span className="cursor-pointer">{item?.code}</span>
                          </TableCell>
                          <TableCell className="px-6 py-1 whitespace-nowrap font-bold text-center">
                            {item.discount_type}
                          </TableCell>
                          <TableCell className="px-6 py-1 whitespace-nowrap font-bold text-center">
                            {currency}
                            {parseFloat(item.discount).toFixed(2)}
                            
                          </TableCell>

                          <TableCell className="px-4 py-1 whitespace-nowrap text-left font-bold">
                            {currency}{item?.min_order_amount}
                          </TableCell>

                          <TableCell className="px-4 py-1 whitespace-nowrap text-left font-bold">
                            {item?.status}
                          </TableCell>

                          <TableCell className="px-6 py-1 whitespace-nowrap text-right font-bold text-red-500 dark:text-green-500">
                            {item?.apply_to}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            </>
          }
        </div>

        {!loading && (
          <div className="border rounded-xl border-gray-100 p-8 py-6 bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex lg:flex-row md:flex-row flex-col justify-between">
              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoicepaymentMethod")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold font-serif block">
                  {data.payment_method}
                </span>
              </div>
              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("ShippingCost")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold font-serif block">
                  {currency}
                  {parseFloat(data.shipping_fee).toFixed(2)}
                </span>
              </div>
              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoiceDicount")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold font-serif block">
                  {currency}
                  {data.discount ? parseFloat(data.discount).toFixed(2) : 0}
                </span>
              </div>
              <div className="flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoiceTotalAmount")}
                </span>
                <span className="text-xl font-serif font-bold text-red-500 dark:text-green-500 block">
                  {currency}
                  {parseFloat(data.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {!loading && (
        <div className="mb-4 mt-3 flex justify-between">
          <PDFDownloadLink
            document={
              <InvoiceForDownload
                t={t}
                data={data}
                currency={currency}
                globalSetting={globalSetting}
              />
            }
            fileName="Invoice"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                "Loading..."
              ) : (
                <button className="flex items-center text-sm leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-2 rounded-md text-white bg-green-500 border border-transparent active:bg-green-600 hover:bg-green-600 focus:ring focus:ring-purple-300 w-auto cursor-pointer">
                  Download Invoice
                  <span className="ml-2 text-base">
                    <IoCloudDownloadOutline />
                  </span>
                </button>
              )
            }
          </PDFDownloadLink>

          <ReactToPrint
            trigger={() => (
              <button className="flex items-center text-sm leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-2 rounded-md text-white bg-green-500 border border-transparent active:bg-green-600 hover:bg-green-600 focus:ring focus:ring-purple-300 w-auto">
                {t("PrintInvoice")}
                <span className="ml-2">
                  <FiPrinter />
                </span>
              </button>
            )}
            content={() => printRef.current}
            documentTitle="Invoice"
          />
        </div>
      )}
    </>
  );
};

export default OrderInvoice;
