import React, { memo } from "react";

const Input = ({ inputClass = "", labelClass = "", divClass = "", type = "", value = "", handleChange = {}, label = "", id = "", required = true, placeholder = "" }) => {
    return (
        <div className={`flex flex-col m-2 ${divClass}`}>
            <label htmlFor={id} className={`${labelClass}`}>
                {label}
            </label>

            <input
                type={type}
                className={`border rounded-md text-wrap px-2 py-2 focus:outline-[#808080] ${inputClass}`}
                value={value}
                onChange={handleChange}
                id={id}
                name={id}
                placeholder={placeholder ? placeholder : label}
                required={required}
            />
        </div>
    );
};

// Here this component is memoized because if not done so
// this component will re-render itself whenever the parent component re-renders
export default memo(Input);
