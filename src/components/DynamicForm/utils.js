export const getFieldRelevantCondition = (relevant) => {
  const regex =
    /(?:selected\(\$\{(.*?)\},\s*'([^']+)'\)|\$\{(.*?)\}='([^']+)')/;

  const match = relevant.match(regex);

  if (match) {
    const relevantField = match[1] || match[3];
    const relevantValue = match[2] || match[4];

    return { relevantField, relevantValue };
  }
  return null;
};

export const findObjectByName = (objArray, nameToFind) => {
  for (let i = 0; i < objArray.length; i++) {
    const currentObject = objArray[i];
    if (currentObject.name === nameToFind) {
      return currentObject;
    } else if (currentObject.items && Array.isArray(currentObject.items)) {
      const nestedObject = findObjectByName(currentObject.items, nameToFind);
      if (nestedObject) {
        return nestedObject;
      }
    }
  }
  return { required: "", required_message: "" };
};
