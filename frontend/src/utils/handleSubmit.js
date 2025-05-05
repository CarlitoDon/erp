const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = {
      isNewCustomer,
      existingCustomer,
      newCustomer: isNewCustomer
        ? {
            name: newCustomerName,
            phone: newCustomerPhone,
            email: newCustomerEmail,
            address: newCustomerAddress,
            province: newCustomerProvince,
            city: newCustomerCity,
            district: newCustomerDistrict,
            village: newCustomerVillage,
            postalCode: newCustomerPostalCode,
          }
        : null,
      orderItems,
      buyerNote,
      sellerNote,
      isDifferentShippingAddress,
      shippingAddress: isDifferentShippingAddress ? shippingAddress : null,
      shippingProviderId,
      paymentMethod,
      totalPayment,
      // salesRepId akan diisi di backend berdasarkan user yang login
      orderChannel: "WHATSAPP_ACQUISITION", // Default untuk form akuisisi
      orderCreatedAt: new Date().toISOString(), // Waktu order dibuat
    };
    console.log("Data form yang akan dikirim:", formData);
    // TODO: Kirim data form ke backend API
  };

export default handleFormSubmit;