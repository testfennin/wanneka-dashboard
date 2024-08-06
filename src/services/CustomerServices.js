import axiosInstance from "utils/axios";
import requests from "./httpService";
import { baseUrl } from "./AdminServices";

const CustomerServices = {
  getAllCustomers: async ({ searchText = "" }) => {
    try{
        return axiosInstance.get(`${baseUrl}/customers/`)
    }catch(err){
        console.log(err)
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
    return requests.get(`/customer/${id}`);
  },

  updateCustomer: async (id, body) => {
    return requests.put(`/customer/${id}`, body);
  },

  deleteCustomer: async (id) => {
    return requests.delete(`/customer/${id}`);
  },
};

export default CustomerServices;
