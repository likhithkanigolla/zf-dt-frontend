import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';
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
import {
  NotificationsActive as NotificationsIcon,
  Alarm as AlarmIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import IITHLOGO from './images/iiith.png';
import SCRCLOGO from './images/scrc_logo.png';
import ZFLOGO from './images/zf_logo.png';

import config from '../../config';

const useStyles = styled((theme) => ({
  notificationCard: {
    marginBottom: theme.spacing(1),
    position: 'relative',
  },
  notificationCardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  markAsReadButton: {
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
  },
  markAsResolvedButton: {
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
  },
  popover: {
    padding: theme.spacing(2),
  },
}));

const NavigationBar = ({ title }) => {
  const classes = useStyles();
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [alarmAnchorEl, setAlarmAnchorEl] = useState(null);
  const [closedNotifications, setClosedNotifications] = useState([]);
  const [ncount, setNcount] = useState(0); // State for unread notification count
  const [acount, setAcount] = useState(0); // State for alarm count
  const [issue, setIssue] = useState([]); // State for notifications
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAlarmId, setSelectedAlarmId] = useState(null);
  const [remarks, setRemarks] = useState('');

  const handleNotificationOpen = async (event = null) => {
    if (event !== null) {
      setNotificationAnchorEl(event.currentTarget);
    }
    try {
      const response = await fetch(`${config.backendAPI}/notifications`);
      const data = await response.json();
      const notificationsWithTimestamp = data.map((item) => ({
        id: item[0],
        timestamp: new Date(item[1]).toLocaleString(),
        node_id: item[2],
        notification_type: item[3],
        title: item[4],
        read: item[5],
      }));
      setIssue(notificationsWithTimestamp);
      
      // Update ncount with the count of unread notifications
      const unreadCount = notificationsWithTimestamp.filter(item => !item.read).length;
      setNcount(unreadCount);
      
      console.log(`Number of notifications: ${notificationsWithTimestamp.length}`);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleAlarmOpen = async (event=null) => {
    if (event !== null) {
      setAlarmAnchorEl(event.currentTarget);
    }
    try {
      const response = await fetch(`${config.backendAPI}/alarms`);
      const data = await response.json();
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
      console.error(error.message);
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
        setClosedNotifications((prevNotifications) => [
          ...prevNotifications,
          closedNotification,
        ]);
        localStorage.setItem(
          `notification_${id}`,
          JSON.stringify(closedNotification)
        );
        setIssue((prevIssue) => prevIssue.filter((item) => item.id !== id));
        // Update ncount after marking notification as read
        const unreadCount = issue.filter(item => !item.read).length - 1;
        setNcount(unreadCount);
        if (issue.length === 1) {
          handleNotificationClose();
        }
        console.log('Notification marked as read successfully');
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
        console.log('Alarm resolved successfully');
        // Optionally update UI after resolving alarm
        setAcount(acount - 1); // Reduce alarm count after resolving
        handleCloseDialog();
      } else {
        console.error('Failed to resolve alarm');
      }
    } catch (error) {
      console.error('Error resolving alarm:', error.message);
    }
  };

  useEffect(() => {
    // Fetch notifications when component mounts
    handleNotificationOpen();
    handleAlarmOpen();
  }, []);

  return (
    <nav className="navbar">
      <Link to="/">
        <div className="navbar__logo">
          <img src={IITHLOGO} alt="IIITH Logo" />
        </div>
      </Link>
      <Link to="/">
        <div className="navbar__logo">
          <img src={SCRCLOGO} alt="Smart City Living Lab Logo" />
        </div>
      </Link>
      <div className="navbar__title">{title}</div>

      <div>
        {/* Dropdown to select the pages */}
        <select className="navbar__dropdown" onChange={(e) => { window.location.href = e.target.value }}>
          <option value="/dt_waternetwork/" selected={window.location.pathname === '/dt_waternetwork'}>Home</option>
          <option value="/dt_waternetwork/analytics" selected={window.location.pathname === '/dt_waternetwork/analytics'}>Analytics</option>
          <option value="/dt_waternetwork/actuation" selected={window.location.pathname === '/dt_waternetwork/actuation'}>Actuation</option>
          <option value="/dt_waternetwork/simulation" selected={window.location.pathname === '/dt_waternetwork/simulation'}>Simulation</option>
        </select>
      </div>

      <div>
        <IconButton color="inherit" onClick={handleNotificationOpen}>
          <Badge badgeContent={ncount !== null ? ncount : 0} color="secondary">
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
          <div className={classes.popover}>
            {/* Notification cards */}
            {issue.map((item, index) => (
              <Card key={index} className={classes.notificationCard}>
                <CardContent className={classes.notificationCardContent}>
                  <div>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body1">Timestamp: {item.timestamp}</Typography>
                  </div>
                  <Button className={classes.markAsReadButton} onClick={() => markNotificationAsRead(item.id)}>Mark as Read</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Popover>
      </div>

      <div>
        <IconButton color="inherit" onClick={handleAlarmOpen}>
          <Badge badgeContent={acount !== null ? acount : 0} color="secondary">
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
          <div className={classes.popover}>
            {issue.map((item, index) => (
              <Card key={index} className={classes.notificationCard}>
                <CardContent className={classes.notificationCardContent}>
                  <div>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body1">id: {item.id}</Typography>
                    <Typography variant="body1">Timestamp: {item.timestamp}</Typography>
                  </div>
                  <Button className={classes.markAsResolvedButton} onClick={() => handleMarkAsResolved(item.id)}>Mark as Resolved</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Popover>
      </div>

      {/* Dialog for resolving alarms */}
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

      <Link to="/">
        <div className="navbar__logo">
          <img src={ZFLOGO} alt="ZF Logo" />
        </div>
      </Link>
    </nav>
  );
};

export default NavigationBar;
