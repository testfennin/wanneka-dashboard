
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
//internal import
import MainDrawer from "components/drawer/MainDrawer";
import ProductDrawer from "components/drawer/ProductDrawer";
import Loading from "components/preloader/Loading";
import PageTitle from "components/Typography/PageTitle";
import ModalWrapper from "components/common/ModalWrapper";
import CustomerServices from "services/CustomerServices";

const CustomerDetails = () => {
  const { id } = useParams();

  const [user,setUser] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchData = () => {
    setLoading(true)
    CustomerServices.getCustomerById(id)
    .then(res=>{
      setLoading(false)
      setUser(res.data)
      console.log(res)
    }).catch(err=>{
      setLoading(false)
      console.log(err)
    })
  }

  useEffect(()=>{
    fetchData();
    // eslint-disable-next-line
  },[])


  const [isModal, setModal] = useState(null);



  return (
    <>
      {
        isModal && <ModalWrapper content={isModal} close={()=>setModal(null)}/>
      }

      <MainDrawer product>
        <ProductDrawer id={id} />
      </MainDrawer>

      <PageTitle>Customer Detail</PageTitle>
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <div className="inline-block overflow-y-auto h-full align-middle transition-all transform dark:text-gray-400">
          <section className="w-full flex flex-col items-center py-6">
            <aside className="w-full p-4 flex flex-col items-center dark:bg-gray-700 bg-gray-100 rounded-xl">
              <div className="w-20 h-20 mb-4 border flex items-center justify-center rounded-full overflow-hidden">
                  {
                      user?.avatar ? <img src={user?.avatar} alt="" className="w-full h-full object-cover" /> :
                      <i className="fa fa-user dark:text-gray-300"></i>
                  }
              </div>
              {user.user_type && <div className="rounded-2xl px-8 h-8 text-sm bg-green-600 text-white flex items-center mb-4">{user?.user_type}</div>}
              
              <h1 className="text-2xl font-semibold dark:text-gray-100">{user?.first_name} {user?.last_name}</h1>
              <p>{user?.email}</p>
              <p>{user?.phone}</p>
              <small className="my-1 text-green-600">({user?.gender})</small>
            </aside>

            <br />
            <div className="p-4 grid grid-cols-3 gap-4 w-1/2">
              <aside className="flex flex-col border rounded-lg p-3">
                <small>Email Verified</small>
                <p className={`${user?.email_verified ? `text-green-600`:`text-red-600`}`}>{user?.email_verified ? 'YES':'NO'}</p>
              </aside>
              <aside className="flex flex-col border rounded-lg p-3">
                <small>Phone Verified</small>
                <p className={`${user?.phone_verified ? `text-green-600`:`text-red-600`}`}>{user?.phone_verified ? 'YES':'NO'}</p>
              </aside>
              <aside className="flex flex-col border rounded-lg p-3">
                <small>Active</small>
                <p className={`${user?.is_active ? `text-green-600`:`text-red-600`}`}>{user?.is_active ? 'YES':'NO'}</p>
              </aside>
              <aside className="flex flex-col border rounded-lg p-3">
                <small>Suspended</small>
                <p className={`${!user?.is_suspended ? `text-green-600`:`text-red-600`}`}>{user?.is_suspended ? 'YES':'NO'}</p>
              </aside>
            </div>
          </section>
        </div>
      )}

    </>
  );
};


export default CustomerDetails;
