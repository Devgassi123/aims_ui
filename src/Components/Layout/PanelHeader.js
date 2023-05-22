import { AppBar, Divider, Toolbar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { CustomColorTypography } from "../../Functions/CustomStyle";
import { CenteralUIColor } from "../../Functions/CustomStyle";

const StyledAppBar = withStyles((theme) => ({
  root: {
    backgroundColor: CenteralUIColor.LightGrey,
    color: theme.palette.common.white,
  },
}))(AppBar);

const PanelHeader = ({ title }) => {
  return (
    <StyledAppBar position="static" elevation={0}>
      <Toolbar variant="dense">
        <CustomColorTypography variant="h6" gutterBottom>
          {title}
        </CustomColorTypography>
      </Toolbar>
      <Divider />
    </StyledAppBar>
  );
};

export default PanelHeader;
