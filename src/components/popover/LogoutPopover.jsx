import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { setCookie } from '@/helper/functions';


export default function LogoutPopover({ children }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const router = useRouter();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <div aria-describedby={id} variant="contained" onClick={handleClick}>
                {children}
            </div>
            <Popover
                disableScrollLock
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <Typography sx={{ p: 2, width: 220, color: 'red', display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                    onClick={async () => {
                        await fetch('/api/logout', {
                            method: 'POST',
                            credentials: 'include' // Ensures cookies are included in the request
                        });
                        setCookie('payload', '', 0);
                        router.push('/login');
                    }}
                >
                    <Stack sx={{ color: "#000" }}>
                        Logout
                    </Stack>
                    <LogoutIcon sx={{ height: 20 }} />
                </Typography>
            </Popover>
        </div>
    );
}
