import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { Card, CardMedia, CardActions, CircularProgress } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";

//FUNCTIONS
import { CenteralUIColor } from "../../Functions/CustomStyle";
import IconBuilder from "../../Functions/Icons";

//ASSET
// import defaultImage from "../../img/defaultItem.png";
import defaultImage from "../../assets/img/avatar.gif"
import { useToasts } from "react-toast-notifications";

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

export default function ImageSelector(props) {
    const { id, title, size, base64Img, onSaveImage } = props;
    const classes = useStyles();
    const { addToast } = useToasts();

    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (base64Img.length > 0) {
            setImage(`data:image/png;base64,${base64Img}`);
        }
        else {
            setImage("");
        }
    }, [base64Img])

    const getBase64 = (file, cb) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    };

    const onDeleteImage = async () => {
        if (image.length !== 0) {
            if (window.confirm("Are you sure you want to remove this picture?")) {
                setLoading(true);
                setImage("");
                const result = await onSaveImage("");
                if (result === "success") {
                    setLoading(false);
                }
            }
        }
        else {
            addToast("Oops! No image selected", { appearance: "info" });
        }
    };

    const onUpload = async (file = null) => {
        if (file !== null) {
            setLoading(true);
            const result = await onSaveImage(file);
            if (result === "success") {
                setLoading(false);
            }
        }
    };

    const fileOnChange = (e) => {
        if (e.target.files[0]) {
            getBase64(e.target.files[0], (result) => {
                setImage(result);
                onUpload(String(result).split(",")[1]);
            });
        }
    };

    return (
        <Card variant="outlined">
            <CardMedia
                component="img"
                alt={id}
                image={image || defaultImage}
                height={size}
                width={size}
                title={title}
            />
            {(id !== "") && (
                <CardActions>
                    <input
                        style={{ display: "none" }}
                        type="file"
                        name="picture"
                        onChange={fileOnChange}
                        id="image_upload"
                        disabled={loading}
                    />
                    {image === "" ? (
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
                    ) : (
                        <ToggleButton
                            value="left"
                            aria-label="left aligned"
                            title="Remove this image"
                            size="small"
                            onClick={onDeleteImage}
                        >
                            <IconBuilder tag="Remove" />
                        </ToggleButton>
                    )}
                </CardActions>
            )}

        </Card>
    );
}