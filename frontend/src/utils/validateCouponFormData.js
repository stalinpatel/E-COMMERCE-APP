export const validateCouponForm = (formData) => {
  const { code, discountPercentage, expirationDate } = formData;

  if (!code.trim()) {
    toast.error("Coupon code is required");
    return false;
  }

  if (
    !discountPercentage ||
    isNaN(discountPercentage) ||
    discountPercentage <= 0 ||
    discountPercentage > 100
  ) {
    toast.error("Discount must be between 1 and 100");
    return false;
  }

  if (!expirationDate || new Date(expirationDate) < new Date()) {
    toast.error("Expiration date must be in the future");
    return false;
  }

  return true;
};
