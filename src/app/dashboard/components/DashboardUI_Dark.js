'use client'
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

import { getDashboardData, getDashboardChartData } from '../../../services/dashboardService'


import { usePathname } from 'next/navigation'


export default function DashboardUI_Dark(props) {
  const pathname = usePathname()
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(pathname);
  const drawerWidth = 240;
  const [dashboardData, setDashboardData] = useState(null)
  const [dashboardChartData, setDashboardChartData] = useState(null)


  useEffect(() => {
    fetchDashboadData();
    fetchDashboadChartData();
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const fetchDashboadData = async () => {
    try {

      // setIsReportAndInvoiceDetailsLoading(true);
      // const data = await getDashboardData();
      // const dataChart = [{ name: "Pass", value: data.data?.passTasks, color: "#4CAF50" },
      // { name: "Fail", value: data?.data?.failTasks, color: "#F44336" },
      // ]
      const dataChart = [{ name: "Pass", value: props?.res?.passTasks, color: "#4CAF50" },
      { name: "Fail", value: props?.res?.failTasks, color: "#F44336" },
      ]
      setDashboardData({ ...props?.res, overallResult: dataChart })

      // setReportAndInvoiceDetails(data?.data);
      // setIsReportAndInvoiceDetailsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      // setIsReportAndInvoiceDetailsLoading(false);
    }
  };

  const fetchDashboadChartData = async () => {
    try {
      const data = await getDashboardChartData();

      setDashboardChartData(data?.data)

      // setReportAndInvoiceDetails(data?.data);
      // setIsReportAndInvoiceDetailsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      // setIsReportAndInvoiceDetailsLoading(false);
    }
  };

  const getChipColor = (result) => {
    switch (result) {
      case 'PASS':
        return {
          // bgcolor: "#E8F5E9",
          bgcolor: "#6F9A5D",
          // color: "#2e7d32",
          color: "#FFFFFF",
        };
      case 'FAIL':
        return {
          // bgcolor: "#FFEBEE",
          bgcolor: "#c62828",
          // color: "#c62828",
          color: "#FFFFFF"
        };
      case 'In Progress':
        return {
          bgcolor: '#FFF3E0 ',
          color: '#FF9800',
        };
      case 'Scheduled':
        return {
          bgcolor: '#E8F5E9',
          color: '#2e7d32',
        };
      case 'Pending':
        return {
          // bgcolor: "#E1F5FE",
          bgcolor: "#03A9F4",
          // color: "#03A9F4",
          color: "#FFFFFF"
        };
      default:
        return {
          bgcolor: "#444444",
          // color: "#616161",
          color: "#FFFFFF"
        };
    }
  };

  return (
    <Box sx={{
      display: 'flex', position: 'relative', marginTop: "25px"
      // backgroundColor:"#0A0A0A"
    }}>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // p: 3,
          // mt: 8,
          // backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: open ? 0 : `-${drawerWidth}px`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // backgroundImage: "url('/images/dashboard/dashboardCard.png')", // Using the background image
            backgroundImage: "url('/images/dashboard/dashboardCard_new1.png')", // Using the background image
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "20px",
            position: "relative",
            overflow: "hidden",
            height: "321px"
          }}
        >
          {/* Left Content */}
          <Box sx={{ flex: 3, pr: 3, color: "white", zIndex: 1 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{
              // fontSize: { xs: "24px", md: "32px" },
              fontSize: "30px",
              letterSpacing: "-0.2px",
              lineHeight: 1.2,
              mb: 2,
              color: "#FFFFFF",
            }}>
              Welcome to Your Property Management Hub
              <br />
              {/* Stay Connected and Informed */}
              Stay Connected. Stay Informed.
            </Typography>
            <Typography variant="body1" sx={{
              color: "#FFFFFF",
              fontWeight: "400",
              fontSize: "17px",
              lineHeight: 1.5,
              maxWidth: "62%"
            }}>
              {/* Welcome to your dedicated portal where you can view real-time updates
              and manage all your property maintenance needs efficiently. From
              electrical and gas safety checks to air conditioner installations, every
              detail is just a click away. */}
              This is your dedicated client portal where you can view real-time updates and manage all your property maintenance and compliance needs—effortlessly.<br />
              Track the status of Safety Checks, Minimum Rental Standards (MRS),  general plumbing or electrical works, installations, and more—all in one place.<br />
              Need support or have questions? Our team is here to help.
            </Typography>
          </Box>

          {/* Right Section */}
          {/* <Box
            sx={{
              flex: 1,
              position: "relative",
              display: "flex",
              justifyContent: "center",
              zIndex: 1
            }}
          >
            <img
              src="/images/dashboard/imageContainer1.png"
              alt="Property Management"
              style={{
                width: "100%",
                borderRadius: "12px",
                height: "240px",
                objectFit: "cover",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
              }}
            />
          </Box> */}
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3} sx={{ marginTop: "0.5rem" }}>
            {/* Left Side Cards */}
            <Grid item xs={12} md={6}>



              <Card sx={{
                p: 3,
                boxShadow: 'none',
                borderRadius: 4,
                height: "314px",
                // border: "1px solid #EEEEEE",
                background: 'linear-gradient(144deg, rgb(23, 23, 23) 0%, rgb(17, 17, 17) 99%)',

              }}>
                <Typography
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    letterSpacing: "-0.2px",
                  }}>
                  Quick Status Check
                </Typography>
                <Typography variant="body1"
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: '400',
                    fontSize: '14px',
                    marginTop: '10px',
                    maxWidth: '85%'
                  }}>
                  Get a snapshot of current job statuses, upcoming appointments,
                  and recent completions. This overview ensures you're always
                  informed and prepared for what's next.
                </Typography>
              </Card>
            </Grid>

            {/* Right Side Chart */}
            <Grid item xs={12} md={6}>

              <Card
                sx={{
                  p: 3,
                  boxShadow: 'none',
                  borderRadius: 4,
                  height: "314px",
                  // border: "1px solid #EEEEEE",
                  background: 'linear-gradient(144deg, rgb(23, 23, 23) 0%, rgb(17, 17, 17) 99%)',
                }}>
                {/* Title */}

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "8px" }}>

                    <Typography
                      style={{
                        fontSize: "22px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        letterSpacing: "-0.2px",
                      }}>
                      Overall Result
                    </Typography>

                    {/* Legend */}
                    {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1, mr: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 18, height: 18, bgcolor: "#4CAF50", borderRadius: "20%" }} />
                        <Typography variant="body2" style={{ fontSize: "12px", color: "#212121", marginLeft: "4px" }}>Pass</Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 18, color: "#BDBDBD" }} />
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 18, height: 18, bgcolor: "#F44336", borderRadius: "20%" }} />
                        <Typography variant="body2" style={{ fontSize: "12px", color: "#212121", marginLeft: "4px" }}>Fail</Typography>
                      </Box>
                    </Box> */}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Box sx={{
                    // display: "flex", 
                    alignItems: "center",
                    gap: 2,
                    mt: 1,
                    mr: 1
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{
                          width: 12,
                          height: 12,
                          // bgcolor: "#4CAF50", 
                          bgcolor: "#6BB46D",
                          borderRadius: "50%"
                        }} />
                        <Typography variant="body2"
                          style={{
                            fontSize: "13px",
                            color: "#FFFFFF",
                            marginLeft: "4px",
                            fontWeight: "400"
                          }}>Pass</Typography>
                      </Box>
                      <Typography variant="body2"
                        style={{
                          fontSize: "13px",
                          color: "#FAFAFA",
                          marginLeft: "4px",
                          fontWeight: "400"
                        }}>
                        {dashboardData?.passTasks || 0}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 5, color: "#BDBDBD" }} />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{
                          width: 12,
                          height: 12,
                          bgcolor: "#F44336",
                          borderRadius: "50%"
                        }} />
                        <Typography variant="body2"
                          style={{
                            fontSize: "13px",
                            color: "#FFFFFF",
                            marginLeft: "4px",
                            fontWeight: "400"
                          }}>Fail</Typography>
                      </Box>
                      <Typography variant="body2"
                        style={{
                          fontSize: "13px",
                          color: "#FAFAFA",
                          marginLeft: "4px",
                          fontWeight: "400"
                        }}>
                        {dashboardData?.failTasks || 0}
                      </Typography>
                    </Box>
                  </Box>
                </div>

                <div>
                  {/* Chart & Stats */}
                  <Grid container alignItems="center" spacing={2} sx={{
                    // mt: 2, 
                    width: "100%"
                  }}>
                    {/* Donut Chart */}
                    <Grid item xs={6}>
                      <PieChart width={325} height={200}>
                        <Pie
                          data={dashboardData?.overallResult}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          dataKey="value"
                          stroke="none"
                        >
                          {dashboardData?.overallResult.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </Grid>
                  </Grid>
                </div>
              </Card>
            </Grid>
          </Grid>

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 'none',
              marginTop: "2rem",
              // border: "1px solid #EEEEEE",
              background: 'linear-gradient(144deg, rgb(23, 23, 23) 0%, rgb(17, 17, 17) 99%)',
            }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}
                // borderBottom={"1px solid #EEEEEE"} 
                paddingBottom={"10px"}>
                <Typography
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    letterSpacing: "-0.2px",
                  }}>
                  Job Status
                </Typography>

                <Box display="flex" justifyContent="center">
                  <Box display="flex" alignItems="center" mx={1}>
                    <Box component="span" width={12} height={12} bgcolor="#2E93fA" mr={1} borderRadius={50} />
                    <Typography variant="body2" style={{ color: "#FFFFFF" }}>Pending</Typography>

                  </Box>
                  {/* <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 18, color:"#BDBDBD" }} /> */}
                  <Box display="flex" alignItems="center" mx={1}>
                    <Box component="span" width={12} height={12} bgcolor="#33C481" mr={1} borderRadius={50} />
                    <Typography variant="body2" style={{ color: "#FFFFFF" }}>Completed</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mx={1}>
                    <Box component="span" width={12} height={12} bgcolor="#F39C12" mr={1} borderRadius={50} />
                    <Typography variant="body2" style={{ color: "#FFFFFF" }}>In Progress</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mx={1}>
                    <Box component="span" width={12} height={12} bgcolor="#E74C3C" mr={1} borderRadius={50} />
                    <Typography variant="body2" style={{ color: "#FFFFFF" }}>Not Started</Typography>
                  </Box>

                  {/* <Select size="small" defaultValue="Monthly" variant="outlined" style={{ marginLeft: "20px", fontWeight: "700" }}
                  MenuProps={{ disableScrollLock: true }}>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select> */}
                  <div style={{
                    height: "40px",
                    width: "84px",
                    // border: "1px solid #BDBDBD", 
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "12px",
                    marginLeft: "20px",
                    background: "#171717",
                    fontWeight: "600",
                    fontSize: "14px"
                  }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#FAFAFA" }}>Monthly</span>
                  </div>
                </Box>
              </Box>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardChartData}
                  barSize={12}
                  barGap={5}
                  barCategoryGap={16}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid stroke="#ffffff" vertical={false} />
                  <XAxis dataKey="month" stroke='#ffffff' />
                  <YAxis stroke='#ffffff' />
                  <Tooltip cursor={{ fill: "#eeeeee" }} />
                  {/* <Legend /> */}
                  <Bar
                    dataKey="pending_count"
                    fill="#03A9F4"
                    name="Pending"
                    fillOpacity={0.8}
                  // activeBar={{ fill: "#000" }} // Light Grey on Hover
                  />

                  <Bar
                    dataKey="completed_count"
                    fill="#4CAF50"
                    name="Completed"
                    fillOpacity={0.8}
                  // activeBar={{ fill: "#000" }} // Light Grey on Hover
                  />

                  <Bar
                    dataKey="inprogress_count"
                    fill="#FF9800"
                    name="In Progress"
                    fillOpacity={0.8}
                  // activeBar={{ fill: "#000" }} // Light Grey on Hover
                  />

                  <Bar
                    dataKey="notstarted_count"
                    fill="#F44336"
                    name="Not Started"
                    fillOpacity={0.8}
                  // activeBar={{ fill: "#000" }} // Light Grey on Hover
                  />

                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {/* First Grid Container */}
            <Grid item xs={12} sm={6} style={{ marginTop: '4rem', marginBottom: '20px' }}>
              <Card 
                sx={{ 
                  p: "16px 0", 
                  boxShadow: 'none', 
                  borderRadius: 4, 
                  height: "500px", 
                  // border: "1px solid #EEEEEE",
                  background: 'linear-gradient(144deg, rgb(23, 23, 23) 0%, rgb(17, 17, 17) 99%)',
                  overflow: 'hidden',
                }}>
                  <div style={{borderBottom: "1px solid #232323"}}>
                <Typography 
                  variant="h6" 
                  fontWeight={600} 
                  fontSize={22} 
                  sx={{ 
                    marginBottom: 2, 
                    marginLeft: 2,
                    color: "#FFFFFF",
                    letterSpacing: "-0.2px"
                  }}>
                  Recent Completions (Last 7 Days)
                </Typography>
                </div>
                <TableContainer 
                  // component={Paper} 
                  elevation={0} sx={{ maxHeight: 450, overflowY: 'auto' }}>
                  <Table
                    // sx={{ minWidth: 650 }}
                    aria-label="jobs table">
                    <TableHead sx={{ 
                      // backgroundColor: '#FAFAFA',
                      backgroundColor: '#0A0A0A', 
                      position: 'sticky', top: 0, zIndex: 1 }}>
                      <TableRow>
                        <TableCell style={{color:"#FFFFFF", borderBottom: "1px solid #232323"}}><b>Task Name</b></TableCell>
                        <TableCell style={{color:"#FFFFFF", borderBottom: "1px solid #232323"}}><b>Completion Date</b></TableCell>
                        <TableCell style={{color:"#FFFFFF", borderBottom: "1px solid #232323"}}><b>Overall Result</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody
                      style={{
                        background: 'linear-gradient(144deg, rgb(23, 23, 23) 0%, rgb(17, 17, 17) 99%)',
                      }}
                    >
                      {dashboardData?.completionsJobs.length > 0 ? (
                        dashboardData?.completionsJobs?.map((job) => (
                          <TableRow key={job?.taskName}>
                            <TableCell style={{color:"#FFFFFF"}}>{job?.taskName}</TableCell>
                            <TableCell style={{color:"#FFFFFF"}}>{job?.completeddate}</TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  job?.OvestatusrallResultValue ? 
                                    job?.OvestatusrallResultValue
                                    : 
                                    "-"
                                }
                                sx={{
                                  ...getChipColor(job?.OvestatusrallResultValue),
                                  borderRadius: "25px",
                                  fontWeight: "600",
                                  minWidth: "80px",
                                  justifyContent: "center",
                                  fontSize: "14px",
                                  // backgroundColor: "#FFF"
                                }}
                              />
                            
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} style={{ textAlign: "center", padding: "89px" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#fff" }}>
                              <img
                                src="/images/notfound/No_data_found_new.png"
                                alt="No data found"
                                width={150}
                                height={100}
                                style={{ marginBottom: "20px" }}
                              />
                              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#999999" }}>No Data Found</h2>
                              <p style={{ marginTop: "8px", fontSize: "14px", color: "#999999" }}>
                                There is no data to show you
                              </p>
                              <p style={{ color: "#999999" }}>right now</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>

            {/* Second Grid Container */}
            <Grid item xs={12} sm={6} style={{ marginTop: '4rem' }}>
              <Card 
                sx={{ 
                  p: "16px 0", 
                  boxShadow: 'none', 
                  borderRadius: 4, 
                  height: "500px", 
                  // border: "1px solid #EEEEEE",
                  background: 'linear-gradient(144deg, rgb(23, 23, 23) 0%, rgb(17, 17, 17) 99%)',
                  overflow: 'hidden'
                }}>
                  <div style={{borderBottom: "1px solid #232323"}}>
                <Typography 
                  variant="h6" 
                  fontWeight={600} 
                  fontSize={22} 
                  sx={{ 
                    marginBottom: 2, 
                    marginLeft: 2,
                    color: "#FFFFFF",
                    letterSpacing: "-0.2px"
                  }}>
                  Upcoming Appointments (Next 7 Days)
                </Typography>
                </div>
                <TableContainer 
                  // component={Paper} 
                  elevation={0} sx={{ maxHeight: 450, overflowY: 'auto' }}>
                  <Table
                    // sx={{ minWidth: 650 }}
                    aria-label="appointments table">
                    <TableHead sx={{ 
                      // backgroundColor: '#FAFAFA',
                      backgroundColor: '#0A0A0A', 
                      position: 'sticky', top: 0, zIndex: 1 }}>
                      <TableRow>
                        <TableCell style={{color:"#FFFFFF", borderBottom: "1px solid #232323"}}><b>Task Name</b></TableCell>
                        <TableCell style={{color:"#FFFFFF", borderBottom: "1px solid #232323"}}><b>Date Scheduled</b></TableCell>
                        <TableCell style={{color:"#FFFFFF", borderBottom: "1px solid #232323"}}><b>Status</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody
                      style={{
                        background: 'linear-gradient(144deg, rgb(23, 23, 23) 0%, rgb(17, 17, 17) 99%)',
                      }}
                    >
                    {dashboardData?.upcomingJobs.length > 0 ? (
                      dashboardData.upcomingJobs.map((job) => (
                        <TableRow key={job?.taskName}>
                          <TableCell style={{color:"#FFFFFF"}}>{job?.taskName}</TableCell>
                          <TableCell style={{color:"#FFFFFF"}}>{job?.scheduledDate}</TableCell>
                          <TableCell>
                            <Chip
                              label={job?.status}
                              style={{
                                backgroundColor: getChipColor(job?.status).bgcolor,
                                color: getChipColor(job?.status).color,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} style={{ textAlign: "center", padding: "89px" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#fff" }}>
                            <img
                              src="/images/notfound/No_data_found_new.png"
                              alt="No data found"
                              width={150}
                              height={100}
                              style={{ marginBottom: "20px" }}
                            />
                            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#999999" }}>No Data Found</h2>
                            <p style={{ marginTop: "8px", fontSize: "14px", color: "#999999" }}>
                              There is no data to show you
                            </p>
                            <p style={{ color: "#999999" }}>right now</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box >
  );
}