import axiosInstance from "utils/axios";
import requests from "./httpService";
import { baseUrl, userBaseUrl } from "./AdminServices";
import axios from "axios";

const ProductServices = {

  getAllProducts: async (page, params) => {
    try {
        let url = `${baseUrl}/products?offset=${page}`;
        if (params) url += params
        return await axiosInstance.get(url);
    } catch (err) {
        return err;
    }
  },

  getProductById: async (id) => {
    let res = await axiosInstance.get(`${baseUrl}/products/${id}`)
    return res.data
  },

  updateProduct: async (id, body) => {
    try{
      let url = id ? `/products/${id}/` : `/products/`;
      let method = id ? 'patch' : 'post';
      const res = await axiosInstance[method](url, body);
      return res;
    }catch(err){
      return err
    }
  },

  bulkUpdateProduct: async (body) => {
    try{
      const res = await axiosInstance.post(`/products/bulk-update/`, body);
      return res;
    }catch(err){
      return err
    }
  },

  getStyles: async () => {
    try{
      const res = axios.get(`${userBaseUrl}/styles`)
      return res
    }catch(err){
      return err
    }
  },
  addGallery: async (data) => {
    try{
      const res = axiosInstance.post(`/products/gallery/`, data)
      return res
    }catch(err){
      return err
    }
  },
  deleteGallery: async (id) => {
    try{
      const res = axiosInstance.delete(`/products/gallery/${id}`)
      return res
    }catch(err){
      return err
    }
  },

  addProduct: async (body) => {
    return requests.post("/products/add", body);
  },
  addAllProducts: async (body) => {
    return requests.post("/products/all", body);
  },
  updateManyProducts: async (body) => {
    return requests.patch("products/update/many", body);
  },
  updateStatus: async (id, body) => {
    return requests.put(`/products/status/${id}`, body);
  },

  deleteProduct: async (id) => {
    return await axiosInstance.delete(`${baseUrl}/products/${id}`);
  },
  deleteManyProducts: async (ids) => {
    return await axiosInstance.post(`/products/bulk-delete/`, {uid_list: ids})
  },
};

export default ProductServices;
