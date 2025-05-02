import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  InputBase,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  Pagination,
  Chip,
  Menu,
  ListItemIcon,
  ListItemText,
  TextField,
  PaginationItem,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreHoriz as MoreHorizIcon,
  UnfoldMore as UnfoldMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

const JobsTable = () => {
  // State for tabs
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [currentRowMenu, setCurrentRowMenu] = useState(null);

  // Sample data
  const jobData = [
    {
      id: 1,
      taskName: 'SEG 5 - Electrical Safety Check - Jan/Feb 2025',
      date: '2025/02/18',
      description: 'Melbourne Residential Property Management',
      result: 'Pending',
    },
    {
      id: 2,
      taskName: 'SEG 5 - Gas Safety Check - Jan/Feb 2025',
      date: '2025/02/18',
      description: 'OBrien Real Estate Somerville',
      result: 'FAIL',
    },
    {
      id: 3,
      taskName: 'Smoke Alarm Issue',
      date: '2025/02/18',
      description: 'Melbourne Residential Property Management',
      result: 'PASS',
    },
    {
      id: 4,
      taskName: 'SEG 5 - Electrical Safety Check - Jan/Feb 2025',
      date: '2025/02/18',
      description: 'Area Specialist Casey',
      result: 'PASS',
    },
    {
      id: 5,
      taskName: 'SEG 5 - Gas Safety Check - Feb 2025',
      date: '2025/02/18',
      description: 'OBrien Real Estate Somerville',
      result: 'FAIL',
    },
    {
      id: 6,
      taskName: 'SEG 5 - Electrical Safety Check - Jan/Feb 2025',
      date: '2025/02/18',
      description: 'Melbourne Residential Property Management',
      result: 'PASS',
    },
    {
      id: 7,
      taskName: 'SEG 5 - Gas Safety Check - Jan/Feb 2025',
      date: '2025/02/18',
      description: 'OBrien Real Estate Somerville',
      result: 'FAIL',
    },
    {
      id: 8,
      taskName: 'Smoke Alarm Issue',
      date: '2025/02/18',
      description: 'Melbourne Residential Property Management',
      result: 'PASS',
    },
    {
      id: 9,
      taskName: 'SEG 5 - Electrical Safety Check - Jan/Feb 2025',
      date: '2025/02/18',
      description: 'Area Specialist Casey',
      result: 'PASS',
    },
    {
      id: 10,
      taskName: 'SEG 5 - Gas Safety Check - Feb 2025',
      date: '2025/02/18',
      description: 'OBrien Real Estate Somerville',
      result: 'FAIL',
    },
  ];

  const tabData = [
    { label: 'In Progress', count: 7 },
    { label: 'Scheduled', count: 15 },
    { label: 'Pending', count: 3 },
    { label: 'Completed', count: 43 },
    { label: 'All', count: 68 }
  ];

  // Handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1);
  };

  const handleMenuOpen = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setCurrentRowMenu(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRowMenu(null);
  };

  const handleSortMenuOpen = (event, column) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };

  // Function to get appropriate chip color based on result
  const getChipColor = (result) => {
    switch (result) {
      case 'PASS':
        return {
          bgcolor: '#E8F5E9',
          color: '#2e7d32',
        };
      case 'FAIL':
        return {
          bgcolor: '#FFEBEE',
          color: '#c62828',
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
    <Paper sx={{ width: '100%', p: 0, boxShadow: 1 }}>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <div style={{ display: "flex", justifyContent: "space-between", margin: "0px 30px 30px 30px", paddingTop: "30px" }}>
          {/* <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="job status tabs"
          sx={{ 
            '& .MuiTabs-indicator': { height: 3 },
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 'medium' }
          }}
        >
          {tabData.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs> */}

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="job status tabs"
            sx={{
              backgroundColor: "#F5F5F5", // Light background for contrast
              borderRadius: "8px",
              "& .MuiTabs-indicator": { display: "none" }, // Hide default indicator
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: "500",
                color: "#555",
                padding: "8px 16px",
                borderRadius: "10px",
                transition: "background-color 0.3s ease",
                margin: "5px"
              },
              "& .Mui-selected": {
                backgroundColor: "white", // Active tab background
                color: "black", // Active tab text color
                fontWeight: "bold",
              },
            }}
          >
            {tabData.map((tab, index) => (
              <Tab key={index} label={tab.label} style={{fontWeight:"600"}} />
            ))}
          </Tabs>

          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, border: "1px solid #E0E0E0", borderRadius: "8px" }}
            elevation={0}
          >
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />

          </Paper>

        </div>

      </Box>

      {/* Search Bar */}
      {/* <Box sx={{ my: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box> */}

      {/* Table */}
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }} aria-label="jobs table">
          <TableHead sx={{ backgroundColor: '#FAFAFA', }}>
            <TableRow>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Task Name */}
                  <Typography sx={{ fontWeight: '600' }}>Task Name</Typography>
                  <IconButton size="small" onClick={(e) => handleSortMenuOpen(e, 'taskName')}>
                    <UnfoldMoreIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: '600' }}>Date</Typography>
                  <IconButton size="small" onClick={(e) => handleSortMenuOpen(e, 'date')}>
                    <UnfoldMoreIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: '600' }}>Description</Typography>
                  <IconButton size="small" onClick={(e) => handleSortMenuOpen(e, 'description')}>
                    <UnfoldMoreIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: '600' }}>Overall Result</Typography>
                  <IconButton size="small" onClick={(e) => handleSortMenuOpen(e, 'result')}>
                    <UnfoldMoreIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell style={{maxWidth:"15rem"}}>
                  {/* {row.taskName} */}
                  <Typography sx={{ fontWeight: 'bold', fontSize:"14px" }}>{row.taskName}</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize:"14px" }}>{row.date}</Typography>
                </TableCell>
                <TableCell style={{maxWidth:"15rem"}}>
                  <Typography sx={{ fontWeight: 'bold', fontSize:"14px" }}>{row.description}</Typography>
                </TableCell>
                <TableCell style={{minWidth:"15rem"}}>
                  <Chip
                    label={row.result}
                    sx={{
                      ...getChipColor(row.result),
                      borderRadius: '25px',
                      fontWeight: '600',
                      minWidth: '80px',
                      justifyContent: 'center',
                      fontSize: "14px"
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="options"
                    size="small"
                    onClick={(e) => handleMenuOpen(e, row.id)}
                  >
                    <MoreHorizIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{
        // mt: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #e0e0e0',
        padding: '22px 16px'
        // pt: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" mr={1}>
            Showing:
          </Typography>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            variant="outlined"
            size="small"
            sx={{ mr: 1, minWidth: 70 }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
          <Typography variant="body2" color="text.secondary">
            out of 68
          </Typography>
        </Box>
        <Stack spacing={''}>


          <Pagination
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: 1,
              '& .MuiPaginationItem-root': {
                backgroundColor: 'white', // White background
                color: 'black', // Black text color
                border: '1px solid #EEEEEE', // Light gray border color
                borderRadius: '1px', // Rounded corners for the box
                padding: '8px 15px', // Padding to make the box bigger
                // fontWeight: '600', // Bold text for the page number
                fontSize: '16px', // Font size of the page number
                margin: 0, // No space between the boxes
              },
            }}
            count={Math.ceil(68 / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  color: "#333",
                  fontWeight: item.selected ? "bold" : "normal",
                  backgroundColor: item.selected ? "#f5f5f5" : "white",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              />
            )}
          />

          {/* <Pagination
        count={Math.ceil(68 / rowsPerPage)}
        page={page}
        onChange={handlePageChange}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              borderRadius: "8px",
              border: "1px solid #ddd",
              color: "#333",
              fontWeight: item.selected ? "bold" : "normal",
              backgroundColor: item.selected ? "#f5f5f5" : "white",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          />
        )}
      /> */}

        </Stack>

      </Box>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Column Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortMenuClose}
      >
        <MenuItem onClick={handleSortMenuClose}>Sort Ascending</MenuItem>
        <MenuItem onClick={handleSortMenuClose}>Sort Descending</MenuItem>
        <MenuItem onClick={handleSortMenuClose}>Clear Sorting</MenuItem>
      </Menu>
    </Paper>
  );
};

export default JobsTable;