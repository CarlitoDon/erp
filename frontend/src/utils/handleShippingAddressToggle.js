const handleFormShippingAddressToggle = (event) => {
    setIsDifferentShippingAddress(event.target.checked);
    // Jika dicentang, isi default dengan data customer baru (jika ada)
    if (event.target.checked && isNewCustomer) {
      setShippingAddress({
        name: newCustomerName,
        phone: newCustomerPhone,
        email: newCustomerEmail,
        address: newCustomerAddress,
        province: newCustomerProvince,
        city: newCustomerCity,
        district: newCustomerDistrict,
        village: newCustomerVillage,
        postalCode: newCustomerPostalCode,
      });
    } else {
      setShippingAddress({
        name: "",
        phone: "",
        email: "",
        address: "",
        province: "",
        city: "",
        district: "",
        village: "",
        postalCode: "",
      });
    }
  };

  export default handleFormShippingAddressToggle;