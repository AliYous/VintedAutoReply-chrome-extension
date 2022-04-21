import React, { useState } from "react";
import { IconButton, Menu, MenuItem, MenuList } from "@mui/material";
import { FiSettings as SettingsIcon } from "react-icons/fi";

const SettingsDropdown = ({ updateAuthStatus, whop }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);
  const handleOpenMenu = () => {
    setOpen(true);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleManageSubscription = () => {
    window.open("https://whop.com/vintmate/home", "_blank");
    handleClose();
  };
  const handleSignOut = async () => {
    whop.logout();
    updateAuthStatus();
  };
  return (
    <div>
      <IconButton component="span" ref={anchorRef} onClick={handleOpenMenu}>
        <SettingsIcon />
      </IconButton>

      <Menu open={open} anchorEl={anchorRef.current} onClose={handleClose}>
        <MenuList
          autoFocusItem={open}
          id="composition-menu"
          aria-labelledby="composition-button"
        >
          <MenuItem onClick={handleManageSubscription}>
            Manage subscription
          </MenuItem>
          <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export default SettingsDropdown;
