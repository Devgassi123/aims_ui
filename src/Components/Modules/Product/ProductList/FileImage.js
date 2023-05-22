import React, { useEffect, useState } from "react";
import {
  Card,
  CardActions,
  CardMedia,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { useToasts } from "react-toast-notifications";
import "firebase/storage";

import { CenteralUIColor } from "../../../../Functions/CustomStyle";
import IconBuilder from "../../../../Functions/Icons";
import defaultImage from "../../../../img/defaultItem.png";

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

const FileImageInput = ({ sku, image, onSaveImage }) => {
  const classes = useStyles();
  const { addToast } = useToasts();

  const [images, setImages] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (image.length > 0) {
      setImages(`data:image/png;base64,${image}`);
    }
  }, [image])

  const onUpload = (file = null) => {
    if (file !== null) {
      setLoading(true);
      onSaveImage(file);
      setLoading(false);
      // const bucketName = `images`;
      // let storageRef = firebase.storage().ref(`${bucketName}/${file.name}`);
      // let uploadTask = storageRef.put(file);
      // uploadTask.on(
      //   firebase.storage.TaskEvent.STATE_CHANGED,
      //   function progress(snapshot) {
      //     // var percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //     //   console.log(percent + "% uploaded");
      //   },
      //   function error() {
      //     //   console.log(`status : FAILED TRY AGAIN!`);
      //     setLoading(false);
      //   },
      //   function complete(event) {
      //     //   console.log(`Status : UPLOAD COMPLETED`);
      //     storageRef.getDownloadURL().then((url) => {
      //       setImages(prev => [...prev, url])
      //       onSaveImage(images + "," + url);
      //       setLoading(false);
      //     });
      //   }
      // );
    }
  };

  const fileOnChange = (e) => {
    if (e.target.files[0]) {
      getBase64(e.target.files[0], (result) => {
        setImages(result);
        onUpload(String(result).split(",")[1]);
      });
    }
  };

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

  const onDeleteImage = () => {
    if (images.length !== 0) {
      if (window.confirm("Are you sure you want to remove this data?")) {
        setImages("");
        onSaveImage("")
      } else {
        addToast("Oops! No image selected", { appearance: "error" });
      }
    }
  };

  return (
    <Card variant="outlined">
      {images.length !== 0 ? (
        <CardMedia
          component="img"
          alt={sku}
          // src={}
          image={images}
          height={245}
          title={sku}
        />
      ) : (
        <CardMedia
          component="img"
          image={defaultImage}
          height={245}
          title="No image available"
        />
      )}

      {(sku !== "") && (
        <CardActions>
          <input
            style={{ display: "none" }}
            type="file"
            name="picture"
            onChange={fileOnChange}
            id="image_upload"
            disabled={loading}
          />
          {images === "" ? (
            <label htmlFor="image_upload">
              <ToggleButton
                value="left"
                aria-label="left aligned"
                title="New"
                component="span"
                disabled={loading}
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
                onClick={() => {
                  onDeleteImage();
                }}
              >
                <IconBuilder tag="Remove" />
              </ToggleButton>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export const FileImage = React.memo(FileImageInput, (prevProps, nextProps) => {
  if (prevProps.sku === nextProps.sku) {
    return true;
  }
  return false;
});

export default FileImage;
