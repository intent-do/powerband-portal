import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Menu,
    MenuItem,
    Divider,
    Chip,
    CircularProgress,
    Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { getJobsData } from '../../services/jobsService';

const JobsTableSection_Dark = (props) => {
    // State for filter menus
    const [scheduledFilterAnchorEl, setScheduledFilterAnchorEl] = useState(null);
    const [pendingFilterAnchorEl, setPendingFilterAnchorEl] = useState(null);
    const [completedFilterAnchorEl, setCompletedFilterAnchorEl] = useState(null);
    const [mainFilterAnchorEl, setMainFilterAnchorEl] = useState(null);
    const [jobsDetails, setJobsDetails] = useState(null);
    const [isJobsDataLoading, setIsJobsDataLoading] = useState(false);


    const [search, setSearch] = useState('');  // Search state
    // const [filters, setFilters] = useState({
    //     scheduled: { taskStatus: 1, filter: 'lastMonth' },
    //     pending: { taskStatus: 2, filter: 'lastMonth' },
    //     completed: { taskStatus: 3, filter: 'lastMonth' },
    //     inProgress: { taskStatus: 4, filter: 'lastMonth' },
    // });

    const [filters, setFilters] = useState({
        inProgress: { taskStatus: 1, filter: 'next7Days' },
        scheduled: { taskStatus: 2, filter: 'next7Days' },
        pending: { taskStatus: 3, filter: 'next7Days' },
        completed: { taskStatus: 4, filter: 'last7Days' },
        archived: { taskStatus: 5, filter: 'last7Days' },
    });

    const [scheduledFilterText, setScheduledFilterText] = useState("Next 7 Days");
    const [pendingFilterText, setPendingFilterText] = useState("Next 7 Days");
    const [completedFilterText, setCompletedFilterText] = useState("Last 7 Days");

    const [searchLoading, setSearchLoading] = useState(false);
    const [isScheduleTableLoader, setIsScheduleTableLoader] = useState(false);
    const [isCompletedTableLoader, setIsCompletedTableLoader] = useState(false);

    const fetchJobsData = async (searchQuery) => {
        const payload = {
            // search: search ? search : undefined,  // Add search if it has a value
            search: searchQuery || undefined,
            filter: Object.values(filters).map(filter => ({
                taskStatus: filter.taskStatus,
                filter: filter.filter
            }))
        };

        try {
            if (!isScheduleTableLoader && !isCompletedTableLoader) {
                setIsJobsDataLoading(true);
            }
            setSearchLoading(searchQuery ? true : false);
            const data = await getJobsData(payload);  // Pass the payload to API
            setIsJobsDataLoading(false);
            setJobsDetails(data?.data);
            setSearchLoading(false);
            setIsScheduleTableLoader(false);
            setIsCompletedTableLoader(false);
        } catch (error) {
            console.error('Error:', error);
            setIsJobsDataLoading(false);
            setIsScheduleTableLoader(false);
            setIsCompletedTableLoader(false);
        }
    };

    const debouncedFetchJobsData = useCallback(debounce(fetchJobsData, 1500), [filters]);

    const [jobsInProgressSearch, setJobsInProgresssearch] = useState("");
    const [jobsSheduledSearch, setJobsSheduledsearch] = useState("");
    const [jobsPendingSearch, setJobsPendingsearch] = useState("");
    const [jobsCompletedSearch, setJobsCompletedsearch] = useState("");

    const filterdInProgressJobs = jobsDetails?.inProgressJobs.filter(job =>
        job.taskname.toLowerCase().includes(jobsInProgressSearch.toLowerCase())
    );

    const filterdSheduledJobs = jobsDetails?.scheduledJob.filter(job =>
        job.taskname.toLowerCase().includes(jobsSheduledSearch.toLowerCase())
    );

    const filterdPendingJobs = jobsDetails?.pendingJobs.filter(job =>
        job.taskname.toLowerCase().includes(jobsPendingSearch.toLowerCase())
    );

    const filterdCompletedJobs = jobsDetails?.completedJobs.filter(job =>
        job.taskname.toLowerCase().includes(jobsCompletedSearch.toLowerCase())
    );

    // const debouncedFetchJobsData = useCallback(
    //     debounce(async () => {
    //         setSearchLoading(true);
    //       await fetchJobsData();
    //       setSearchLoading(false);
    //     }, 1500),
    //     [filters]
    //   );

    useEffect(() => {
        if (search === '') {
            fetchJobsData('');
        } else {
            debouncedFetchJobsData(search);
        }
        return () => debouncedFetchJobsData.cancel();
    }, [search, filters, debouncedFetchJobsData]);

    // useEffect(() => {
    //     if (search.trim()) {
    //       debouncedFetchJobsData(search);
    //     }
    //     return () => debouncedFetchJobsData.cancel();
    //   }, [search,filters, debouncedFetchJobsData]);

    // const fetchJobsData = async () => {
    //     try {
    //         const data = await getJobsData();
    //         setJobsDetails(data?.data)
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };



    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    // const handleFilterChange = (taskStatus, filterValue) => {
    //     console.log("handleFilterChange")
    //     debugger
    //     setFilters((prev) => ({
    //         ...prev,
    //         [taskStatus]: { taskStatus, filter: filterValue }
    //     }));
    // };

    const handleFilterChange = (filterKey, filterValue) => {

        if (filterKey == "scheduled") {
            setIsScheduleTableLoader(true);
        }
        if (filterKey == "completed") {
            setIsCompletedTableLoader(true);
        }


        // const taskStatusMap = {
        //     'scheduled': 1,
        //     'pending': 2,
        //     'completed': 3,
        //     'inProgress': 4
        // };   

        const taskStatusMap = {
            'inProgress': 1,
            'scheduled': 2,
            'pending': 3,
            'completed': 4,
            'archived': 5
        };

        const filterTextMap = {
            last7Days: "Last 7 Days",
            next7Days: "Next 7 Days",
            thisMonth: "This Month",
            lastMonth: "Last Month",
            nextMonth: "Next Month",
        };

        setFilters((prev) => ({
            ...prev,
            [filterKey]: {
                taskStatus: taskStatusMap[filterKey],
                filter: filterValue
            }
        }));

        switch (filterKey) {
            case "scheduled":
                setScheduledFilterText(filterTextMap[filterValue]);
                setScheduledFilterAnchorEl(null);
                break;
            case "pending":
                setPendingFilterText(filterTextMap[filterValue]);
                setPendingFilterAnchorEl(null);
                break;
            case "completed":
                setCompletedFilterText(filterTextMap[filterValue]);
                setCompletedFilterAnchorEl(null);
                break;
            default:
                break;
        }
    };

    // Sample data
    const jobsInProgress = [
        { taskName: 'Startup India Seed Fund' },
        { taskName: 'Startup Gujarat' },
        { taskName: 'SSIP/Nidhi TBI' }
    ];

    const jobsScheduled = [
        { taskName: 'Startup India Seed Fund', scheduledDate: '2025/02/18' },
        { taskName: 'Startup Gujarat', scheduledDate: '2025/02/18' },
        { taskName: 'SSIP/Nidhi TBI', scheduledDate: '2025/02/18' }
    ];

    const jobsPending = [
        { taskName: 'Startup India Seed Fund', subStatus: 'In Progress' },
        { taskName: 'Startup Gujarat', subStatus: 'In Progress' },
        { taskName: 'SSIP/Nidhi TBI', subStatus: 'In Progress' }
    ];

    const jobsCompleted = [
        { taskName: 'Startup India Seed Fund', completionDate: '2025/02/18' },
        { taskName: 'Startup Gujarat', completionDate: '2025/02/18' },
        { taskName: 'SSIP/Nidhi TBI', completionDate: '2025/02/18' }
    ];

    // Handle filter menu opens
    const handleScheduledFilterClick = (event) => {
        setScheduledFilterAnchorEl(event.currentTarget);
    };

    const handlePendingFilterClick = (event) => {
        setPendingFilterAnchorEl(event.currentTarget);
    };

    const handleCompletedFilterClick = (event) => {
        setCompletedFilterAnchorEl(event.currentTarget);
    };

    const handleMainFilterClick = (event) => {
        setMainFilterAnchorEl(event.currentTarget);
    };

    // Handle filter menu closes
    const handleScheduledFilterClose = () => {
        setScheduledFilterAnchorEl(null);
    };

    const handlePendingFilterClose = () => {
        setPendingFilterAnchorEl(null);
    };

    const handleCompletedFilterClose = () => {
        setCompletedFilterAnchorEl(null);
    };

    const handleMainFilterClose = () => {
        setMainFilterAnchorEl(null);
    };

    return (
        <Box sx={{ padding: 0 }}>
            {/* Header */}
            {/* <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Jobs
      </Typography> */}

            {/* <Divider sx={{ my: 2 }} /> */}

            {/* Company Info */}


            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    // backgroundImage: "url('/images/dashboard/dashboardCard.png')", // Using the background image
                    backgroundImage: "url('/images/jobs/jobsCard_new.png')", // Using the background image
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
                            Thanks for partnering with{" "}
                            <Box component="span" sx={{ color: "#E95E1B", fontWeight: 700 }}>
                                Powerband Electrical.
                            </Box>
                        </Box>
                        &nbsp;
                        <br />
                        Below is a summary of all of your work orders and their respective statuses.

                    </Typography>
                </Box>

            </Box>

            {/* <Paper sx={{ p: 3, mb: 3, backgroundColor: '#FFFFFF', border: "1px solid #EEEEEE", borderRadius: "8px" }} elevation={0}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                    {props?.res}
                </Typography>
                <Typography variant="body1">
                    Thanks for partnering with Powerband Electrical, below is a summary of all of your work orders and their respective statuses.
                </Typography>
            </Paper> */}

            {/* Search and Main Filter */}
            <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
                <TextField
                    fullWidth

                    value={search}
                    onChange={handleSearchChange}

                    placeholder="Search"
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                {/* <SearchIcon /> */}
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
                        endAdornment: (
                            <InputAdornment position="end">
                                {searchLoading ? <CircularProgress size={20} /> : null}
                            </InputAdornment>
                        ),
                        style: {
                            color: '#fff', // ✅ typed text white
                        },
                    }}
                    sx={{
                        // width: '25rem',
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

            </Box>

            {/* Jobs layout - using grid with two columns */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {/* Jobs In Progress */}
                {/* <Paper sx={{ flexBasis: '48%', flexGrow: 1, mb: 3 }}>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                            Jobs In Progress
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell>Task Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {jobsInProgress.map((job, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{job.taskName}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper> */}

                <Paper
                    sx={{
                        flexBasis: '48%',
                        flexGrow: 1,
                        mb: 3,
                        // border: "1px solid #EEEEEE", 
                        overflow: 'hidden',
                        borderRadius: "16px",
                        background: 'linear-gradient(144deg, rgb(23, 23, 23) 0%, rgb(17, 17, 17) 99%)',
                        borderBottom: '1px solid #232323'
                    }} elevation={0}>
                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: "84px",
                            borderBottom: "1px solid #232323"
                        }}>
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            // component="h3"
                            sx={{
                                color: "#FFFFFF",
                                letterSpacing: "-0.2px"
                            }}>
                            All Jobs
                        </Typography>
                    </Box>
                    <TableContainer sx={{
                        // maxHeight: 300,
                        maxHeight: "368px",
                        overflowY: 'auto'
                    }}>
                        {isJobsDataLoading ? (

                            <Table sx={{ minWidth: '100%' }} aria-label="jobs table">
                                <TableBody>
                                    <TableRow
                                    // key={index}
                                    >
                                        <TableCell style={{ borderBottom: 'none' }} >
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        ) : (
                            <Table>
                                <TableHead sx={{
                                    // backgroundColor: '#FAFAFA',
                                    backgroundColor: '#0A0A0A',
                                    position: 'sticky', top: 0, zIndex: 3
                                }}>
                                    <TableRow>
                                        <div style={{ borderBottom: "1px solid #232323" }}>
                                            <TableCell style={{ border: 'none' }}>
                                                <Typography sx={{ fontSize: "12px", color: "#FFFFFF", fontWeight: '600' }}>
                                                    Task Name
                                                </Typography>
                                            </TableCell>
                                        </div>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {jobsDetails?.allJobs?.length > 0 ? (
                                        jobsDetails?.allJobs?.map((job, index) => (
                                            <TableRow key={index}>
                                                <TableCell
                                                    style={{
                                                        color: "#FFFFFF",
                                                        fontWeight: "600",
                                                        border: "1px solid #232323"
                                                    }}>{job?.taskname}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} style={{ textAlign: "center", padding: "25px", height: "300px", border: "1px solid #232323" }}>
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#fff" }}>
                                                    <img
                                                        src="/images/notfound/No_data_found_new.png"
                                                        alt="No data found"
                                                        width={120}
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
                        )}
                    </TableContainer>
                </Paper>
                
                <Paper
                    sx={{
                        flexBasis: '48%',
                        flexGrow: 1,
                        mb: 3,
                        // border: "1px solid #EEEEEE", 
                        overflow: 'hidden',
                        borderRadius: "16px",
                        background: 'linear-gradient(144deg, rgb(23, 23, 23) 0%, rgb(17, 17, 17) 99%)',
                        borderBottom: '1px solid #232323'
                    }} elevation={0}>
                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: "84px",
                            borderBottom: "1px solid #232323"
                        }}>
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            // component="h3"
                            sx={{
                                color: "#FFFFFF",
                                letterSpacing: "-0.2px"
                            }}>
                            Jobs In Progress
                        </Typography>
                    </Box>
                    {/* <Box
                        sx={{
                            display: 'flex',
                            mb: 3,
                            gap: 2,
                            p: 2,
                            margin: 0,
                            width: '100%',
                            position: 'sticky',
                            top: 0,
                            zIndex: 2,
                            backgroundColor: 'white'
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Search"
                            variant="outlined"
                            value={jobsInProgressSearch}
                            onChange={(e) => setJobsInProgresssearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <img src="/images/jobs/searchIcon.svg" alt="Search" width={18} height={18} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                bgcolor: 'white',
                                '& fieldset': { border: '1px solid #E0E0E0', borderRadius: "8px" }
                            }}
                        />
                    </Box> */}
                    <TableContainer sx={{
                        // maxHeight: 300,
                        maxHeight: "368px",
                        overflowY: 'auto'
                    }}>
                        {isJobsDataLoading ? (

                            <Table sx={{ minWidth: '100%' }} aria-label="jobs table">
                                <TableBody>
                                    <TableRow
                                    // key={index}
                                    >
                                        <TableCell style={{ borderBottom: 'none' }} >
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        ) : (
                            <Table>
                                <TableHead sx={{
                                    // backgroundColor: '#FAFAFA',
                                    backgroundColor: '#0A0A0A',
                                    position: 'sticky', top: 0, zIndex: 3
                                }}>
                                    <TableRow>
                                        <div style={{ borderBottom: "1px solid #232323" }}>
                                            <TableCell style={{ border: 'none' }}>
                                                <Typography sx={{ fontSize: "12px", color: "#FFFFFF", fontWeight: '600' }}>
                                                    Task Name
                                                </Typography>
                                            </TableCell>
                                        </div>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {filterdInProgressJobs?.length > 0 ? (
                                        filterdInProgressJobs?.map((job, index) => (
                                            <TableRow key={index}>
                                                <TableCell
                                                    style={{
                                                        color: "#FFFFFF",
                                                        fontWeight: "600",
                                                        border: "1px solid #232323"
                                                    }}>{job?.taskname}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} style={{ textAlign: "center", padding: "25px", height: "300px", border: "1px solid #232323" }}>
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#fff" }}>
                                                    <img
                                                        src="/images/notfound/No_data_found_new.png"
                                                        alt="No data found"
                                                        width={120}
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
                        )}
                    </TableContainer>

                </Paper>



                {/* Jobs Scheduled */}
                <Paper
                    sx={{
                        flexBasis: '48%',
                        flexGrow: 1,
                        mb: 3,
                        // border: "1px solid #EEEEEE", 
                        overflow: 'hidden',
                        borderRadius: "16px",
                        background: 'linear-gradient(144deg, rgb(23, 23, 23) 0%, rgb(17, 17, 17) 99%)',
                        borderBottom: '1px solid #232323'
                    }} elevation={0}>
                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: "84px",
                            borderBottom: "1px solid #232323"
                        }}>
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            // component="h3" 
                            sx={{
                                color: "#FFFFFF",
                                letterSpacing: "-0.2px"
                            }}>
                            Jobs Scheduled
                        </Typography>
                        <Button
                            disableRipple
                            variant="outlined"
                            // startIcon={<FilterAltIcon />}
                            startIcon={<img src="/images/jobs/jobsFilterNew.svg" alt="Filter" width={20} height={20} />}
                            // onClick={handleScheduledFilterClick}

                            onClick={(event) => setScheduledFilterAnchorEl(event.currentTarget)}

                            sx={{
                                minWidth: '100px',
                                // border: "1px solid #BDBDBD", 
                                color: "#FFFFFF",
                                borderRadius: "8px",
                                textTransform: 'none',
                                fontWeight: '600',
                                backgroundColor: '#e95e1b'
                            }}
                        >
                            {/* Filter */}
                            {scheduledFilterText}
                        </Button>
                        <Menu
                            disableScrollLock
                            anchorEl={scheduledFilterAnchorEl}
                            open={Boolean(scheduledFilterAnchorEl)}
                            // onClose={handleScheduledFilterClose}
                            onClose={() => setScheduledFilterAnchorEl(null)}
                        >
                            {/* <MenuItem onClick={handleScheduledFilterClose} style={{color: "#757575"}}>Last 7 Days</MenuItem>
                            <MenuItem onClick={handleScheduledFilterClose} style={{color: "#757575"}}>This Month</MenuItem>
                            <MenuItem onClick={handleScheduledFilterClose} style={{color: "#757575"}}>Last Month</MenuItem> */}

                            {/* <MenuItem onClick={() => handleFilterChange('scheduled', 'last7Days')}>Last 7 Days</MenuItem>
                            <MenuItem onClick={() => handleFilterChange('scheduled', 'thisMonth')}>This Month</MenuItem>
                            <MenuItem onClick={() => handleFilterChange('scheduled', 'lastMonth')}>Last Month</MenuItem> */}

                            {/* <MenuItem onClick={() => {
                                handleFilterChange('scheduled', 'last7Days');
                                // setScheduledFilterAnchorEl(null); // Close menu after selection
                            }}>Last 7 Days</MenuItem> */}
                            <MenuItem onClick={() => {
                                handleFilterChange('scheduled', 'next7Days');
                                // setScheduledFilterAnchorEl(null); // Close menu after selection
                            }}>Next 7 Days</MenuItem>
                            <MenuItem onClick={() => {
                                handleFilterChange('scheduled', 'thisMonth');
                                // setScheduledFilterAnchorEl(null);
                            }}>This Month</MenuItem>
                            {/* <MenuItem onClick={() => {
                                handleFilterChange('scheduled', 'lastMonth');
                                // setScheduledFilterAnchorEl(null);
                            }}>Last Month</MenuItem> */}
                            <MenuItem onClick={() => {
                                handleFilterChange('scheduled', 'nextMonth');
                                // setScheduledFilterAnchorEl(null);
                            }}>Next Month</MenuItem>

                        </Menu>
                    </Box>
                    {/* <Box
                            sx={{
                                display: 'flex',
                                mb: 3,
                                gap: 2,
                                p: 2,
                                margin: 0,
                                width: '100%',
                                position: 'sticky',
                                top: 0,
                                zIndex: 2,
                                backgroundColor: 'white'
                            }}>
                            <TextField
                                fullWidth
                                placeholder="Search"
                                variant="outlined"
                                value={jobsSheduledSearch}
                                onChange={(e) => setJobsSheduledsearch(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img src="/images/jobs/searchIcon.svg" alt="Search" width={18} height={18} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    bgcolor: 'white',
                                    '& fieldset': { border: '1px solid #E0E0E0', borderRadius: "8px" }
                                }}
                            />

                        </Box> */}
                    <TableContainer sx={{
                        // maxHeight: 300, 
                        maxHeight: "368px",
                        overflowY: 'auto'
                    }}>
                        {isJobsDataLoading || isScheduleTableLoader ? (

                            <Table sx={{ minWidth: '100%' }} aria-label="jobs table">
                                <TableBody>
                                    <TableRow
                                    // key={index}
                                    >
                                        <TableCell colSpan={2} style={{ borderBottom: 'none' }} >
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        ) : (
                            <Table>
                                <TableHead sx={{
                                    backgroundColor: '#0A0A0A',
                                    position: 'sticky', top: 0, zIndex: 1
                                }}>
                                    <TableRow sx={{
                                        // backgroundColor: '#FAFAFA'
                                        backgroundColor: '#0A0A0A',
                                    }}>
                                        <TableCell style={{ borderBottom: "1px solid #232323" }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: '600',
                                                    fontSize: "12px",
                                                    color: "#FFFFFF"
                                                }}>
                                                Task Name
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: "1px solid #232323" }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: '600',
                                                    fontSize: "12px",
                                                    color: "#FFFFFF"
                                                }}>
                                                {/* Scheduled Date */}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                {/* <TableBody>
                                {jobsScheduled.map((job, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{job.taskName}</TableCell>
                                        <TableCell align="right">{job.scheduledDate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody> */}
                                <TableBody>
                                    {filterdSheduledJobs?.length > 0 ? (
                                        filterdSheduledJobs?.map((job, index) => (
                                            <TableRow key={index}>
                                                <TableCell
                                                    style={{
                                                        color: "#FFFFFF",
                                                        fontWeight: "600",
                                                        // border:"1px solid #232323"
                                                    }}
                                                >{job?.taskname}</TableCell>
                                                <TableCell align="right"
                                                    style={{
                                                        color: "#FFFFFF",
                                                        fontWeight: "600",
                                                        // border:"1px solid #232323"
                                                    }}
                                                >
                                                    {/* {job?.completeddate} */}
                                                    </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} style={{ textAlign: "center", padding: "25px", height: "317px", border: "1px solid #232323" }}>
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#fff" }}>
                                                    <img
                                                        src="/images/notfound/No_data_found_new.png"
                                                        alt="No data found"
                                                        width={120}
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
                        )}
                    </TableContainer>
                </Paper>

                {/* Jobs Pending */}
                <Paper
                    sx={{
                        flexBasis: '48%',
                        flexGrow: 1,
                        mb: 3,
                        // border: "1px solid #EEEEEE", 
                        overflow: 'hidden',
                        borderRadius: "16px",
                        background: 'linear-gradient(144deg, rgb(23, 23, 23) 0%, rgb(17, 17, 17) 99%)',
                        borderBottom: '1px solid #232323'
                    }} elevation={0}>
                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: "84px",
                            borderBottom: "1px solid #232323"
                        }}>
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            // component="h3" 
                            sx={{
                                color: "#FFFFFF",
                                letterSpacing: "-0.2px"
                            }}>
                            Jobs Pending
                        </Typography>
                        {/* <Button
                            variant="outlined"
                            startIcon={<FilterAltIcon />}
                            // onClick={handleScheduledFilterClick}
                            onClick={(event) => setPendingFilterAnchorEl(event.currentTarget)}
                            sx={{ minWidth: '100px', border: "1px solid #BDBDBD", color: "#212121", textTransform:'none', fontWeight:'600' }}
                        >
                            {pendingFilterText}
                        </Button> */}
                        <Menu
                            disableScrollLock
                            // anchorEl={scheduledFilterAnchorEl}
                            anchorEl={pendingFilterAnchorEl}
                            // open={Boolean(scheduledFilterAnchorEl)}
                            open={Boolean(pendingFilterAnchorEl)}
                            // onClose={handleScheduledFilterClose}
                            onClose={() => setPendingFilterAnchorEl(null)}
                        >
                            {/* <MenuItem onClick={handleScheduledFilterClose} style={{color: "#757575"}}>Last 7 Days</MenuItem>
                            <MenuItem onClick={handleScheduledFilterClose} style={{color: "#757575"}}>This Month</MenuItem>
                            <MenuItem onClick={handleScheduledFilterClose} style={{color: "#757575"}}>Last Month</MenuItem> */}

                            <MenuItem onClick={() => {
                                handleFilterChange('pending', 'last7Days');
                                setPendingFilterAnchorEl(null);
                            }}>Last 7 Days</MenuItem>
                            <MenuItem onClick={() => {
                                handleFilterChange('pending', 'next7Days');
                                setPendingFilterAnchorEl(null);
                            }}>Next 7 Days</MenuItem>
                            <MenuItem onClick={() => {
                                handleFilterChange('pending', 'thisMonth');
                                setPendingFilterAnchorEl(null);
                            }}>This Month</MenuItem>
                            <MenuItem onClick={() => {
                                handleFilterChange('pending', 'lastMonth');
                                setPendingFilterAnchorEl(null);
                            }}>Last Month</MenuItem>
                            <MenuItem onClick={() => {
                                handleFilterChange('pending', 'nextMonth');
                                setPendingFilterAnchorEl(null);
                            }}>Next Month</MenuItem>
                        </Menu>
                    </Box>
                    {/* <Box
                        sx={{
                            display: 'flex',
                            mb: 3,
                            gap: 2,
                            p: 2,
                            margin: 0,
                            width: '100%',
                            position: 'sticky',
                            top: 0,
                            zIndex: 2,
                            backgroundColor: 'white'
                        }}>
                        <TextField
                            fullWidth
                            placeholder="Search"
                            variant="outlined"
                            value={jobsPendingSearch}
                            onChange={(e) => setJobsPendingsearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <img src="/images/jobs/searchIcon.svg" alt="Search" width={18} height={18} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                bgcolor: 'white',
                                '& fieldset': { border: '1px solid #E0E0E0', borderRadius: "8px" }
                            }}
                        />
                    </Box> */}
                    <TableContainer sx={{
                        // maxHeight: 300, 
                        maxHeight: "368px",
                        overflowY: 'auto'
                    }}>
                        {isJobsDataLoading ? (

                            <Table sx={{ minWidth: '100%' }} aria-label="jobs table">
                                <TableBody>
                                    <TableRow
                                    // key={index}
                                    >
                                        <TableCell colSpan={2} style={{ borderBottom: 'none' }} >
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        ) : (
                            <Table>
                                <TableHead sx={{
                                    backgroundColor: '#0A0A0A',
                                    position: 'sticky', top: 0, zIndex: 1
                                }}>
                                    <TableRow sx={{
                                        // backgroundColor: '#FAFAFA'
                                        backgroundColor: '#0A0A0A',
                                    }}>
                                        <TableCell style={{ borderBottom: "1px solid #232323" }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 'bold',
                                                    fontSize: "12px",
                                                    color: "#FFFFFF"
                                                }}>
                                                Task Name
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: "1px solid #232323" }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 'bold',
                                                    fontSize: "12px",
                                                    color: "#FFFFFF"
                                                }}>
                                                Sub Status
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                {/* <TableBody>
                                {jobsPending.map((job, index) => (
                                    <TableRow key={index} style={{height:"61px"}}>
                                        <TableCell>{job.taskName}</TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                label={job.subStatus}
                                                size="small"
                                                sx={{
                                                    bgcolor: '#FFF3E0',
                                                    color: '#FF9800',
                                                    borderRadius: '16px'
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody> */}
                                <TableBody>
                                    {filterdPendingJobs?.length > 0 ? (
                                        filterdPendingJobs?.map((job, index) => (
                                            <TableRow key={index}>
                                                <TableCell
                                                    style={{
                                                        color: "#FFFFFF",
                                                        fontWeight: "600",
                                                        // border:"1px solid #232323"
                                                    }}
                                                >{job?.taskname}</TableCell>
                                                <TableCell align="right">
                                                    <Chip
                                                        label={JSON.parse(job.substatussubstatus).substatus}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#FFF3E0',
                                                            color: '#FF9800',
                                                            borderRadius: '16px'
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} style={{ textAlign: "center", padding: "25px", height: "300px", border: "1px solid #232323" }}>
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#fff" }}>
                                                    <img
                                                        src="/images/notfound/No_data_found_new.png"
                                                        alt="No data found"
                                                        width={120}
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
                        )}
                    </TableContainer >
                </Paper >


                {/* Jobs Completed */}
                < Paper
                    sx={{
                        flexBasis: '48%',
                        flexGrow: 1,
                        mb: 3,
                        // border: "1px solid #EEEEEE", 
                        overflow: 'hidden',
                        borderRadius: "16px",
                        background: 'linear-gradient(144deg, rgb(23, 23, 23) 0%, rgb(17, 17, 17) 99%)',
                        borderBottom: '1px solid #232323'
                    }} elevation={0} >
                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: "84px",
                            borderBottom: "1px solid #232323"
                        }}>
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            // component="h3" 
                            sx={{
                                // fontWeight: 'bold'
                                color: "#FFFFFF",
                                letterSpacing: "-0.2px"
                            }}>
                            Jobs Completed
                        </Typography>
                        <Button
                            variant="outlined"
                            // disableFocusRipple
                            disableRipple
                            // startIcon={<FilterAltIcon />}
                            startIcon={<img src="/images/jobs/jobsFilterNew.svg" alt="Filter" width={20} height={20} />}
                            onClick={(event) => setCompletedFilterAnchorEl(event.currentTarget)}
                            // onClick={handleScheduledFilterClick}
                            sx={{
                                minWidth: '100px',
                                // border: "1px solid #BDBDBD", 
                                color: "#FFFFFF",
                                borderRadius: "8px",
                                textTransform: 'none',
                                fontWeight: '600',
                                backgroundColor: '#e95e1b'
                            }}
                        >
                            {completedFilterText}
                        </Button>
                        <Menu
                            disableScrollLock
                            // anchorEl={scheduledFilterAnchorEl}
                            // open={Boolean(scheduledFilterAnchorEl)}
                            // onClose={handleScheduledFilterClose}
                            anchorEl={completedFilterAnchorEl}
                            open={Boolean(completedFilterAnchorEl)}
                            onClose={() => setCompletedFilterAnchorEl(null)}
                        >
                            {/* <MenuItem onClick={handleScheduledFilterClose} style={{color: "#757575"}}>Last 7 Days</MenuItem>
                            <MenuItem onClick={handleScheduledFilterClose} style={{color: "#757575"}}>This Month</MenuItem>
                            <MenuItem onClick={handleScheduledFilterClose} style={{color: "#757575"}}>Last Month</MenuItem> */}

                            {/* <MenuItem onClick={() => {
                                handleFilterChange('completed', 'last7Days');
                                setCompletedFilterAnchorEl(null);
                            }}>Last 7 Days</MenuItem> */}
                            <MenuItem onClick={() => {
                                handleFilterChange('completed', 'last7Days');
                                handleFilterChange('archived', 'last7Days');
                                setCompletedFilterAnchorEl(null); // Close menu after selection
                            }}>Last 7 Days</MenuItem>
                            <MenuItem onClick={() => {
                                handleFilterChange('completed', 'thisMonth');
                                handleFilterChange('archived', 'thisMonth');
                                setCompletedFilterAnchorEl(null);
                            }}>This Month</MenuItem>
                            <MenuItem onClick={() => {
                                handleFilterChange('completed', 'lastMonth');
                                handleFilterChange('archived', 'lastMonth');
                                setCompletedFilterAnchorEl(null);
                            }}>Last Month</MenuItem>
                            {/* <MenuItem onClick={() => {
                                handleFilterChange('completed', 'nextMonth');
                                setCompletedFilterAnchorEl(null);
                            }}>Next Month</MenuItem> */}
                        </Menu>
                    </Box>
                    {/* <Box
                        sx={{
                            display: 'flex',
                            mb: 3,
                            gap: 2,
                            p: 2,
                            margin: 0,
                            width: '100%',
                            position: 'sticky',
                            top: 0,
                            zIndex: 2,
                            backgroundColor: 'white'
                        }}>
                        <TextField
                            fullWidth
                            placeholder="Search"
                            variant="outlined"
                            value={jobsCompletedSearch}
                            onChange={(e) => setJobsCompletedsearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <img src="/images/jobs/searchIcon.svg" alt="Search" width={18} height={18} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                bgcolor: 'white',
                                '& fieldset': { border: '1px solid #E0E0E0', borderRadius: "8px" }
                            }}
                        />

                    </Box> */}
                    <TableContainer
                        sx={{
                            // maxHeight: 300, 
                            maxHeight: "368px",
                            overflowY: 'auto'
                        }}>
                        {isJobsDataLoading || isCompletedTableLoader ? (

                            <Table sx={{ minWidth: '100%' }} aria-label="jobs table">
                                <TableBody>
                                    <TableRow
                                    // key={index}
                                    >
                                        <TableCell colSpan={2} style={{ borderBottom: 'none' }} >
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                            <br />
                                            <Skeleton variant="rounded" width="100%" height={51} />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        ) : (
                            <Table>
                                <TableHead sx={{
                                    backgroundColor: '#0A0A0A',
                                    position: 'sticky', top: 0, zIndex: 1
                                }}>
                                    <TableRow sx={{
                                        // backgroundColor: '#FAFAFA',
                                        backgroundColor: '#0A0A0A',
                                    }}>
                                        <TableCell style={{ borderBottom: "1px solid #232323" }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: '600',
                                                    color: "#FFFFFF",
                                                    fontSize: "12px"
                                                }}>
                                                Task Name
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: "1px solid #232323" }}>
                                            <Typography sx={{
                                                fontWeight: 'bold',
                                                fontSize: "12px",
                                                color: "#FFFFFF",
                                            }}>
                                                Completed Date
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filterdCompletedJobs?.length > 0 ? (
                                        filterdCompletedJobs?.map((job, index) => (
                                            <TableRow key={index}>
                                                <TableCell
                                                    style={{
                                                        color: "#FFFFFF",
                                                        fontWeight: "600",
                                                        // border:"1px solid #232323"
                                                    }}>{job.taskname}</TableCell>
                                                <TableCell align="right"
                                                    style={{
                                                        color: "#FFFFFF",
                                                        fontWeight: "600",
                                                        // border:"1px solid #232323"
                                                    }}
                                                >{job.completeddate}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} style={{ textAlign: "center", padding: "25px", height: "300px", border: "1px solid #232323" }}>
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#fff" }}>
                                                    <img
                                                        src="/images/notfound/No_data_found_new.png"
                                                        alt="No data found"
                                                        width={120}
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
                        )}
                    </TableContainer>
                </Paper>
            </Box>
        </Box>
    );
};

export default JobsTableSection_Dark;