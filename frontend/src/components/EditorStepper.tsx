import { useEffect, useState } from "react";

import { ResumeEditor } from "./ResumeEditor";

import { Box, Button, Input, Modal, ModalBody, ModalContent, ModalHeader, Step, StepDescription, StepIndicator, Stepper, StepSeparator, StepStatus, StepTitle, useDisclosure, useSteps } from "@chakra-ui/react";
import { Root, Version, VersionCreate, VersionsService } from "../api";
import { applyDelta, Delta, getDelta, MyFile } from "../types/delta";

interface EditorStepperProps {
    resume: Root;
    parentVersion: Version;
    addVersion: (v: Version) => void;
    mode: EditorMode;
    open: boolean;
}

export enum EditorMode {
    HIDDEN,
    EDITING,
    CREATING
}


export const EditorStepper = (props: EditorStepperProps) => {

    const [deltas, setDeltas] = useState<Delta[]>([]);
    const [files, setFiles] = useState<MyFile[]>([]);
    const [version, setVersion] = useState<VersionCreate>()
    const [selectedFile, setSelectedFile] = useState<MyFile>();

    const { isOpen, onOpen, onClose } = useDisclosure({ isOpen: props.open })


    useEffect(() => {

        if (props.parentVersion) {
            const files__ = props.parentVersion.deltas
            console.log(files__);

            const version_init: VersionCreate = {
                resumeid: props.parentVersion.resumeid,
                parentid: props.parentVersion.id,
                deltas: undefined
            }
            setVersion(version_init)

            setFiles((props.parentVersion.deltas as Delta[]).map(delta => applyDelta({ contentString: "", filename: delta.filename, path: delta.path }, delta.content)))
        }

        // setDeltaGroup({
        //     id: "fdsfdsf",
        //     deltas: []
        // })
    }, [props])


    const selectFile = (filename: string, path: string) => {
        const file: MyFile = files.find(f => f.filename == filename && f.path == path)
        const delta: Delta = deltas.find(d => d.filename == filename && d.path == path)
        setSelectedFile(applyDelta(file, delta.content))
    }

    const makeChange = (content: string, filename: string, path: string) => {
        let delta: Delta;

        if (deltas.some(file => file.filename == filename && file.path == path)) {
            const currentDelta: Delta = deltas.find(file => file.filename == filename && file.path == path)
            const currentFile: MyFile = files.find(file => file.filename == filename && file.path == path)

            const updatedFile: MyFile = currentFile //applyDelta(currentFile, currentDelta.content)

            delta = {
                ...currentDelta,
                content: getDelta(updatedFile.contentString, content)
            }

            const newDeltas = deltas.map(d => (d.filename == filename && d.path == path) ? delta : d)
            setDeltas(newDeltas)
        }
        else {
            delta = {
                filename: filename,
                path: path,
                content: getDelta("", content)
            }
            const file: MyFile = {
                filename: filename,
                path: path,
                contentString: ""
            }
            setFiles([...files, file])
            setDeltas([...deltas, delta])
        }
    }


    const submit = async () => {
        let resumeCreated

        if (props.mode == EditorMode.CREATING) {

            const aa = await VersionsService.postVersionApiV1VersionsPost({ ...version, deltas: deltas })



        }
        else {
            // resumeCreated = await ResumeService.getInstance().postVersionApiV1VersionsPost(tmpResume as VersionCreate)
            // resumeCreated = await VersionsService.postVersionApiV1VersionsPost(tmpResume)
        }
        if (resumeCreated)
            props.addVersion(resumeCreated)
    }


    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: 2,
    })

    return <Modal isOpen={props.open} onClose={onClose} size='xl'>
        <ModalContent minWidth={"fit-content"}>
            <ModalHeader>Edit resume</ModalHeader>
            <ModalBody>

                <Stepper index={activeStep}>

                    <Step key={0}>
                        <StepIndicator>
                            <StepStatus
                            // complete={<StepIcon />}
                            // incomplete={<StepNumber />}
                            // active={<StepNumber />}
                            />
                        </StepIndicator>

                        <Box flexShrink='0'>
                            <StepTitle>{"Resume configuration"}</StepTitle>
                            <StepDescription>{"step.description"}</StepDescription>
                        </Box>

                        <StepSeparator />
                    </Step>

                    <Step key={1}>
                        <StepIndicator>
                            <StepStatus
                            // complete={<StepIcon />}
                            // incomplete={<StepNumber />}
                            // active={<StepNumber />}
                            />
                        </StepIndicator>

                        <Box flexShrink='0'>
                            <StepTitle>{"Resume edit"}</StepTitle>
                            <StepDescription>{"step.description"}</StepDescription>
                        </Box>

                        <StepSeparator />
                    </Step>

                </Stepper>

                {activeStep == 0 && <>
                    <Box>
                        <Input placeholder="New version name" onChange={(a) => setVersion({ ...version, name: (a.target).value })}></Input>
                        <Button variant="contained" onClick={() => setActiveStep(1)}>Next</Button>
                    </Box>
                </>}

                {activeStep == 1 && <>
                    <ResumeEditor
                        fileList={files}
                        applyChange={makeChange}
                        fileOpen={selectedFile}
                        openFile={file => selectFile(file.filename, file.path)} />

                    <Button variant="contained" onClick={() => submit()}>Save</Button>
                </>}
            </ModalBody>
        </ModalContent>
    </Modal>
}