import { useEffect } from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material'

const FileInput = props => {
    const { name, label = name, attachments, setAttachments } = props
    const { register, unregister, setValue } = useForm()
    const onDrop = useCallback(
      (droppedFiles) => {
          const newFiles = (!!attachments?.length && [...attachments].concat(droppedFiles)) || droppedFiles;

          setValue(name, newFiles, { shouldValidate: true });
          setAttachments([...newFiles])
      },
      [setValue, name, attachments, setAttachments],
  );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: props.accept,
    })
    useEffect(() => {
        register(name)
        return () => {
            unregister(name)
        }
    }, [register, unregister, name])
    return (
        <>
            <label className=" " htmlFor={name} style={{ marginBottom: "10px" }}>
                {label}
            </label>
            <div
                {...getRootProps()}
                type="file"
                role="button"
                aria-label="File Upload"
                id={name}
            >
                <input {...props} {...getInputProps()} />
                <Box
                    sx={{ width: "100%", border: "1px dashed grey", height: "7rem", padding: "0.7rem 1rem" }}
                    className={" " + (isDragActive ? " " : " ")}
                >
                    <p style={{ marginBottom: "10px" }}>Drop the files here ...</p>
  
                    {!!attachments?.length && (
                        <Box sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-start",
                          flexDirection: "row",
                          gap: "1rem"
                        }}>
                            {attachments.map(file => {
                                return (
                                    <div key={file.name}>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            style={{
                                                height: "50px",
                                                width: "35px"
                                            }}
                                        />
                                    </div>
                                )
                            })}
                        </Box>
                    )}
                </Box>
            </div>
        </>
    )
  }

  export default FileInput