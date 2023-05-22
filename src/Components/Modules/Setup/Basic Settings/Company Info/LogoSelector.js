import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Card, CardMedia, CardActions, CircularProgress } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";

//FUNCTIONS
import { CenteralUIColor } from "../../../../../Functions/CustomStyle";
import IconBuilder from "../../../../../Functions/Icons";

//ASSET
import defaultImage from "../../../../../img/defaultItem.png";

const useStyles = makeStyles((theme) => ({
    root: {
        width: 300,
        height: 300,
        margin: "auto",
    },
    Media: {
        height: "100%",
        width: "100%",
        objectFit: "cover",
    },
    wrapper: {
        margin: theme.spacing(1),
        position: "relative",
    },
    buttonProgress: {
        color: CenteralUIColor.Orange,
    },
}));

export default function LogoSelector(props) {
    const classes = useStyles();

    // eslint-disable-next-line no-unused-vars
    const [image, setImage] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);

    return (
        <Card variant="outlined">
            <CardMedia
                component="img"
                alt="company logo"
                image={image || defaultImage}
                height={250}
                title="company logo"
            />
            <CardActions>
                <input
                    style={{ display: "none" }}
                    type="file"
                    name="picture"
                    // onChange={fileOnChange}
                    id="image_upload"
                    disabled={loading}
                />
                <label htmlFor="image_upload">
                    <ToggleButton
                        value="left"
                        aria-label="left aligned"
                        title="New"
                        component="span"
                        disabled={loading}
                        size="small"
                    >
                        {loading ? (
                            <CircularProgress
                                size={24}
                                className={classes.buttonProgress}
                            />
                        ) : (
                            <IconBuilder tag="Add" />
                        )}
                    </ToggleButton>
                </label>
                <ToggleButton
                    value="left"
                    aria-label="left aligned"
                    title="Remove this image"
                    size="small"
                // onClick={() => {
                //     onDeleteImage();
                // }}
                >
                    <IconBuilder tag="Remove" />
                </ToggleButton>
            </CardActions>
        </Card>
    );
}