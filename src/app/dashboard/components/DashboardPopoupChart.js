'use client'
import React from 'react';
import {
  Grid,
  IconButton,
  Button,
  Dialog, DialogActions, DialogContent, DialogTitle, 
} from "@mui/material";

import moment from 'moment';


export default function DashboardPopoupChart(props) {
  return (
        <Dialog
            open={openModal}
            onClose={handleCloseModal}
            maxWidth="md"
            fullWidth={true}
            sx={{
                margin: 'auto',
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
                    position: 'relative'
                }}
            >
              {/* Todo place the selection */}
                {"Passed/Fail"} Data 
                <IconButton
                    onClick={handleCloseModal}
                    sx={{ position: 'absolute', right: 8, top: 8, color: '#FFFFFF' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ fontSize: '14px' }}>
              {isDocumentDataLoading ? (
                  <strong>Loading</strong>
                ) : (
                  <>
                    {documentSelect && documentSelect.length > 0 ? (
                      documentSelect.map((row, index) => (
                        <Grid container spacing={8} sx={{mb: 1 }} key={index}>
                          <Grid item xs={8}>
                            <strong>{row?.name}</strong>
                          </Grid>
                          <Grid item xs={4}>
                          </Grid>
                        </Grid>
                      ))
                    ) : (
                      <strong>No Documents</strong>
                    )}
                  </>
                )}
            </DialogContent>
           {!isDocumentDataLoading??
            <DialogActions sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button
                    disableRipple
                    variant="contained"
                    sx={{ marginRight: 1, color: '#fff' }}
                    style={{ textTransform: 'capitalize', borderRadius: '8px', backgroundColor: '#e95e1b', color: '#fff' }}
                    // onClick={handleSubmit}
                >
                    See
                </Button>
            </DialogActions>
          }
        </Dialog>
  );
}