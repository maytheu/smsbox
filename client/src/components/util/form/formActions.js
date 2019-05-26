export const populateOptionFields = (formdata, arrayData = [], field) => {
    const newArray = [];
    const newFormdata = { ...formdata };
  
    arrayData.forEach(item => {
      newArray.push({ key: item._id, value: item.name });
    });
  
    newFormdata[field].config.options = newArray;
    return newFormdata;
  };

  export const checkValidityInput = (values, rules) => {
    let isValid = true;
    if (!rules) {
      return true;
    }
    if (rules.required) {
      isValid = values.trim() !== "" && isValid;
    }
    if (rules.minLength) {
      isValid = values.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = values.length <= rules.maxLength && isValid;
    }
    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(values) && isValid;
    }
    if (rules.minAmount) {
      isValid = values >= rules.minAmount && isValid;
    }
    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(values) && isValid;
    }
    return isValid;
  };

  export const populateFields = (formData, fields) => {

    for(let key in formData){
        formData[key].value = fields[key];
        formData[key].valid = true;
        formData[key].touched = true;
        formData[key].validationMessage = ''
    }
  
    return formData;
  }