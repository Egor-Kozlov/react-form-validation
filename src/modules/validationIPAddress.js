import deleteSpacesFromString from "./deleteSpacesFromString";

const validationIPAddress = (value) => {
  if (!value) {
    return true;
  }
  const ipAddressRegex =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
  return ipAddressRegex.test(deleteSpacesFromString(value));
};

export default validationIPAddress;
