import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

/**
 * Khalti redirects here after payment (see return_url in initiate).
 * Docs: https://docs.khalti.com/khalti-epayment/ — use lookup API to confirm.
 */
const KhaltiReturn = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl, setCartItem } = useContext(ShopContext);
  const [statusText, setStatusText] = useState("Verifying payment…");

  useEffect(() => {
    const pidx = params.get("pidx");
    const purchaseOrderId = params.get("purchase_order_id");
    const callbackStatus = params.get("status");
    const token = localStorage.getItem("token");

    if (!token) {
      setStatusText("Please log in.");
      toast.error("Please log in.");
      navigate("/Login");
      return;
    }

    if (
      callbackStatus === "User canceled" ||
      (callbackStatus && callbackStatus.toLowerCase().includes("cancel"))
    ) {
      setStatusText("Payment was cancelled.");
      toast.info("Payment cancelled.");
      navigate("/place-orders");
      return;
    }

    if (!pidx || !purchaseOrderId) {
      setStatusText("Missing payment information from Khalti.");
      toast.error("Invalid return from payment.");
      navigate("/place-orders");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await axios.post(
          `${backendUrl}/api/order/khalti/verify`,
          { pidx, orderId: purchaseOrderId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (cancelled) return;

        if (res.data.success) {
          setCartItem({});
          setStatusText("Payment successful!");
          toast.success("Payment successful!");
          navigate("/orders");
        } else {
          setStatusText(res.data.message || "Verification failed.");
          toast.error(res.data.message || "Verification failed.");
        }
      } catch (err) {
        if (cancelled) return;
        const msg =
          err.response?.data?.message || err.message || "Verification error.";
        setStatusText(msg);
        toast.error(msg);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [backendUrl, navigate, params, setCartItem]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center px-4">
      <p className="text-gray-700 text-center">{statusText}</p>
    </div>
  );
};

export default KhaltiReturn;
