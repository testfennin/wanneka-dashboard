import ReactTagInput from "@pathofdev/react-tag-input";
import {
  Button,
  Input,
  TableCell,
  TableContainer,
  TableHeader,
  Textarea,
  Table,
} from "@windmill/react-ui";
import Multiselect from "multiselect-react-dropdown";
import React, { useEffect, useRef, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { MultiSelect } from "react-multi-select-component";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiX } from "react-icons/fi";
import useProductSubmit from "hooks/useProductSubmit";
import UploaderThree from "components/image-uploader/UploaderThree";
import Title from "components/form/Title";
import SwitchToggleForCombination from "components/form/SwitchToggleForCombination";
import ActiveButton from "components/form/ActiveButton";
import LabelArea from "components/form/LabelArea";
import Error from "components/form/Error";
import Uploader from "components/image-uploader/Uploader";
import InputArea from "components/form/InputArea";
import ParentCategory from "components/category/ParentCategory";
import InputValue from "components/form/InputValue";
import InputValueFive from "components/form/InputValueFive";
import AttributeOptionTwo from "components/attribute/AttributeOptionTwo";
import DrawerButton from "components/form/DrawerButton";
import AttributeListTable from "components/attribute/AttributeListTable";
import { showingTranslateValue } from "utils/translate";
import ImageDropzone from "components/form/DragDrop";
import CategoryServices from "services/CategoryServices";
import styled from "styled-components";
import axiosInstance from "utils/axios";
import { baseUrl } from "services/AdminServices";
import ProductServices from "services/ProductServices";
import TextEditor from "components/common/TextEditor";

//internal import

function stripHtmlTags(str) {
  const doc = new DOMParser().parseFromString(str, 'text/html');
  return doc.body.textContent || "";
}

