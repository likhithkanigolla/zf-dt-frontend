import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Typography,
  Popover,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import Analyticsicon from '@mui/icons-material/BarChartSharp';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/NotificationsActive';
import AlarmIcon from '@mui/icons-material/Alarm';
import { styled } from '@mui/material/styles';
import IITHLOGO from './images/iiith.png';
import SCRCLOGO from './images/scrc_logo.png';
import ZFLOGO from './images/zf_logo.png';
import config from '../../config';
import './NavigationBar.css';

// Styled components using MUI's styled API
const NotificationCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  position: 'relative',
}));

const NotificationCardContent = styled(CardContent)({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
});

const MarkAsReadButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF8000',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#FFA500',
  },
  fontSize: '0.7rem',
  padding: theme.spacing(0.2, 1),
  minWidth: 'unset',
  height: 'unset',
  borderRadius: '10px',
  alignSelf: 'flex-end',
  marginBottom: theme.spacing(1),
}));

const MarkAsResolvedButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4CAF50',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#388E3C',
  },
  fontSize: '0.7rem',
  padding: theme.spacing(0.2, 1),
  minWidth: 'unset',
  height: 'unset',
  borderRadius: '10px',
  alignSelf: 'flex-end',
  marginBottom: theme.spacing(1),
}));

const PopoverContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

