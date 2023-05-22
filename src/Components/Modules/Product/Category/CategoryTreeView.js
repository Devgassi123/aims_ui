import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Link, IconButton, Tooltip } from "@material-ui/core";
import { alpha, makeStyles, withStyles } from "@material-ui/core/styles";
import { ChevronRight as ChevronRightIcon, ExpandMore as ExpandMoreIcon, Category, Clear as ClearIcon, FilterList as FilterListIcon } from "@material-ui/icons";
import { TreeItem, TreeView } from "@material-ui/lab";

import { useCustomStyle } from "../../../../Functions/CustomStyle";

import CategoryFilter from "./CategoryFilter";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 210,
    flexGrow: 1,
    maxWidth: 400,
  },
  cardContent: {
    "& > *": {
      margin: theme.spacing(.75, 0),
    },
    height: "100%",
    minHeight: 680,
    maxHeight: 680,
    overflow: "auto"
  },
}));

const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    "& .close": {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}))((props) => <TreeItem {...props} />);

export default function CategoryTreeView(props) {
  const classes = useStyles();
  const customStyle = useCustomStyle();
  const [treeView, setTreeView] = useState([]);
  const [defaultExpandedTreeView, setDefaultExpandedTreeView] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);

  const { categoryData, onClick, handleDrop } = props;
  let defaultExpandedIds = [];

  const treeViewConverter = () => {
    const nest = (items, category_id = 0, link = "parent_category_id") =>
      items
        .filter((item) => item[link] === category_id)
        .map((item) => ({ ...item, children: nest(items, item.category_id) })); //<----- Parent Child Converter

    const tree = nest(categoryData);
    setTreeView(tree);

    if (tree.length !== 0) {
      defaultExpandedMethod(tree); //<----- get the all the location id that has children and set as default expanded
      setDefaultExpandedTreeView([...defaultExpandedIds]);
    }
  };

  const defaultExpandedMethod = (tree) => {
    tree.map((x) => {
      if (x.children.length !== 0) {
        defaultExpandedIds.push(x.category_id.toString());
        defaultExpandedMethod(x.children);
      }
      return tree;
    });
  };

  const treeViewConverterCallBack = useCallback(treeViewConverter, [categoryData]);

  useEffect(() => {
    treeViewConverterCallBack();
  }, [treeViewConverterCallBack]);

  const handleChange = (event, nodes) => {
    if (!event.shiftKey) {
      setDefaultExpandedTreeView(nodes);
    }
  };

  const handleSelect = (event, nodeIds) => {
    const selectedItem = categoryData.find(
      (x) => x.category_id === parseInt(nodeIds)
    );
    onClick(parseInt(nodeIds), selectedItem.name);

  };;

  const treeLabel = (category_id, name, is_active, total_items) => (
    <Link
      color="inherit"
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => handleDrop(e, category_id)}
    >
      {is_active === false ? (
        <ClearIcon
          fontSize="small"
          style={{ color: "red" }}
          titleAccess="Deactivated Location"
        />
      ) : null}
      <Category /> {name} - {`(${total_items})`}
    </Link>
  );

  const renderTree = (nodes) => {
    return nodes.map((tree, index) => {
      return (
        <StyledTreeItem
          key={tree.category_id}
          nodeId={tree.category_id.toString()}
          label={treeLabel(
            tree.category_id,
            tree.name,
            tree.is_active,
            tree.total_items
          )}
        >
          {Array.isArray(tree.children) ? renderTree(tree.children) : null}
        </StyledTreeItem>
      );
    });
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <React.Fragment>
      <CategoryFilter open={openFilter} handleClose={handleCloseFilter} />
      <Card>
        <CardHeader
          title="Categories"
          className={customStyle.cardHdr}
          action={
            <Tooltip title="Filter list">
              <IconButton aria-label="filter list" onClick={handleOpenFilter}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          }
        />
        <CardContent className={classes.cardContent}>
          <TreeView
            title={"Hint : Hold shift to prevent parent node to close"}
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            expanded={defaultExpandedTreeView}
            onNodeToggle={handleChange}
            onNodeSelect={handleSelect}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            {renderTree(treeView)}
          </TreeView>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
