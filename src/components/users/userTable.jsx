'use client';
import React, { useState, useEffect } from 'react';
import { Grid, Box, InputBase, FormControl, InputLabel, Typography, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, Pagination, PaginationItem, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Search as SearchIcon, UnfoldMore as UnfoldMoreIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { getUsersData, getUpdateUsersData, getAddUsersData } from '../../services/userService'
import { add } from 'lodash';
import moment from 'moment';

const UsersTable = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [organization, setOrganization] = useState('');
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [usersData, setUsersData] = useState(null);
  const [addUsersData, setAddUsersData] = useState(null);
  const [updateUsersData, setUpdateUsersData] = useState(null);
  const [totalItems, setTotalItems] = useState();
  const [emailError, setEmailError] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [userEditId, setUserEditId] = useState(null);
  const [isModifiedUserLoader, setIsModifiedUserLoader] = useState(false);
  const [originalUserFetchedData, setOriginalUserFetchedData] = useState(null);

  // const users = props?.data?.records;

  // const organizationName=["Acme Corp", "Beta LLC", "Gamma Inc.", "Delta Enterprises", "Omega Solutions", "Sigma Tech", "Alpha Corp"];
  const organizationName = props?.organizationData;

  useEffect(() => {
    fetchUsersData();
  }, []);



  const fetchUsersData = async (params) => {
    try {
      const params = {
        page: page,
        pageSize: rowsPerPage,
      }
      // const data = await getUsersData();
      // setUsersData(users);
      setUsersData(props?.data?.records);
      // setTotalItems(props?.data?.totalRecords);
      setTotalItems(props?.data?.totalRecords);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUsersPagignationData = async (pageNo, recordsPerPage) => {
    try {
      const params = {
        page: pageNo,
        pageSize: recordsPerPage,
      }
      const data = await getUsersData(params);
      setUsersData(data?.data?.records);
      setTotalItems(props?.data?.totalRecords);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAddUsersData = async () => {
    const payload = {
      userName: userName,
      organization: organization,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    try {
      setIsModifiedUserLoader(true);
      const data = await getAddUsersData(payload);
      if (data?.code == 200 || data?.code == 201) {
        setUsersData((prevUsers) => {
          const updatedUsers = [...prevUsers, data?.data];
          return updatedUsers;
        });

        setAddUsersData(data?.data);

        setIsModifiedUserLoader(false);
        handleCloseModal();
        setToastMessage(data?.message);
        setToastOpen(true);
        // users.push(data?.data);
        // fetchUsersData();
      } else {
        setIsModifiedUserLoader(false);
        setErrorMsg(data?.message)

      }
    } catch (error) {
      console.error('Error:', error);
      setIsModifiedUserLoader(false);
    }
  };

  const fetchUpdateUsersData = async () => {
    const payload = {
      userName: userName,
      organization: organization,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    try {
      setIsModifiedUserLoader(true);
      const data = await getUpdateUsersData(payload, userEditId);

      const updatedUser = data?.data;
      // setUpdateUsersData(data?.data);

      setUsersData((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user
        )
      );

      setIsModifiedUserLoader(false);
      handleCloseModal();
      setToastMessage(data?.message);
      setToastOpen(true);
    } catch (error) {
      console.error('Error:', error);
      setIsModifiedUserLoader(false);
    }
  };


  const handleSubmit = () => {
    if (openEditModal) {
      fetchUpdateUsersData();
    } else {
      fetchAddUsersData();
    }
    // handleCloseModal();
  };

  const handleDiscard = () => {
    if (openEditModal) {
      handleDiscardEditModal();
    } else {
      handleDiscardModal();
    }
    // handleCloseModal();
  };

  const sortUsers = (users) => {
    if (!sortColumn) return users;
    return [...users].sort((a, b) => {
      if (a[sortColumn] > b[sortColumn]) return 1;
      if (a[sortColumn] < b[sortColumn]) return -1;
      return 0;
    });
  };

  // const sortedUsers = sortUsers(users);
  const sortedUsers = sortUsers(usersData);


  const filteredUsers = sortedUsers?.filter((user) => {
    return (
      user?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      user?.organizationName?.toLowerCase()?.includes(searchQuery.toLowerCase())
    );
  });

  // const handlePageChange = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleRowsPerPageChange = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(1);
  // };

  // const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchUsersPagignationData(value, rowsPerPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    // setPage(1);
    fetchUsersPagignationData(page, event.target.value);
  };

  const handleOpenModal = async () => {
    setUserName('');
    setOrganization('');
    setFirstName('');
    setLastName('');
    setEmail("");
    setPassword('');

    setOpenModal(true);
    setOpenEditModal(false);
  };

  const handleEditOpenModal = async (data) => {
    setUserName(data?.name);
    setOrganization(data?.organizationName);
    setFirstName(data?.firstname);
    setLastName(data?.lastname);
    setEmail(data?.email);
    setPassword(data?.password);

    setOriginalUserFetchedData(data);

    setOpenModal(true);
    setOpenEditModal(true);
    setErrorMsg("");
    setUserEditId(data?.id)
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setUserName('');
    setOrganization('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setOpenEditModal(false);
  };

  const handleDiscardModal = () => {
    setUserName('');
    setOrganization('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setEmailError('');

    setOpenModal(true);
  };

  const handleDiscardEditModal = () => {
    setUserName(originalUserFetchedData?.name || '');
    setOrganization(originalUserFetchedData?.organizationName || '');
    setFirstName(originalUserFetchedData?.firstname || '');
    setLastName(originalUserFetchedData?.lastname || '');
    setEmail(originalUserFetchedData?.email || '');
    setPassword(originalUserFetchedData?.password || '');
    setEmailError('');

    setOpenEditModal(true);
  };


  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setUsersData(props?.data?.records); // Reset to original data when the search query is empty
    } else {
      const filteredData = usersData.filter((user) => {
        return (
          user?.name?.toLowerCase().includes(query) ||
          user?.organizationName?.toLowerCase().includes(query) ||
          user?.email?.toLowerCase().includes(query)
        );
      });

      setUsersData(filteredData);
    }
  };


  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const open = Boolean(anchorEl);

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handOrganizationChange = (e) => {
    // setOrganization(e.target.value?.clientname);
    setOrganization(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Email validation regex pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(""); // Clear error if email is valid
    }
  };


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const isFormValid = () => {
    return (
      userName &&
      organization &&
      firstName &&
      lastName &&
      email && // Ensures email is entered
      !emailError && // Ensures email is valid
      password
    );
  };

  const isFormModified = () => {
    return (
      userName !== originalUserFetchedData?.name ||
      organization !== originalUserFetchedData?.organizationName ||
      firstName !== originalUserFetchedData?.firstname ||
      lastName !== originalUserFetchedData?.lastname ||
      email !== originalUserFetchedData?.email ||
      password !== originalUserFetchedData?.password
    );
  };

  moment.updateLocale('en', {
    relativeTime: {
      future: "in %s",
      past: "%s",
      s: "Just now", // Replace "a few seconds ago" with "Just now"
      ss: "Just now",
      m: "1 minute ago",
      mm: "%d minutes ago",
      h: "1 hour ago",
      hh: "%d hours ago",
      d: "1 day ago",
      dd: "%d days",
      M: "1 month ago",
      MM: "%d months",
      y: "1 year ago",
      yy: "%d years"
    }
  });

  return (
    <>
      <div>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            disableRipple
            variant="contained"
            color="primary"
            sx={{ fontSize: '16px', backgroundColor: '#212121', gap: '8px', Top: '20px', bottom: '20px' }}
            style={{ textTransform: 'capitalize', borderRadius: '8px' }}
            onClick={handleOpenModal}
          >
            + &nbsp;Add User
          </Button>
        </Box>

        <Box sx={{ width: '100%', p: 0, border: "1px solid #EEEEEE", borderRadius: "8px" }}>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem" }}>
              <Typography sx={{ fontSize: '30px', fontWeight: 'bold' }}>Users</Typography>
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* <Button variant="text" sx={{ color: 'black', margin: 'auto', justifyContent: 'end', display: 'flex' }}>
                Selected
              </Button>
              <Button variant="contained" sx={{ backgroundColor: '#F5F5F5', color: 'black', margin: 'auto', justifyContent: 'end', display: 'flex' }}>
                Remove
              </Button> */}
              </div>
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '20%', height: '40px', border: "1px solid #E0E0E0", borderRadius: "8px" }}
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
          <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 500, overflowY: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="users table">
              <TableHead sx={{ backgroundColor: '#FAFAFA', position: 'sticky', top: 0, zIndex: 1 }}>
                <TableRow>
                  {/* <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell> */}
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', width: "28rem" }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Typography sx={{ fontWeight: '600' }}>User Name</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
                      <Typography sx={{ fontWeight: '600' }}>Organization Name</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
                      <Typography sx={{ fontWeight: '600' }}>Last Active</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', textAlign: 'right' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {/* {filteredUsers?.map((user) => ( */}
                {usersData?.map((user) => (

                  <TableRow key={user?.id}>
                    {/* <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell> */}
                    <TableCell>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>{user?.name}</div>
                        <div style={{ fontSize: '12px', color: '#757575' }}>{user?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'left', color: '#757575', fontWeight: '600' }}>{user?.organizationName}</TableCell>
                    {/* <TableCell sx={{ textAlign: 'left' ,color:'#757575', fontWeight:'600'}}>{user.lastActive}</TableCell> */}

                    <TableCell sx={{ textAlign: 'left', color: '#757575', fontWeight: '600' }}>
                      {user?.lastActive ? moment(user?.lastActive).fromNow() : 'Not logged in yet'}
                    </TableCell>

                    {/* <TableCell align="right">
                    <Button sx={{ color: 'black' }} onClick={() => handleOpenEditModal(user)}>...</Button>
                  </TableCell> */}

                    <TableCell align="right">
                      {/* <Button sx={{ color: 'black' }} onClick={handleClick}>
        ...
      </Button> */}
                      {/* <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '.MuiPopover-paper': {
            borderRadius: 1,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        }}
      > */}
                      <Button disableRipple sx={{ p: 1, color: 'black', textTransform: 'capitalize' }} onClick={() => handleEditOpenModal(user)}>
                        <EditIcon sx={{ mr: 1, color: '#757575' }} />
                      </Button>

                      {/* </Popover> */}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>



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
                out of {totalItems}
              </Typography>
            </Box>
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
              count={Math.ceil(totalItems / rowsPerPage)}
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
                    '& .MuiPaginationItem-root': { borderRadius: '8px' }
                  }}
                />
              )}
            />
          </Box>
        </Box>

        {/* Add User Modal */}

        <Dialog open={openModal} onClose={handleCloseModal} sx={{ margin: 'auto', width: '540px' }}>
          <DialogTitle sx={{ fontWeight: 'bold', fontSize: '20px' }}>
            {openEditModal ? 'Edit User' : 'Add User'}
            <IconButton
              onClick={handleCloseModal}
              color="primary"
              sx={{ position: 'absolute', right: 8, top: 8, color: 'black' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          {errorMsg && (
            <Typography sx={{ color: 'red', fontSize: '14px', marginLeft: '1.5rem' }}>
              {errorMsg}
            </Typography>
          )}

          <DialogContent sx={{ fontSize: '14px', justifyContent: 'space-between' }}>
            {/* Form fields for user details */}
            <strong>User Name</strong>
            <TextField
              placeholder="User Name"
              autoFocus
              margin="dense"
              fullWidth
              variant="outlined"
              sx={{
                marginBottom: "20px",
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  minHeight: "40px",
                  borderRadius: "8px",
                }
              }}
              value={userName}
              onChange={handleUserNameChange}
            />

            <strong>Organization Name</strong>
            <Select
              // label
              // value={organization?.clientname}
              value={organization}
              onChange={handOrganizationChange}
              fullWidth
              variant="outlined"
              renderValue={(selected) =>
                selected ? selected : <span style={{ color: "#9E9E9E", marginLeft: "-8px" }}>Select an organization</span>
              }
              displayEmpty
              sx={{
                marginTop: "8px",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 200, // Set a fixed dropdown height
                    overflowY: "auto", // Enable scrolling if needed
                  },
                },
              }}
            >
              {/* <MenuItem value="" disabled>Select an organization</MenuItem> */}
              {/* {
                organizationName.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name?.clientname}
                  </MenuItem>
                ))
              } */}
              {
                organizationName.map((client, index) => (
                  <MenuItem key={index} value={client.clientname}>
                    {client.clientname}
                  </MenuItem>
                ))
              }
            </Select >

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <strong>First Name</strong>
                <TextField
                  placeholder="First Name"
                  margin="dense"
                  fullWidth
                  variant="outlined"
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      height: "40px",
                      minHeight: "40px",
                      borderRadius: "8px",
                    }
                  }}
                  value={firstName}
                  onChange={handleFirstNameChange}
                />
              </Grid>
              <Grid item xs={6}>
                <strong>Last Name</strong>
                <TextField
                  placeholder="Last Name"
                  margin="dense"
                  fullWidth
                  variant="outlined"
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      height: "40px",
                      minHeight: "40px",
                      borderRadius: "8px",
                    }
                  }}
                  value={lastName}
                  onChange={handleLastNameChange}
                />
              </Grid>
            </Grid>

            <strong>Email Address</strong>
            <TextField
              placeholder="Email Address"
              margin="dense"
              fullWidth
              variant="outlined"
              sx={{
                marginBottom: "20px",
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  minHeight: "40px",
                  borderRadius: "8px",
                },
              }}
              value={email}
              onChange={handleEmailChange}
              error={!!emailError} // Shows red border if email is invalid
              helperText={emailError} // Displays error message below input
            />

            <strong>Password</strong>
            <TextField
              placeholder="Password"
              type='password'
              margin="dense"
              fullWidth
              variant="outlined"
              sx={{
                marginBottom: "20px",
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  minHeight: "40px",
                  borderRadius: "8px",
                }
              }}
              value={password}
              onChange={handlePasswordChange}
            />
          </DialogContent>

          <DialogActions sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <Button
              disableRipple
              variant="contained"
              sx={{ marginRight: 1, backgroundColor: 'black', color: 'white' }}
              style={{ textTransform: 'capitalize', borderRadius: '8px' }}
              onClick={handleSubmit}
              disabled={!isFormValid() || !isFormModified()}
            >
              {isModifiedUserLoader ? <CircularProgress size={25} color='#fff' /> : (
                openEditModal ? 'Save' : 'Add'
              )}
              {/* {} */}
            </Button>

            <Button
              disableRipple
              sx={{ marginRight: 2, backgroundColor: 'white', color: 'black', border: '1px solid #BDBDBD' }}
              style={{ textTransform: 'capitalize', borderRadius: '8px' }}
              onClick={handleDiscard}
            >
              Discard
            </Button>
          </DialogActions>

        </Dialog>
      </div>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>

    </>
  );
};

export default UsersTable;
