import { useEffect, useState, Fragment, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CircleStackIcon, EyeIcon } from "@heroicons/react/24/outline";
import Button from "../../components/adminPanelComponents/Button";
import Title from "../../components/Title";
import Nameless from "../../components/adminPanelComponents/Namless";
import toast, { Toaster } from "react-hot-toast";
function Update() {
  Title("Category | Update");

  const [id, setID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const params = useParams();
  const errorMessage = "failed_to_update";
  const successfullyMessage = "successfully_updated";
  const networkErrorMessage = "network_error";
  const methodNotAllowedMessage = "method_not_allowed";
  const emptyValueMessage = "Value is required";

  const getCategory = useCallback(async () => {
    setIsLoading(true);
    try {
      await axios.get(`category/${params.categoryId}`).then((res) => {
        setCategory(res.data);
        setID(res.data.id);
        setValue("name", res.data.name);
      });
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }, [params.categoryId, setValue]);

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  const updateCategory = async (data) => {
    console.log(data);
    const formData = new FormData();
    // formData.append("_method", "PUT");
    formData.append("name", data.name);

    try {
      await axios
        .put(`category/${id}`, formData)
        .then(() => {
          toast.success(successfullyMessage, {
            className:
              "bg-gray-50 shadow-lg dark:bg-slate-900 dark:text-slate-500",
          });
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.status === 405) {
            toast.error(methodNotAllowedMessage, {
              className:
                "bg-gray-50 shadow-lg dark:bg-slate-900 dark:text-slate-500",
            });
          } else {
            toast.error(errorMessage, {
              className:
                "bg-gray-50 shadow-lg dark:bg-slate-900 dark:text-slate-500",
            });
          }
        });
    } catch (err) {
      toast.error(networkErrorMessage, {
        className: "bg-gray-50 shadow-lg dark:bg-slate-900 dark:text-slate-500",
      });
      console.error(err);
    }
  };

  return (
    <Fragment>
      <Toaster />
      {!isLoading && category && (
        <div>
          <Nameless
            icon={<CircleStackIcon />}
            btnIcon={<EyeIcon />}
            title="Edit Category"
            path="/adminpanel/Categories"
            action="All Category"
          />
          <form onSubmit={handleSubmit(updateCategory)} className="mt-10">
            <div className="mb-6">
              <label
                className="block mb-2 text-xs font-bold text-gray-700 uppercase"
                htmlFor="categoryName"
              >
                Name
              </label>
              <input
                className={`w-full dark:bg-slate-800 dark:text-slate-600 dark:border-slate-700 p-2 border border-gray-400 rounded outline-none ${
                  errors.name && "w-full p-2 border-2 border-red-700 rounded"
                }`}
                type="text"
                name="categoryName"
                id="categoryName"
                {...register("name", {
                  required: emptyValueMessage,
                })}
              />
              {errors.name && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex mb-6 w-min">
              <Button title="Update" />
            </div>
          </form>
        </div>
      )}
    </Fragment>
  );
}

export default Update;
