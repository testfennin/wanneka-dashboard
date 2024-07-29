import axiosInstance from 'utils/axios';
import requests from './httpService';
import { baseUrl } from './AdminServices';

const CouponServices = {
  addCoupon: async (body) => {
    try{
      return axiosInstance.post(`${baseUrl}/promocodes/`, body)
    }catch(err){
      console.log(err)
    }
  },
  addAllCoupon: async (body) => {
    try{
      return axiosInstance.post(`${baseUrl}/promocodes/`, body)
    }catch(err){
      console.log(err)
    }
  },
  getAllCoupons: async (page, params) => {
    try{
      return axiosInstance.get(`${baseUrl}/promocodes?page=${page}`)
    }catch(err){
      console.log(err)
    }
  },
  updateCoupon: async (id, body) => {
    try{
      return axiosInstance.patch(`${baseUrl}/promocodes/${id}/`, body)
    }catch(err){
      console.log(err)
    }
  },
  bulkUpdateCoupon: async (ids, body) => {
    for (const [idx, id] of ids.entries()) {
      const res = await axiosInstance.patch(`/promocodes/${id}/`, body)
      if (idx === ids.length - 1 && res) {
        return res
      }
    }
  },
  getCouponById: async (id) => {
    return requests.get(`/coupon/${id}`);
  },
  updateManyCoupons: async (body) => {
    return requests.patch('/coupon/update/many', body);
  },
  updateStatus: async (id, body) => {
    return requests.put(`/coupon/status/${id}`, body);
  },
  deleteCoupon: async (id) => {
    try{
      return axiosInstance.delete(`${baseUrl}/promocodes/${id}/`,)
    }catch(err){
      console.log(err)
    }
  },
  deleteManyCoupons: async (body) => {
    return requests.patch(`/coupon/delete/many`, body);
  },
};

export default CouponServices;
