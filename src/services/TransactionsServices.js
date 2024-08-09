import axiosInstance from "utils/axios";
import requests from "./httpService";
import { baseUrl, userBaseUrl } from "./AdminServices";
import axios from "axios";

const TransactionServices = {
    getGiftCardPayments: async (page, params) => {
        try {
            let url = `${baseUrl}/transactions/giftcard-payments?offset=${page}`;
            if (params) url += params
            return await axiosInstance.get(url);
        } catch (err) {
            return err;
        }
    },
    getGiftCardPaymentsDetail: async (id) => {
        try {
            return await axiosInstance.get(`${baseUrl}/transactions/giftcard-payments/${id}`);
        } catch (err) {
            return err;
        }
    },
    getOrdersPayments: async (page, params) => {
        try {
            let url = `${baseUrl}/transactions/orders-payments?offset=${page}`;
            if (params) url += params
            return await axiosInstance.get(url);
        } catch (err) {
            return err;
        }
    },
    getOrdersPaymentsDetail: async (id) => {
        try {
            return await axiosInstance.get(`${baseUrl}/transactions/orders-payments/${id}`);
        } catch (err) {
            return err;
        }
    },
    getWalletsPayments: async (page, params) => {
        try {
            let url = `${baseUrl}/transactions/wallets-payments?offset=${page}`;
            if (params) url += params
            return await axiosInstance.get(url);
        } catch (err) {
            return err;
        }
    },
    getWalletsPaymentsDetail: async (id) => {
        try {
            return await axiosInstance.get(`${baseUrl}/transactions/wallets-payments/${id}`);
        } catch (err) {
            return err;
        }
    },
    update: async (url, body) => {
        try {
            return await axiosInstance.patch(`${baseUrl}/transactions${url}/`, body);
        } catch (err) {
            return err;
        }
    },
    deleteTrans: async (url) => {
        try {
            return await axiosInstance.delete(`${baseUrl}/transactions${url}/`);
        } catch (err) {
            return err;
        }
    },

}

export default TransactionServices