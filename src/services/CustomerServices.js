import axiosInstance from "utils/axios";
import requests from "./httpService";
import { baseUrl } from "./AdminServices";

const CustomerServices = {
  getAllCustomers: async (page, params) => {
        try {
            let url = `${baseUrl}/customers?offset=${page||0}`;
            if (params) url += params
            return await axiosInstance.get(url);
        } catch (err) {
            return err;
        }
    },
  addAllCustomers: async (body) => {
    return requests.post("/customer/add/all", body);
  },
  // user create
  createCustomer: async (body) => {
    return requests.post(`/customer/create`, body);
  },

  filterCustomer: async (email) => {
    return requests.post(`/customer/filter/${email}`);
  },

  getCustomerById: async (id) => {
    try{
      return axiosInstance.get(`${baseUrl}/customers/${id}/`,)
    }catch(err){
      console.log(err)
    }
  },

  updateCustomer: async (id, body) => {
    return requests.put(`/customer/${id}`, body);
  },

  deleteCustomer: async (id) => {
    try{
      return axiosInstance.delete(`${baseUrl}/customers/${id}/`,)
    }catch(err){
      console.log(err)
    }
  },
};

export default CustomerServices;
