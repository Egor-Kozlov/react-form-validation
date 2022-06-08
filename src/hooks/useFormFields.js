import { useState } from "react";

const useFormFields = (objFields) => {
  const [fields, setFields] = useState(objFields);

  const handleChange = (e) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  const clearData = (defaultValue) => {
    setFields(defaultValue);
  };

  return [fields, handleChange, clearData];
};

export default useFormFields;
