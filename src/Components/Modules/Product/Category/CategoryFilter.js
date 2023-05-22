import React from 'react';
import moment from 'moment';
import {
    Box, Button,
    Checkbox,
    Dialog, DialogActions, DialogContent, DialogTitle,
    MenuItem,
    Slide,
    TextField
} from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function CategoryFilter(props) {
    const { open, handleClose } = props;

    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth="xs"
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">Filter Categories</DialogTitle>
            <DialogContent>
                {/* DATE CREATED */}
                <Box display="flex">
                    <TextField 
                        id="dateCreated"
                        label="Date Created"
                        variant="outlined"
                        type="date"
                        size="small"
                        margin="dense"
                        value={moment(new Date()).format('YYYY-MM-DD')}
                        fullWidth
                    />
                    <Checkbox
                        // checked={checked}
                        // onChange={handleChange}
                        color="secondary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                </Box>
                {/* DATE MODIFIED */}
                <Box display="flex">
                    <TextField 
                        id="dateModified"
                        label="Date Modified"
                        variant="outlined"
                        type="date"
                        size="small"
                        margin="dense"
                        value={moment(new Date()).format('YYYY-MM-DD')}
                        fullWidth
                    />
                    <Checkbox
                        // checked={checked}
                        // onChange={handleChange}
                        color="secondary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                </Box>
                {/* CREATED BY */}
                <Box display="flex">
                    <TextField 
                        id="createdBy"
                        name="createdBy"
                        label="Created By"
                        variant="outlined"
                        size="small"
                        margin="dense"
                        value=""
                        select
                        fullWidth
                    >
                        <MenuItem value={1}>User 1</MenuItem>
                        <MenuItem value={2}>User 2</MenuItem>
                        <MenuItem value={3}>User 3</MenuItem>
                    </TextField>
                    <Checkbox
                        // checked={checked}
                        // onChange={handleChange}
                        color="secondary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                </Box>
                {/* MODIFIED BY */}
                <Box display="flex">
                    <TextField 
                        id="modifiedBy"
                        name="modifiedBy"
                        label="Modified By"
                        variant="outlined"
                        size="small"
                        margin="dense"
                        value=""
                        select
                        fullWidth
                    >
                        <MenuItem value={1}>User 1</MenuItem>
                    </TextField>
                    <Checkbox
                        // checked={checked}
                        // onChange={handleChange}
                        color="secondary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="default">
                    Clear Filter
                </Button>
                <Button onClick={handleClose} color="primary">
                    Apply Filter
                </Button>
            </DialogActions>
        </Dialog>
    );
}
