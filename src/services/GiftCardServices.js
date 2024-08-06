import axiosInstance from "utils/axios"
import { baseUrl } from "./AdminServices"

export const GiftCardServices = {
    getAll: async (page)=>{
        try{
            return axiosInstance.get(`${baseUrl}/giftcards?offset=${page}`)
        }catch(err){
            console.log(err)
        }
    },
    addCard: async (body)=>{
        try{
            return axiosInstance.post(`${baseUrl}/giftcards/`, body)
        }catch(err){
            console.log(err)
        }
    },
    updateCard: async (id, body)=>{
        try{
            return axiosInstance.patch(`${baseUrl}/giftcards/${id}/`, body)
        }catch(err){
            console.log(err)
        }
    },
    deleteCard: async (id)=>{
        try{
            return axiosInstance.delete(`${baseUrl}/giftcards/${id}/`)
        }catch(err){
            console.log(err)
        }
    },
}