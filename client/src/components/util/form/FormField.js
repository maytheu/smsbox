import React from "react";

import "../utils.css";

const FormField = props => {
  let inputElement = null;
  const validateInputClass = ["inputElement"];
  if (props.invalid && props.shouldValidate && props.touched) {
    validateInputClass.push("invalid");
  }

  const showMessage = () => {
    let errorMessage = null;
    if (props.invalid && props.shouldValidate && props.touched) {
      errorMessage = <div className="input-field col s12">{props.message}</div>;
    }
    return errorMessage;
  };

  switch (props.elementType) {
    case "input":
      inputElement = (
        <div className="row">
          <div className="input-field col s12">
            <input
              className={`${validateInputClass.join(" ")} validate`}
              {...props.elementConfig}
              value={props.value}
              onChange={props.changed}
            />
          </div>
        </div>
      );
      break;
    case "select":
      inputElement = (
        <div className="row">
          <div className="input-field col s12">
            <select
              className={`${validateInputClass.join(" ")} validate`}
              value={props.value}
              onChange={props.changed}
            >
              <option value=''>Select group</option>
              {props.elementConfig.options.map(option => (
                <option value={option.value} key={option.key}>
                  {option.key}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
      break;
    case "textarea":
      inputElement = (
        <div className="row">
          <div className="input-field col s12">
            <textarea
              className={`${validateInputClass.join(" ")} validate`}
              {...props.elementConfig}
              value={props.value}
              onChange={props.changed}
            />
          </div>
          {showMessage()}
        </div>
      );
      break;
    default:
      inputElement = (
        <div className="row">
          <div className="input-field col s12">
            <input
              className="validate"
              {...props.elementConfig}
              value={props.value}
              onChange={props.changed}
            />
          </div>
        </div>
      );
  }
  return (
    <div className="row input">
      {/* <label className="label">{props.elementConfig.label}</label> */}
      {inputElement}
    </div>
  );
};

export default FormField;
