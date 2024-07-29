import { Container, FormHeader, FormInputs, FormSection } from 'components/drawer/ProductDrawer'
import LabelArea from 'components/form/LabelArea';
import React, { useEffect, useState } from 'react'
import CategoryServices from 'services/CategoryServices';
import ProductServices from 'services/ProductServices';

function BulkUpdateProduct({close, fetchData, ids, setIsCheck}) {
    const [details, setDetails] = useState({
        "is_classic": null,
        "is_featured": null,
        "in_stock": null,
        "price": "",
        "discount_type": "",
        "discount": "",
        "category": "",
        "is_active": null,
        "title": "",
        "image": "",
        "content": "",
        "styles": []
    });
    const [categories, setCategories] = useState([])
    const [styles, setStyles] = useState([])

    const getCategories =async () => {
        const res = await CategoryServices.getAllCategories()
        setCategories(res.data?.results)
    }

    const getStyles = async () =>{
        const res = await ProductServices.getStyles();
        setStyles(res.data)
    }

    useEffect(()=>{
        getCategories();
        getStyles();
    },[]);

    const handleFormSubmit =async (e) => {
        e.preventDefault();
        let data = {}
        let formDetail = details;
        
        Object.keys(formDetail).forEach(key=>{
            if(formDetail[key] && key !== 'styles'){
                data[key] = formDetail[key]
            }else if(formDetail[key]?.length>0){
                data[key] = formDetail[key]
            }
        })
        let body = {
            uid_list: ids,
            data
        }
        
        const res = await ProductServices.bulkUpdateProduct(body)
        if(res){
            close();
            fetchData();
            setIsCheck([])
        }
        console.log(data)
    }

    const clearSelection = () => {
        setDetails(prev=>{
            return {...prev, is_active: null, is_classic: null, is_featured: null, in_stock: null }
        })
    }
  return (
    <Container className="h-full flex flex-col">
        <div className="flex flex-col w-full sticky top-0">
            <div className="w-full p-6 border-b border-gray-500 bg-gray-800 text-gray-300">
                <aside className="flex flex-col">
                    <h1 className="font-semibold text-lg">Update Selected Products</h1>
                    <p>Update products info, combinations and extras.</p>
                </aside>
            </div>
        </div>
        <FormSection onSubmit={handleFormSubmit} className="w-full bg-gray-700 flex flex-col">
            <section className="h-full w-full overflow-y-auto text-gray-300" id="">
                <div className="px-6 pt-8 ">
                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                        <LabelArea label={'Category'} />
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
                        </div>
                    </div>

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

                    <div className="w-full grid sm:grid-cols-4 gap-3 mb-2 border p-4 rounded-lg">
                        <aside className="flex items-center">
                            <div className="overflow-hidden rounded-lg">
                            <input checked={details?.is_classic} onChange={e=>{
                                setDetails({...details, is_classic:e.target.checked});
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
                    <div className="w-full flex mb-6">
                        <p onClick={clearSelection} className="text-red-400 cursor-pointer hover:text-red-600">Clear Selections</p>
                    </div>

                </div>
            </section>
            <div className="formButtons w-full grid grid-cols-2 bg-gray-800 gap-3 items-center py-6 px-3">
                <div onClick={()=>close()} className="w-full h-12 cursor-pointer hover:bg-gray-600 rounded-lg flex justify-center items-center bg-gray-700 text-gray-500">Cancel</div>
                <button className="w-full h-12 rounded-lg flex justify-center items-center bg-green-500 text-white">Bulk Update Products</button>
            </div>
        </FormSection>
    </Container>
  )
}

export default BulkUpdateProduct