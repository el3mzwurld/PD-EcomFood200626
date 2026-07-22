import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "./menu";
import { useNavigate, useParams } from "react-router-dom";
import type {
  CartItem,
  Currency,
  LocationResult,
  Order,
  Restaurant,
  SupportedCountry,
} from "../types/types";
import { useCart } from "../context/cartContext";
import { useUser } from "../context/userContext";
import { useLocation } from "../context/locationContext";
import {
  ArrowDropDownRounded,
  DoorFrontRounded,
  ShoppingBagRounded,
  ShoppingCart,
} from "@mui/icons-material";
import paystack_icon from "../img/Paystack_idIi-h8rZ0_0.svg";
import { useRestaurant } from "../context/restaurantContext";
import { useSearch } from "../hooks/useSearch";
import { usePayStack } from "../hooks/usePaystack";
//checkout page
const Checkout = () => {
  // user

  const { id } = useParams();
  const resID = id as string;
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { getRestaurantById, isLoading, restaurants } = useRestaurant();
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const { isAuthenticated, authError, user } = useUser();
  const { location } = useLocation();
  useEffect(() => {
    if (authError) {
      setSnackbarOpen(true);
    }
  }, [authError]);

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // get restaurant and meal by ID
  const restaurant = getRestaurantById(resID);

  useEffect(() => {
    if (isLoading || restaurants.length === 0) return;

    if (!restaurant) {
      navigate("/restaurants", { replace: true });
    }
  }, [isLoading, restaurant, navigate]);
  // check on mount if the cart ID matches up to the same restaurant the user tried to order from
  useEffect(() => {
    if (cart.restaurantID !== resID || cart.items.length === 0) {
      setTimeout(() => {
        navigate("/restaurants", { replace: true });
      }, 4000);
      return;
    }
  }, [cart.restaurantID, cart.items.length, resID, navigate]);
  // modal controls
  const [open, SetOpen] = useState(false);
  // delivery instructions
  const [activeLocation, setActiveLocation] = useState<"LAD" | "DBY">("LAD");
  const [driverInstructions, setDriverInstructions] = useState("");
  const handleOpen = () => {
    SetOpen(true);
  };
  const handleClosed = () => {
    SetOpen(false);
  };

  const { pay } = usePayStack({
    email: user?.email ?? "nyamza.guest@gmail.com",
    amount: total,
    countryCode: location?.countryCode as SupportedCountry,
    onSuccess: (reference) => {
      const order: Order = {
        id: crypto.randomUUID(),
        restaurantID: resID,
        restaurantName: restaurant?.name ?? "",
        items: cart.items,
        total,
        deliveryAddress: location?.label ?? "",
        deliveryCoords: location?.coords ?? { lat: 0, lng: 0 },
        driverInstructions: `${activeLocation === "LAD" ? "Leave at door" : "Deliver in person"}. ${driverInstructions}`,
        createdAt: Date.now(),
        etaMinutes: restaurant?.deliveryTimeMins ?? 0,
        paystackReference: reference,
      };
      localStorage.setItem("nyamza:currentOrder", JSON.stringify(order));
      clearCart();
      navigate(`/order/${order.id}`);
    },
    onClose: () => console.log("Payment closed"),
  });
  if (!restaurant) {
    return null;
  }

  // paystack object

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/auth", { replace: true });
      return;
    }
    pay();
  };

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
          {/* details : restaurant details and payment cta:: connect it to paystack API to generate payment modal + receipt */}

          <Stack
            spacing={{ xs: 1 }}
            sx={{
              height: "auto",
              width: { xs: "100%", md: "45%" },
              alignItems: { xs: "center" },
            }}
          >
            {/* delivery details component :  */}
            <DeliveryDetails
              handleOpen={handleOpen}
              activeLocation={activeLocation}
              setActiveLocation={setActiveLocation}
              deliveryInstructions={driverInstructions}
              setDeliveryInstructions={setDriverInstructions}
            />
            <Button
              variant="contained"
              sx={{
                width: { xs: "100%" },
                display: "flex",
                gap: 1.5,
                alignItems: "center",
              }}
              onClick={() => handleCheckout()}
            >
              <Typography
                variant="caption"
                sx={{ fontFamily: "open sans", fontWeight: 500 }}
              >
                Pay with Paystack
              </Typography>
              <img
                style={{ width: "15px", height: "15px" }}
                src={paystack_icon}
              ></img>
            </Button>
          </Stack>

          {/* details : restaurant details + cart summary + order details */}
          <Stack
            spacing={{ xs: 1 }}
            sx={{
              height: "auto",
              width: { xs: "100%", md: "35%" },
            }}
          >
            <RestaurantAndOrderDetails restaurant={restaurant} />
          </Stack>
          <LocationModal open={open} handleClose={handleClosed} />
        </Stack>
        <Snackbar
          open={isSnackbarOpen && Boolean(authError)}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {authError}
          </Alert>
        </Snackbar>{" "}
      </Box>
      <Footer />
    </Box>
  );
};

