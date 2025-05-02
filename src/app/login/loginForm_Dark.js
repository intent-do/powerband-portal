'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, Box, Grid, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { setCookie } from "@/helper/functions";
import LogoutIcon from '@mui/icons-material/Logout';

const LoginPage_Dark = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isModifiedUserLoader, setIsModifiedUserLoader] = useState(false);


    // const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const apiUrl = 'http://portal.powerbandelectrical.com.au/api';


    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    const handleSubmit = async (email, password) => {
        // Clear previous error messages
        setError('');
        setEmailError('');
        setPasswordError('');

        // Validate email and password
        let valid = true;

        // Email validation
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address.");
            valid = false;
        }

        // Password validation
        if (!password) {
            setPasswordError("Password is required.");
            valid = false;
        }

        if (!valid) return; // If invalid, stop the form submission

        try {
            setIsModifiedUserLoader(true);
            // const response = await axios.post("http://172.16.17.20:3004/api/login", {
            const response = await axios.post(`${apiUrl}/login`, {
                email,
                password,
            });
            if (response?.data?.code === 200) {
                const { accessToken, payload } = response?.data?.data;
                setCookie('payload', JSON.stringify({ id: payload?.id, organizationName: payload?.organizationName, name: payload?.name, email: payload?.email, accessToken: accessToken, isAdmin: payload?.isAdmin }), 7);
                // router.push("/dashboard"); // Redirect to dashboard
                payload?.isAdmin ? router.push("/users") : router.push("/dashboard");
            } else {
                setIsModifiedUserLoader(false);
                setError(response?.data?.message);
                router.push('/login');
            }
        } catch (error) {
            router.push('/login');
            setError("An error occurred. Please try again.");
            setIsModifiedUserLoader(false);
        }
    };

    return (
        <Grid container sx={{ height: "100vh", overflow: "hidden" }}>
            {/* Left Side - Image Section */}
            <Grid
                item
                xs={12}
                md={7}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                }}
            >
                <img
                    // src="/images/dashboard/login1.jpg"
                    src="/images/dashboard/login5_updated.png"
                    alt="Illustration"
                    style={{
                        // maxWidth: "80%", 
                        // borderRadius: 10, 
                        maxHeight: "100%",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center 50%"
                        // marginLeft: "150px"
                    }}
                />
            </Grid>

            {/* Right Side - Login Form */}
            <Grid
                item
                xs={12}
                md={5}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 4,
                    height: "100%",
                    backgroundColor:"#111111",
                    position:"relative"
                }}
            >
                <Box 
                    sx={{
                        width: "100%",
                        // maxWidth: "360px",
                        maxWidth: "401px",
                        display: "flex",
                        flexDirection: "column"
                    }}
                // width={360}
                >

                {/* <div>
                    <span style={{color:"#FFFFFF"}}>Powerband Customer Portal</span>
                </div> */}

                    <Typography
                        variant="body1"
                        sx={{
                            color: "#FFFFFF",
                            // mb: 3,
                            marginBottom:"40px",
                            fontSize: "31px"
                        }}
                    >
                        Powerband Customer Portal
                    </Typography>

                {/* <div style={{display:"flex", alignItems:"center"}}>
                <Typography variant="h5" sx={{ mb: 3, mt: 3, fontWeight: 600, fontSize: "24px", color:"#EBEBEB" }}>
                    Log In
                </Typography>
                <LogoutIcon sx={{ height: 20, color:"#E95E1B" }} />
                </div> */}

                <Box 
                        sx={{ 
                            display: "flex", 
                            alignItems: "center",
                            // mb: 4,
                            marginBottom:"40px"
                        }}
                    >
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 400, 
                                fontSize: "30px", 
                                color: "#EBEBEB",
                                mr: 1
                            }}
                        >
                            Log In
                        </Typography>
                        <LogoutIcon sx={{ color: "#E95E1B", fontSize: "20px" }} />
                    </Box>
                {/* </Box> */}

                <Box
                    component="form"
                    noValidate
                    // sx={{ width: "360px" }}
                    sx={{ width: "100%" }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(email, password);
                    }}
                >
                    {/* <div style={{ marginBottom: "6px" }}>
                        <Typography variant="subtitle2" component="label" htmlFor="email" sx={{ fontSize: "14px", fontWeight:"bold", color:"#FFFFFF" }}>
                            Email Address
                        </Typography>
                    </div> */}

                    <Typography 
                            variant="subtitle2" 
                            component="label" 
                            htmlFor="email" 
                            sx={{ 
                                fontSize: "14px", 
                                fontWeight: "600", 
                                color: "#FFFFFF",
                                display: "block",
                                // mb: 1
                                marginBottom:"5px"
                            }}
                        >
                            Email Address
                        </Typography>

                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        variant="outlined"
                        placeholder="david@powerband.com"

                        // sx={{
                        //     marginBottom: "20px",
                        //     "& .MuiOutlinedInput-root": {
                        //         height: "40px",
                        //         minHeight: "40px",
                        //         borderRadius: "8px",
                        //         "& input": {
                        //             backgroundColor: "white !important",
                        //             WebkitBoxShadow: "0 0 0px 1000px white inset !important",
                        //             WebkitTextFillColor: "black !important",
                        //             caretColor: "black",
                        //             padding: "6px 12px",
                        //             fontSize: "14px",
                        //             lineHeight: "1",
                        //         },
                        //     },
                        //     "& .MuiOutlinedInput-notchedOutline": {
                        //         borderColor: "#ccc",
                        //     },
                        //     "&:hover .MuiOutlinedInput-notchedOutline": {
                        //         borderColor: "#000",
                        //     },
                        //     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        //         borderColor: "#000",
                        //     },
                        // }}

                        sx={{
                            mb: 3,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "4px",
                                backgroundColor: "#1A1A1A",
                                "& input": {
                                    color: "#FFFFFF",
                                    padding: "12px",
                                    fontSize: "14px",
                                    // Remove the white background from inputs
                                    backgroundColor: "transparent !important",
                                    WebkitBoxShadow: "0 0 0 1000px #1A1A1A inset !important",
                                    WebkitTextFillColor: "#FFFFFF !important",
                                    caretColor: "#FFFFFF",
                                },
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#333333",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#555555",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E95E1B",
                            },
                            "& .MuiFormHelperText-root": {
                                color: "#ff4444",
                                marginLeft: 0,
                                fontSize: "12px"
                            },
                        }}

                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSubmit(email, password);
                            }
                        }}
                        error={!!emailError}
                        helperText={emailError}
                    />

                    {/* <div style={{ marginBottom: "6px" }}>
                        <Typography variant="subtitle2" component="label" htmlFor="password" sx={{ fontSize: "14px", fontWeight: "bold", color:"#FFFFFF" }}>
                            Password
                        </Typography>
                    </div> */}

                        <Typography
                            variant="subtitle2"
                            component="label"
                            htmlFor="password"
                            sx={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#FFFFFF",
                                display: "block",
                                // mb: 1
                                marginBottom:"5px"
                            }}
                        >
                            Password
                        </Typography>


                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="******"

                        // sx={{
                        //     marginBottom: "20px",
                        //     "& .MuiOutlinedInput-root": {
                        //         height: "40px",
                        //         minHeight: "40px",
                        //         borderRadius: "8px",
                        //         "& input": {
                        //             backgroundColor: "white !important",
                        //             WebkitBoxShadow: "0 0 0px 1000px white inset !important",
                        //             WebkitTextFillColor: "black !important",
                        //             caretColor: "black",
                        //             padding: "6px 12px",
                        //             fontSize: "14px",
                        //             lineHeight: "1",
                        //         },
                        //     },
                        //     "& .MuiOutlinedInput-notchedOutline": {
                        //         borderColor: "#ccc",
                        //     },
                        //     "&:hover .MuiOutlinedInput-notchedOutline": {
                        //         borderColor: "#000",
                        //     },
                        //     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        //         borderColor: "#000",
                        //     },
                        // }}

                        sx={{
                            mb: 3,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "4px",
                                backgroundColor: "#1A1A1A",
                                "& input": {
                                    color: "#FFFFFF",
                                    padding: "12px",
                                    fontSize: "14px",
                                    // Remove the white background from inputs
                                    backgroundColor: "transparent !important",
                                    WebkitBoxShadow: "0 0 0 1000px #1A1A1A inset !important",
                                    WebkitTextFillColor: "#FFFFFF !important",
                                    caretColor: "#FFFFFF",
                                },
                                "& .MuiInputAdornment-root": {
                                    backgroundColor: "#1A1A1A", // matching the input background
                                    borderRadius: "0 4px 4px 0",
                                    marginLeft: "0px"
                                  },
                                  "& .MuiIconButton-root": {
                                    padding: "8px", // optional, make it feel tighter
                                    backgroundColor: "#1A1A1A",
                                    borderRadius: "4px",
                                    height:"49px"
                                  },
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#333333",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#555555",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E95E1B",
                            },
                            "& .MuiFormHelperText-root": {
                                color: "#ff4444",
                                marginLeft: 0,
                                fontSize: "12px"
                            },
                        }}

                        value={password}
                        error={!!passwordError}
                        helperText={passwordError}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError("");
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSubmit(email, password);
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {/* {showPassword ? <VisibilityOff /> : <Visibility />} */}
                                        <img
                                            src={showPassword ? "/images/login/visibilityOffEyes.svg" : "/images/login/visibilityEyes.svg"}
                                            alt="Toggle Visibility"
                                            width={40}
                                            height={40}
                                        />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <Button
                        disableRipple
                        fullWidth
                        variant="contained"
                        onClick={() => handleSubmit(email, password)}
                        sx={{
                            // py: 1.5,
                            color:"#FFFFFF",
                            backgroundColor: "#E95E1B",
                            marginTop: "8px",
                            borderRadius: "6px",
                            textTransform: "none",
                            fontSize: "16px",
                            fontWeight: "bold",
                            padding:"0px 10px",
                            height:"54px",
                            // textAlign:"center",
                            // "&:hover": { backgroundColor: "#333" },
                            "&:hover": { backgroundColor: "#D04D0A" },
                        }}
                        >
                        {isModifiedUserLoader ? (
                            <CircularProgress size={25} color="inherit" />
                        ) : (
                            "Login"
                        )}
                    </Button>

                </Box>
                </Box>

                <Box sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0,
        //   padding: 2,
        padding:3,
          display: 'flex',
          justifyContent: 'space-between',
          color: '#888',
          fontSize: '0.75rem',
        }}>
          <Typography variant="caption" style={{color:"#E95E1B", fontWeight:"bold", fontSize:"12px"}}>
            powerbandelectrical.com.au
          </Typography>
          <Typography variant="caption" style={{color:"#FFFFFF", fontWeight:"400", fontSize:"12px"}}>
            © 2025, Powerband Electrical All rights reserved.
          </Typography>
        </Box>


            </Grid>

        </Grid>
    );
};

export default LoginPage_Dark;
