import axiosInstance from "utils/axios";
import requests from "./httpService";
import { baseUrl } from "./AdminServices";

const CategoryServices = {
  getAllCategory: async () => {
    return requests.get("/category");
  },

  getAllCategories: async (page, params) => {
    try{
      return axiosInstance.get(`${baseUrl}/categories?page=${page}`)
    }catch(err){
      return err
    }
  },

  bulkUpdateCategory: async (ids, body) => {
    for (const [idx, id] of ids.entries()) {
            const res = await axiosInstance.patch(`/categories/${id}`, body)
            if (idx === ids.length - 1 && res) {
              return res
            }
          }
  },

  getCategoryById: async (id) => {
    return requests.get(`/category/${id}`);
  },

  addCategory: async (body) => {
    return requests.post("/category/add", body);
  },

  addAllCategory: async (body) => {
    return requests.post("/category/add/all", body);
  },

  updateCategory: async (id, body) => {
    try{
      return axiosInstance.patch(`${baseUrl}/categories/${id}/`, body)
    }catch(err){
      return err
    }
  },

  updateStatus: async (id, body) => {
    return requests.put(`/category/status/${id}`, body);
  },

  deleteCategory: async (id, body) => {
    return await axiosInstance.delete(`${baseUrl}/categories/${id}`)
  },

  updateManyCategory: async (body) => {
    return requests.patch("/category/update/many", body);
  },

  deleteManyCategory: async (body) => {
    return requests.patch("/category/delete/many", body);
  },
};

export default CategoryServices;