const NavigationBar = ({ title }) => {
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [alarmAnchorEl, setAlarmAnchorEl] = useState(null);
  const [ncount, setNcount] = useState(0);
  const [acount, setAcount] = useState(0);
  const [issue, setIssue] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAlarmId, setSelectedAlarmId] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const handleHamburgerClick = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  const handleNotificationOpen = async (event = null) => {
    if (event !== null) {
      setNotificationAnchorEl(event.currentTarget);
    }
    try {
      const response = await fetch(`${config.backendAPI}/notifications`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Unexpected response format: expected an array');
      }
      const notificationsWithTimestamp = data.map((item) => ({
        id: item[0],
        timestamp: new Date(item[1]).toLocaleString(),
        node_id: item[2],
        notification_type: item[3],
        title: item[4],
        read: item[5],
      }));
      setIssue(notificationsWithTimestamp);

      const unreadCount = notificationsWithTimestamp.filter(item => !item.read).length;
      setNcount(unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:',error.message);
    }
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleAlarmOpen = async (event = null) => {
    if (event !== null) {
      setAlarmAnchorEl(event.currentTarget);
    }
    try {
      const response = await fetch(`${config.backendAPI}/alarms`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
       const responseText = await response.text();
      console.log('Raw response:', responseText);   
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Unexpected response format: expected an array');
      }
      const alarmsWithTimestamp = data.map((item) => ({
        id: item[0],
        timestamp: new Date(item[1]).toLocaleString(),
        node_id: item[2],
        alarm_type: item[3],
        title: item[4],
      }));
      setIssue(alarmsWithTimestamp);
      const unreadCount = alarmsWithTimestamp.filter(item => !item.read).length;
      setAcount(unreadCount);
    } catch (error) {
      console.error('Error fetching alarms:',error.message);
    }
  };

  const handleAlarmClose = () => {
    setAlarmAnchorEl(null);
  };

  const markNotificationAsRead = async (id) => {
    try {
      const response = await fetch(`${config.backendAPI}/${id}/notification/read`, {
        method: 'PUT',
      });
      if (response.ok) {
        const closedNotification = issue.find((item) => item.id === id);
        setIssue((prevIssue) => prevIssue.filter((item) => item.id !== id));
        const unreadCount = issue.filter(item => !item.read).length - 1;
        setNcount(unreadCount);
        if (issue.length === 1) {
          handleNotificationClose();
        }
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
    }
  };

  const handleMarkAsResolved = (id) => {
    setSelectedAlarmId(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleResolveAlarm = async () => {
    try {
      const response = await fetch(`${config.backendAPI}/${selectedAlarmId}/alarm/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ remarks }),
      });
      if (response.ok) {
        setAcount(acount - 1);
        handleCloseDialog();
      } else {
        console.error('Failed to resolve alarm');
      }
    } catch (error) {
      console.error('Error resolving alarm:', error.message);
    }
  };

  const [selectedPath, setSelectedPath] = useState(window.location.pathname);
  
  useEffect(() => {
    handleNotificationOpen();
    handleAlarmOpen();
    setSelectedPath(window.location.pathname);
  }, []);

  

  return (
    <nav className="navbar">
      <Link to="/dt_waternetwork/">
        <div className="navbar__logo">
          <img src={IITHLOGO} alt="IIITH Logo" />
        </div>
      </Link>
      <Link to="/dt_waternetwork/">
        <div className="navbar__logo">
          <img src={SCRCLOGO} alt="Smart City Living Lab Logo" />
        </div>
      </Link>
      <div className="navbar__title">{title}</div>

      <div>
        {/* <select className="navbar__dropdown" onChange={(e) => { window.location.href = e.target.value }}>
          <option value="/dt_waternetwork/" selected={window.location.pathname === '/dt_waternetwork'}>Live</option>
          <option value="/dt_waternetwork/simulation" selected={window.location.pathname === '/dt_waternetwork/simulation'}>Simulation</option>
        </select> */}
        <select className="navbar__dropdown" value={selectedPath} onChange={(e) => {window.location.href = e.target.value;}}>
            <option value="/dt_waternetwork/">Live</option>
            <option value="/dt_waternetwork/simulation">Simulation</option>
        </select>
      </div>

      <div>
        <IconButton color="inherit" onClick={handleNotificationOpen}>
          <Badge badgeContent={ncount} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Popover
          open={Boolean(notificationAnchorEl)}
          anchorEl={notificationAnchorEl}
          onClose={handleNotificationClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <PopoverContent>
            {issue.map((item, index) => (
              <NotificationCard key={index}>
                <NotificationCardContent>
                  <div>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body1">Timestamp: {item.timestamp}</Typography>
                  </div>
                  <MarkAsReadButton onClick={() => markNotificationAsRead(item.id)}>Mark as Read</MarkAsReadButton>
                </NotificationCardContent>
              </NotificationCard>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <IconButton color="inherit" onClick={handleAlarmOpen}>
          <Badge badgeContent={acount} color="secondary">
            <AlarmIcon />
          </Badge>
        </IconButton>
        <Popover
          open={Boolean(alarmAnchorEl)}
          anchorEl={alarmAnchorEl}
          onClose={handleAlarmClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <PopoverContent>
            {issue.map((item, index) => (
              <NotificationCard key={index}>
                <NotificationCardContent>
                  <div>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body1">Timestamp: {item.timestamp}</Typography>
                  </div>
                  <MarkAsResolvedButton onClick={() => handleMarkAsResolved(item.id)}>Mark as Resolved</MarkAsResolvedButton>
                </NotificationCardContent>
              </NotificationCard>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <IconButton color="inherit" onClick={handleHamburgerClick}>
          {isHamburgerOpen ? <CloseIcon /> : <Analyticsicon />}
        </IconButton>
        {isHamburgerOpen && (
          <div className="full-screen-overlay">
            <div className="iframe-container">
              <div style={{ width: '100vw', height: '92vh', overflow: 'hidden', zIndex: 15 }}>
                <iframe
                  src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=dark&background=transparent"
                  title="Live"
                  style={{ width: '100vw', height: '92vh', border: 'none' }}
                  allowTransparency="true"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Resolve Alarm</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="remarks"
            label="Remarks"
            fullWidth
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={handleResolveAlarm}>
            Resolve
          </Button>
        </DialogActions>
      </Dialog>

      <Link to="/dt_waternetwork/">
        <div className="navbar__logo">
          <img src={ZFLOGO} alt="ZF Logo" />
        </div>
      </Link>
    </nav>
  );
};

export default NavigationBar;
