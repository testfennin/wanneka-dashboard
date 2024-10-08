import React, { useContext } from "react";
import { SidebarContext } from "context/SidebarContext";

const SelectLanguageTwo = ({ handleSelectLanguage, register }) => {
  const data = [];
  const loading = false;
  const error = null;
  const { lang } = useContext(SidebarContext);


  return (
    <>
      <select
        name="language"
        {...register(`language`, {
          required: `language is required!`,
        })}
        onChange={(e) => handleSelectLanguage(e.target.value)}
        className="dark:border-gray-600 focus:shadow-none w-20 h-8 px-2 py-1 mt-1 text-gray-800 dark:text-gray-300 form-select outline-none text-sm focus:outline-none block rounded-md bg-gray-50 border-transparent focus:bg-white border-green-400 dark:bg-gray-700 focus:border-green-400 dark:focus:border-green-400 focus:ring focus:ring-green-200 dark:focus:ring-green-200"
      >
        <option value={lang} defaultChecked hidden>
          {lang}
        </option>
        {!error &&
          !loading &&
          data?.map((lang) => (
            <option key={lang._id} value={lang.iso_code}>
              {lang.iso_code}{" "}
            </option>
          ))}
      </select>
    </>
  );
};

export default SelectLanguageTwo;
