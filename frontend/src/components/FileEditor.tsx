import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEffect, useState } from "react";
import { Box, Button, Container, HStack, UnorderedList, VStack, Text, Flex } from "@chakra-ui/react";
import Dropzone from 'react-dropzone';
import { MyFile } from "../types/delta";
import { CopyIcon } from "@chakra-ui/icons";


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

interface FileMeta {
    filename: string,
    path: string
}

interface ResumeEditorProps {
    fileList: FileMeta[];
    fileOpen: MyFile;
    applyChange: (content: string, filename: string, path: string) => void;
    openFile: (file: FileMeta) => void;
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

    const renderFolder = (files: FileMeta[]): JSX.Element => {
        return <>
            {files?.map(el => <Box><Button
                variant={"ghost"}
                colorScheme={"gray"}
                leftIcon={<CopyIcon />}
                w={"100%"}
                width={"100%"}
                justifyContent={"start"}
                onClick={() => props.openFile(el)}
                key={el.filename + el.path}
            >{el.filename}</Button></Box>
            )
            }
        </>
    }


    return <>
        <HStack spacing={"20px"} align={"flex-start"}>
            <Flex direction={"column"} style={{ paddingTop: "1rem" }} w="250px" height={"100%"}>
                {renderFolder(props.fileList)}

                <Box flexGrow={1} style={{ padding: "0px 1rem" }} justifyContent={"stretch"}>
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
                </Box>

            </Flex>

            <Box flex={1}>
                <Editor
                    key={key}
                    height="90vh"
                    defaultLanguage="latex"
                    defaultValue={cacheValue ?? ""}
                    theme="vs-dark"
                    onChange={fileEdit}
                    width="100%"
                />
            </Box>


        </HStack>
    </>
        ;
}

