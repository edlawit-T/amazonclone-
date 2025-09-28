import React, { useContext, useState, useEffect } from "react";
import Layout from "../../components/LayOut/LayOut";
import styles from "./Payment.module.css";
import { DataContext } from "../../components/DataProvider/DataProvider";
import ProductCard from "../../components/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormatter from "../../components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";
import { ClipLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/action.type";

function Payment() {
  const [{ basket, user }, dispatch] = useContext(DataContext);
  const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);
  const totalPrice = basket.reduce(
    (amount, item) => item.price * item.amount + amount,
    0
  );

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const navigate = useNavigate();

  // 1️⃣ Create PaymentIntent on page load or basket change
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axiosInstance.post("/payment/create", {
          total: totalPrice * 100, // amount in cents
        });
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
      }
    };

    if (totalPrice > 0) {
      createPaymentIntent();
    }
  }, [totalPrice]);

  const handleChange = (e) => {
    setCardError(e?.error?.message || "");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      const confirmation = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (confirmation.error) {
        setCardError(confirmation.error.message);
        setProcessing(false);
        return;
      }

      const { paymentIntent } = confirmation;
      // Save order to Firestore
      await setDoc(
        doc(collection(db, "users", user.uid, "orders"), paymentIntent.id),
        {
          basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        }
      );

      dispatch({ type: Type.EMPTY_BASKET });
      setProcessing(false);
      navigate("/orders", {
        state: { msg: "You have placed a new order" },
      });
    } catch (err) {
      console.error(err);
      setCardError(err.message);
      setProcessing(false);
    }
  };

  return (
    <Layout>
      <div className={styles.payment__header}>Checkout ({totalItem}) items</div>
      <section className={styles.payment}>
        {/* Delivery address */}
        <div className={styles.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>React Lane`</div>
            <div>Chicago, IL</div>
          </div>
        </div>
        <hr />

        {/* Products */}
        <div className={styles.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item, index) => (
              <ProductCard product={item} key={index} flex={true} />
            ))}
          </div>
        </div>
        <hr />

        {/* Payment Form */}
        <div className={styles.flex}>
          <h3>Payment Methods</h3>
          <div className={styles.payment__card__container}>
            <form onSubmit={handlePayment} className={styles.payment__details}>
              {cardError && <small style={{ color: "red" }}>{cardError}</small>}
              <CardElement onChange={handleChange} />
              <div className={styles.payment__price}>
                <div>
                  <span style={{ display: "flex", gap: "10px" }}>
                    <p>Total Order</p> |{" "}
                    <CurrencyFormatter amount={totalPrice} />
                  </span>
                </div>
                <button type="submit" disabled={processing || !clientSecret}>
                  {processing ? (
                    <div className={styles.loading}>
                      <ClipLoader size={15} />
                      <p>Please wait ...</p>
                    </div>
                  ) : (
                    "Pay Now"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Payment;
