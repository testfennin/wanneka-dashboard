import Error from "components/form/Error";
import LabelArea from "components/form/LabelArea";
import Title from "components/form/Title";
import useCategorySubmit from "hooks/useCategorySubmit";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
//internal import
import axiosInstance from "utils/axios";
import { FormHeader, FormInputs, FormSection } from "./ProductDrawer";

const CategoryDrawer = ({ id, data, lang, fetchData, close }) => {
  const { t } = useTranslation();

  const {
    register,
    errors,
    handleSelectLanguage,
  } = useCategorySubmit(id, data);


  const [details, setDetails] = useState({
    name: '',
    product_count: 0,
    is_active: false
  });

  useEffect(()=>{
    if(data){
      setDetails(prev=>{
        return {...prev, ...data}
      })
    }
  }, [data])

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let url = id ? `/categories/${id}/` : `/categories/`;
    let method = id ? 'patch' : 'post';
    
    axiosInstance[method](url, details)
      .then(res => {
        console.log(res);
        fetchData();
        close();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className="h-full flex flex-col">
      <FormHeader height={'100px'} className="flex flex-col bg-gray-800 p-6 w-full sticky top-0">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdateCategory")}
            description={t("UpdateCategoryDescription")}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddCategoryTitle")}
            description={t("AddCategoryDescription")}
          />
        )}
      </FormHeader>

      <FormSection className="w-full h-full bg-gray-700 flex flex-col" onSubmit={handleSubmit}>
        <FormInputs height="auto" className=" w-full overflow-y-auto text-gray-300 p-6" id="">
          <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
            <LabelArea label={t("Name")} />
            <div className="col-span-8 sm:col-span-4">
              <aside className="flex items-center h-12 border rounded-lg overflow-hidden">
                  <input value={details.name} onChange={e=>setDetails({...details, name: e.target.value})} name="sku"
                  type="text"
                  placeholder={'Category Name'} className="rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent" />
                </aside>
              <Error errorName={errors.name} />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
            <LabelArea label={'Product count'} />
            <div className="col-span-8 sm:col-span-4">
              <aside className="flex items-center h-12 border rounded-lg overflow-hidden">
                <input value={details.product_count} onChange={e=>setDetails({...details, product_count: e.target.value})} name="sku"
                    type="text"
                    placeholder={'Category Name'} className="rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent" />
              </aside>
              <Error errorName={errors.description} />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
            <LabelArea label={t("Published")} />
            <div className="col-span-8 sm:col-span-4">
              <div style={{width: 50, }} onClick={()=>setDetails({...details, is_active: !details.is_active})} className={`rounded-2xl cursor-pointer h-5 border flex ${details.is_active ? 'justify-end bg-green-500':'bg-red-500'}`}>
                <div className="w-4 h-full rounded-full bg-white"></div>
              </div>
            </div>
          </div>
        </FormInputs>

        <div className="formButtons w-full grid grid-cols-2 bg-gray-800 gap-3 items-center py-6 px-3">
          <div onClick={()=>close()} className="w-full h-12 cursor-pointer hover:bg-gray-600 rounded-lg flex justify-center items-center bg-gray-700 text-gray-500">Cancel</div>
          <button className="w-full h-12 rounded-lg flex justify-center items-center bg-green-500 text-white">{id ? 'Update':'Add'} Category</button>
        </div>
      </FormSection>
    </div>
  );
};


export default CategoryDrawer;
