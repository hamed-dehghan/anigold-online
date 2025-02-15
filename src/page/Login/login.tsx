import React, { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logotype-bazartala.png';
import { LoginApi } from '../../lib/endPointes/login/login';
import Toast from '../../components/Toast/Toast';

export default function Login() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [save, setSave] = useState(localStorage.getItem('SavePass') === 'true');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<any>();

  // If saved, prefill the form fields from localStorage.
  useEffect(() => {
    setValue('username', localStorage.getItem('username') || '');
    setValue('password', localStorage.getItem('password') || '');
  }, [setValue]);

  const onSubmitPasswordLogin: SubmitHandler<any> = async (data) => {
    setLoginLoading(true);

    // Save or clear username/password in localStorage based on the "save" checkbox.
    if (save) {
      localStorage.setItem('username', getValues('username'));
      localStorage.setItem('password', getValues('password'));
      localStorage.setItem('SavePass', 'true');
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.setItem('SavePass', 'false');
    }

    try {
      // Call the login API
      const response = await LoginApi(data);
      // Check if login was successful (adjust the check based on your API response structure)
      if (response.data.isSuccessful) {
        const token = response.data.data.token;
        localStorage.setItem('token', token);
        Toast({
          message: 'با موفقیت وارد شدید',
          type: 'success'
        })
        navigate('/users');
        
      } else {
        // console.error("Login failed:", response.message);
        response.data.getMessageText.map((item)=>{
          Toast({
            message:item,
            type:'error'
          })
        })
        navigate('/users');

      }
    } catch (error) {
      navigate('/users');
      console.error("Login error:", error);
    }
    setLoginLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 login-container">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Section – Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-between mb-6">
            <div className="flex items-center">
              {/* You can add a clock or additional info here if needed */}
              <span className="w-20 text-lg font-mono"></span>
            </div>
            <div className="flex items-center">
              <span className="text-lg"></span>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmitPasswordLogin)}
            autoComplete="off"
            className="space-y-4 text-green_2"
          >
            <h2 className="text-2xl font-bold text-center text-green_2">ورود به سامانه</h2>
            <div>
              <label className="block mb-1 font-medium">نام کاربری</label>
              <input
                {...register("username", { required: true })}
                placeholder=""
                className="w-full border border-blue placeholder:text-gray_45 rounded-[11px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow_5"
              />
              {errors.username && (
                <p className="text-red_5 text-sm mt-1">
                  نام کاربری خود را وارد نمایید.
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">رمز عبور</label>
              <input
                type="password"
                {...register("password", { required: true })}
                placeholder=""
                className="w-full border border-blue rounded-[11px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow_5"
              />
              {errors.password && (
                <p className="text-red_5 text-sm mt-1">
                  پسورد خود را وارد نمایید.
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-green_2 text-white py-2 rounded-[11px] transition-colors flex items-center justify-center"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin" />
                ) : (
                  'ورود'
                )}
              </button>
            </div>
          </form>
          <div className="flex justify-between mt-6 text-sm text-green_2">
            <a href="#" className="text-blue-600 hover:underline">
              فراموشی رمزعبور
            </a>
            <div className="flex items-center">
              <span className="mr-2">ذخیره اطلاعات</span>
              <input
                type="checkbox"
                checked={save}
                onChange={() => setSave(!save)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
        {/* Right Section – Additional Information */}
        <div className="w-full md:w-1/2 bg-blue-50 p-8 flex flex-col items-center justify-center sidBarLogin text-white">
          <div className="">
            <img src={logo} alt="logo bazartalla" />
          </div>
          <div className="text-center mb-4">
            <p className="text-lg font-medium">
              یزد، بازار خان، سرای خام کهنه
            </p>
          </div>
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center space-x-2">
              <span>0921232323</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>025332445345</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
