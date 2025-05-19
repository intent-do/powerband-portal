"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "lodash";
import {
  Box,
  Typography,
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
  Stack,
  Tooltip,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import {
  Search as SearchIcon,
  MoreHoriz as MoreHorizIcon,
  UnfoldMore as UnfoldMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  downloadDocument,
  getReportAndInvoiceData,
  getReportAndInvoiceDataClient,
} from "../../services/documentService";
import axios from "axios";

const DocumentsTable = (props) => {
  // State for tabs
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [currentRowMenu, setCurrentRowMenu] = useState(null);
  const [reportAndInvoiceDetails, setReportAndInvoiceDetails] = useState(null);
  const [reportAndInvoiceOriginalDetails, setReportAndInvoiceOriginalDetails] =
    useState(null);
  const [
    isReportAndInvoiceDetailsLoading,
    setIsReportAndInvoiceDetailsLoading,
  ] = useState(false);
  const [isPaginationDocumentDataLoading, setIsPaginationDocumentDataLoading] =
    useState(false);
  const [reportPaginationData, setReportPaginationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState();
  const [inputValue, setInputValue] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [isModifiedDownloadLoader, setIsModifiedDownloadLoader] =
    useState(null);

  const searchQueryRef = useRef("");

  useEffect(() => {
    fetchReportAndInvoiceData();
  }, []);

  // useEffect(() => {
  //   if(searchQuery){
  //     searchQueryRef.current = searchQuery;
  //     debouncedSearch();
  //   }
  // }, [searchQuery]);

  const fetchReportAndInvoiceData = async () => {
    try {
      // const params = {
      //   page: page,
      //   pageSize: rowsPerPage,
      // };

      setIsReportAndInvoiceDetailsLoading(true);
      const data = await getReportAndInvoiceDataClient(props);
      // setReportAndInvoiceDetails(props?.res?.res);
      setReportAndInvoiceDetails(data?.data);
      setIsReportAndInvoiceDetailsLoading(false);
      setReportAndInvoiceOriginalDetails(data);
      // setTotalItems(props?.res?.res?.totalRecords);
    } catch (error) {
      console.error("Error:", error);
      setIsReportAndInvoiceDetailsLoading(false);
    }
  };

  const fetchReportPagignationData = async (
    pageNo,
    recordsPerPage,
    searchText = ""
  ) => {
    try {
      setLoading(true);
      setSearchLoading(true);
      setReportAndInvoiceDetails(null);
      const params = {
        // page: page,
        page: pageNo,
        // pageSize: rowsPerPage,
        pageSize: recordsPerPage,
        search: searchText,
      };

      const data = await getReportAndInvoiceData(params);
      // setReportAndInvoiceDetails(data?.data);

      // setReportPaginationData(data?.data || [] );
      // setTotalItems(data?.totalItems || 68);
      setReportAndInvoiceDetails(data?.data || []); // This fully replaces the state data
      setReportPaginationData(data?.data || []);
      setTotalItems(data?.data?.totalRecords);
      setIsPaginationDocumentDataLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
      setIsPaginationDocumentDataLoading(false);
    }
  };

  // const handleDownload = async (url, filename, index) => {
  //   setIsModifiedDownloadLoader(index);
  //   try {
  //     // const response = await fetch(url);
  //     const response = await fetch(url, { mode: "no-cors" });
  //     const blob = await response.blob();
  //     const blobUrl = window.URL.createObjectURL(blob);
  //     setIsModifiedDownloadLoader(null);

  //     const link = document.createElement("a");
  //     link.href = blobUrl;
  //     link.download = filename
  //     document.body.appendChild(link);
  //     link.click();

  //     // Cleanup
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(blobUrl);
  //   } catch (error) {
  //     console.error("File download failed:", error);
  //     setIsModifiedDownloadLoader(null);
  //   }
  // };

  const handleDownload = async (fileUrl, filename, index) => {
    setIsModifiedDownloadLoader(index);
    try {
      const response = await downloadDocument(fileUrl);

      if (response.status !== 200) {
        throw new Error("Failed to download file");
      }

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Create an object URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Trigger file download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || "downloaded_file.pdf"; // Ensure a proper filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup memory
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("File download failed:", error);
      setIsModifiedDownloadLoader(null);
    } finally {
      setIsModifiedDownloadLoader(null);
    }
  };

  // const handleSearchChange = (event) => {

  //   searchQueryRef.current = event.target.value;
  //   debouncedSearch();
  //   setSearchQuery(event.target.value);
  // }

  // const handleSearchChange = (event) => {
  //   console.log(event, "event");
  //   // searchQueryRef.current = event.target.value;
  //   // debouncedSearch();

  //   const AllFilterArray =
  //     reportAndInvoiceDetails?.records && reportAndInvoiceDetails?.records.filter((item) => item?.taskname == event);
  //   // setFilterData(AllFilterArray);

  //   setSearchQuery(AllFilterArray);
  // }

  const handleSearchChange = (event) => {
    const query = event;
    setInputValue(query);

    if (!query) {
      // Reset to full records when input is cleared
      setReportAndInvoiceDetails(reportAndInvoiceOriginalDetails);
      return;
    }

    // Filter records based on input text
    const filteredData = reportAndInvoiceOriginalDetails?.filter((item) =>
      item?.taskname?.toLowerCase().includes(query.toLowerCase())
    );

    setReportAndInvoiceDetails(filteredData); // Store the filtered data
  };

  // const debouncedSearch = useCallback(
  //   debounce(() => {
  //     // fetchReportPagignationData(1, rowsPerPage, searchQueryRef.current);
  //     fetchReportPagignationData(page, rowsPerPage, searchQueryRef.current);
  //   }, 1500),
  //   // [searchQuery, rowsPerPage]
  //   []
  // );

  const debouncedSearch = useCallback(
    debounce(() => {
      fetchReportPagignationData(page, rowsPerPage, searchQueryRef.current);
    }, 1500),
    [page, rowsPerPage]
  );

  // Sample data
  const jobData = [
    {
      id: 1,
      taskName: "Startup India Seed Fund",
      clientReport: "Financial support for early stage startups.",
      result: "PASS",
      report: "N8QF-B4AGA-original",
    },
    {
      id: 2,
      taskName: "Startup Gujarat",
      clientReport: "Empowering startups in Gujarat.",
      result: "PASS",
      report: "N8QF-B4AGA-original",
    },
    {
      id: 3,
      taskName: "SSIP/Nidhi TBI",
      clientReport: "Support for tech-based innovations.",
      result: "PASS",
      report: "N8QF-B4AGA-original",
    },
    {
      id: 4,
      taskName: "Atal Innovation Mission",
      clientReport: "Boosting innovation nationwide.",
      result: "FAIL",
      report: "N8QF-B4AGA-original",
    },
    {
      id: 5,
      taskName: "Digital India",
      clientReport: "Digital transformation support.",
      result: "FAIL",
      report: "N8QF-B4AGA-original",
    },
    {
      id: 6,
      taskName: "Make in India",
      clientReport: "Incentives for manufacturing startups.",
      result: "FAIL",
      report: "N8QF-B4AGA-original",
    },
    {
      id: 7,
      taskName: "MSME Scheme",
      clientReport: "Support for small and medium enterprises.",
      result: "PASS",
      report: "N8QF-B4AGA-original",
    },
    {
      id: 8,
      taskName: "Stand Up India",
      clientReport: "Finance for underrepresented entrepreneurs.",
      result: "FAIL",
      report: "N8QF-B4AGA-original",
    },
    {
      id: 9,
      taskName: "Startup Gujarat",
      clientReport: "Empowering startups in Gujarat.",
      result: "PASS",
      report: "N8QF-B4AGA-original",
    },
    {
      id: 10,
      taskName: "SSIP/Nidhi TBI",
      clientReport: "Support for tech-based innovations.",
      result: "PASS",
      report: "N8QF-B4AGA-original",
    },
  ];

  // Handlers

  const handlePageChange = (event, value) => {
    setPage(value);
    setIsPaginationDocumentDataLoading(true);
    // fetchReportPagignationData(value, rowsPerPage);
    fetchReportPagignationData(value, rowsPerPage, searchQueryRef.current);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setIsPaginationDocumentDataLoading(true);
    // setPage(1);
    // fetchReportPagignationData(page, event?.target?.value);
    fetchReportPagignationData(
      page,
      event.target.value,
      searchQueryRef.current
    );
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
      case "PASS":
        return {
          bgcolor: "#E8F5E9",
          color: "#2e7d32",
        };
      case "FAIL":
        return {
          bgcolor: "#FFEBEE",
          color: "#c62828",
        };
      case "Pending":
        return {
          bgcolor: "#E1F5FE",
          color: "#03A9F4",
        };
      default:
        return {
          bgcolor: "#f5f5f5",
          color: "#616161",
        };
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 0,
        border: "1px solid #EEEEEE",
        borderRadius: "8px",
      }}
    >
      {/* Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "0px 30px 30px 30px",
            paddingTop: "30px",
          }}
        >
          <TextField
            fullWidth
            placeholder="Search"
            variant="outlined"
            value={inputValue} // Display input text, not filtered data
            onChange={(e) => handleSearchChange(e?.target?.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img
                    src="/images/jobs/searchIcon.svg"
                    alt="Search"
                    width={18}
                    height={18}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchLoading ? <CircularProgress size={20} /> : null}
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: "white",
              "& fieldset": { border: "1px solid #E0E0E0" },
            }}
          />
        </div>

          <Button
              variant="outlined"
              disableRipple
              // onClick={(event) => fetchReportPagignationData(page, rowsPerPage, searchQueryRef.current)}
              onClick={(event) => fetchReportAndInvoiceData()}
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
              Load Documents
          </Button>
      </Box>

      {isReportAndInvoiceDetailsLoading ? (
        <>
          <Table sx={{ minWidth: 650 }} aria-label="jobs table">
            <TableBody>
              <TableRow
              // key={index}
              >
                <TableCell colSpan={3}>
                  <Skeleton variant="rounded" width="100%" height={50} />
                  <br />
                  <Skeleton variant="rounded" width="100%" height={50} />
                  <br />
                  <Skeleton variant="rounded" width="100%" height={50} />
                  <br />
                  <Skeleton variant="rounded" width="100%" height={50} />
                  <br />

                  <Skeleton variant="rounded" width="100%" height={50} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ maxHeight: 600, overflowY: "auto" }}
        >
          {isPaginationDocumentDataLoading ? (
            <Table sx={{ minWidth: 650 }} aria-label="jobs table">
              <TableBody>
                <TableRow
                // key={index}
                >
                  <TableCell colSpan={3}>
                    <Skeleton variant="rounded" width="100%" height={50} />
                    <br />
                    <Skeleton variant="rounded" width="100%" height={50} />
                    <br />
                    <Skeleton variant="rounded" width="100%" height={50} />
                    <br />
                    <Skeleton variant="rounded" width="100%" height={50} />
                    <br />

                    <Skeleton variant="rounded" width="100%" height={50} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <Table sx={{ minWidth: 650 }} aria-label="jobs table">
              <TableHead
                sx={{
                  backgroundColor: "#FAFAFA",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <TableRow>
                  <TableCell sx={{ width: "35rem" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: "600" }}>
                        Task Name
                      </Typography>
                      <IconButton
                        size="small"
                      // onClick={(e) => handleSortMenuOpen(e, 'taskName')}
                      >
                        {/* <UnfoldMoreIcon fontSize="small" /> */}
                        <img
                          src="/images/documents/filter.svg"
                          alt="Sort"
                          width={16}
                          height={16}
                        />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography sx={{ fontWeight: "600" }}>
                        Overall Result
                      </Typography>
                      <IconButton
                        size="small"
                      // onClick={(e) => handleSortMenuOpen(e, 'result')}
                      >
                        {/* <UnfoldMoreIcon fontSize="small" /> */}
                        <img
                          src="/images/documents/filter.svg"
                          alt="Sort"
                          width={16}
                          height={16}
                        />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography sx={{ fontWeight: "600" }}>Report</Typography>
                      {/* <IconButton size="small" onClick={(e) => handleSortMenuOpen(e, 'result')}>
                      <UnfoldMoreIcon fontSize="small" />
                    </IconButton> */}
                    </Box>
                  </TableCell>
                  {/* <TableCell align="right"></TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {jobData.map((row) => ( */}
                {reportAndInvoiceDetails?.length > 0 ? (
                  reportAndInvoiceDetails?.map((row, index) => (
                    <TableRow key={row?.id} hover>
                      <TableCell style={{ maxWidth: "15rem" }}>
                        {/* {row.taskName} */}
                        <Typography
                          sx={{
                            // fontWeight: 600,
                            fontSize: "14px",
                          }}
                        >
                          {row.taskname}
                        </Typography>
                      </TableCell>
                      {/* <TableCell>{row?.clientReport}</TableCell> */}
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Chip
                            label={
                              row?.overallResultValue === null ||
                                row?.overallResultValue === ""
                                ? "-"
                                : row?.overallResultValue
                            }
                            sx={{
                              ...getChipColor(row?.overallResultValue),
                              borderRadius: "25px",
                              fontWeight: "600",
                              minWidth: "80px",
                              justifyContent: "center",
                              fontSize: "14px",
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={row?.filename} arrow>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                color: "#FFFFFF",
                                backgroundColor: "#212121",
                                padding: "9px 14px",
                                borderRadius: "8px",
                                textAlign: "center",
                                height: "36px",
                                width: "12rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer", // To indicate it's interactive
                              }}
                              onClick={() =>
                                handleDownload(row?.url, row?.filename, index)
                              }
                            >
                              {/* {row?.filename} */}
                              {isModifiedDownloadLoader == index ? (
                                <CircularProgress size={18} color="inherit" />
                              ) : (
                                row?.filename
                              )}
                            </div>
                          </Box>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: "#666",
                          minHeight: 500,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src="/images/notfound/No_data_found.jpg"
                          alt="Search"
                          width={400}
                          height={400}
                        />
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      )}

      {/* Pagination */}
      {reportAndInvoiceDetails?.length > 0 &&
        !isPaginationDocumentDataLoading && (
          <Box
            sx={{
              // mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #e0e0e0",
              padding: "22px 16px",
              // pt: 2
            }}
          >
            {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        <Stack spacing={2}>
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
                  borderTopLeftRadius: item.type == 'previous' ? "8px !important" : "0px !important",
                  borderBottomLeftRadius: item.type == 'previous' ? "8px !important" : "0px !important",
                  borderTopRightRadius: item.type == "next" ? "8px !important" : "0px !important",
                  borderBottomRightRadius: item.type == "next" ? "8px !important" : "0px !important",
                  border: "1px solid #ddd",
                  color: "#333",
                  padding: "9px 17px",
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
        </Stack> */}

            {/* <Pagination
          count={Math.ceil(68 / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          // showFirstButton
          // showLastButton
        /> */}
          </Box>
        )}

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
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
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
    </Box>
  );
};

export default DocumentsTable;
