import React from "react";
// import Home from "./Components/Data/Home";

import Home from "./Components/Layout/TabbedActiveModules";
import POHeaderAndDetailsRpt from "./Components/Modules/Inbound/PO/POReport/POHeaderAndDetailsRpt";
import store from "./redux/store";
import { Provider } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import Nav from './Components/Layout/Nav';
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import { CenteralUIColor } from "../src/Functions/CustomStyle"

const theme = createTheme({
  palette: {
    default: {
      light: '#2196f3',
      main: '#795548',
      dark: '#0d47a1',
    },
    primary: {
      light: '#2196f3',
      main: '#1565c0',
      dark: '#0d47a1',
    },
    secondary: {
      light: "#8d6e63",
      main: "#795548",
      dark: "#6d4c41"
    },
    success: {
      light: "#43a047",
      main: "#388e3c",
      dark: "#2e7d32"
    },
    warning: {
      light: "#fbc02d",
      main: "#f9a825",
      dark: "#f57f17"
    }
  },
  typography: {
    fontFamily: `"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif`,
    // fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    fontSize: 12,
    fontWeightLight: 600,
    fontWeightRegular: 800,
    fontWeightMedium: 1000,
    h6: {
      // color: "rgba(0,0,0)",
    },
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        fontSize: "13px",
        fontFamily: `"Calibri", "Montserrat", "Roboto"`,
        "&.Mui-disabled": {
          backgroundColor: "#eeeeee"
        }
      },
      input: {
        padding: "8px"
      }
    },
    MuiFilledInput: {
      root: {
        backgroundColor: "#fafafa",
        fontSize: "13px",
        fontFamily: `"Calibri", "Montserrat", "Roboto"`,
        "&.Mui-disabled": {
          backgroundColor: "#eeeeee"
        },
        "&input:read-only": {
          backgroundColor: "red",
          // borderStyle: "dashed"
        }
      }
    },
    MuiInput: {
      root: {
        fontSize: "13px",
        fontFamily: `"Calibri", "Montserrat", "Roboto"`,
        "&.Mui-disabled": {
          backgroundColor: "#eeeeee"
        }
      },
      input: {
        padding: "8px"
      }
    },
    MuiInputLabel: {
      root: {
        "&.MuiInputLabel-shrink": {
          fontSize: "17px",
        }
      },
      outlined: {
        fontSize: "13px",
        fontFamily: `"Calibri", "Montserrat", "Roboto"`,
        "&.MuiInputLabel-shrink": {
          fontSize: "14px",
          color: "black"
        }
      },
      asterisk: {
        color: "red",
      }
    },
    MuiFormLabel: {
      root: {
        fontSize: "12px",
        fontFamily: `"Calibri", "Montserrat", "Roboto"`
      }
    },
    MuiTypography: {
      body1: {
        fontSize: "12px",
        // fontFamily: "inherit"
      }
    },
    MuiToolbar: {
      regular: {
        minHeight: "49px"
      }
    },
    MuiTab: {
      root: {
        textTransform: "capitalize",
        fontWeight: "bold",
        "&.Mui-selected": {
          // background: "blue"
        },
      },
    },
    MuiToggleButton: {
      root: {
        color: "rgba(0, 0, 0)",
      },
    },
    MuiCssBaseline: {
      "@global": {
        "*": {
          "scrollbar-width": "thin",
        },
        "*::-webkit-scrollbar": {
          width: "4px",
          height: "4px",
        },
        /* Handle */
        "::-webkit-scrollbar-thumb": {
          background: CenteralUIColor.LightBrown,
        },
      },
    },
    MuiFab: {
      root: {
        backgroundColor: "#1565c0",
        color: "#ffffff",
        '&:hover': {
          backgroundColor: "#0d47a1",
        },
      },
      primary: {
        color: "#ffffff",
      },
    },
    MuiStepIcon: {
      root: {
        "&.MuiStepIcon-completed": {
          color: "green"
        }
      }
    },
    MuiBadge: {

    }
  },
});

function App() {

  const location = useLocation();
  // console.log("pathname", location.pathname)

  return (
    <Provider store={store}>
      <ToastProvider autoDismiss={true} placement="bottom-right">
        {/* ROUTER LINKS */}
        <ThemeProvider theme={theme}>
          {!location.pathname.includes("print/") && <Nav />}
          {/* <Nav /> */}
          <Switch>
            <Route path='/print/po/:poId' component={POHeaderAndDetailsRpt} />
            <Route path='/' component={Home} />
          </Switch>
        </ThemeProvider>
      </ToastProvider>
    </Provider>
  );
}

export default App;
