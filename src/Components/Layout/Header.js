import { AppBar, IconButton, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import { useHistory } from "react-router-dom";
import {
  CenteralUIColor,
  CustomColorTypography,
} from "../../Functions/CustomStyle";
import logo from "../../img/logo.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  // necessary for content to be below app bar
  // toolbar: theme.mixins.toolbar,

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: CenteralUIColor.Brown,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    }, //to show permanent drawer : Menu Button uncomment this
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    [theme.breakpoints.up("md")]: {
      maxWidth: 200,
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: 150,
    },
    maxWidth: 0,
    objectFit: "cover",
  },
}));

const Header = (props) => {
  const classes = useStyles();

  const history = useHistory();

  const routeChange = () => {
    let path = `/`;
    history.push(path);
    props.setTitle("Home");
  };

  // function httpGet() {
  //   var xmlHttp = new XMLHttpRequest();
  //   xmlHttp.open("GET", "https://localhost:7150/WeatherForecast", false); // false for synchronous request
  //   xmlHttp.send(null);
  //   return xmlHttp.responseText;
  // }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={props.handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            style={{ padding: "0px" }}
            edge="start"
            aria-label="menu"
            onClick={routeChange}
          >
            <img src={logo} alt="Aurumax" className={classes.logo} />
          </IconButton>
          <div className={classes.title} variant="h6"></div>
          <CustomColorTypography variant="h6">
            {/* {props.title} */}
            Warehouse Name
            {/* <IconButton onClick={httpGet}>CLick Me!</IconButton> */}
          </CustomColorTypography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