const ProductDrawer = ({ id, close, fetchData }) => {
  const { t } = useTranslation();
  const {
    tag,
    setTag,
    values,
    language,
    register,
    onSubmit,
    errors,
    slug,
    openModal,
    attribue,
    setValues,
    variants,
    imageUrl,
    setImageUrl,
    handleSubmit,
    isCombination,
    variantTitle,
    attributes,
    attTitle,
    handleAddAtt,
    // productId,
    onCloseModal,
    isBulkUpdate,
    globalSetting,
    isSubmitting,
    tapValue,
    setTapValue,
    resetRefTwo,
    handleSkuBarcode,
    handleProductTap,
    selectedCategory,
    setSelectedCategory,
    setDefaultCategory,
    defaultCategory,
    handleProductSlug,
    handleSelectLanguage,
    handleIsCombination,
    handleEditVariant,
    handleRemoveVariant,
    handleClearVariant,
    handleQuantityPrice,
    handleSelectImage,
    handleSelectInlineImage,
    handleGenerateCombination,
  } = useProductSubmit(id);
  const containerRef = useRef(null);
  const lastElementRef = useRef(null);

  const [details, setDetails] = useState({
    "name": "",
    "sku": "",
    "brief_description": "",
    "description": "",
    "is_classic": false,
    "is_featured": false,
    "in_stock": false,
    "price": "",
    "sale_price": "",
    "discount_type": "percentage",
    "discount": "",
    "length": "",
    "colors": "",
    "weight": 0,
    "thumbnail": "",
    "category": "",
    "is_active": false,
    "title": "",
    "image": "",
    "content": "",
    "styles": []
  });
  const [images, setImages] = useState([])
  const [classicImg, setClassicImg] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [moreDetails, setMoreDetails] = useState(false)

  const [categories, setCategories] = useState([])
  const [styles, setStyles] = useState([])

  const scrollBottom = () => {
    if (containerRef.current && lastElementRef.current) {
      containerRef.current.scrollTop = lastElementRef.current.offsetTop;
    }
  }

  const getCategories =async ()=>{
    const res = await CategoryServices.getAllCategories()
    setCategories(res.data?.results)

    if(id){
      const product = await ProductServices.getProductById(id)
      console.log(product)
      Object.keys(product).forEach(key=>{
        switch(key){
          case 'thumbnail':
            setThumbnail(product[key])
            setDetails(prev=>{
              return {...prev, [key]:product[key]}
            })
            break;
          case 'classic_product_detail':
            setClassicImg(product[key]?.image)
            setDetails(prev=>{
              return {...prev, image:product[key]?.image, content: product[key]?.content, title: product[key]?.title}
            })
            break;
          case 'category':
            setDetails(prev=>{
              return {...prev, [key]: product[key]?.uid}
            })
            break;
          case 'discount_type':
            setDetails(prev=>{
              return {...prev, [key]: 'percentage'}
            })
            break;
          case 'is_active':
            setDetails(prev=>{
              return {...prev, [key]: Boolean(product[key])}
            })
            break;
          case 'weight':
            setDetails(prev=>{
              return {...prev, [key]: parseInt(product[key] || '0')}
            })
            break;
          default:
            setDetails(prev=>{
              return {...prev, [key]:product[key]}
            })
        }
      })
    }
  }

  const getStyles = async () =>{
    const res = await ProductServices.getStyles();
    setStyles(res.data)
  }

  useEffect(()=>{
    setMoreDetails(id?true:false)
    getCategories();
    getStyles();
  },[]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDetails({...details, image: file})
      setClassicImg(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    let data = details;
    delete data.classic_product_detail;

    if(typeof data.thumbnail !== 'object'){
      delete data.thumbnail
    }
    
    // data.gallery = images
    if(!data.is_classic){
      delete data.title;
      delete data.image;
      delete data.content;
    }

    let styles = data.styles;
    if(data.styles?.length>0){
      let newStyles = [];
      styles.forEach(style=>{
        newStyles.push(style.uid)
      })
      data.styles = newStyles;
    }else{
      delete data.styles
    }
    
    Object.keys(data).forEach(key=>{
      switch(key){
        default:
          formData.append(key, data[key])
      }
    })

    ProductServices.updateProduct(id, data)
    .then(res=>{
      console.log(res)
      close();
      fetchData();
    }).catch(err=>{
      console.log(err)
    })

  }

  return (
    <Container className="h-full flex flex-col justify-between">      
      <FormHeader className="flex flex-col w-full sticky top-0">
        <div className="w-full p-6 border-b border-gray-500 bg-gray-800 text-gray-300">
          {
            id ? <aside className="flex flex-col">
                  <h1 className="font-semibold text-lg">Update Products</h1>
                  <p>Update products info, combinations and extras.</p>
                </aside> : <aside className="flex flex-col">
                  <h1 className="font-semibold text-lg">Add Products</h1>
                  <p>Add products info, combinations and extras.</p>
                </aside>
          }
        </div>

        <div className="text-sm pt-4 font-medium text-center text-gray-500 border-b border-gray-500 bg-gray-700">
          <SwitchToggleForCombination
            product
            handleProcess={handleIsCombination}
            processOption={isCombination}
          />

          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <ActiveButton
                tapValue={tapValue}
                activeValue="Basic Info"
                handleProductTap={handleProductTap}
              />
            </li>

            {isCombination && (
              <li className="mr-2">
                <ActiveButton
                  tapValue={tapValue}
                  activeValue="Combination"
                  handleProductTap={handleProductTap}
                />
              </li>
            )}
          </ul>
        </div>
      </FormHeader>
        
      <FormSection onSubmit={handleFormSubmit} className="w-full bg-gray-700 flex flex-col">
        <FormInputs ref={containerRef} className=" w-full overflow-y-auto text-gray-300" id="">
          {tapValue === "Basic Info" && (
            <div className="px-6 pt-8 ">
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <ClassicImage className="border relative border-gray-500 rounded-lg bg-gray-400 overflow-hidden flex justify-center items-center">
                  {
                    thumbnail ? <img src={thumbnail} alt="" className="w-full h-full object-cover" /> :
                    <small>Thumbnail</small>
                  }
                  
                  <input type="file" onChange={e=>{
                    const file = e.target.files[0];
                    setDetails({...details, thumbnail: file});
                    setThumbnail(URL.createObjectURL(file))
                  }} name="" id="" className="absolute w-full h-full opacity-0" />
                </ClassicImage>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductTitleName")} />
                <div className="col-span-8 sm:col-span-4">
                  <input required value={details.name} onChange={e=>setDetails({...details, name: e.target.value, title: e.target.value})} name="title"
                    type="text"
                    placeholder={t("ProductTitleName")} className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent"/>

                  <Error errorName={errors.title} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={"Brief Description"} />
                <div className="col-span-8 sm:col-span-4">
                  <input required maxLength={50} value={details.brief_description} onChange={e=>setDetails({...details, brief_description: e.target.value, title: e.target.value})} name="title"
                    type="text"
                    placeholder={'Brief Description'} className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent"/>

                  <Error errorName={errors.title} />
                </div>
              </div>
              
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductDescription")} />
                <div className="col-span-8 sm:col-span-4">
                  <TextEditor required value={details.description} setValue={(value)=>setDetails({...details, description: value})} />
                  <Error errorName={errors.description} />
                </div>
              </div>
              

              {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductImage")} />
                <div className="col-span-8 sm:col-span-4">
                  <ImageDropzone defaultImages={id ? details?.gallery : []} saveImages={images=>setImages(images)} />
                </div>
              </div> */}

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductSKU")} />
                <div className="col-span-8 sm:col-span-4">
                  <input required value={details.sku} onChange={e=>setDetails({...details, sku: e.target.value})} name="sku"
                    type="text"
                    placeholder={t("ProductSKU")} className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent" />
                  <Error errorName={errors.sku} />
                </div>
              </div>


              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("Category")} />
                <div className="col-span-8 sm:col-span-4">
                  <select required value={details.category} onChange={e=>setDetails({...details, category: e.target.value})} name="" id="" className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent">
                    <option>Select category</option>
                    {
                      categories.map((cat, idx)=>{
                        return <option key={`cat-${idx}`} value={cat?.uid}>{cat?.name}</option>
                      })
                    }
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Product Price" />
                <div className="col-span-8 sm:col-span-4">
                  <aside className="flex items-center h-12 border rounded-lg overflow-hidden">
                    <div className="h-full px-4 flex items-center justify-center border-r">$</div>
                    <input value={details.price} onChange={e=>setDetails({...details, price: e.target.value})} name="sku"
                    type="number"
                    placeholder={'Product Price'} className="rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent" />
                  </aside>
                  <Error errorName={errors.originalPrice} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("SalePrice")} />
                <div className="col-span-8 sm:col-span-4">
                  <aside className="flex items-center h-12 border rounded-lg overflow-hidden">
                    <div className="h-full px-4 flex items-center justify-center border-r">$</div>
                    <input value={details.sale_price} onChange={e=>setDetails({...details, sale_price: e.target.value})} name="sku"
                    type="number"
                    placeholder={t("SalePrice")} className="rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent" />
                  </aside>
                  <Error errorName={errors.price} />
                </div>
              </div>

              {
                !id && <div onClick={()=>{
                  setMoreDetails(!moreDetails)
                  scrollBottom();
                }} className="w-full flex items-center cursor-pointer mb-8 mt-2">
                  <p>Add More Details</p>
                  <hr className="w-full mx-2 border-gray-600" />
                  <i className={`fa ${moreDetails ? 'fa-chevron-up':'fa-chevron-down'}`}></i>
                </div>
              }
              
              
              {
                moreDetails && <>
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label={"Discount Type"} />
                    <div className="col-span-8 sm:col-span-4">
                      <select value={details.discount_type} onChange={e=>setDetails({...details, discount_type: e.target.value})} name="" id="" className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent">
                        <option>Select discount type</option>
                        <option value={'percentage'}>Percentage</option>
                        <option value={'amount'}>Amount</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
                    <LabelArea label={"Discount"} />
                    <div className="col-span-8 sm:col-span-4">
                      <input value={details.discount} onChange={e=>setDetails({...details, discount: e.target.value})} name="sku"
                        type="number"
                        placeholder={"Product discount"} className="border rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent" />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label={'Styles'} />
                    <div className="col-span-8 sm:col-span-4 flex flex-wrap">
                      {
                        styles.map((style, idx)=><div onClick={()=>{
                          let currentStyles = [...details.styles];
                          if(JSON.stringify(currentStyles)?.includes(style.uid)){
                            let newStyles = currentStyles.filter(addedStyle=>addedStyle.uid !== style.uid);
                            setDetails(prev=>{
                              return {...prev, styles:newStyles}
                            })
                          }else{
                            setDetails(prev=>{
                              return {...prev, styles:[...details.styles, style]}
                            })
                          }
                        }} key={`style-${idx}`} className={`px-4 h-8 text-sm cursor-pointer hover:text-white ${JSON.stringify(details.styles)?.includes(style.uid) ? `bg-green-500 text-white border-none`:`text-gray-400`} flex items-center rounded-2xl mr-2 mb-2 border border-gray-500`}>{style?.name}</div>)
                      }
                    </div>
                  </div>

                  <div className="w-full grid sm:grid-cols-4 gap-3 mb-6 border p-4 rounded-lg">
                    <aside className="flex items-center">
                      <div className="overflow-hidden rounded-lg">
                        <input checked={details?.is_classic} onChange={e=>{
                          setDetails({...details, is_classic:e.target.checked});
                          scrollBottom();
                        }} type="checkbox" name="" id="" className="mr-2 w-5 h-5" />
                      </div>
                      <p>Classic</p>
                    </aside>
                    <aside className="flex items-center">
                      <div className="overflow-hidden rounded-lg">
                        <input checked={details?.is_featured} onChange={e=>setDetails({...details, is_featured:e.target.checked})} type="checkbox" name="" id="" className="mr-2 w-5 h-5" />
                      </div>
                      <p>Featured</p>
                    </aside>
                    <aside className="flex items-center">
                      <div className="overflow-hidden rounded-lg">
                        <input checked={details?.in_stock} onChange={e=>setDetails({...details, in_stock:e.target.checked})} type="checkbox" name="" id="" className="mr-2 w-5 h-5" />
                      </div>
                      <p>In Stock</p>
                    </aside>
                    <aside className="flex items-center">
                      <div className="overflow-hidden rounded-lg">
                        <input checked={details?.is_active} onChange={e=>setDetails({...details, is_active:e.target.checked})} type="checkbox" name="" id="" className="mr-2 w-5 h-5" />
                      </div>
                      <p>Active/Publish</p>
                    </aside>
                  </div>

                  {
                    details.is_classic && <>
                    <br />
                    <div className="pb-1 flex items-end justify-between border-b border-gray-500 text-xl">
                      <p>Classic Product Detail</p>
                      <small className="text-gray-500">You're seeing this because this product is a classic product.</small>
                    </div>
                    <div className="w-full my-3 mb-6 flex md:flex-row flex-col">
                      <ClassicImage className="mr-4 bg-gray-300 relative rounded-xl flex justify-center items-center overflow-hidden">
                        {
                          classicImg ? <img src={classicImg||details.image} className="w-full h-full object-cover"/> :
                          <i className="fa fa-camera text-4xl"></i>
                        }
                        <input type="file" onChange={e=>handleImageChange(e)} name="" id="" className="w-full h-full absolute opacity-0" />
                      </ClassicImage>
                      <div className="w-full flex flex-col">
                        <small className="text-gray-400">Product Title</small>
                        <input required={details.is_classic} value={details.title} onChange={e=>setDetails({...details, title: e.target.value})} type="text" placeholder={'Classic product title'} className="mb-4 border border-gray-500 rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent" />

                        <small className="text-gray-400">Product Content</small>
                        <input required={details.is_classic} value={details.content} onChange={e=>setDetails({...details, content: e.target.value})} type="text" placeholder={'Classic product content'} className="mb-4 border border-gray-500 rounded-lg px-3 h-12 text-sm focus:outline-none block w-full bg-transparent" />
                      </div>
                    </div>
                    <br />
                    </>
                  }
              
                </>
              }
            </div>
          )}

          {tapValue === "Combination" &&
            isCombination &&
            (attribue.length < 1 ? (
              <div
                className="bg-teal-100 border border-teal-600 rounded-md text-teal-900 px-4 py-3 m-4"
                role="alert"
              >
                <div className="flex">
                  <div className="py-1">
                    <svg
                      className="fill-current h-6 w-6 text-teal-500 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm">
                      {t("AddCombinationsDiscription")}{" "}
                      <Link to="/attributes" className="font-bold">
                        {t("AttributesFeatures")}
                      </Link>
                      {t("AddCombinationsDiscriptionTwo")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                {/* <h4 className="mb-4 font-semibold text-lg">Variants</h4> */}
                <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3 md:gap-3 xl:gap-3 lg:gap-2 mb-3">
                  <MultiSelect
                    options={attTitle}
                    value={attributes}
                    onChange={(v) => handleAddAtt(v)}
                    labelledBy="Select"
                  />

                  {attributes?.map((attribute, i) => (
                    <div key={attribute._id}>
                      <div className="flex w-full h-10 justify-between font-sans rounded-tl rounded-tr bg-gray-200 px-4 py-3 text-left text-sm font-normal text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                        {"Select"}
                        {showingTranslateValue(attribute?.title, language)}
                      </div>

                      <AttributeOptionTwo
                        id={i + 1}
                        values={values}
                        lang={language}
                        attributes={attribute}
                        setValues={setValues}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mb-6">
                  {attributes?.length > 0 && (
                    <Button
                      onClick={handleGenerateCombination}
                      type="button"
                      className="mx-2"
                    >
                      <span className="text-xs">{t("GenerateVariants")}</span>
                    </Button>
                  )}

                  {variantTitle.length > 0 && (
                    <Button onClick={handleClearVariant} className="mx-2">
                      <span className="text-xs">{t("ClearVariants")}</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}

          <div ref={lastElementRef} className="h-0 w-0 opacity-0"></div>
        </FormInputs>
        <div className="formButtons w-full grid grid-cols-2 bg-gray-800 gap-3 items-center py-6 px-3">
          <div onClick={()=>close()} className="w-full h-12 cursor-pointer hover:bg-gray-600 rounded-lg flex justify-center items-center bg-gray-700 text-gray-500">Cancel</div>
          <button className="w-full h-12 rounded-lg flex justify-center items-center bg-green-500 text-white">{id ? 'Update':'Add'} Product</button>
        </div>
      </FormSection>
    </Container>
  );
};

export const Container = styled.div`
  width: 800px;
  @media only screen and (max-width: 800px){
    width: 100%;
  }
`
export const FormHeader = styled.div`
  height: ${props => props.height || '190px'};
  max-height: ${props => props.height || '190px'};

`
export const FormSection = styled.form`
  height: calc(100vh - 200px);
  max-height: calc(100vh - 200px);
  flex: 1;

  `
export const FormInputs = styled.div`
  height: ${props=>props.height || `calc(100% - 300px)`};
  max-height: ${props=>props.height || `calc(100% - 300px)`};
`

const ClassicImage = styled.div`
  min-width: 150px;
  width: 150px;
  height: 150px;
`

export default React.memo(ProductDrawer);
