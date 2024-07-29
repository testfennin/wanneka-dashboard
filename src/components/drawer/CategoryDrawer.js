import { Input } from "@windmill/react-ui";
import DrawerButton from "components/form/DrawerButton";
import Error from "components/form/Error";
import InputArea from "components/form/InputArea";
import LabelArea from "components/form/LabelArea";
import SwitchToggle from "components/form/SwitchToggle";
import TextAreaCom from "components/form/TextAreaCom";
import Title from "components/form/Title";
import Uploader from "components/image-uploader/Uploader";
import useCategorySubmit from "hooks/useCategorySubmit";
import Tree from "rc-tree";
import React, { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useTranslation } from "react-i18next";
//internal import
import CategoryServices from "services/CategoryServices";
import axiosInstance from "utils/axios";
import { notifyError } from "utils/toast";
import { showingTranslateValue } from "utils/translate";
import { FormHeader, FormInputs, FormSection } from "./ProductDrawer";

const CategoryDrawer = ({ id, data, lang, fetchData, close }) => {
  const { t } = useTranslation();

  const {
    checked,
    register,
    onSubmit,
    // handleSubmit,
    errors,
    imageUrl,
    setImageUrl,
    published,
    setPublished,
    setChecked,
    selectCategoryName,
    setSelectCategoryName,
    handleSelectLanguage,
    isSubmitting,
  } = useCategorySubmit(id, data);

  console.log("image=======>", imageUrl);

  const STYLE = `
  .rc-tree-child-tree {
    display: hidden;
  }
  .node-motion {
    transition: all .3s;
    overflow-y: hidden;
  }
`;

  const motion = {
    motionName: "node-motion",
    motionAppear: false,
    onAppearStart: (node) => {
      return { height: 0 };
    },
    onAppearActive: (node) => ({ height: node.scrollHeight }),
    onLeaveStart: (node) => ({ height: node.offsetHeight }),
    onLeaveActive: () => ({ height: 0 }),
  };

  const renderCategories = (categories) => {
    let myCategories = [];
    // for (let category of categories) {
    for (let category of [{_id: '', name: '', children: []}]) {
      myCategories.push({
        title: showingTranslateValue(category.name, lang),
        key: category._id,
        children:
          category.children?.length  > 0 && renderCategories(category.children),
      });
    }

    return myCategories;
  };

  const findObject = (obj, target) => {
    return obj._id === target
      ? obj
      : obj?.children?.reduce(
          (acc, obj) => acc ?? findObject(obj, target),
          undefined
        );
  };

  const handleSelect = async (key) => {
    // console.log('key', key, 'id', id);
    if (key === undefined) return;
    if (id) {
      const parentCategoryId = await CategoryServices.getCategoryById(key);

      if (id === key) {
        return notifyError("This can't be select as a parent category!");
      } else if (id === parentCategoryId.parentId) {
        return notifyError("This can't be select as a parent category!");
      } else {
        if (key === undefined) return;
        setChecked(key);

        const obj = data[0];
        const result = findObject(obj, key);

        setSelectCategoryName(showingTranslateValue(result?.name, lang));
      }
    } else {
      if (key === undefined) return;
      setChecked(key);

      const obj = data[0];
      const result = findObject(obj, key);

      setSelectCategoryName(showingTranslateValue(result?.name, lang));
    }
  };

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
