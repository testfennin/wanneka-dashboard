import {
  Document,
  Font,
  Image,
  // Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import logoDark from "../../assets/img/logo/logo-dark.png";
import { showDateFormat } from "utils/dateFormate";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});
Font.register({
  family: "DejaVu Sans",
  fonts: [
    {
      src: "https://kendo.cdn.telerik.com/2017.2.621/styles/fonts/DejaVu/DejaVuSans.ttf",
    },
    {
      src: "https://kendo.cdn.telerik.com/2017.2.621/styles/fonts/DejaVu/DejaVuSans-Bold.ttf",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    marginRight: 10,
    marginBottom: 20,
    marginLeft: 10,
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 29,
    lineHeight: 1.5,
  },
  table: {
    display: "table",
    width: "auto",
    color: "#4b5563",
    marginRight: 10,
    marginBottom: 20,
    marginLeft: 10,
    marginTop: 0,
    borderRadius: "8px",
    borderColor: "#e9e9e9",
    borderStyle: "solid",
    borderWidth: 0.5,
    padding: 0,
    textAlign: "left",
  },
  tableRow: {
    // margin: 'auto',
    flexDirection: "row",
    paddingBottom: 2,
    paddingTop: 2,
    textAlign: "left",
    borderWidth: 0.8,
    borderColor: "#E5E7EB",
    borderBottom: "0",
  },
  tableRowHeder: {
    // margin: 'auto',
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    paddingBottom: 4,
    paddingTop: 4,
    paddingLeft: 0,
    borderBottomWidth: 0.8,
    borderColor: "#E5E7EB",
    borderStyle: "solid",
    textTransform: "uppercase",
    textAlign: "left",
  },
  tableCol: {
    width: "25%",
    textAlign: "left",

    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderLeftWidth: 0.5,
    // borderTopWidth: 0.5,
    // borderBottomWidth: 0.5,
    // borderColor: '#d1d5db',
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    // textAlign:'center',
    paddingLeft: "0",
    paddingRight: "0",
    marginLeft: "13",
    marginRight: "13",
  },

  tableCellQuantity: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    textAlign: "center",
    paddingLeft: "0",
    paddingRight: "0",
    marginLeft: "12",
    marginRight: "12",
  },

  invoiceFirst: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 18,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottom: 1,
    borderColor: "#f3f4f6",
    // backgroundColor:'#EEF2FF',
  },
  invoiceSecond: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 10,
    // backgroundColor:'#EEF2FF',
    paddingLeft: 10,
    paddingRight: 10,
  },
  invoiceThird: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderTop: 1,
    borderColor: "#ffffff",
    backgroundColor: "#f4f5f7",
    borderRadius: 12,
    marginLeft: "13",
    marginRight: "13",

    // backgroundColor:'#F2FCF9',
  },
  logo: {
    width: 64,
    height: 25,
    bottom: 5,
    right: 10,
    marginBottom: 10,
    textAlign: "right",
    color: "#4b5563",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    fontSize: 10.3,

    marginRight: "39%",
    textTransform: "uppercase",
  },
  title: {
    color: "#2f3032",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    fontSize: 8.1,
    textTransform: "uppercase",
  },
  info: {
    fontSize: 9,
    color: "#6b7280",
  },
  infoCost: {
    fontSize: 10,
    color: "#6b7280",
    marginLeft: "4%",
    marginTop: "7px",
    textAlign: "left",
    width: "25%",
  },
  invoiceNum: {
    fontSize: 9,
    color: "#6b7280",
    marginLeft: "6%",
  },
  topAddress: {
    fontSize: 10,
    color: "#6b7280",
    width: "100%",
    marginRight: "62%",
    textAlign: "right",
    whiteSapce: "nowrap",
  },
  amount: {
    fontSize: 10,
    color: "#ef4444",
  },
  totalAmount: {
    fontSize: 10,
    color: "#ef4444",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "right",
  },
  status: {
    color: "#10b981",
  },
  quantity: {
    color: "#1f2937",
    textAlign: "center",
  },
  itemPrice: {
    color: "#1f2937",
    textAlign: "left",
  },
  header: {
    color: "#6b7280",
    fontSize: 9,
    fontFamily: "Open Sans",
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "left",
  },

  thanks: {
    color: "#22c55e",
  },
  infoRight: {
    textAlign: "right",
    fontSize: 9,
    color: "#6b7280",
    width: "25%",
    marginRight: "39%",
    fontFamily: "Open Sans",
    fontWeight: "bold",
  },
  titleRight: {
    textAlign: "right",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    fontSize: 8.1,
    width: "25%",
    marginRight: "39%",
    textTransform: "uppercase",
    color: "#2f3032",
  },
  topBg: {
    // backgroundColor:'#EEF2FF',
  },
  invoiceDiv: {
    alignItems: "baseline",
  },
});

