import { CssBaseline, Drawer, Hidden } from "@material-ui/core";
import Header from "./Header";
import { Menu } from "./Menu";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { drawerWidth } from "./Menu";  //to show permanent drawer uncomment this
import PropTypes from "prop-types";
import { CenteralUIColor } from "../../Functions/CustomStyle";
import { useDispatch, useSelector } from "react-redux";
import { getPin } from "../../redux/actions/pin";
import React, { useCallback, useEffect, useState } from "react";

import clsx from "clsx";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    backgroundColor: CenteralUIColor.DrawerColor,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    backgroundColor: CenteralUIColor.DrawerColor,
    [theme.breakpoints.up("md")]: {
      width: theme.spacing(8) + 1,
    },
  },

  drawerPaper: {
    width: drawerWidth,
    backgroundColor: CenteralUIColor.DrawerColor,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
  },
  // necessary for content to be below app bar
  toolbar: {
    ...theme.mixins.toolbar,
  },
  //Content adjuster
  closeNav: {
    [theme.breakpoints.up("md")]: {
      width: theme.spacing(8) + 1,
      flexShrink: 0,
    },
  },
  openNav: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
}));


const Nav = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [title, setTitle] = useState('Home');
  const [desktopOpen, setDesktopOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };
  const { window } = props;

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header
        title={title}
        setTitle={setTitle}
        handleDrawerToggle={handleDrawerToggle}
      >
      </Header>

      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        {/* Drawer for mobile view */}
        <Hidden mdUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
          // ModalProps={{
          //   keepMounted: true, // Better open performance on mobile.
          // }}
          >
            {/* if userMenu store has not yet fetched the data from API show loader */}
            <Menu
              setTitle={setTitle}
              setMobileOpen={setMobileOpen}
              setDesktopOpen={setDesktopOpen}
              desktopOpen={desktopOpen}
            />
          </Drawer>
        </Hidden>

        {/* //to show permanent drawer uncomment this */}
        <Hidden smDown implementation="css">
          <Drawer
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: desktopOpen,
              [classes.drawerClose]: !desktopOpen,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: desktopOpen,
                [classes.drawerClose]: !desktopOpen,
              }),
            }}
            variant="permanent"
            open
          >
            <div className={classes.toolbar}></div>
            <Menu
              setTitle={setTitle}
              setMobileOpen={setMobileOpen}
              setDesktopOpen={setDesktopOpen}
              desktopOpen={desktopOpen}
            />
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

export default Nav;

Nav.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

//Distiributed in all Main Modules for permanent drawer
export const NavDiv = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const pinStatus = useSelector((state) => state.pinReducer.document);

  const getPinState = () => {
    if (pinStatus.length === 0) {
      dispatch(getPin());
    }
  }
  const stableDispatch = useCallback(getPinState, []);

  useEffect(() => {
    stableDispatch();
  }, [stableDispatch]);

  const getPinStatus = () => {
    let ret = false;
    if (pinStatus.length !== 0) {
      ret = pinStatus[0].pinned;
    }
    return ret;
  }
  return (
    <nav className={getPinStatus() ? classes.openNav : classes.closeNav} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
    </nav>
  );
}




