import Cookies from 'js-cookie';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { AdminContext } from 'context/AdminContext';
import AdminServices, { baseUrl } from 'services/AdminServices';
import { notifyError, notifySuccess } from 'utils/toast';
import axios from 'axios';
import axiosInstance from 'utils/axios';
import session from 'utils/Session';

const useLoginSubmit = () => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AdminContext);
  const history = useHistory();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ name, email, verifyEmail, password, role }) => {
    setLoading(true);
    const cookieTimeOut = 0.5;

    if (location.pathname === '/login') {
      axios.post(`${baseUrl}/login/`, { email, password })
      .then(res=>{
        setLoading(false);
        console.log(res)
        dispatch({ type: 'USER_LOGIN', payload: res.data.user });
        session.set('adminInfo', JSON.stringify(res.data.user))
        session.set('accessToken', res.data.access)
        session.set('refreshToken', res.data.refresh)
        history.replace('/');
      }).catch(err=>{
        setLoading(false);
        console.log(err)
      })
      // AdminServices.loginAdmin({ email, password })
      //   .then((res) => {
      //     if (res) {
      //       // console.log(res.data)
      //       setLoading(false);
      //       notifySuccess('Login Success!');
      //       dispatch({ type: 'USER_LOGIN', payload: res });
      //       Cookies.set('adminInfo', JSON.stringify(res), {
      //         expires: cookieTimeOut,
      //       });
      //       window.location.href = '/dashboard'
      //       // history.replace('/');
      //     }
      //   })
      //   .catch((err) => {
      //     notifyError(err ? err.response.data.message : err.message);
      //     setLoading(false);
      //   });
    }

    if (location.pathname === '/signup') {
      AdminServices.registerAdmin({ name, email, password, role })
        .then((res) => {
          if (res) {
            setLoading(false);
            notifySuccess('Register Success!');
            dispatch({ type: 'USER_LOGIN', payload: res });
            Cookies.set('adminInfo', JSON.stringify(res), {
              expires: cookieTimeOut,
            });
            history.replace('/');
          }
        })
        .catch((err) => {
          notifyError(err ? err.response.data.message : err.message);
          setLoading(false);
        });
    }

    if (location.pathname === '/forgot-password') {
      AdminServices.forgetPassword({ verifyEmail })
        .then((res) => {
          setLoading(false);
          notifySuccess(res.message);
        })
        .catch((err) => {
          setLoading(false);
          notifyError(err ? err.response.data.message : err.message);
        });
    }
  };
  return {
    onSubmit,
    register,
    handleSubmit,
    errors,
    loading,
  };
};

export default useLoginSubmit;
