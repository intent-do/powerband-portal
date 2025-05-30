'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import { Grid, Box, InputBase, FormControl, InputLabel, Typography, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, Pagination, PaginationItem, Snackbar, Alert, CircularProgress, InputAdornment, OutlinedInput, Autocomplete } from '@mui/material';
import { Search as SearchIcon, UnfoldMore as UnfoldMoreIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { getUsersData, getUpdateUsersData, getAddUsersData,getDeleteUsersData } from '../../services/userService'
import { add } from 'lodash';
import moment from 'moment';
import { decryptPassword } from '@/helper/securityFunctions';

const UsersTableDark = (props) => {
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
    const [addUsersData, setAddUsersData] = useState(null);
    const [updateUsersData, setUpdateUsersData] = useState(null);
    const [totalItems, setTotalItems] = useState();
    const [emailError, setEmailError] = useState("");
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [userEditId, setUserEditId] = useState(null);
    const [isModifiedUserLoader, setIsModifiedUserLoader] = useState(false);
    const [isUserDataLoading, setIsUserDataLoading] = useState(false);
    const [originalUserFetchedData, setOriginalUserFetchedData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    
    const [originalPropsData, setOriginalPropsData] = useState(props?.data?.records);
    // const [usersData, setUsersData] = useState(originalPropsData);
    const [usersData, setUsersData] = useState(null);
    

    const searchQueryRef = useRef('');

    // const users = props?.data?.records;

    // const organizationName=["Acme Corp", "Beta LLC", "Gamma Inc.", "Delta Enterprises", "Omega Solutions", "Sigma Tech", "Alpha Corp"];
    const organizationName = props?.organizationData;

    useEffect(() => {
        fetchUsersData();
    }, []);   

    // useEffect(() => {
    //     if (props?.data?.records) {
    //         setOriginalPropsData(props?.data?.records);
    //         setUsersData(props?.data?.records);
    //     }
    // }, [props?.data?.records]);
    

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

    const fetchUsersPagignationData = async (pageNo, recordsPerPage, searchText = '') => {
        setIsUserDataLoading(true);
        try {
        setIsUserDataLoading(true);
            const params = {
                page: pageNo,
                pageSize: recordsPerPage,
                search: searchText
            }
            const data = await getUsersData(params);
            setUsersData(data?.data?.records);
            // setOriginalPropsData(data?.data?.records);
            setTotalItems(props?.data?.totalRecords);
            setIsUserDataLoading(false);

        } catch (error) {
            console.error('Error:', error);
            setIsUserDataLoading(false);
        }
    };

    const fetchAddUsersData = async () => {
        const payload = {
            // userName: userName,
            organization: organization?.clientname,
            firstName: firstName,
            lastName: lastName,
            email: email,
            // password: password,
        };

        try {
            setIsModifiedUserLoader(true);
            const data = await getAddUsersData(payload);
            if (data?.code == 200 || data?.code == 201) {
                setUsersData((prevUsers) => {
                    const updatedUsers = [...prevUsers, data?.data];
                    return updatedUsers;
                });
                // setOriginalPropsData((prevUsers) => {
                //     const updatedUsers = [...prevUsers, data?.data];
                //     return updatedUsers;
                // });

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
            // userName: userName,
            // userName: "",
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
            // setOriginalPropsData((prevUsers) =>
            //     prevUsers.map((user) =>
            //         user.id === updatedUser.id ? { ...user, ...updatedUser } : user
            //     )
            // );

            setIsModifiedUserLoader(false);
            handleCloseModal();
            setToastMessage(data?.message);
            setToastOpen(true);
        } catch (error) {
            console.error('Error:', error);
            setIsModifiedUserLoader(false);
        }
    };

    const fetchDeleteUsersData = async (userId) => {
        try {
            setIsModifiedUserLoader(true);
            const data = await getDeleteUsersData( userId);
            if(data?.data){
                setUsersData((prevUsers) =>
                    prevUsers.filter((user) => user.id !== userId)
                );
            }
            setIsModifiedUserLoader(false);
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
        // fetchUsersPagignationData(page, event.target.value);
        fetchUsersPagignationData(1, event.target.value);
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
        let dcryptPass = await decryptPassword(data?.password, data?.IV);
        setUserName(data?.name);
        setOrganization(data?.organizationName);
        setFirstName(data?.firstname);
        setLastName(data?.lastname);
        setEmail(data?.email);
        setPassword(dcryptPass);
        setShowPassword(false)

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


    // const handleSearchChange = (event) => {
    //     const query = event.target.value.toLowerCase();
    //     setSearchQuery(query);

    //     if (query === "") {
    //         // setUsersData(props?.data?.records); // Reset to original data when the search query is empty
    //         setUsersData(originalPropsData); // ✅ Reset to original data
    //     } else {
    //         const filteredData = originalPropsData.filter((user) => {
    //             return (
    //                 user?.name?.toLowerCase().includes(query) ||
    //                 user?.organizationName?.toLowerCase().includes(query) ||
    //                 user?.email?.toLowerCase().includes(query)
    //             );
    //         });

    //         setUsersData(filteredData);
    //     }
    // };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        searchQueryRef.current = value;
        setSearchQuery(value);

        // searchQueryRef.current = event.target.value;
        // debouncedSearch();
        // setSearchQuery(event.target.value);

        if (value.trim() === "") {
            // Search cleared: reset to page 1
            setPage(1);
            fetchUsersPagignationData(1, rowsPerPage, "");
        } else {
            debouncedSearch(); // Debounce only for non-empty input
        }

      }

      const debouncedSearch = useCallback(
        debounce(() => {
            fetchUsersPagignationData(1, rowsPerPage, searchQueryRef.current);
        }, 1500),
        [page, rowsPerPage]
      );
    
    


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

    const doHandleChangeOrganizationDetails = async (newValue) => {

        // setEmployeeOptionDetails([]);
        // setSelectedEmployee([]);
        setOrganization(newValue);

        // const payload = {
        //     clientname: newValue?.clientname || ""
        // };

        // try {
        //     const data = await handleOrganizationDetails(payload);
        //     setEmployeeOptionDetails(data?.data);
        // } catch (error) {
        //     console.error("Error:", error);
        // }
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
            // userName &&
            organization &&
            firstName &&
            lastName &&
            email && // Ensures email is entered
            !emailError &&// Ensures email is valid
            (!openEditModal || password)
        );
    };

    const isFormModified = async() => {
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

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // backgroundImage: "url('/images/dashboard/dashboardCard.png')", // Using the background image
                        backgroundImage: "url('/images/users/users_image.png')", // Using the background image
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
                            fontSize: "14px",
                            letterSpacing: "-0.2px",
                            lineHeight: 1.2,
                            mb: 2,
                            color: "#E95E1B",
                            textTransform: "uppercase"
                        }}>
                            {props?.res}

                        </Typography>
                        <Typography variant="body1" sx={{
                            color: "#FFFFFF",
                            fontWeight: "400",
                            fontSize: "18px",
                            lineHeight: 1.5,
                            maxWidth: "40%"
                        }}>

                            {/* <Box component="span" sx={{ fontWeight: 700 }}>
                                Thanks for partnering with Powerband Electrical.
                            </Box> */}
                            <Box component="span" sx={{ fontWeight: 700 }}>
                                This is the{" "}
                                <Box component="span" sx={{ color: "#E95E1B", fontWeight: 700 }}>
                                    Powerband Electrical Client Portal Admin Centre.
                                </Box>
                            </Box>
                            &nbsp;
                            <br />
                            Below are the list of users that have been provided access to the Client Portal. You can add more Users be selecting the Add User option.

                        </Typography>
                    </Box>

                </Box>

                <Box sx={{ width: '100%', p: 0, background: 'linear-gradient(144deg, rgb(23, 23, 23) 0%, rgb(17, 17, 17) 99%)', borderRadius: "8px", marginTop: "25px" }}>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, zIndex: 1 }}>
                        <div style={{
                            display: "flex", justifyContent: "space-between", margin: "0px 30px 30px 30px",
                            paddingTop: "30px",
                        }}>
                            <Typography sx={{ fontSize: '30px', fontWeight: 'bold', color: '#fff', fontFamily: 'Nunito' }}>Users</Typography>
                            <div style={{ display: 'flex', gap: '10px' }}></div>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <TextField
                                    fullWidth
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <img
                                                    src="/images/jobs/searchIcon.svg"
                                                    alt="Search"
                                                    width={18}
                                                    height={18}
                                                    style={{
                                                        filter:
                                                            'invert(49%) sepia(100%) saturate(5636%) hue-rotate(2deg) brightness(99%) contrast(105%)',
                                                    }}
                                                />
                                            </InputAdornment>

                                        ),
                                        style: {
                                            color: '#fff', // ✅ typed text white
                                        },
                                    }}
                                    sx={{
                                        width: '25rem',
                                        marginRight: '20px',
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#000', // ✅ dark background
                                            borderRadius: '10px',
                                            '& fieldset': {
                                                borderColor: '#e95e1b !important', // ✅ border default
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#e95e1b !important', // ✅ border hover
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#e95e1b !important', // ✅ border focus
                                            },
                                        },
                                        '& input::placeholder': {
                                            color: '#fff', // ✅ placeholder white
                                            opacity: 1,
                                        },
                                    }}
                                />









                                <Button
                                    disableRipple
                                    variant="contained"
                                    color="primary"
                                    // sx={{ fontSize: '16px', backgroundColor: '#212121', gap: '8px' }}
                                    // style={{ textTransform: 'capitalize', borderRadius: '8px' }}
                                    style={{
                                        // width: "475px",
                                        // height: "567px",
                                        // padding: "8px",
                                        // boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.25)",
                                        // background: "#232323",
                                        // border: "1px solid #000000",
                                        // borderRadius: "6px"

                                        width: "173px",
                                        height: "46px",
                                        padding: "0px 10px",
                                        background: "#E95E1B",
                                        color: "#F7F6F6",
                                        border: "1px solid #232323",
                                        borderRadius: "15px",
                                        fontFamily: "Nunito",
                                        fontWeight: 400,
                                        fontSize: "14px",
                                        textAlign: "center"
                                    }}
                                    onClick={handleOpenModal}
                                >
                                    + &nbsp;Add User
                                </Button>
                            </Box>
                        </div>
                    </Box>
                    <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 500, overflowY: 'auto' }}>
                            <Table sx={{ minWidth: 650, }} aria-label="users table">
                                <TableHead sx={{ backgroundColor: '#0A0A0A', position: 'sticky', top: 0, zIndex: 1 }}>
                                    <TableRow sx={{
                                        // backgroundColor: '#FAFAFA'
                                        // backgroundColor: '#0A0A0A',
                                        // border: "1px solid #232323"
                                    }}>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', width: "28rem", borderBottom: "1px solid #232323" }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                <Typography sx={{ fontWeight: '600', color: "#e95e1b", fontFamily: "Nunito" }}>User Name</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', textAlign: 'center', borderBottom: "1px solid #232323" }}>
                                            <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
                                                <Typography sx={{ fontWeight: '600', color: "#e95e1b", fontFamily: 'Nunito' }}>Organization Name</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', textAlign: 'center', borderBottom: "1px solid #232323" }}>
                                            <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
                                                <Typography sx={{ fontWeight: '600', color: "#e95e1b", fontFamily: 'Nunito' }}>Last Active</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', textAlign: 'right', borderBottom: "1px solid #232323" }}>

                                            <Typography sx={{ fontWeight: '600', color: "#e95e1b", fontFamily: 'Nunito' }}>Actions</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                            {isUserDataLoading ? (
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ borderBottom: "1px solid #232323", height: '300px', textAlign: 'center', backgroundColor: 'black' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                <CircularProgress sx={{ color: '#e95e1b' }} />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                        ) : (
                              

                                <TableBody style={{
                                    background: 'linear-gradient(144deg, rgb(23, 23, 23) 0%, rgb(17, 17, 17) 99%)',
                                    border: "1px solid #232323"
                                }}>
                                    {/* {filteredUsers?.map((user) => ( */}
                                    {usersData?.map((user) => (

                                        <TableRow key={user?.id} sx={{ border: "1px solid #232323" }}>
                                            {/* <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell> */}
                                            <TableCell sx={{ borderBottom: "1px solid #232323" }}>
                                                <div>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px', color: '#fff', fontFamily: 'Figtree' }}>{user?.name}</div>
                                                    <div style={{ fontSize: '12px', color: '#fff' }}>{user?.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'left', color: '#fff', fontWeight: '600', borderBottom: "1px solid #232323", fontFamily: 'Figtree' }}>{user?.organizationName}</TableCell>
                                            {/* <TableCell sx={{ textAlign: 'left' ,color:'#757575', fontWeight:'600'}}>{user.lastActive}</TableCell> */}

                                            <TableCell sx={{ textAlign: 'left', color: '#fff', fontWeight: '600', borderBottom: "1px solid #232323", fontFamily: 'Figtree' }}>
                                                {user?.lastActive ? moment(user?.lastActive).fromNow() : 'Not logged in yet'}
                                            </TableCell>

                                            {/* <TableCell align="right">
                    <Button sx={{ color: 'black' }} onClick={() => handleOpenEditModal(user)}>...</Button>
                  </TableCell> */}

                                            <TableCell align="right" sx={{ borderBottom: "1px solid #232323" }}>
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
                                                <Button disableRipple sx={{ p: 1, color: 'black', textTransform: 'capitalize' }} onClick={() => fetchDeleteUsersData(user?.id)}>
                                                    <DeleteIcon sx={{ mr: 1, color: '#757575' }} />
                                                </Button>
                                                

                                                {/* </Popover> */}
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                                   )}
                            </Table>
                    </TableContainer>

                    {!isUserDataLoading &&
                        <Box sx={{
                            // mt: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid #232323',
                            padding: '22px 16px'
                            // pt: 2
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" mr={1} sx={{ color: '#fff' }}>
                                    Showing:
                                </Typography>
                                <Select
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    variant="outlined"
                                    size="small"
                                    sx={{ mr: 1, minWidth: 70, color: '#fff' }}
                                >
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                </Select>
                                <Typography variant="body2" color="text.secondary" sx={{ color: '#fff' }}>
                                    {/* out of {totalItems} */}
                                    out of {searchQuery == "" ? totalItems : usersData?.length}
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
                                // count={Math.ceil(totalItems / rowsPerPage)}
                                count={Math.ceil(searchQuery == "" ? totalItems / rowsPerPage : usersData?.length / rowsPerPage)}
                                page={page}
                                onChange={handlePageChange}
                                renderItem={(item) => (
                                    <PaginationItem
                                        {...item}
                                        sx={{
                                            borderRadius: "8px",
                                            border: "1px solid #ddd",
                                            color: item.selected ? "#fff" : "#333",
                                            fontWeight: item.selected ? "bold" : "normal",
                                            backgroundColor: item.selected ? "#e95e1b" : "#fff",
                                            "&:hover": {
                                                backgroundColor: item.selected ? "#e95e1b" : "#f0f0f0",
                                            },
                                            '& .MuiPaginationItem-root': { borderRadius: '8px' },
                                            '&.Mui-selected': { color: "#fff" }

                                        }}
                                    />
                                )}
                            />
                        </Box>
                    }
                </Box >

                {/* Add User Modal */}

                <Dialog
                    open={openModal}
                    onClose={handleCloseModal}
                    sx={{
                        margin: 'auto',
                        width: '540px',
                        '& .MuiPaper-root': {
                            backgroundColor: '#121212', // Dialog background
                            color: '#FFFFFF', // Text color
                            borderRadius: '12px',
                            padding: '16px'
                        }
                    }}
                >
                    <DialogTitle
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '20px',
                            color: '#FFFFFF',
                            position: 'relative',
                            fontFamily: "Nunito",
                        }}
                    >
                        {openEditModal ? 'Edit User' : 'Add User'}
                        <IconButton
                            onClick={handleCloseModal}
                            sx={{ position: 'absolute', right: 8, top: 8, color: '#FFFFFF' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    {errorMsg && (
                        <Typography sx={{ color: 'red', fontSize: '14px', marginLeft: '1.5rem' }}>
                            {errorMsg}
                        </Typography>
                    )}

                    <DialogContent sx={{ fontSize: '14px' }}>

                                {/* <strong style={{ fontFamily: "Nunito" }}>User Name</strong>
                                <TextField
                                    placeholder="User Name"
                                    autoFocus
                                    margin="dense"
                                    fullWidth
                                    variant="outlined"
                                    // sx={{
                                    //     marginBottom: "20px",
                                    //     input: { color: '#FFFFFF' },
                                    //     "& .MuiOutlinedInput-root": {
                                    //         height: "40px",
                                    //         borderRadius: "8px",
                                    //         backgroundColor: "#1E1E1E",
                                    //         '& fieldset': {
                                    //             borderColor: '#444'
                                    //         }
                                    //     },
                                    //     "& .MuiInputLabel-root": {
                                    //         color: "#AAAAAA"
                                    //     }
                                    // }}
                                    sx={{
                                        mb: 3,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "4px",
                                            backgroundColor: "#1A1A1A",
                                            "& input": {
                                                color: "#FFFFFF",
                                                fontFamily: "Figtree",
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
                                    // sx={{
                                    //     width: "412px",
                                    //     height: "37px",
                                    //     // padding: "4px 8px",
                                    //     background: "#232323",
                                    //     color: "#F7F6F6",
                                    //     // border: "1px solid #FFFFFF",
                                    //     borderRadius: "6px",
                                    //     fontFamily: "Figtree",
                                    //     fontWeight: "bold",
                                    //     fontsize: "14px",
                                    //     letterSpacing: "1px",
                                    //     textAlign: "left",
                                    //     marginBottom: "20px"

                                    // }}
                                    value={userName}
                                    onChange={handleUserNameChange}
                                /> */}

                        <strong style={{ fontFamily: "Nunito" }}>Organization Name</strong>
                        {openEditModal ?
                            <Select
                                value={organization}
                                onChange={handOrganizationChange}
                                fullWidth
                                displayEmpty
                                variant="outlined"
                                renderValue={(selected) =>
                                    selected ? selected : (
                                        <span style={{ color: "#FFFFFF !important", marginLeft: "0px" }}>
                                            Select an organization
                                        </span>
                                    )
                                }
                                sx={{
                                    mb: 3,
                                    backgroundColor: "#1A1A1A",
                                    marginTop: "10px",
                                    borderRadius: "4px",
                                    color: "#FFFFFF",
                                    fontSize: "14px",
                                    "& .MuiSelect-select": {
                                        padding: "12px",
                                        fontFamily: "Figtree",
                                        backgroundColor: "transparent !important",
                                        WebkitBoxShadow: "0 0 0 1000px #1A1A1A inset !important",
                                        WebkitTextFillColor: "#FFFFFF !important",
                                        caretColor: "#FFFFFF",
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
                                    "& .MuiSelect-icon": {
                                        color: "#FFFFFF",
                                    },
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            maxHeight: 200,
                                            overflowY: "auto",
                                            backgroundColor: "#232323",
                                            color: "#AAAAAA",
                                            fontFamily: "Figtree",
                                            fontSize: "14px",
                                        },
                                    },
                                }}
                            >
                                {organizationName.map((client, index) => (
                                    <MenuItem key={index} value={client.clientname}>
                                        {client.clientname}
                                    </MenuItem>
                                ))}
                            </Select>
                            :
                            <Autocomplete
                                options={organizationName}
                                // getOptionLabel={(option) => option.clientname}
                                getOptionLabel={(option) => option.clientname || ''}
                                value={organization}
                                onChange={(event, newValue) => doHandleChangeOrganizationDetails(newValue)}

                                // filterOptions={(options) => options} // 👈 disables built-in filtering
                                filterOptions={(options = [], state) => {
                                    return options.filter((option) =>
                                        option?.clientname?.toLowerCase?.().includes(state.inputValue.toLowerCase())
                                    );
                                }}

                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Select an organization"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                                isOptionEqualToValue={(option, value) =>
                                    option.clientname == value?.clientname
                                }


                                componentsProps={{
                                    paper: {
                                        sx: {
                                            backgroundColor: "#232323",
                                            color: "#AAAAAA",
                                            fontFamily: "Figtree",
                                            fontSize: "14px",
                                            borderRadius: "4px",
                                            maxHeight: "200px",
                                            // ✅ REMOVE this to avoid outer scroll
                                            // overflowY: "auto",
                                            "& .MuiAutocomplete-listbox": {
                                                maxHeight: "200px",
                                                overflowY: "auto"
                                            },
                                        },
                                    },
                                }}

                                sx={{
                                    mb: 3,
                                    mt: 1,
                                    "& .MuiInputBase-root": {
                                        backgroundColor: "#1A1A1A",
                                        color: "#FFFFFF",
                                        fontFamily: "Figtree",
                                        fontSize: "14px",
                                        borderRadius: "4px",
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
                                    "& .MuiSvgIcon-root": {
                                        color: "#FFFFFF",
                                    },
                                }}
                            />
                        }


                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <strong style={{ fontFamily: "Nunito" }}>First Name</strong>
                                <TextField
                                    placeholder="First Name"
                                    margin="dense"
                                    fullWidth
                                    variant="outlined"
                                    // sx={{
                                    //     marginBottom: "20px",
                                    //     input: { color: '#FFFFFF' },
                                    //     "& .MuiOutlinedInput-root": {
                                    //         height: "40px",
                                    //         borderRadius: "8px",
                                    //         backgroundColor: "#1E1E1E",
                                    //         '& fieldset': {
                                    //             borderColor: '#444'
                                    //         }
                                    //     }
                                    // }}
                                    sx={{
                                        mb: 3,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "4px",
                                            backgroundColor: "#1A1A1A",
                                            "& input": {
                                                color: "#FFFFFF",
                                                padding: "12px",
                                                fontFamily: "Figtree",
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
                                    value={firstName}
                                    onChange={handleFirstNameChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <strong style={{ fontFamily: "Nunito" }}>Last Name</strong>
                                <TextField
                                    placeholder="Last Name"
                                    margin="dense"
                                    fullWidth
                                    variant="outlined"
                                    // sx={{
                                    //     marginBottom: "20px",
                                    //     input: { color: '#FFFFFF' },
                                    //     "& .MuiOutlinedInput-root": {
                                    //         height: "40px",
                                    //         borderRadius: "8px",
                                    //         backgroundColor: "#1E1E1E",
                                    //         '& fieldset': {
                                    //             borderColor: '#444'
                                    //         }
                                    //     }
                                    // }}
                                    sx={{
                                        mb: 3,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "4px",
                                            backgroundColor: "#1A1A1A",
                                            "& input": {
                                                color: "#FFFFFF",
                                                fontFamily: "Figtree",
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
                                    value={lastName}
                                    onChange={handleLastNameChange}
                                />
                            </Grid>
                        </Grid>

                        <strong style={{ fontFamily: "Nunito" }}>Email Address</strong>
                        <TextField
                            placeholder="Email Address"
                            margin="dense"
                            fullWidth
                            variant="outlined"
                            // sx={{
                            //     marginBottom: "20px",
                            //     input: { color: '#FFFFFF' },
                            //     "& .MuiOutlinedInput-root": {
                            //         height: "40px",
                            //         borderRadius: "8px",
                            //         backgroundColor: "#1E1E1E",
                            //         '& fieldset': {
                            //             borderColor: '#444'
                            //         }
                            //     }
                            // }}
                            sx={{
                                mb: 3,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "4px",
                                    backgroundColor: "#1A1A1A",
                                    "& input": {
                                        color: "#FFFFFF",
                                        fontFamily: "Figtree",
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
                            // sx={{

                            //     width: "412px",
                            //     height: "37px",
                            //     // padding: "4px 8px",
                            //     background: "#232323",
                            //     color: "#F7F6F6",
                            //     // border: "1px solid #FFFFFF",
                            //     borderRadius: "6px",
                            //     fontFamily: "Figtree",
                            //     fontWeight: "bold",
                            //     fontsize: "14px",
                            //     letterSpacing: "1px",
                            //     textAlign: "left",
                            //     marginBottom: "20px"

                            // }}
                            value={email}
                            onChange={handleEmailChange}
                            error={!!emailError}
                            helperText={emailError}
                            FormHelperTextProps={{ sx: { color: '#FF6B6B' } }}
                        />

                        {openEditModal && (
                            <>
                                <strong style={{ fontFamily: "Nunito" }}>Password</strong>
                                <TextField
                                    placeholder="Password"
                                    type={showPassword ? "text" : "password"}
                                    margin="dense"
                                    fullWidth
                                    variant="outlined"
                                    // sx={{
                                    //     marginBottom: "20px",
                                    //     input: { color: '#FFFFFF' },
                                    //     "& .MuiOutlinedInput-root": {
                                    //         height: "40px",
                                    //         borderRadius: "8px",
                                    //         backgroundColor: "#1E1E1E",
                                    //         '& fieldset': {
                                    //             borderColor: '#444'
                                    //         }
                                    //     }
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
        
                                    // sx={{

                                    //     width: "412px",
                                    //     height: "37px",
                                    //     // padding: "4px 8px",
                                    //     background: "#232323",
                                    //     color: "#F7F6F6",
                                    //     // border: "1px solid #FFFFFF",
                                    //     borderRadius: "6px",
                                    //     fontFamily: "Figtree",
                                    //     fontWeight: "bold",
                                    //     fontsize: "14px",
                                    //     letterSpacing: "1px",
                                    //     textAlign: "left",
                                    //     marginBottom: "20px"

                                    // }}
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </>
                        )}
                    </DialogContent>

                    <DialogActions sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <Button
                            disableRipple
                            variant="contained"
                            sx={{ marginRight: 1, color: '#fff' }}
                            style={{ textTransform: 'capitalize', borderRadius: '8px', backgroundColor: '#e95e1b', color: '#fff', fontFamily: "Nunito" }}
                            onClick={handleSubmit}
                            disabled={!isFormValid() || !isFormModified()}
                        >
                            {isModifiedUserLoader ? <CircularProgress size={25} color="#fff" /> : (openEditModal ? 'Save' : 'Add')}
                        </Button>

                        <Button
                            disableRipple
                            sx={{
                                marginRight: 2,
                                backgroundColor: '#1E1E1E',
                                color: 'white',
                                border: '1px solid #BDBDBD',
                                fontFamily: "Nunito",
                            }}
                            style={{ textTransform: 'capitalize', borderRadius: '8px' }}
                            onClick={handleDiscard}
                        >
                            Discard
                        </Button>
                    </DialogActions>
                </Dialog>

            </div >

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

export default UsersTableDark;
