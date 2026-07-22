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
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 5 },
        background:
          "linear-gradient(135deg, #090909 0%, #f4f4f4 50%, #121212 100%)",
        color: "#ffffff",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.25), transparent 24%), radial-gradient(circle at bottom right, rgba(255,255,255,0.18), transparent 26%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -90,
          left: -90,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          filter: "blur(12px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: -70,
          bottom: -70,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "rgba(8,8,8,0.24)",
          filter: "blur(12px)",
        }}
      />

      <Stack
        direction="row"
        sx={{
          position: "relative",
          zIndex: 1,
          mb: 3,
          p: 0.75,
          borderRadius: 999,
          bgcolor: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 16px 32px rgba(0,0,0,0.28)",
        }}
      >
        <Box
          onClick={() => setIsLogin(false)}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 999,
            cursor: "pointer",
            fontWeight: 700,
            color: !isLogin ? "#111111" : "rgba(255,255,255,0.9)",
            bgcolor: !isLogin ? "#ffffff" : "transparent",
            transition: "all 0.2s ease",
            fontFamily: "open sans",
          }}
        >
          Signup
        </Box>
        <Box
          onClick={() => setIsLogin(true)}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 999,
            cursor: "pointer",
            fontWeight: 700,
            color: isLogin ? "#111111" : "rgba(255,255,255,0.9)",
            bgcolor: isLogin ? "#ffffff" : "transparent",
            transition: "all 0.2s ease",
            fontFamily: "open sans",
          }}
        >
          Login
        </Box>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 540,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(246,246,246,0.5))",
          border: "1px solid rgba(0,0,0,0.22)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.32)",
          color: "#111111",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
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
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#111111",
                }}
              >
                {isLogin ? "Welcome back" : "Create an account"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "rgba(17,17,17,0.72)",
                  maxWidth: 340,
                }}
              >
                {isLogin
                  ? "Sign in to continue your next delicious order on Nyamza."
                  : "Enter your details and start your food journey with Nyamza."}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "rgba(17,17,17,0.16)" }} />

          <AnimatePresence mode="wait">
            {isLogin ? (
              <MotionDiv
                key="login"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(255,255,255,0.45)",
                        borderRadius: 3,
                        color: "#111111",
                        "& fieldset": {
                          borderColor: "rgba(17,17,17,0.78)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(17,17,17,0.95)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#111111",
                          borderWidth: 1.5,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(17,17,17,0.85)",
                      },
                      "& .MuiFormHelperText-root": {
                        color: "rgba(17,17,17,0.8)",
                      },
                      "& .MuiInputBase-input": {
                        color: "#111111",
                      },
                    }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(255,255,255,0.45)",
                        borderRadius: 3,
                        color: "#111111",
                        "& fieldset": {
                          borderColor: "rgba(17,17,17,0.78)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(17,17,17,0.95)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#111111",
                          borderWidth: 1.5,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(17,17,17,0.85)",
                      },
                      "& .MuiFormHelperText-root": {
                        color: "rgba(17,17,17,0.8)",
                      },
                      "& .MuiInputBase-input": {
                        color: "#111111",
                      },
                    }}
                  />
                  {authError && (
                    <Typography color="error.light" variant="body2">
                      {authError}
                    </Typography>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disableElevation
                    sx={{
                      borderRadius: 999,
                      fontWeight: 800,
                      py: 1.25,
                      background: "linear-gradient(135deg, #ff7b45, #ff5b2f)",
                      boxShadow: "0 12px 28px rgba(255, 107, 53, 0.35)",
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </MotionDiv>
            ) : (
              <MotionDiv
                key="signup"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(255,255,255,0.45)",
                        borderRadius: 3,
                        color: "#111111",
                        "& fieldset": {
                          borderColor: "rgba(17,17,17,0.78)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(17,17,17,0.95)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#111111",
                          borderWidth: 1.5,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(17,17,17,0.85)",
                      },
                      "& .MuiFormHelperText-root": {
                        color: "rgba(17,17,17,0.8)",
                      },
                      "& .MuiInputBase-input": {
                        color: "#111111",
                      },
                    }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(255,255,255,0.45)",
                        borderRadius: 3,
                        color: "#111111",
                        "& fieldset": {
                          borderColor: "rgba(17,17,17,0.78)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(17,17,17,0.95)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#111111",
                          borderWidth: 1.5,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(17,17,17,0.85)",
                      },
                      "& .MuiFormHelperText-root": {
                        color: "rgba(17,17,17,0.8)",
                      },
                      "& .MuiInputBase-input": {
                        color: "#111111",
                      },
                    }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(255,255,255,0.45)",
                        borderRadius: 3,
                        color: "#111111",
                        "& fieldset": {
                          borderColor: "rgba(17,17,17,0.78)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(17,17,17,0.95)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#111111",
                          borderWidth: 1.5,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(17,17,17,0.85)",
                      },
                      "& .MuiFormHelperText-root": {
                        color: "rgba(17,17,17,0.8)",
                      },
                      "& .MuiInputBase-input": {
                        color: "#111111",
                      },
                    }}
                  />
                  {authError && (
                    <Typography color="error.light" variant="body2">
                      {authError}
                    </Typography>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disableElevation
                    sx={{
                      borderRadius: 999,
                      fontWeight: 800,
                      py: 1.25,
                      background: "linear-gradient(135deg, #ff7b45, #ff5b2f)",
                      boxShadow: "0 12px 28px rgba(255, 107, 53, 0.35)",
                    }}
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
