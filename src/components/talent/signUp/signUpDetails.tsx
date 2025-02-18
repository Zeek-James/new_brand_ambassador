"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../../../ui/dialog";
import { TbProgressCheck } from "react-icons/tb";
import { Controller, useForm } from "react-hook-form";
import axiosInstance from "../../../api/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import validator from "validator";
import { TbEyeOff, TbEye } from "react-icons/tb";

import { useNavigate } from "react-router-dom";
import PasswordValidator from "password-validator";
import { Button } from "../../../ui/button";
// import { signIn } from "next-auth/react";
import { Separator } from "../../../ui/seperator";
import { Link } from "react-router-dom";
import { HiArrowLongLeft } from "react-icons/hi2";
import backgroundImage from "../../../assets/auth__background.jpeg";
import Logo from "../../../assets/Frame.svg";

export default function SignUpDetails() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [individual, setIndividual] = useState(true);
  const [successModal, setSuccessModal] = useState(false);
  const [resLink, setResLink] = useState("");
  const [showPass, setShowPass] = useState(false);

  const {
    control,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      agencyName: "",
      agencyType: "",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    //  Retrieve userInfo from sessionStorage

    let sessionInfo = sessionStorage.getItem("userInfo");

    if (sessionInfo !== null) {
      // Parse sessionInfo as JSON
      const userInfo = JSON.parse(sessionInfo);
      if (!userInfo) {
        navigate("/auth/signup");
      }
    }

    const user = localStorage.getItem("individual");
    if (user === "true") {
      setIndividual(true);
      return;
    }
    setIndividual(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let errMsg = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    agencyName: "",
    agencyType: "",
  };

  if (errors?.email?.type === "required") {
    errMsg.email = "Please enter your email address";
  }

  if (
    errors?.email?.type === "required" ||
    (watch("email") && !validator.isEmail(watch("email")))
  ) {
    errMsg.email = "Please enter a valid email address.";
  }

  if (errors?.firstName?.type === "required") {
    errMsg.firstName = "Please enter your first name";
  }

  if (
    errors?.firstName?.type === "required" ||
    (watch("firstName") && !validator.isAlpha(watch("firstName")))
  ) {
    errMsg.firstName = "Please enter only alphabetic characters";
  }

  if (errors?.lastName?.type === "required") {
    errMsg.lastName = "Please enter your last name";
  }

  if (
    errors?.lastName?.type === "required" ||
    (watch("lastName") && !validator.isAlpha(watch("lastName")))
  ) {
    errMsg.lastName = "Please enter only alphabetic characters";
  }

  if (errors?.agencyName?.type === "required") {
    errMsg.agencyName = "Please enter name of your agency";
  }

  if (errors?.agencyType?.type === "required") {
    errMsg.agencyType = "Please select the type of agency";
  }
  if (errors?.password?.type === "required") {
    errMsg.password = "Please enter a password";
  }

  if (errors?.confirmPassword?.type === "required") {
    errMsg.confirmPassword = "Please confirm your password";
  }

  if (errors?.password?.type === "minLength") {
    errMsg.password = "Password cannot be less than 8 characters";
  }

  if (errors?.confirmPassword?.type === "minLength") {
    errMsg.confirmPassword = "Password cannot be less than 8 characters";
  }

  if (watch("password") !== watch("confirmPassword")) {
    errMsg.password = "Both passwords must match";
    errMsg.confirmPassword = "Both passwords must match.";
  }

  let schema = new PasswordValidator();

  schema
    .has()
    .lowercase()
    .uppercase()
    .has()
    .digits(1)
    .has()
    .symbols(1)
    .is()
    .min(8)
    .has()
    .not()
    .spaces();

  if (watch("password") && !schema.validate(watch("password"))) {
    errMsg.password = "Password is too weak";
    errMsg.confirmPassword = "Password is too weak";
  }

  const onSubmit = async (data: any) => {
    localStorage.setItem("userEmail", data.email );

    const isError = Object.values(errMsg).every(
      (error) => error === null || error === ""
    );

    if (isError) {
      try {
        setLoading(true);

        const url = individual ? "/register" : "/agency-register";

        const requestData = individual
          ? {
              firstName: data.firstName,
              lastName: data.lastName,
              password: data.password,
              email: data.email,
            }
          : {
              firstName: data.firstName,
              lastName: data.lastName,
              password: data.password,
              agencyName: data.agencyName,
              agencyType: data.agencyType,
              email: data.email,
            };

        const newAccountResponse = await axiosInstance.post(
          `${url}`,
          requestData,
        );

        if (
          newAccountResponse !== undefined &&
          newAccountResponse.status === 201
        ) {
          setSuccessModal(true);
          setError("");
          setMessage(newAccountResponse.data.message);
          setResLink(newAccountResponse.data.link);

          setTimeout(() => {
            navigate("/auth/login");
          }, 3000);
          return;
        }

        setLoading(false);

        setError(
          "Please enter your credentials correctly or check your internet connection."
        );

        setMessage("");
      } catch (error: any) {
        setLoading(false);

        if (error.response) {
          const keys = Object.keys(error.response.data);
          const errorMsg = error.response.data[keys[0]];
          setError(errorMsg);
          return;
        }

        setError(
          "Something went wrong. Please check your internet connection."
        );

        setMessage("");
      }
    }
  };

  return (
    <div className="auth__layout">
      <div className=" bg-white/30 z-10 h-screen w-screen flex items-center justify-center">
        <div className="z-10 flex justify-around w-full p-4 min-w-[350px] rounded-lg">
          <div className="lg:flex flex-col items-center justify-center hidden">
            <div className=" w-full p-4 min-w-[380px] rounded-lg">
              <div className="text-left  text-white cursor-pointer">
                <Link to="/">
                  <img
                    src={Logo}
                    style={{}}
                    alt="logo"
                    width={300}
                    height={50}
                  /> 
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full max-w-[480px] justify-center items-center">
            {message && (
              <div
                className="p-4 mb-4 my-2 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                role="alert"
              >
                <span className="font-medium">Success alert!</span> {message}
              </div>
            )}
            {error && (
              <div className=" bg-red-100 w-full max-w-[480px] text-red-700 text-center p-2 rounded-lg mb-2 transition-all duration-1000">
                {error}
              </div>
            )}
            <div className="bg-[#f3f3f3] text-black w-full max-w-[480px] p-[20px] m-2 md:p-[40px]  rounded">
              <div className=" flex flex-col md:space-y-7">
                <div className=" p-1 text-center ">
                  <Link to={"/auth/signup"}>
                    <HiArrowLongLeft className="text-black text-[30px] hover:bg-black/10" />{" "}
                  </Link>
                  <h3 className="font-medium text-[24px] md:mb-3 p-0 m-0">
                    Create Account
                  </h3>
                  <small className="font-normal text-[12px] ">
                    Already have an Account?{"  "}
                    <Link to={"/auth/login"}>
                      <span
                        className="
                  font-medium text-[12px]
                  text-[#6F797A]
                  "
                      >
                        Login
                      </span>
                    </Link>
                  </small>
                </div>
                <form>
                  {!individual && (
                    <>
                      <Controller
                        name="email"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <div className="w-full pb-4">
                            <input
                              {...field}
                              type="text"
                              placeholder="Company email address"
                              name="email"
                              className="w-full sm:h-12 rounded-lg p-2 text-[12px] sm:p-4 sm:text-[14px]"
                            />
                            {errMsg.email && (
                              <small className="text-red-500">
                                {errMsg.email}
                              </small>
                            )}
                          </div>
                        )}
                      />{" "}
                      <Controller
                        name="agencyName"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <div className="w-full pb-4">
                            <input
                              {...field}
                              type="text"
                              placeholder="Agency name"
                              name="agencyName"
                              className="w-full sm:h-12 rounded-lg p-2 text-[12px] sm:p-4 sm:text-[14px]"
                            />
                            {errMsg.agencyName && (
                              <small className="text-red-500">
                                {errMsg.agencyName}
                              </small>
                            )}
                          </div>
                        )}
                      />
                      <Controller
                        name="agencyType"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <div className="w-full pb-4">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select Type of Agency" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="Advertising Agency">
                                  Advertising Agency
                                </SelectItem>
                                <SelectItem value="Branding Agency">
                                  Branding Agency
                                </SelectItem>

                                <SelectItem value=" Public Relations Agency">
                                  Public Relations Agency
                                </SelectItem>
                                <SelectItem value="Promotional Agency">
                                  Promotional Agency
                                </SelectItem>
                                <SelectItem value="Event Agency">
                                  Event Agency
                                </SelectItem>
                                <SelectItem value="Social Media Marketing Agency">
                                  Social Media Marketing Agency
                                </SelectItem>
                                <SelectItem value="Production and Design Agency">
                                  Production and Design Agency
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {errMsg.agencyType && (
                              <small className="text-red-500">
                                {errMsg.agencyType}
                              </small>
                            )}
                          </div>
                        )}
                      />
                      <Separator className="my-4" />
                    </>
                  )}
                  {!individual && (
                    <p className="pb-2 md:pb-3 text-[12px]">
                      Key Contact Details
                    </p>
                  )}
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <div className="w-full pb-4">
                        <input
                          {...field}
                          type="text"
                          placeholder="First name"
                          name="firstName"
                          className="w-full sm:h-12 rounded-lg p-2 text-[12px] sm:p-4 sm:text-[14px]"
                        />
                        {errMsg.firstName && (
                          <small className="text-red-500">
                            {errMsg.firstName}
                          </small>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <div className="w-full pb-4">
                        <input
                          {...field}
                          type="text"
                          placeholder="Last name"
                          name="lastName"
                          className="w-full sm:h-12 rounded-lg p-2 text-[12px] sm:p-4 sm:text-[14px]"
                        />
                        {errMsg.lastName && (
                          <small className="text-red-500">
                            {errMsg.lastName}
                          </small>
                        )}
                      </div>
                    )}
                  />
                  {individual && (
                    <Controller
                      name="email"
                      // name='email'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <div className="w-full pb-4">
                          <input
                            {...field}
                            type="email"
                            placeholder="Email address"
                            name="email"
                            className="w-full sm:h-12 rounded-lg p-2 text-[12px] sm:p-4 sm:text-[14px]"
                          />
                          {errMsg.email && (
                            <small className="text-red-500">
                              {errMsg.email}
                            </small>
                          )}
                        </div>
                      )}
                    />
                  )}
                  {/* <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <div className="w-full pb-4">
                        <div className="flex items-center bg-white rounded-lg px-2 sm:px-4 ">
                          <input
                            {...field}
                            type={showPass ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            className="w-full h-10 rounded-lg text-base outline-none border-none focus:outline-none focus:ring-0 px-4"
                          />
                          <div
                            className="cursor-pointer"
                            onClick={() => setShowPass(!showPass)}
                          >
                            {showPass ? <TbEye /> : <TbEyeOff />}
                          </div>
                        </div>
                        {errMsg.password && (
                          <small className="text-red-500">
                            {errMsg.password}
                          </small>
                        )}
                      </div>
                    )}
                  /> */}
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <div className="w-full pb-4 relative">
                        <div className="flex items-center">
                          <input
                            {...field}
                            type={showPass ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            className="w-full sm:h-12 rounded-lg p-2 text-[12px] sm:p-4 sm:text-[14px]"
                          />
                          <div
                            className="cursor-pointer ml-2 absolute right-0 md:top-[18px] flex items-center pr-2"
                            onClick={() => setShowPass(!showPass)}
                          >
                            {showPass ? <TbEye /> : <TbEyeOff />}
                          </div>
                        </div>
                        {errMsg.password && (
                          <small className="text-red-500">
                            {errMsg.password}
                          </small>
                        )}
                      </div>
                    )}
                  />
                  {/* <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <div className="w-full pb-4">
                        <div className="flex items-center bg-white rounded-lg px-2 sm:px-4 ">
                          <input
                            {...field}
                            type={showPass ? "text" : "password"}
                            placeholder="Confirm Password"
                            name="password"
                            className="w-full h-10 rounded-lg text-base outline-none border-none focus:outline-none focus:ring-0 px-4"
                          />

                          <div
                            className="cursor-pointer"
                            onClick={() => setShowPass(!showPass)}
                          >
                            {showPass ? <TbEye /> : <TbEyeOff />}
                          </div>
                        </div>
                        {errMsg.confirmPassword && (
                          <small className="text-red-500">
                            {errMsg.confirmPassword}
                          </small>
                        )}
                      </div>
                    )}
                  /> */}
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <div className="w-full pb-4 relative">
                        <div className="flex items-center">
                          <input
                            {...field}
                            type={showPass ? "text" : "password"}
                            placeholder="Confirm Password"
                            name="password"
                            className="w-full sm:h-12 rounded-lg p-2 text-[12px] sm:p-4 sm:text-[14px]"
                          />
                          <div
                            className="cursor-pointer ml-2 absolute right-0 md:top-[18px] flex items-center pr-2"
                            onClick={() => setShowPass(!showPass)}
                          >
                            {showPass ? <TbEye /> : <TbEyeOff />}
                          </div>
                        </div>
                        {errMsg.confirmPassword && (
                          <small className="text-red-500">
                            {errMsg.confirmPassword}
                          </small>
                        )}
                      </div>
                    )}
                  />
                  <Button
                    // type='submit'
                    className="bg-[#6F797A] w-full mt-2 md:mt-6 text-white hover:bg-bm__btn__grey/70"
                    onClick={handleSubmit(onSubmit)}
                  >
                    {loading && (
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 mr-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    Create Account
                  </Button>
                </form>
                {/* <Dialog open={successModal}>
                  <DialogContent className="bg-bm_card_grey flex flex-col items-center justify-center rounded max-w-[350px] md:max-w-[460px] p-16">
                    <TbProgressCheck className="font-normal text-[155px] text-green-700" />
                    <div className="text-[20px] font-bold whitespace-nowrap">
                      Account Created Successfully
                    </div>
                    <small className="text-center">
                      A verification link has been sent to your email, please
                      verify your account
                    </small>
                  </DialogContent>
                </Dialog> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        src={backgroundImage}
        alt="background"
        width={3440}
        height={2000}
        className="auth__layout__image object-cover"
      />
    </div>
  );
}
