const errorMessage = (code, package_id) => {
  switch (code) {
    case 404:
      return "We do not have a package stored with the identifier: " + package_id + ". Please verify that you are using the correct format.";

    case 403:
      return "You are not permitted to view the package: " + package_id + ". Please contact the content manager for this item if you believe you should have access.";

    default:
      return "We experienced an error in servicing your request. Please try again later.";
  }
}

export default errorMessage;
