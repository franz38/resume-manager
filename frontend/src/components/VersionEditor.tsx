import { useEffect, useState } from "react";

import { FileEditor } from "./FileEditor";

import { Box, Button, Container, Flex, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Step, StepDescription, StepIcon, StepIndicator, StepNumber, Stepper, StepSeparator, StepStatus, StepTitle, Textarea, useDisclosure, useSteps } from "@chakra-ui/react";
import { Root, Version, VersionCreate, VersionsService } from "../api";
import { Delta, MyFile } from "../versionControl/types";
import { getDeltaString, applyDelta } from "../versionControl/applyDelta";
import { getDelta } from "../versionControl/getDelta";


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


export const VersionEditor = (props: EditorStepperProps) => {

    const [deltas, setDeltas] = useState<Delta[]>([]);
    const [version, setVersion] = useState<VersionCreate>()
    const [selectedFile, setSelectedFile] = useState<MyFile>();
    const [fileLoading, setFileLoading] = useState<boolean>(false);

    useEffect(() => {

        if (props.parentVersion) {

            const version_init: VersionCreate = {
                resumeid: props.parentVersion.resumeid,
                parentid: props.parentVersion.id,
                deltas: undefined
            }
            setVersion(version_init)
            setDeltas(getLegacyDeltas().map(d => ({ ...d, added: {}, removed: {} })))
        }

    }, [props])

    const getLegacyDeltas = (): Delta[] => props.parentVersion?.deltas as Delta[] ?? []


    const selectFile = (filename: string, path: string) => {
        const parentDelta: Delta = getLegacyDeltas().find(d => d.filename == filename && d.path == path)
        let initialString = parentDelta ? getDeltaString(parentDelta) : ""

        const currentDelta: Delta = deltas.find(d => d.filename == filename && d.path == path)

        const file: MyFile = {
            contentString: applyDelta(initialString, currentDelta.removed, currentDelta.added),
            filename: filename,
            path: path
        }
        setSelectedFile(file)
    }

    const makeChange = (content: string, filename: string, path: string) => {
        setFileLoading(true)
        let delta: Delta;

        // edit to a file
        if (getLegacyDeltas().some(file => file.filename == filename && file.path == path)) {
            const originalDelta: Delta = getLegacyDeltas().find(file => file.filename == filename && file.path == path)

            delta = {
                ...getDelta(getDeltaString(originalDelta), content),
                filename: filename,
                path: path
            }

        }
        // new file created
        else {
            delta = {
                ...getDelta("", content),
                filename: filename,
                path: path,
            }
        }

        let newDeltas: Delta[];
        if (deltas.some(d => (d.filename == filename && d.path == path)))
            newDeltas = deltas.map(d => (d.filename == filename && d.path == path) ? delta : d)
        else
            newDeltas = [...deltas, delta]

        setDeltas(newDeltas)
        setFileLoading(false)
    }


    const submit = async () => {
        setFileLoading(true)

        const newVersion = await VersionsService.postVersionApiV1VersionsPost({ ...version, deltas: deltas })
        props.addVersion(newVersion)

        setFileLoading(false)
    }


    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: 2,
    })

    return <Modal isOpen={props.open} onClose={() => { }} size='xl'>
        <ModalOverlay />
        <ModalContent minWidth={"fit-content"} maxW={"800px"}>
            <ModalHeader>Edit resume</ModalHeader>
            <ModalCloseButton onClick={() => props.addVersion(undefined)} />
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
                                {/* <StepDescription>{"step.description"}</StepDescription> */}
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
                                {/* <StepDescription>{"step.description"}</StepDescription> */}
                            </Box>

                            <StepSeparator />
                        </Step>

                    </Stepper>
                </Container>


                {activeStep == 0 && <>
                    <Box>
                        <Flex>
                            <Box w={"50%"}>
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        onChange={(e) => setVersion({ ...version, name: (e.target).value })}
                                        value={version?.name ?? ""}></Input>
                                </FormControl>
                            </Box>
                            <Box w={"50%"}></Box>
                        </Flex>

                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                onChange={e => setVersion({ ...version, description: (e.target).value })}
                                value={version?.description ?? ""} />
                        </FormControl>
                    </Box>
                </>}

                {activeStep == 1 && <>
                    <FileEditor
                        fileList={deltas.map(d => ({ filename: d.filename, path: d.path }))}
                        applyChange={makeChange}
                        fileOpen={selectedFile}
                        openFile={file => selectFile(file.filename, file.path)} />
                </>}
            </ModalBody>

            <ModalFooter>
                {activeStep == 0 && <>
                    <Button colorScheme={"blue"} onClick={() => setActiveStep(1)}>Next</Button>
                </>}
                {activeStep == 1 && <Flex w="100%" justifyContent={"space-between"}>
                    <Button onClick={() => setActiveStep(0)}>Indietro</Button>
                    <Button colorScheme={"blue"} onClick={() => submit()} isLoading={fileLoading}>Save</Button>
                </Flex>}
            </ModalFooter>

        </ModalContent>
    </Modal>
}