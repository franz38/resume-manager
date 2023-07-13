import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEffect, useState } from "react";
import { Box, Container, HStack, UnorderedList } from "@chakra-ui/react";
import Dropzone from 'react-dropzone';
import { MyFile } from "../types/delta";


export enum NodeType {
    FOLDER,
    FILE
}

export interface Node {
    name: string;
    type: NodeType;
    children?: Node[]
    fileContent?: string;
    files: string[]
}

interface ResumeEditorProps {
    fileList: MyFile[];
    fileOpen: MyFile;
    applyChange: (content: string, filename: string, path: string) => void;
    openFile: (file: MyFile) => void;
}



export const ResumeEditor = (props: ResumeEditorProps) => {

    const [cacheValue, setCacheValue] = useState<string>();
    const [key, setKey] = useState<number>(0);

    useEffect(() => {
        if (props.fileOpen) {
            setCacheValue(props.fileOpen.contentString)
            setKey(key + 1)
        }
    }, [props.fileOpen])


    const fileEdit = (value: string | undefined, ev: editor.IModelContentChangedEvent) => {
        setCacheValue(value)
    }

    const fileSwitch = async (fileToOpen: MyFile) => {
        if (props.fileOpen == fileToOpen)
            return

        if (props.fileOpen) {
            props.applyChange(cacheValue, props.fileOpen.filename, props.fileOpen.path)
        }

        props.openFile(fileToOpen)
        // setCacheValue(await fileToOpen.data.text())
        // setOpenFile(fileToOpen)
        setKey(key + 1)
    }

    const renderFolder = (files: MyFile[]): JSX.Element => {
        return <>
            {files?.map(el => <div
                onClick={(e) => fileSwitch(el)}
                // selected={false}
                key={el.path + el.filename}
            >
                {/* <ListItemIcon>
                                    <InsertDriveFile fontSize="small"/>
                                </ListItemIcon> */}
                <p>
                    {el.filename}
                </p>
            </div>)
            }
        </>
    }


    return <>
        <Container>
            <HStack spacing={"20px"} align={"flex-start"}>
                <Box w="200px">
                    <UnorderedList style={{ paddingTop: "1rem" }}>
                        {renderFolder(props.fileList)}
                        <Dropzone onDrop={acceptedFiles => {
                            acceptedFiles.forEach(async af => props.applyChange(await af.text(), af.name, ""))
                        }}>
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    </UnorderedList>
                </Box>

                <Box flex={1}>
                    <Editor
                        key={key}
                        height="90vh"
                        defaultLanguage="latex"
                        defaultValue={cacheValue ?? ""}
                        theme="vs-dark"
                        onChange={fileEdit}
                        width="400px"
                    />
                </Box>


            </HStack>
        </Container>

    </>
        ;
}

