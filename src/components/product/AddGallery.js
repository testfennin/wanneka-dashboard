import { Container } from 'components/drawer/ProductDrawer';
import ImageDropzone from 'components/form/DragDrop'
import React, { useState } from 'react'
import ProductServices from 'services/ProductServices';
import styled from 'styled-components'
import { notifyError } from 'utils/toast';

function AddGallery({close, fetchData, product, }) {

    const [images, setImages] = useState([]);
    const [details, setDetails] = useState({
        type: 'image',
        file: '',
        media_file: '',
        product: product.uid,
        order: 1
    })

    const handleSubmit =async e=>{
        e.preventDefault();
        if(details.file){
            let data = details;
            data.media_file = data.file
            const formData = new FormData();
            Object.keys(data).forEach(key=>{
                formData.append(key, data[key])
            })
            const res = await ProductServices.addGallery(formData)
            if(res){
                fetchData();
                close();
            }
        }else{
            notifyError('Select an image')
        }
    }
  return (
    <Container className="h-full flex flex-col justify-between">
        <div className="p-6 flex flex-col bg-gray-800 text-gray-100 border-b">
            <h1 className="text-lg font-semibold">Add new galleries</h1>
            <p>Click to select images or drag and drod</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col bg-gray-700 py-6 px-4 text-gray-100">
            <section className="w-full flex mb-6">
                <Label className='md:mr-3'>Media type</Label>
                <select required value={details.type} onChange={e=>setDetails({...details, type: e.target.value})} className="w-full h-10 border rounded-lg px-4 bg-transparent">
                    <option value="">Select media type</option>
                    <option value="image">Image file</option>
                    <option value="video">Video file</option>
                </select>
            </section>
            <section className="w-full flex mb-6">
                <Label className='md:mr-3'>Order Position</Label>
                <input required type='number' value={details.order} onChange={e=>setDetails({...details, order: e.target.value})} className="w-full h-10 border rounded-lg px-4 bg-transparent"/>
            </section>
            <section className="w-full flex mb-6">
                <Label className='md:mr-3'>File</Label>
                <ImageDropzone className={`w-full`} maxFiles={1} saveImages={val=>setDetails({...details, file:val })}  />
            </section>
            <div className="formButtons w-full grid grid-cols-2 bg-gray-800 gap-3 items-center py-6 px-3">
                <div onClick={()=>close()} className="w-full h-12 cursor-pointer hover:bg-gray-600 rounded-lg flex justify-center items-center bg-gray-700 text-gray-500">Cancel</div>
                <button className="w-full h-12 rounded-lg flex justify-center items-center bg-green-500 text-white">Add Gallery</button>
            </div>
        </form>
        
    </Container>
  )
}

const Label = styled.div`
    min-width: 200px;
`



export default AddGallery