import { useEffect, useState } from "react";

import { ResumeEditor } from "./FileEditor";

import { Box, Button, Container, FormControl, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Step, StepDescription, StepIcon, StepIndicator, StepNumber, Stepper, StepSeparator, StepStatus, StepTitle, Textarea, useDisclosure, useSteps } from "@chakra-ui/react";
import { Root, Version, VersionCreate, VersionsService } from "../api";
import { applyDelta, Delta, getDelta, getDeltaString, MyFile } from "../types/delta";

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
    // const [files, setFiles] = useState<MyFile[]>([]);
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
            setDeltas((props.parentVersion.deltas as Delta[]).map(d => ({ ...d, content: {} })))
            // setFiles((props.parentVersion.deltas as Delta[]).map(delta => applyDelta({ contentString: "", filename: delta.filename, path: delta.path }, delta.content)))
        }

        // setDeltaGroup({
        //     id: "fdsfdsf",
        //     deltas: []
        // })
    }, [props])



    const selectFile = (filename: string, path: string) => {
        let initialString = ""
        if ((props.parentVersion.deltas as Delta[]).find(d => d.filename == filename && d.path == path))
            initialString = getDeltaString((props.parentVersion.deltas as Delta[]).find(d => d.filename == filename && d.path == path))
        const currentDelta: Delta = deltas.find(d => d.filename == filename && d.path == path)
        const file: MyFile = {
            contentString: applyDelta(initialString, currentDelta.content),
            filename: filename,
            path: path
        }
        setSelectedFile(file)
    }

    const makeChange = (content: string, filename: string, path: string) => {
        let delta: Delta;

        if (deltas.some(file => file.filename == filename && file.path == path)) {
            const currentDelta: Delta = deltas.find(file => file.filename == filename && file.path == path)


            delta = {
                ...currentDelta,
                content: getDelta(getDeltaString(currentDelta), content)
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
        <ModalOverlay />
        <ModalContent minWidth={"fit-content"} maxW={"800px"}>
            <ModalHeader>Edit resume</ModalHeader>
            <ModalBody>

                <Container maxW={"md"} padding="1rem 0px 2rem 0px">
                    <Stepper index={activeStep}>

                        <Step key={0}>
                            <StepIndicator>
                                <StepStatus
                                    complete={<StepIcon />}
                                    incomplete={<StepNumber />}
                                    active={<StepNumber />}
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
                                    complete={<StepIcon />}
                                    incomplete={<StepNumber />}
                                    active={<StepNumber />}
                                />
                            </StepIndicator>

                            <Box flexShrink='0'>
                                <StepTitle>{"Resume edit"}</StepTitle>
                                <StepDescription>{"step.description"}</StepDescription>
                            </Box>

                            <StepSeparator />
                        </Step>

                    </Stepper>
                </Container>


                {activeStep == 0 && <>
                    <Box>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input onChange={(e) => setVersion({ ...version, name: (e.target).value })}></Input>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea onChange={e => setVersion({ ...version, description: (e.target).value })} />
                        </FormControl>
                    </Box>
                </>}

                {activeStep == 1 && <>
                    <ResumeEditor
                        fileList={deltas.map(d => ({ filename: d.filename, path: d.path }))}
                        applyChange={makeChange}
                        fileOpen={selectedFile}
                        openFile={file => selectFile(file.filename, file.path)} />
                </>}
            </ModalBody>

            <ModalFooter>
                {activeStep == 0 && <Button colorScheme={"blue"} onClick={() => setActiveStep(1)}>Next</Button>}
                {activeStep == 1 && <Button colorScheme={"blue"} onClick={() => submit()}>Save</Button>}
            </ModalFooter>

        </ModalContent>
    </Modal>
}