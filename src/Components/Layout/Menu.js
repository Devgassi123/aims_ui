import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import { AiOutlinePushpin, AiTwotonePushpin } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CenteralUIColor } from "../../Functions/CustomStyle";

import { getUserMenu } from "../../redux/actions/menu";
import { updatePin } from "../../redux/actions/pin";
import { setActiveModules, setSelectedModuleLink } from "../../redux/actions/active_modules"

import { IconMenuLoad } from "./Loader";
import IconBuilder from "../../Functions/Icons";
export const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  subItem: {
    paddingLeft: theme.spacing(2),
  },
  subItemMenu: {
    paddingLeft: theme.spacing(4),
  },
  subItem3rdMenu: {
    paddingLeft: theme.spacing(6),
  },
  Card: {
    width: 170,
    margin: "auto",
  },
  CardBackground: {
    backgroundColor: CenteralUIColor.Black,
  },
  Media: {
    height: 150,
    width: "100%",
    objectFit: "cover",
  },
  ListItemTextColor: {
    color: "#000000",
  },
  //Drawer Styles
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: theme.palette.getContrastText(CenteralUIColor.DrawerColor),
    "&:hover, &:focus": {
      backgroundColor: CenteralUIColor.HoverBlue,
    },
  },
  itemCategory: {
    backgroundColor: CenteralUIColor.DrawerColor,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: "#4fc3f7",
  },
  itemPrimary: {
    fontSize: "inherit",
  },
  itemIcon: {
    minWidth: "auto",
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },

  listSubheader: {
    color: CenteralUIColor.Gold,
    // fontSize : "10px",
  },
  dividerHeader: {
    boxShadow: "0 -1px 0 #404854 inset",
  },

  pin: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

export function Menu(props) {
  const { setTitle, setMobileOpen, setDesktopOpen } = props;

  const userMenu = useSelector((state) => state.menuReducer.data);
  const dispatch = useDispatch();
  const stableDispatch = useCallback(dispatch, []);

  useEffect(() => {
    stableDispatch(getUserMenu());
  }, [stableDispatch]);

  if (userMenu && userMenu.length === 0) {
    return <IconMenuLoad />;
  }
  else {
    return (
      <ModuleListItem setTitle={setTitle} setMobileOpen={setMobileOpen} setDesktopOpen={setDesktopOpen} />
    );
  }
}

function ModuleListItem(props) {
  const { setTitle, setMobileOpen, setDesktopOpen } = props;

  const classes = useStyles();

  const [pinned, setPinned] = useState(false);
  const [openedMenus, setOpenedMenus] = useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const userMenu = useSelector((state) => state.menuReducer.data);
  const dispatch = useDispatch();
  const stableDispatch = useCallback(dispatch, []);

  const handleOpenDrawer = (e) => {
      if (!pinned) {
        setDesktopOpen(true);
      }
  };

  const handleMinimizeDrawer = (e) => {
    if (!pinned) {
      setDesktopOpen(false);
    }
  };

  const handlePin = (e) => {
    e.preventDefault();
    setPinned((prevState) => !prevState); // for setting the icon star pin
    setDesktopOpen(true); // for setting the drawer open
    stableDispatch(updatePin({ pinned: !pinned })); // for setting the nav status and widths of every transactyion components
  };

  const setHeaderTitle = (moduleName) => {
    setTitle(moduleName);
    setMobileOpen(false);
  };

  const handleListItemClick = (event, index, moduleName, link) => {
    setSelectedIndex(index);
    setHeaderTitle(moduleName);
    dispatch(setActiveModules(moduleName));
    dispatch(setSelectedModuleLink(link));
  };

  // this method sets the current state of a menu item i.e whether it is in expanded or collapsed or a collapsed state
  const handleClick = (item) => {
    // setOpenedMenus((prevState) => ({ [item]: !prevState[item] }));
    if (openedMenus.find(element => element === item)) {
      var array = [...openedMenus]; // make a separate copy of the array
      var index = array.indexOf(item)
      if (index !== -1) {
        array.splice(index, 1);
        setOpenedMenus(array);
      }
    } else {
      setOpenedMenus(openedMenus.concat(item))
    }
  };

  // if the menu item doesn't have any child, this method simply returns a clickable menu item that redirects to any location 
  // and if there is no child this method uses recursion to go until the last level of children and then returns the item by the first condition.
  const loopModules = (modules) => {

    return modules && modules.map((module, index) => {
      if ((module.childModules && module.childModules.length !== 0)) {
        return (
          <div key={index}>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              disablePadding
            >
              <ListItem
                button
                className={clsx(
                  classes.item,
                  classes.itemCategory,
                  classes.subItem
                )}
                onClick={() => handleClick(module.moduleName)}
              >
                <ListItemIcon>
                  <IconBuilder tag={module.moduleName} />
                </ListItemIcon>
                <ListItemText primary={module.moduleName} />
                {openedMenus.find(element => element === module.moduleName) ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse
                in={Boolean(openedMenus.find(element => element === module.moduleName))}
                timeout="auto"
                unmountOnExit
              >
                {loopModules(module.childModules)}
              </Collapse>
            </List>
          </div>
        )
      }
      else {
        // no children
        return (
          <div key={index}>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              disablePadding
            >
              <ListItem
                button
                className={clsx(
                  classes.item,
                  classes.itemCategory,
                  classes.subItem,
                  {
                    [classes.subItem3rdMenu]: (module.url.split("/").length - 1) === 3,
                    [classes.subItemMenu]: (module.url.split("/").length - 1) === 2
                  }
                )}
                selected={selectedIndex === index}
                onClick={(event) =>
                  handleListItemClick(event, index, module.moduleName, module.url)
                }
              >
                <ListItemIcon>
                  <IconBuilder tag={module.moduleName} />
                </ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                  primary={module.moduleName}
                />
              </ListItem>
            </List>
          </div>
        );
      }
    });
  };

  return (
    <div onMouseLeave={handleMinimizeDrawer} onMouseEnter={handleOpenDrawer}>
      <ListItem
        button
        className={clsx(classes.item, classes.itemCategory, classes.subItem)}
        onClick={(event) => setHeaderTitle("Home")}
        component={Link}
        to={"/"}
      >
        <ListItemIcon>
          <IconBuilder tag={"Home"} />
        </ListItemIcon>
        <ListItemText primary={"Home"} />
        <IconButton
          className={classes.pin}
          style={{ padding: "0px", color: CenteralUIColor.IconColor }}
          onClick={handlePin}
        >
          {pinned ? <AiTwotonePushpin /> : <AiOutlinePushpin />}
        </IconButton>
      </ListItem>
      {userMenu && loopModules(userMenu)}
    </div>
  )
}
