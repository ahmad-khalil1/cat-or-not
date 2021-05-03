import { useState, useEffect } from "react";
import { Box, Button, Card } from "@material-ui/core";
import { DropzoneArea, DropzoneAreaBase } from "material-ui-dropzone";
import AudioTrack from "@material-ui/icons/Audiotrack";
import {
  AttachFile,
  Description,
  PictureAsPdf,
  Theaters,
} from "@material-ui/icons";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import useHttp, { patchPhotos } from "../hooks/useHttp";
import catIcon from "../resources/catIcon";

const useStyles = makeStyles(theme =>
  createStyles({
    previewChip: {
      minWidth: 160,
      maxWidth: 210,
    },
    active: {
      border: "dashed",
      borderColor: "red",

      backgroundImage: "none",
    },
    dropZone: {
      backgroundColor: "",
    },
    dropZoneIcon: {
      display: "none",
    },
    previewGridContainer: { marginTop: "1rem" },
    previewGridItem: {},
    previewGridImage: {},
  })
);

const handlePreviewIcon = (fileObject, classes) => {
  const { type } = fileObject.file;
  const iconProps = {
    className: classes.image,
  };

  if (type.startsWith("video/")) return <Theaters {...iconProps} />;
  if (type.startsWith("audio/")) return <AudioTrack {...iconProps} />;

  switch (type) {
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return <Description {...iconProps} />;
    case "application/pdf":
      return <PictureAsPdf {...iconProps} />;
    default:
      return <AttachFile {...iconProps} />;
  }
};

const DropZone = () => {
  const [fileObjects, setFileObjects] = useState([]);
  const [intialState, setIntialState] = useState(true);
  const { sendRequest, status } = useHttp(patchPhotos);

  useEffect(() => {
    if (!intialState) {
      console.log("triggerd : useEffect");
      console.log(fileObjects);
      sendRequest(fileObjects);
    }
  }, [fileObjects]);

  const handleAddingFiles = newFileObjs => {
    console.log("onAdd", newFileObjs);
    setIntialState(false);
    setFileObjects([].concat(fileObjects, newFileObjs));
  };

  const handleDeletingFiles = deleteFileObj => {
    console.log("triggerd : handleDeletingFiles");
    setFileObjects(latestFiles => {
      let updatedFiles = [...latestFiles];
      return updatedFiles.filter(file => {
        return deleteFileObj.file.name !== file.file.name;
      });
    });
  };

  const loading = (
    <p
      style={{
        margin: "3rem auto",
        textAlign: "center",
      }}
    >
      loading ....
    </p>
  );

  const isDropZoneEmpty = fileObjects.length === 0;
  let icon;
  if (isDropZoneEmpty) {
    icon = catIcon;
  } else {
    icon = null;
  }

  const classes = useStyles();
  return (
    <Box>
      <DropzoneAreaBase
        // acceptedFiles={["image/*"]}
        // showPreviews={true}
        showPreviewsInDropzone={true}
        // Icon={!isDropZoneEmpty && ""}
        Icon={icon}
        showFileNames={true}
        // filesLimit={2}
        // useChipsForPreview
        // previewGridProps={{ container: { spacing: 1, direction: "row" } }}
        // previewChipProps={{ classes: { root: classes.previewChip } }}
        // previewText='Selected files'
        fileObjects={fileObjects}
        onAdd={handleAddingFiles}
        dropzoneText={isDropZoneEmpty ? "Drag your image here " : ""}
        dropzoneClass={classes.dropZone}
        previewGridClasses={{
          container: classes.previewGridContainer,
          item: classes.previewGridItem,
          image: classes.previewGridImage,
        }}
        previewGridProps={{ container: { justify: "center" } }}
        // onChange={files => {
        //   setFileObjects(files);
        //   console.log("Files:", files);
        //   console.log("fileObject:", fileObjects);
        // }}
        onDelete={handleDeletingFiles}
        // getPreviewIcon={handlePreviewIcon}
        classes={{ active: classes.active, icon: classes.dropZoneIcon }}
      >
        <Button variant='outlined'> hey there </Button>
      </DropzoneAreaBase>
      {status === "pending" && loading}
    </Box>
  );
};

export default DropZone;

//// temp

// {
//     import React, { useState } from "react";

// import { Card } from "@material-ui/core";
// import { DropzoneArea, DropzoneAreaBase } from "material-ui-dropzone";
// import AudioTrack from "@material-ui/icons/Audiotrack";
// import {
//   AttachFile,
//   //   AudioTrack,
//   Description,
//   PictureAsPdf,
//   Theaters,
// } from "@material-ui/icons";

// import { createStyles, makeStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles(theme =>
//   createStyles({
//     previewChip: {
//       minWidth: 160,
//       maxWidth: 210,
//     },
//   })
// );

// const handlePreviewIcon = (fileObject, classes) => {
//   const { type } = fileObject.file;
//   const iconProps = {
//     className: classes.image,
//   };

//   if (type.startsWith("video/")) return <Theaters {...iconProps} />;
//   if (type.startsWith("audio/")) return <AudioTrack {...iconProps} />;

//   switch (type) {
//     case "application/msword":
//     case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
//       return <Description {...iconProps} />;
//     case "application/pdf":
//       return <PictureAsPdf {...iconProps} />;
//     default:
//       return <AttachFile {...iconProps} />;
//   }
// };

// const DropZone = () => {
//   const [fileObjects, setFileObjects] = useState([]);

//   const classes = useStyles();
//   return (
//     <Card>
//       <DropzoneAreaBase
//         // acceptedFiles={["image/*"]}
//         // showPreviews={true}
//         // showPreviewsInDropzone={false}
//         // useChipsForPreview
//         // previewGridProps={{ container: { spacing: 1, direction: "row" } }}
//         // previewChipProps={{ classes: { root: classes.previewChip } }}
//         // previewText='Selected files'
//         fileObjects={fileObjects}
//         onAdd={newFileObjs => {
//           console.log("onAdd", newFileObjs);
//           setFileObjects([].concat(fileObjects, newFileObjs));
//         }}
//         dropzoneText={"Drag and drop an image here or click"}
//         onChange={files => console.log("Files:", files)}
//         getPreviewIcon={handlePreviewIcon}
//       />
//     </Card>
//   );
// };

// export default DropZone;

// }

// axios
// {
//   console.log("triggerd");
//   const requestConfig = {
//     //   url: "/photos.json",
//     method: "patch",
//     url: "https://cat-or-not-2d93d-default-rtdb.firebaseio.com/photos.json",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: {
//       photo: fileObjects,
//     },
//   };

//   // console.log(fileObjects[fileObjects.length - 1]);
//   const sendPhoto = async () => {
//     const putInstance = axios.create(requestConfig);
//     // const response = await axios.request(requestConfig);

//     // const response = await axios.put(
//     //   requestConfig.baseURL,
//     //   requestConfig.data,
//     //   requestConfig
//     // );
//     const response = await putInstance.request(requestConfig);

//     return response;
//     console.log(response);
//   };
//   if (!intialState) {
//     sendPhoto().catch(error => console.log(error));
//   }
// }
