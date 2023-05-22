import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  toolTipFont: {
    fontSize: 12,
  },
}));

const OverflowTip = ({ text }) => {
  const [isOverflowed, setIsOverflow] = useState(false);
  const classes = useStyles();
  const textElementRef = useRef();
  useEffect(() => {
    setIsOverflow(
      textElementRef.current.scrollWidth > textElementRef.current.clientWidth
    );
  }, []);
  return (
    <Tooltip
      title={text}
      classes={{ tooltip: classes.toolTipFont }}
      disableHoverListener={!isOverflowed}
    >
      <div
        ref={textElementRef}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {text}
      </div>
    </Tooltip>
  );
};


export default OverflowTip;