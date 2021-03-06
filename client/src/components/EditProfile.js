import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { isAuth, getCookie, signout, updateUser } from "../utility/helpers";
import FormContainer from "./FormContainer";

const EditProfile = ({ history }) => {
  const [values, setValues] = useState({
    role: "",
    name: "",
    email: "",
    org_email: "",
    password: "",
    buttonText: "Submit",
  });

  const { role, name, email, org_email, password, buttonText } = values;
  const token = getCookie("token");

  useEffect(() => {
    if (!isAuth()) return;
    loadProfile();
  }, []);

  const loadProfile = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(`Profile fetch ${JSON.stringify(response.data)}`);
        const { role, name, email, org_email } = response.data;
        setValues({
          ...values,
          role,
          name,
          email,
          org_email,
        });
      })
      .catch((error) => {
        console.log(`Profile fetch error ${error.response.data.error}`);
        if (error.response.status === 401) {
          signout(() => {
            history.push("/");
          });
        }
      });
  };

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/${
        role === "admin" ? "admin" : "user"
      }/update`,
      data: { name, password, org_email },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(`Profile update success`, response);
        updateUser(response, () => {
          setValues({
            ...values,
            password: "",
          });
          toast.success("User profile updated successfully");
        });
      })
      .catch((error) => {
        console.log(`Profile update failed`, error.response.data);
        setValues({ ...values, password: "", org_email: "" });
        toast.error(error.response.data.error);
      });
  };

  return (
    <Layout>
      <ToastContainer />
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl mb-2 text-center">
            {role === "admin" ? "Admin" : "User"} Area/ Edit Profile
          </h1>
          {!org_email ? (
            <p className="text-red-400 text-center">
              Please complete required fields
            </p>
          ) : (
            ""
          )}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
              id="role"
              name="role"
              autoComplete="off"
              type="text"
              placeholder="Role"
              value={role}
              disabled
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name <span className="text-red-400">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
              id="name"
              name="name"
              autoComplete="off"
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              autoComplete="off"
              type="email"
              placeholder="Email"
              value={email}
              disabled
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="org_email"
            >
              Organisation Email <span className="text-red-400">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="org_email"
              name="org_email"
              autoComplete="off"
              type="email"
              placeholder="Organisation Email"
              value={org_email}
              onChange={handleChange}
              required
            />
            <p
              className={`text-gray-600 text-xs italic ${
                !org_email ? "text-red-400" : ""
              }`}
            >
              Required to connect organisation participants
            </p>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              autoComplete="off"
              type="password"
              placeholder="******************"
              value={password}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-brand bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </FormContainer>
    </Layout>
  );
};

export default EditProfile;