//delivery details
interface DeliveryProps {
  handleOpen: () => void;
  activeLocation: "LAD" | "DBY";
  setActiveLocation: React.Dispatch<React.SetStateAction<"LAD" | "DBY">>;
  deliveryInstructions: string;
  setDeliveryInstructions: React.Dispatch<React.SetStateAction<string>>;
}
const DeliveryDetails = ({
  handleOpen,
  activeLocation,
  setActiveLocation,
  deliveryInstructions,
  setDeliveryInstructions,
}: DeliveryProps) => {
  const { location } = useLocation();
  const isActiveLAD = Boolean(activeLocation === "LAD");
  const isActiveDBY = Boolean(activeLocation === "DBY");

  return (
    <Stack
      spacing={1.5}
      sx={{
        width: "100%",
        minHeight: { xs: 275 },
        borderRadius: 1.2,
        border: "1px solid",
        borderColor: "text.disabled",
        p: { xs: 1.5 },
      }}
    >
      {/* title */}
      <Typography variant="h5" sx={{ fontFamily: "montserrat" }}>
        Delivery Details
      </Typography>

      {/* delivery location */}
      <Stack
        direction={"row"}
        sx={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          px: 0.45,
          py: 0.5,
        }}
      >
        <Typography variant="caption" sx={{ fontSize: { xs: 10 } }}>
          {location ? location.label : "Set a delivery location"}
        </Typography>

        <Box
          sx={{
            fontSize: { xs: 10 },
            width: { xs: 60 },
            height: { xs: 30 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "text.disabled",
            color: "black",
            fontFamily: "montserrat",
            borderRadius: 0.5,
          }}
          onClick={handleOpen}
        >
          Edit
        </Box>
      </Stack>
      {/* title */}
      <Typography
        variant="body2"
        sx={{ fontFamily: "montserrat", fontWeight: 600 }}
      >
        Delivery Options
      </Typography>
      {/* delivery options */}
      <Stack
        spacing={{ xs: 1.5 }}
        sx={{
          width: "100%",
          alignItems: "start",
          justifyContent: "space-between",
          px: 0.45,
          py: 0.5,
        }}
      >
        <DeliveryOptions
          selected={isActiveLAD}
          page={"LAD"}
          setActive={setActiveLocation}
        />
        <DeliveryOptions
          selected={isActiveDBY}
          page={"DBY"}
          setActive={setActiveLocation}
        />
        <Box
          component={"input"}
          type="text"
          maxLength={100}
          name="del-ins"
          placeholder="Delivery Instructions"
          sx={{
            width: "100%",
            height: { xs: 40 },
            alignItems: "center",
            justifyContent: "start",
            px: 1.8,
            borderRadius: 0.8,
            border: "1.5px solid",
            gap: 1,
            fontFamily: "montserrat",
            cursor: "pointer",
            fontSize: 12,

            "::placeholder": {
              color: "text.disabled",
            },
            ":focus": {
              outline: "none",
            },
          }}
          value={deliveryInstructions}
          onChange={(e) => setDeliveryInstructions(e.target.value)}
        ></Box>
        <Typography
          variant="caption"
          sx={{
            fontSize: 10,
            color:
              deliveryInstructions.length < 90 ? "text.disabled" : "error.main",
          }}
        >
          {deliveryInstructions
            ? `${deliveryInstructions.length}/100`
            : "100/100"}
        </Typography>
      </Stack>
    </Stack>
  );
};

interface DeliveryOptionProps {
  page: "LAD" | "DBY"; //leavy at door or delivery by hand
  selected: boolean;
  setActive: React.Dispatch<React.SetStateAction<"LAD" | "DBY">>;
}

const DeliveryOptions = ({
  page,
  selected,
  setActive,
}: DeliveryOptionProps) => {
  const handleSelection = () => {
    if (selected) return;

    setActive(page);
  };
  return (
    <Stack
      direction={"row"}
      sx={{
        width: "100%",
        height: { xs: 40 },
        alignItems: "center",
        justifyContent: "start",
        px: 1.8,
        borderRadius: 0.8,
        border: "1.5px solid",
        borderColor: selected ? "black" : "text.disabled",
        gap: 1,
        fontFamily: "montserrat",
        cursor: "pointer",
      }}
      onClick={handleSelection}
    >
      {page === "LAD" ? <ShoppingBagRounded /> : <DoorFrontRounded />}
      <Typography variant="caption">
        {page === "LAD" ? "Leave at door." : "Deliver in person."}
      </Typography>
    </Stack>
  );
};

// restaurant and order details

interface RestaurantOrderProps {
  restaurant: Restaurant;
}

