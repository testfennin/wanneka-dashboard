import { Button } from "@windmill/react-ui";
import React, { useContext } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useLocation } from "react-router-dom";

//internal import
import spinnerLoadingImage from "assets/img/spinner.gif";
import { SidebarContext } from "context/SidebarContext";
import AdminServices from "services/AdminServices";
import CategoryServices from "services/CategoryServices";
import CouponServices from "services/CouponServices";
import CustomerServices from "services/CustomerServices";
import LanguageServices from "services/LanguageServices";
import ProductServices from "services/ProductServices";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import useToggleDrawer from "hooks/useToggleDrawer";
import AttributeServices from "services/AttributeServices";
import CurrencyServices from "services/CurrencyServices";
import { notifyError, notifySuccess } from "utils/toast";
import styled from "styled-components";
import { GiftCardServices } from "services/GiftCardServices";

const DeleteModal = ({ id, ids, setIsCheck, category, title, useParamId, close, fetchData }) => {
  const { closeModal, setIsUpdate } = useContext(SidebarContext);
  const { setServiceId } = useToggleDrawer();
  const location = useLocation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    // return notifyError("CRUD operation is disabled for this option!");
    try {
      setIsSubmitting(true);
      if (location.pathname === "/products") {
        if (ids) {
          const res = await ProductServices.deleteManyProducts(ids)
          if(res){
            close();
            fetchData();
            setIsCheck([])
          }
        } else if (id) {
          const res = await ProductServices.deleteProduct(id);
          if(res){
            close();
            fetchData();
          }
        }
      }

      if (location.pathname === "/coupons") {
        if (ids) {
          for (const [idx, id] of ids.entries()) {
            const res = await CouponServices.deleteCoupon(id);
            if (idx === ids.length - 1 && res) {
              close();
              fetchData();
              setIsCheck([]);
            }
          }
        } else {
          const res = await CouponServices.deleteCoupon(id);
          if(res){
            close();
            fetchData();
          }
        }
      }

      if (location.pathname === "/categories" || category) {
        if (ids) {
          for (const [idx, id] of ids.entries()) {
            const res = await CategoryServices.deleteCategory(id);
            if (idx === ids.length - 1 && res) {
              close();
              fetchData();
              setIsCheck([]);
            }
          }
        } else {
          const res = await CategoryServices.deleteCategory(id);
          if(res){
            close();
            fetchData();
          }
        }
      } else if (
        location.pathname === `/categories/${useParamId}` ||
        category
      ) {
        // console.log('delete modal ')
        if (id === undefined || !id) {
          notifyError("Please select a category first!");
          setIsSubmitting(false);
          return closeModal();
        }

        const res = await CategoryServices.deleteCategory(id);
        setIsUpdate(true);
        notifySuccess(res.message);
        closeModal();
        setServiceId();
        setIsSubmitting(false);
      }


      if(location.pathname?.includes('gift-cards')){
        if (ids) {
          for (const [idx, id] of ids.entries()) {
            const res = await GiftCardServices.deleteCard(id);
            if (idx === ids.length - 1 && res) {
              close();
              fetchData();
              setIsCheck([]);
            }
          }
        } else {
          const res = await GiftCardServices.deleteCard(id);
          if(res){
            close();
            fetchData();
          }
        }
      }


      if (location.pathname === "/customers") {
        const res = await CustomerServices.deleteCustomer(id);
        setIsUpdate(true);
        notifySuccess(res.message);
        setServiceId();
        closeModal();
        setIsSubmitting(false);
      }

      if (location.pathname === "/attributes") {
        if (ids) {
          const res = await AttributeServices.deleteManyAttribute({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await AttributeServices.deleteAttribute(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }

      if (
        location.pathname === `/attributes/${location.pathname.split("/")[2]}`
      ) {
        if (ids) {
          const res = await AttributeServices.deleteManyChildAttribute({
            id: location.pathname.split("/")[2],
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          setIsCheck([]);
          closeModal();
          setIsSubmitting(false);
        } else {
          console.log("att value delete", id, location.pathname.split("/")[2]);

          const res = await AttributeServices.deleteChildAttribute({
            id: id,
            ids: location.pathname.split("/")[2],
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }

      if (location.pathname === "/our-staff") {
        const res = await AdminServices.deleteStaff(id);
        setIsUpdate(true);
        notifySuccess(res.message);
        setServiceId();
        closeModal();
        setIsSubmitting(false);
      }

      if (location.pathname === "/languages") {
        if (ids) {
          const res = await LanguageServices.deleteManyLanguage({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await LanguageServices.deleteLanguage(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }

      if (location.pathname === "/currencies") {
        if (ids) {
          const res = await CurrencyServices.deleteManyCurrency({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await CurrencyServices.deleteCurrency(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setServiceId();
      setIsCheck([]);
      closeModal();
      setIsSubmitting(false);
    }
  };

  const { t } = useTranslation();

  return (
    <Container className="bg-gray-800 flex flex-col items-center p-4 rounded-xl ">
      <section className="text-gray-300 flex flex-col items-center w-fit px-6">
        <span className="flex justify-center text-3xl mb-6 text-red-500">
          <FiTrash2 />
        </span>
        <h2 className="text-xl font-medium mb-2">
          {t("DeleteModalH2")} <span className="text-red-500">{title}</span>?
        </h2>
        {ids ? <small className="text-gray-500">{t("DeleteModalPtag")}</small> : <small className="text-gray-500">Once deleted, you will no longer see it in your data.</small>}
        
      </section>
      <section className="flex items-center mt-6">
        <Button
          className="w-full sm:w-auto hover:bg-white hover:border-gray-50"
          layout="outline"
          onClick={close}
        >
          {t("modalKeepBtn")}
        </Button>
        <div className="flex justify-end">
          {isSubmitting ? (
            <Button
              disabled={true}
              type="button"
              className="w-full h-12 sm:w-auto"
            >
              <img
                src={spinnerLoadingImage}
                alt="Loading"
                width={20}
                height={10}
              />{" "}
              <span className="font-serif ml-2 font-light">
                {t("Processing")}
              </span>
            </Button>
          ) : (
            <Button onClick={handleDelete} className="w-full h-12 sm:w-auto">
              {t("modalDeletBtn")}
            </Button>
          )}
        </div>
      </section>
    </Container>
  );
};

const Container = styled.div`
  min-width: 500px;
  @media only screen and (max-width: 555px){
    min-width: 98%;
    width: 98%;
  }
`

export default React.memo(DeleteModal);
