import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import { 
  Checkbox, 
} from "@material-ui/core";
import { CenteralUIColor } from './CustomStyle'

export const CustomCheckbox = withStyles({
  root: {
    color: CenteralUIColor.IconColor,
    "&$checked": {
      color: CenteralUIColor.IconColor,
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);