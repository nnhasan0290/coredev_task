import React, { useEffect } from "react";
import PaymentMd from "../../../Components/Modal/PaymentMd";
import Btn from "../../../Components/Share/Btn";
import { useGlobalCtx } from "../../../Contexts/GlobalProvider";
import { TbRow } from "./Handler";
import { useBkash } from "react-bkash";

const CartProducts = [
  { id: 1, product: "External SSD USB 3.1 750 GB", price: "1" },
  { id: 2, product: "External SSD USB 2.1 150 GB", price: "1" },
];

export default function Order() {
  const { open, setTotalPrice, totalPrice } = useGlobalCtx();

  const total = CartProducts.reduce(
    (accumulator, currentValue) =>
      Number(accumulator) + Number(currentValue.price),
    0
  );
  useEffect(() => {
    setTotalPrice(total + 1);
  }, []);

  const { error, loading, triggerBkash } = useBkash({
    onSuccess: (data) => {
      console.log(data); // this contains data from api response from onExecutePayment
    },
    onClose: () => {
      console.log("Bkash iFrame closed");
    },
    bkashScriptURL:
      "https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js", // https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js
    amount: 1000,
    onCreatePayment: async (paymentRequest) => {
      return {
        paymentID: "string",
        createTime: "string;",
        orgLogo: "string;",
        orgName: "string;",
        transactionStatus: "string;",
        amount: "string;",
        currency: "string;",
        intent: "string;",
        merchantInvoiceNumber: "string;",
      };
    },
    onExecutePayment: async (paymentID) => {
      // call your executePayment API here
      return await fetch("<your backend api>/execute/${paymentID}", {
        method: "POST",
      }).then((res) => res.json());

      // it doesn't matter what you return here, any errors thrown here will be available on error return value of the useBkash hook
    },
  });

  return (
    <div>
      <div className="border border-border border-opacity-5 rounded-[0.5rem] py-4 px-5">
        <h1 className="pb-4 text-xl border-b text-textHeader">Your order</h1>
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="pt-5 pb-2 text-base font-semibold text-black">
                Product
              </td>
              <td className="pt-5 pb-2 text-base font-semibold text-right text-black">
                Subtotal
              </td>
            </tr>
            {CartProducts.map((product) => (
              <TbRow key={product.id} label={product.product}>
                ৳ {product.price} TK{" "}
              </TbRow>
            ))}
            <TbRow label="Subtotal">
              <p className="text-black">৳ {total}TK </p>
            </TbRow>
          </tbody>
        </table>
        <p className="py-5 text-pColor">Shipping</p>
        <div className="pb-5 space-y-2 border-b border-opacity-5 border-border">
          <div className="flex items-center justify-between text-pColor">
            <label className="flex items-center">
              <input
                type="radio"
                name="shipping"
                defaultChecked
                className="mr-2 border-none outline-none accent-yellow-400"
                value="1"
                onChange={() => setTotalPrice(totalPrice - 2 + 1)}
              />
              Inside Dhaka
            </label>
            <p className="text-black">৳ 1.00tk </p>
          </div>
          <div className="flex items-center justify-between text-pColor">
            <label className="flex items-center">
              <input
                type="radio"
                name="shipping"
                className="mr-2 accent-yellow-400"
                value="2"
                onChange={() => setTotalPrice(totalPrice - 1 + 2)}
              />
              Outside Dhaka
            </label>
            <p className="text-black">৳ 2.00tk </p>
          </div>
        </div>
        <div className="flex justify-between py-5">
          <p className="text-base font-normal text-black">Estimated Total</p>
          <p className="text-xl font-bold text-textHeader">
            ৳ {totalPrice} TK{" "}
          </p>
        </div>
        {!loading && !error && (

        <Btn onClick={triggerBkash}>Continue to Payment</Btn>
        )}
        {open ? <PaymentMd /> : ""}
      </div>
    </div>
  );
}