const InvoiceForDownload = ({ data, currency, globalSetting }) => {
  // Language Translation RMK
  const { t } = useTranslation();

  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{...styles.invoiceFirst, justifyContent: 'space-between'}}>
            <View style={styles.invoiceDiv}>
              <Text
                style={{
                  fontFamily: "Open Sans",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  alignItems: "baseline",
                }}
              >
                {t("invoice")}
              </Text>
              <Text style={styles.info}>
                Status :{" "}
                {data?.status === "merged" && (
                  <span style={{ color: "#eab308" }}>{`${data?.status?.charAt(0)?.toUpperCase()}${data?.status?.slice(1)}`}</span>
                )}
                {data?.status === "pending" && (
                  <span style={{ color: "#eab308" }}>{`${data?.status?.charAt(0)?.toUpperCase()}${data?.status?.slice(1)}`}</span>
                )}
                {data?.status === "in_progress" && (
                  <span style={{ color: "#14b8a6" }}>In Progress</span>
                )}
                {data?.status === "completed" && (
                  <span style={{ color: "#14b8a6" }}>{`${data?.status?.charAt(0)?.toUpperCase()}${data?.status?.slice(1)}`}</span>
                )}
                {data?.status === "returned" && (
                  <span style={{ color: "#14b8a6" }}>{`${data?.status?.charAt(0)?.toUpperCase()}${data?.status?.slice(1)}`}</span>
                )}
                {data?.status === "partial_returned" && (
                  <span style={{ color: "#14b8a6" }}>{`${data?.status?.charAt(0)?.toUpperCase()}${data?.status?.slice(1)}`}</span>
                )}
                {data?.status === "delivered" && (
                  <span style={{ color: "#22c55e" }}>{`${data?.status?.charAt(0)?.toUpperCase()}${data?.status?.slice(1)}`}</span>
                )}
                {data?.status === "dancelled" && (
                  <span style={{ color: "#f43f5e" }}>{`${data?.status?.charAt(0)?.toUpperCase()}${data?.status?.slice(1)}`}</span>
                )}
                {data?.status === "deleted" && (
                  <span style={{ color: "#f43f5e" }}>{`${data?.status?.charAt(0)?.toUpperCase()}${data?.status?.slice(1)}`}</span>
                )}
              </Text>
              {globalSetting?.vat_number && (
                <Text style={styles.info}>
                  <p className="font-semibold text-xs capitalize mt-2">
                    VAT Number :{" "}
                    <span className="text-green-500">
                      {globalSetting?.vat_number}
                    </span>
                  </p>
                </Text>
              )}
            </View>

            <View style={{display: 'flex', flexDirection:'column', alignItems: 'flex-end', paddingTop: '15px'}}>
              <Text style={{display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap'}}>
                  <Image
                    src={logoDark}
                    alt="Shop Wanneka"
                    style={{
                      width: 40,
                    }}
                  />
                <Text style={{fontWeight: 'bold', marginLeft: '5px', fontSize: '15px'}}>
                  Shop Wanneka
                </Text>
              </Text>

              <Text style={styles.topAddress}>{globalSetting?.shop_name}</Text>
              <Text style={styles.topAddress}>{globalSetting?.address}</Text>
              <Text style={styles.topAddress}>{globalSetting?.contact}</Text>
              <Text style={styles.topAddress}> {globalSetting?.email}</Text>
              <Text style={styles.topAddress}> {globalSetting?.website}</Text>
            </View>
          </View>

          <View style={styles.invoiceSecond}>
            <View>
              <Text style={styles.title}>{t("date")}</Text>
              <Text style={styles.info}>
                {data?.order_date !== undefined && (
                  <span>
                    {showDateFormat(
                      data?.order_date,
                      globalSetting?.default_date_format
                    )}
                  </span>
                )}
              </Text>
            </View>
            <View>
              <Text style={styles.title}>Order ID</Text>
              <Text style={styles.invoiceNum}>#{data?.order_id}</Text>
            </View>

            <View>
              <Text style={styles.titleRight}>{t("InvoiceTo")}</Text>
              <Text style={styles.infoRight}>{data?.shipping_address?.recipient_name}</Text>
              <Text style={styles.infoRight}>{data?.shipping_address?.address}</Text>
              <Text style={styles.infoRight}>{data?.shipping_address?.recipient_number}</Text>
              <Text style={styles.infoRight}>{`${data?.shipping_address?.city?.name}, ${data?.shipping_address?.region?.name}, ${data?.shipping_address?.country?.name}`}</Text>
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRowHeder}>
              {/* <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  <span style={styles.header}>{t('sr')}</span>
                </Text>
              </View> */}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: 9,
                      fontFamily: "Open Sans",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "left",
                    }}
                  >
                    Product Title
                  </span>
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: 9,
                      fontFamily: "Open Sans",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "center",
                    }}
                  >
                    {t("Quantity")}
                  </span>
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: 9,
                      fontFamily: "Open Sans",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "left",
                    }}
                  >
                    {t("ItemPrice")}
                  </span>
                </Text>
              </View>

              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: 9,
                      fontFamily: "Open Sans",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "right",
                    }}
                  >
                    {t("Amount")}
                  </span>
                </Text>
              </View>
            </View>
            {data?.items?.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {item.product?.name?.substring(0, 20)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellQuantity}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        textAlign: "center",
                        alignItems: "center",
                        fontFamily: "Open Sans",
                      }}
                    >
                      {item.quantity}
                    </span>
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        textAlign: "left",
                        fontFamily: "Open Sans",
                      }}
                    >
                      {currency}
                      {item.unit_price}
                    </span>
                  </Text>
                </View>

                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#ef4444",
                        fontWeight: "bold",
                        textAlign: "right",
                        fontFamily: "Open Sans",
                      }}
                    >
                      {currency}
                      {parseFloat(item.unit_price * item.quantity).toFixed(2)}
                    </span>
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.invoiceThird}>
            <View style={{ width: "25%", alignItems: "baseline" }}>
              <Text style={styles.title}>{t("InvoicepaymentMethod")}</Text>
              <Text style={{ fontSize: 10, color: "#0e9f6e" }}>
                {data?.payment_method}
              </Text>
            </View>
            <View style={{ width: "25%", alignItems: "baseline" }}>
              <Text style={styles.title}>
                <div style={{ width: "25%", alignItems: "baseline" }}>
                  Sub Total
                </div>
              </Text>
              <Text style={styles.title}>
                <div style={{ textAlign: "left" }}>
                  <span style={styles.infoCost}>
                    {currency}

                    {parseFloat(data?.sub_total).toFixed(2) || 0}
                  </span>
                </div>
              </Text>
            </View>

            <View style={{ width: "25%", alignItems: "baseline" }}>
              <Text style={styles.title}>
                <span style={{ textAlign: "left" }}>{t("ShippingCost")}</span>
              </Text>
              <Text style={styles.title}>
                <div style={{ textAlign: "left" }}>
                  <span style={styles.infoCost}>
                    {currency}
                    {parseFloat(data?.shipping_fee).toFixed(2) || 0}
                  </span>
                </div>
              </Text>
            </View>
            <View style={{ width: "25%", alignItems: "baseline" }}>
              <Text style={styles.title}>
                <div style={{ textAlign: "left" }}>{t("discount")} </div>
              </Text>
              <Text style={styles.title}>
                <div style={{ textAlign: "left" }}>
                  <span style={styles.infoCost}>
                    {" "}
                    {currency}
                    {data.discount ? parseFloat(data?.discount).toFixed(2) : 0}
                  </span>
                </div>
              </Text>
            </View>
            <View style={{ width: "25%", alignItems: "baseline" }}>
              <Text style={styles.title}>
                <div
                  style={{ width: "45%", textAlign: "right", float: "left" }}
                >
                  Total
                </div>
              </Text>
              <Text style={styles.title}>
                <span style={styles.totalAmount}>
                  {currency}

                  {parseFloat(data?.total_amount).toFixed(2) || 0}
                </span>
              </Text>
            </View>
          </View>

          <View
            style={{
              textAlign: "center",
              fontSize: 12,
              paddingBottom: 30,
              paddingTop: 30,
            }}
          ></View>
        </Page>
      </Document>
    </>
  );
};

export default InvoiceForDownload;