const RestaurantAndOrderDetails = ({ restaurant }: RestaurantOrderProps) => {
  const { cart } = useCart();
  const { location } = useLocation();
  const country = location && (location.countryCode as SupportedCountry);
  const currency = (place: SupportedCountry): Currency => {
    if (place === "NG") {
      return "NGN";
    } else if (place === "GH") {
      return "GHS";
    }
    return "KES";
  };

  return (
    <Stack
      sx={{
        width: "100%",
        minHeight: { xs: "auto", md: "100%" },
        borderRadius: 1.2,
        border: "1px solid",
        borderColor: "text.disabled",
        py: { xs: 1.5 },
        backgroundColor: "white",
      }}
    >
      {/* restaurant details :: name and address */}
      <Stack
        spacing={1}
        sx={{
          width: "100%",
          height: { xs: 120, md: 160 },
          p: 2,
          px: 1,
          borderBottom: "2px solid",
          borderColor: "secondary.dark",
          justifyContent: "center",
          alignItems: "start",
        }}
      >
        {/* title */}
        <Typography
          variant="body2"
          sx={{
            fontFamily: "montserrat",
            fontWeight: 600,
            color: "primary.dark",
            fontSize: { md: 24 },
          }}
        >
          {restaurant.name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontFamily: "montserrat",
            fontWeight: 400,
            color: "text.disabled",
            fontSize: { xs: 10 },
            width: "80%",
          }}
        >
          {restaurant.address}
        </Typography>
      </Stack>
      {/* accordion : cart summary */}
      <Box
        sx={{
          width: "100%",
          borderBottom: cart.items.length > 1 ? "2.5px solid" : undefined,
          borderColor: "secondary.dark",
        }}
      >
        <Accordion
          sx={{
            width: "100%",
            borderRadius: 0,
            backgroundColor: "white",
            border: "none",
          }}
          elevation={0}
          square
        >
          <AccordionSummary expandIcon={<ArrowDropDownRounded />}>
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontFamily: "montserrat",
              }}
            >
              <ShoppingCart sx={{ color: "primary.main" }} />
              Cart Summary ({cart.items.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {cart.items.map((m) => (
              <AccordionCard item={m} getCurrency={currency} />
            ))}
          </AccordionDetails>
        </Accordion>
      </Box>
      {/* order summary */}
      <Stack
        spacing={1}
        sx={{
          flex: 1,
          width: "100%",
          height: { xs: 120 },
          p: 2,
          px: 1,
        }}
      >
        {/* title */}
        <Typography
          variant="body2"
          sx={{
            fontFamily: "montserrat",
            fontWeight: 600,
            color: "primary.dark",
          }}
        >
          Order Summary
        </Typography>

        {/* summary :: total  */}
        <Stack>
          <Stack
            direction={"row"}
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              px: 1.5,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontSize: { xs: 12 } }}>
              Subtotal
            </Typography>
            <Typography variant="subtitle1" sx={{ fontSize: { xs: 12 } }}>
              {country && currency(country)} {cart.items[0].price}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
type CardProps = {
  item: CartItem;
  getCurrency: (location: SupportedCountry) => Currency;
};
const AccordionCard = ({ item, getCurrency }: CardProps) => {
  const { location } = useLocation();
  return (
    <Stack
      direction={"row"}
      sx={{
        overflow: "hidden",
        height: { xs: 65 },
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "2.5px solid",

        borderColor: "secondary.dark",
      }}
    >
      {/* name and price */}
      <Stack
        direction={"row"}
        sx={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1 },
        }}
      >
        <Typography variant="subtitle1" sx={{ fontSize: { xs: 12 } }}>
          {item.name} ({item.quantity}x)
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ fontSize: { xs: 12 }, color: "text.disabled" }}
        >
          {location && getCurrency(location.countryCode)}
          {item.price}
        </Typography>
      </Stack>
    </Stack>
  );
};

//location modal
export const LocationModal = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const [place, setPlace] = useState<LocationResult | null>(null);
  const [query, setQuery] = useState("");
  const { results } = useSearch(query);
  const { setLocation } = useLocation();

  const handleSetLocation = () => {
    if (!place) {
      return;
    }
    setLocation(place);
    handleClose();
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle variant="h4">Edit delivery address</DialogTitle>
      <DialogContent>
        <Stack
          component={"form"}
          spacing={1}
          sx={{ height: { xs: 300 }, width: { xs: 200, md: 270 } }}
        >
          <Box
            component={"input"}
            type="text"
            sx={{
              width: "100%",
              height: { xs: 40 },
              px: 1,
              ":focus": { outline: "none" },
            }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></Box>

          <Stack spacing={{ xs: 1.5 }} sx={{ width: "100%", height: "auto" }}>
            {results.length !== 0 &&
              results.map((m) => (
                <Stack
                  direction={"row"}
                  sx={{
                    width: "100%",
                    height: { xs: 40 },
                    padding: 0.75,
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "text.disabled",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setPlace(m);
                    setQuery(m.label ?? "");
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontSize: { xs: 10 } }}>
                    {m.label}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontSize: { xs: 10 } }}>
                    {m.countryCode}
                  </Typography>
                </Stack>
              ))}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSetLocation}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Checkout;
