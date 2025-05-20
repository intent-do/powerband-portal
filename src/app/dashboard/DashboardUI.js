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
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { getDashboardData, getDashboardChartData } from '../../services/dashboardService'

import { usePathname } from 'next/navigation'


export default function Dashboard(props) {
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
          bgcolor: '#E8F5E9',
          color: '#4CAF50',
        };
      case 'FAIL':
        return {
          bgcolor: '#FFEBEE',
          color: '#F44336',
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
          bgcolor: '#E1F5FE',
          color: '#03A9F4',
        };
      default:
        return {
          bgcolor: '#f5f5f5',
          color: '#616161',
        };
    }
  };

  return (
    <Box sx={{ display: 'flex', position: 'relative' }}>

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
            backgroundImage: "url('/images/dashboard/dashboardCard.png')", // Using the background image
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "20px",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Left Content */}
          <Box sx={{ flex: 3, pr: 3, color: "white", zIndex: 1 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{
              fontSize: { xs: "24px", md: "32px" },
              lineHeight: 1.2,
              mb: 2
            }}>
              Welcome to Your Property Management Hub
              <br />
              Stay Connected and Informed
            </Typography>
            <Typography variant="body1" sx={{
              fontSize: { xs: "14px", md: "16px" },
              lineHeight: 1.6,
              maxWidth: "90%"
            }}>
              Welcome to your dedicated portal where you can view real-time updates
              and manage all your property maintenance needs efficiently. From
              electrical and gas safety checks to air conditioner installations, every
              detail is just a click away.
            </Typography>
          </Box>

          {/* Right Section */}
          <Box
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
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3} sx={{ marginTop: "0.5rem" }}>
            {/* Left Side Cards */}
            <Grid item xs={12} md={6}>



              <Card sx={{ p: 3, boxShadow: 'none', borderRadius: 2, height: "315px", border: "1px solid #EEEEEE" }}>
                <Typography style={{ fontSize: "24px", fontWeight: 700, color: "#212121" }}>
                  Quick Status Check
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '16px', marginTop: '10px' }}>
                  Get a snapshot of current job statuses, upcoming appointments,
                  and recent completions. This overview ensures you're always
                  informed and prepared for what's next.
                </Typography>
              </Card>
            </Grid>

            {/* Right Side Chart */}
            <Grid item xs={12} md={6}>

              <Card sx={{ p: 3, boxShadow: 'none', borderRadius: 2, height: "315px", border: "1px solid #EEEEEE" }}>
                {/* Title */}

                <div style={{ borderBottom: "1px solid #EEEEEE", paddingBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "8px" }}>

                    <Typography style={{ fontSize: "24px", fontWeight: 700, color: "#212121" }}>
                      Overall Result
                    </Typography>

                    {/* Legend */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1, mr: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 18, height: 18, bgcolor: "#4CAF50", borderRadius: "20%" }} />
                        <Typography variant="body2" style={{ fontSize: "12px", color: "#212121", marginLeft: "4px" }}>Pass</Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 18, color: "#BDBDBD" }} />
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 18, height: 18, bgcolor: "#F44336", borderRadius: "20%" }} />
                        <Typography variant="body2" style={{ fontSize: "12px", color: "#212121", marginLeft: "4px" }}>Fail</Typography>
                      </Box>
                    </Box>
                  </div>
                </div>

                <div>
                  {/* Chart & Stats */}
                  <Grid container alignItems="center" spacing={2} sx={{ mt: 2, width: "100%" }}>
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

                    {/* Stats Section */}
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {/* Pass Section */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                          <Box sx={{ width: 3, height: 75, bgcolor: "#4CAF50" }} />
                          <Box sx={{ textAlign: "center" }}>
                            <Typography variant="body2" color="#212121" sx={{ fontSize: "14px" }}>
                              Pass
                            </Typography>
                            <Typography
                              variant="h4"
                              fontWeight="bold"
                              sx={{
                                fontSize: "36px",
                                marginTop: "5px",
                                width: "80px", // Fixed width to align digits properly
                                textAlign: "center",
                                fontFamily: "monospace", // Ensures digits take up equal space
                              }}
                            >
                              {dashboardData?.passTasks || 0}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Fail Section */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2, justifyContent: "center" }}>
                          <Box sx={{ width: 3, height: 75, bgcolor: "#F44336" }} />
                          <Box sx={{ textAlign: "center" }}>
                            <Typography variant="body2" color="#212121" sx={{ fontSize: "14px" }}>
                              Fail
                            </Typography>
                            <Typography
                              variant="h4"
                              fontWeight="bold"
                              sx={{
                                fontSize: "36px",
                                marginTop: "5px",
                                width: "80px", // Same width to ensure alignment
                                textAlign: "center",
                                fontFamily: "monospace", // Ensures uniform spacing for digits
                              }}
                            >
                              {dashboardData?.failTasks || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </div>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ borderRadius: 2, boxShadow: 'none', marginTop: "2rem", border: "1px solid #EEEEEE" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} borderBottom={"1px solid #EEEEEE"} paddingBottom={"10px"}>
                <Typography style={{ color: "#212121", fontSize: "20px", fontWeight: "700" }}>Job Status</Typography>

                <Box display="flex" justifyContent="center">
                  <Box display="flex" alignItems="center" mx={1}>
                    <Box component="span" width={12} height={12} bgcolor="#2E93fA" mr={1} />
                    <Typography variant="body2">Pending</Typography>

                  </Box>
                  {/* <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 18, color:"#BDBDBD" }} /> */}
                  <Box display="flex" alignItems="center" mx={1}>
                    <Box component="span" width={12} height={12} bgcolor="#33C481" mr={1} />
                    <Typography variant="body2">Completed</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mx={1}>
                    <Box component="span" width={12} height={12} bgcolor="#F39C12" mr={1} />
                    <Typography variant="body2">In Progress</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mx={1}>
                    <Box component="span" width={12} height={12} bgcolor="#E74C3C" mr={1} />
                    <Typography variant="body2">Not Started</Typography>
                  </Box>

                  {/* <Select size="small" defaultValue="Monthly" variant="outlined" style={{ marginLeft: "20px", fontWeight: "700" }}
                  MenuProps={{ disableScrollLock: true }}>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select> */}
                  <div style={{ height: "40px", width: "84px", border: "1px solid #BDBDBD", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "8px", marginLeft: "20px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#212121" }}>Monthly</span>
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
                  <XAxis dataKey="month" />
                  <YAxis />
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
              <Card sx={{ p: "16px 0", boxShadow: 'none', borderRadius: 2, height: "500px", border: "1px solid #EEEEEE", overflow: 'hidden' }}>
                <Typography variant="h6" fontWeight="bold" fontSize={18} sx={{ marginBottom: 2, marginLeft: 2 }}>
                  Recent Completions 7 Days
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 450, overflowY: 'auto' }}>
                  <Table
                    // sx={{ minWidth: 650 }}
                    aria-label="jobs table">
                    <TableHead sx={{ backgroundColor: '#FAFAFA', position: 'sticky', top: 0, zIndex: 1 }}>
                      <TableRow>
                        <TableCell><b>Task Name</b></TableCell>
                        <TableCell><b>Completion Date</b></TableCell>
                        <TableCell><b>Overall Result</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData?.completionsJobs.length > 0 ? (
                        dashboardData?.completionsJobs?.map((job) => (
                          <TableRow key={job.taskName}>
                            <TableCell>{job.taskName}</TableCell>
                            <TableCell>{job.completeddate}</TableCell>
                            <TableCell>
                              <Chip
                                label={job.OverallResultValue}
                                style={{
                                  backgroundColor: getChipColor(job.OverallResultValue).bgcolor,
                                  color: getChipColor(job.OverallResultValue).color,
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} style={{ textAlign: "center", padding: "20px" }}>
                            <img src="/images/notfound/No_data_found.jpg" alt="Search" width={340} height={340} />
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
              <Card sx={{ p: "16px 0", boxShadow: 'none', borderRadius: 2, height: "500px", border: "1px solid #EEEEEE", overflow: 'hidden' }}>
                <Typography variant="h6" fontWeight="bold" fontSize={18} sx={{ marginBottom: 2, marginLeft: 2 }}>
                  Upcoming Appointments Next 7 Days
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 450, overflowY: 'auto' }}>
                  <Table
                    // sx={{ minWidth: 650 }}
                    aria-label="appointments table">
                    <TableHead sx={{ backgroundColor: '#FAFAFA', position: 'sticky', top: 0, zIndex: 1 }}>
                      <TableRow>
                        <TableCell><b>Task Name</b></TableCell>
                        <TableCell>
                          {/* <b>Date Scheduled</b> */}
                          </TableCell>
                        <TableCell><b>Status</b></TableCell>
                      </TableRow>
                    </TableHead>
                    {dashboardData?.upcomingJobs.length > 0 ? (
                      dashboardData.upcomingJobs.map((job) => (
                        <TableRow key={job.taskName}>
                          <TableCell>{job.taskName}</TableCell>
                          <TableCell>{job.scheduledDate}</TableCell>
                          <TableCell>
                            <Chip
                              label={job.status}
                              style={{
                                backgroundColor: getChipColor(job.status).bgcolor,
                                color: getChipColor(job.status).color,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} style={{ textAlign: "center", padding: "20px" }}>
                          <img src="/images/notfound/No_data_found.jpg" alt="Search" width={340} height={340} />
                        </TableCell>
                      </TableRow>
                    )}
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