import {
  Box,
  Rating,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "./menu";
import type { Order } from "../types/types";
import { useOrderTracking } from "../hooks/useOrder";

const order_key = "nyamza:currentOrder";

const OrderPage = () => {
  const navigate = useNavigate();
  //get current order from local storage/null
  const [order, setOrder] = useState<Order | null>(() => {
    const saved = localStorage.getItem(order_key);
    return saved ? JSON.parse(saved) : null;
  });

  // effect to try and catch any orders that slip through the authentication net or didn't get stored in localstorage for any reason
  //::user will be redirected to the restaurants page to restart a new order
  useEffect(() => {
    if (!order) {
      navigate("/restaurants");
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }
  return (
    <Box sx={{ minHeight: "auto" }}>
      <Navbar />

      {/* body */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
          px: { xs: 3, md: 10 },
          py: { xs: 4 },
          backgroundColor: "#eeebeb6d",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 2.5 }}
          sx={{
            width: "100%",
            minHeight: "70vh",
            alignItems: "start",
            justifyContent: "center",
          }}
        >
          {/* order details */}

          <Stack
            spacing={{ xs: 1 }}
            sx={{
              height: "auto",
              width: { xs: "100%", md: "40%" },
              alignItems: { xs: "center" },
            }}
          >
            {/* order receipt */}
            <Box
              sx={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                p: { xs: 2.5, md: 3 },
                fontFamily: "montserrat",
              }}
            >
              <Stack spacing={2}>
                {/* Receipt Header */}
                <Box sx={{ borderBottom: "2px solid #eeebeb", pb: 2 }}>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "18px",
                      color: "#333",
                    }}
                  >
                    Order Receipt
                  </h3>
                  <p
                    style={{ margin: "4px 0", fontSize: "12px", color: "#999" }}
                  >
                    Order ID: {order.id}
                  </p>
                </Box>

                {/* Restaurant Info */}
                <Box>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    Restaurant
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    {order.restaurantName}
                  </p>
                </Box>

                {/* Items */}
                <Box
                  sx={{
                    borderTop: "1px solid #eeebeb",
                    borderBottom: "1px solid #eeebeb",
                    py: 2,
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#666",
                    }}
                  >
                    Items
                  </p>
                  <Stack spacing={1}>
                    {order.items.map((item) => (
                      <Box
                        key={item.menuItemID}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "14px",
                        }}
                      >
                        <Box>
                          <p
                            style={{
                              margin: "0",
                              color: "#333",
                              fontWeight: "500",
                            }}
                          >
                            {item.name}
                          </p>
                          <p
                            style={{
                              margin: "2px 0 0 0",
                              color: "#999",
                              fontSize: "12px",
                            }}
                          >
                            x{item.quantity}
                          </p>
                        </Box>
                        <p
                          style={{
                            margin: "0",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Total */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Total
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#2c3e50",
                    }}
                  >
                    {order.total.toFixed(2)}
                  </p>
                </Box>

                {/* Delivery Details */}
                <Box
                  sx={{
                    backgroundColor: "#f9f8f8",
                    p: 1.5,
                    borderRadius: "8px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#666",
                    }}
                  >
                    Delivery Address
                  </p>
                  <p style={{ margin: "0", fontSize: "14px", color: "#333" }}>
                    {order.deliveryAddress}
                  </p>
                </Box>

                {/* ETA */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                    Estimated Delivery
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    {order.etaMinutes.toFixed(0)} mins
                  </p>
                </Box>

                {/* Paystack Reference */}
                <Box sx={{ borderTop: "1px solid #eeebeb", pt: 1.5 }}>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "10px",
                      color: "#999",
                      wordBreak: "break-all",
                    }}
                  >
                    Reference: {order.paystackReference}
                  </p>
                </Box>
              </Stack>
            </Box>
          </Stack>

          {/* order tracking */}
          <Stack
            spacing={{ xs: 1 }}
            sx={{
              height: "auto",
              width: { xs: "100%", md: "35%" },
            }}
          >
            <OrderTracker order={order} />
          </Stack>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

const stages = [
  { label: "Order Placed", description: "We've received your order" },
  { label: "Order Confirmed", description: "Restaurant confirmed your order" },
  { label: "Preparing your food", description: "Your food is being prepared" },
  { label: "Rider picked up", description: "A rider has your order" },
  { label: "On the way", description: "Almost there!" },
  { label: "Delivered", description: "Enjoy your meal! 🎉" },
];

interface OrderTrackerProps {
  order: Order;
}

const OrderTracker = ({ order }: OrderTrackerProps) => {
  const { activeStep, isDelivered, remainingMins } = useOrderTracking(order);
  const [rating, setRating] = useState<number | null>(null);
  const [rated, setRated] = useState(false);
  const navigate = useNavigate();

  const handleRating = (value: number | null) => {
    setRating(value);
    if (!value) return;

    const saved = localStorage.getItem("nyamza:currentOrder");
    if (saved) {
      const savedOrder = JSON.parse(saved);
      localStorage.setItem(
        "nyamza:currentOrder",
        JSON.stringify({ ...savedOrder, driverRating: value }),
      );
    }

    setRated(true);

    setTimeout(() => navigate("/restaurants"), 4000);
  };
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        p: { xs: 2.5, md: 3 },
        fontFamily: "montserrat",
      }}
    >
      {/* title */}
      <Typography
        variant="body1"
        sx={{ fontFamily: "montserrat", fontWeight: 600 }}
      >
        Order Tracking
      </Typography>
      {!isDelivered && (
        <Typography
          variant="caption"
          sx={{
            fontFamily: "montserrat",
            color: "primary.dark",
            fontWeight: 600,
          }}
        >
          {remainingMins} min{remainingMins !== 1 ? "s" : ""} remaining
        </Typography>
      )}
      {/* stepper */}
      <Stepper activeStep={activeStep} orientation="vertical">
        {stages.map((s, index) => (
          <Step key={s.label} completed={index < activeStep}>
            <StepLabel>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "montserrat",
                  fontWeight: index === activeStep ? 600 : 400,
                  color: index <= activeStep ? "black" : "text.disabled",
                }}
              >
                {s.label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography
                variant="caption"
                sx={{ fontFamily: "montserrat", color: "text.disabled" }}
              >
                {s.description}
              </Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {/* post delivery — rating prompt */}
      {isDelivered && (
        <Stack
          spacing={1.5}
          sx={{
            mt: 3,
            pt: 2,
            borderTop: "2px solid #eeebeb",
            alignItems: "center",
          }}
        >
          {!rated ? (
            <>
              <Typography
                variant="body2"
                sx={{ fontFamily: "montserrat", fontWeight: 600 }}
              >
                How was your delivery?
              </Typography>
              <Rating
                value={rating}
                onChange={(_, value) => handleRating(value)}
                size="large"
              />
              <Typography
                variant="caption"
                sx={{ color: "text.disabled", fontFamily: "montserrat" }}
              >
                Rate your rider
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="body2"
                sx={{ fontFamily: "montserrat", fontWeight: 600 }}
              >
                Thanks for your feedback!
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.disabled", fontFamily: "montserrat" }}
              >
                Redirecting you back to restaurants...
              </Typography>
            </>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default OrderPage;
