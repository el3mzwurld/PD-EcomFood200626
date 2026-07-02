import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  loginValidationSchema,
  signupValidationSchema,
} from "../data/validator";
import { useUser } from "../context/userContext";

const MotionDiv = motion("div");

const Authenticator = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, isAuthenticated, authError } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/restaurants", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      login(values.email, values.password);
    },
  });

  const signupFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: signupValidationSchema,
    onSubmit: (values) => {
      signup(values.name, values.email, values.password);
    },
  });

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        bgcolor: "background.default",

        px: 2,
      }}
    >
      <Stack direction={"row"} sx={{ width: "100%", justifyContent: "center" }}>
        <Box
          onClick={() => setIsLogin(false)}
          sx={{
            textTransform: "none",
            width: 80,
            textAlign: "right",
            px: 3,
            cursor: "pointer",
          }}
        >
          Signup
        </Box>
        <Box
          onClick={() => setIsLogin(true)}
          sx={{
            textTransform: "none",
            width: 80,
            textAlign: "left",
            px: 3,
            cursor: "pointer",
          }}
        >
          Login
        </Box>
      </Stack>

      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: { xs: 3, md: 4 },
          borderRadius: 0.9,
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {isLogin ? "Welcome back" : "Create an account"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {isLogin
                  ? "Sign in to continue to Nyamza."
                  : "Enter your details to create a new account."}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <AnimatePresence mode="wait">
            {isLogin ? (
              <MotionDiv
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                style={{ width: "100%" }}
              >
                <Box
                  component="form"
                  onSubmit={loginFormik.handleSubmit}
                  noValidate
                  sx={{ display: "grid", gap: 2 }}
                >
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    {...loginFormik.getFieldProps("email")}
                    error={Boolean(
                      loginFormik.touched.email && loginFormik.errors.email,
                    )}
                    helperText={
                      loginFormik.touched.email && loginFormik.errors.email
                        ? loginFormik.errors.email
                        : " "
                    }
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    {...loginFormik.getFieldProps("password")}
                    error={Boolean(
                      loginFormik.touched.password &&
                      loginFormik.errors.password,
                    )}
                    helperText={
                      loginFormik.touched.password &&
                      loginFormik.errors.password
                        ? loginFormik.errors.password
                        : " "
                    }
                  />
                  {authError && (
                    <Typography color="error" variant="body2">
                      {authError}
                    </Typography>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disableElevation
                  >
                    Login
                  </Button>
                </Box>
              </MotionDiv>
            ) : (
              <MotionDiv
                key="signup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                style={{ width: "100%" }}
              >
                <Box
                  component="form"
                  onSubmit={signupFormik.handleSubmit}
                  noValidate
                  sx={{ display: "grid", gap: 2 }}
                >
                  <TextField
                    fullWidth
                    label="Name"
                    placeholder="What should we call you?"
                    type="text"
                    {...signupFormik.getFieldProps("name")}
                    error={Boolean(
                      signupFormik.touched.name && signupFormik.errors.name,
                    )}
                    helperText={
                      signupFormik.touched.name && signupFormik.errors.name
                        ? signupFormik.errors.name
                        : " "
                    }
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    {...signupFormik.getFieldProps("email")}
                    error={Boolean(
                      signupFormik.touched.email && signupFormik.errors.email,
                    )}
                    helperText={
                      signupFormik.touched.email && signupFormik.errors.email
                        ? signupFormik.errors.email
                        : " "
                    }
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    {...signupFormik.getFieldProps("password")}
                    error={Boolean(
                      signupFormik.touched.password &&
                      signupFormik.errors.password,
                    )}
                    helperText={
                      signupFormik.touched.password &&
                      signupFormik.errors.password
                        ? signupFormik.errors.password
                        : " "
                    }
                  />
                  {authError && (
                    <Typography color="error" variant="body2">
                      {authError}
                    </Typography>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disableElevation
                  >
                    Sign Up
                  </Button>
                </Box>
              </MotionDiv>
            )}
          </AnimatePresence>
        </Box>
      </Paper>
    </Stack>
  );
};

export default Authenticator;
