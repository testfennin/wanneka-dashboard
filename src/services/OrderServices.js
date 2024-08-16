import axiosInstance from "utils/axios";
import requests from "./httpService";
import { baseUrl } from "./AdminServices";

const OrderServices = {
  getAllOrders: async (page, params)=>{
    try{
      let url = `${baseUrl}/orders?offset=${page}`;
      if (params) url += params;
      let res = await axiosInstance.get(url);
      return res.data
    }catch(err){
      return err
    }
  },
  getOrdersOverview: async ()=>{
    try{
      const res = await axiosInstance.get(`${baseUrl}/analytics/overview/`);
      return res.data;
    }catch(err){
      return err
    }
  },
  getRecentOrders: async ()=>{
    try{
      const res = await axiosInstance.get(`${baseUrl}/orders/recent/`);
      return res.data;
    }catch(err){
      return err
    }
  },
  getWeeklySales: async ()=>{
    try{
      const res = await axiosInstance.get(`${baseUrl}/analytics/weekly-sales-orders/`);
      return res.data;
    }catch(err){
      return err
    }
  },
  getTopSellingProducts: async ()=>{
    try{
      const res = await axiosInstance.get(`${baseUrl}/analytics/top-selling-products/`);
      return res.data;
    }catch(err){
      return err
    }
  },

  getAllOrdersTwo: async ({ invoice, body, headers }) => {
    const searchInvoice = invoice !== null ? invoice : "";
    return requests.get(`/orders/all?invoice=${searchInvoice}`, body, headers);
  },

  // getRecentOrders: async ({
  //   page = 1,
  //   limit = 8,
  //   startDate = "1:00",
  //   endDate = "23:59",
  // }) => {
  //   return requests.get(
  //     `/orders/recent?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
  //   );
  // },

  getOrderCustomer: async (id, body) => {
    return requests.get(`/orders/customer/${id}`, body);
  },

  getOrderById: async (id) => {
    return await axiosInstance.get(`/orders/${id}`);
  },

  updateOrder: async (id, body) => {
    return await axiosInstance.patch(`/orders/${id}/`, body)
    // return requests.put(`/orders/${id}`, body, headers);
  },
  updateItem: async (id, body) => {
    return await axiosInstance.patch(`/orderitems/${id}/`, body)
    // return requests.put(`/orders/${id}`, body, headers);
  },

  deleteOrder: async (id) => {
    return requests.delete(`/orders/${id}`);
  },

  getDashboardOrdersData: async ({
    page = 1,
    limit = 8,
    endDate = "23:59",
  }) => {
    return requests.get(
      `/orders/dashboard?page=${page}&limit=${limit}&endDate=${endDate}`
    );
  },

  getDashboardAmount: async () => {
    return requests.get("/orders/dashboard-amount");
  },

  getDashboardCount: async () => {
    return requests.get("/orders/dashboard-count");
  },

  getDashboardRecentOrder: async ({ page = 1, limit = 8 }) => {
    return requests.get(
      `/orders/dashboard-recent-order?page=${page}&limit=${limit}`
    );
  },

  getBestSellerProductChart: async () => {
    return requests.get("/orders/best-seller/chart");
  },
};

export default OrderServices;
