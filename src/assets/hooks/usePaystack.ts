import type { SupportedCountry } from "../types/types";
import { usePaystackPayment } from "react-paystack";

const test_pk_key = "pk_test_c333f4e48e08d514feaf2b8669767d747f153fc3";
const currencyMap: Record<SupportedCountry, string> = {
  NG: "NGN",
  GH: "GHS",
  KE: "KES",
};

interface PaystackConfig {
  email: string;
  amount: number;
  countryCode: SupportedCountry;
  onSuccess: (ref: string) => void;
  onClose: () => void;
}
export const usePayStack = ({
  email,
  amount,
  countryCode,
  onClose,
  onSuccess,
}: PaystackConfig) => {
  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amount * 100,
    currency: currencyMap[countryCode],
    publicKey: test_pk_key,
  };

  const initializePayment = usePaystackPayment(config);

  const pay = () => {
    initializePayment({
      onSuccess: (ref) => onSuccess(ref.reference),
      onClose: onClose,
    });
  };

  return { pay };
};
