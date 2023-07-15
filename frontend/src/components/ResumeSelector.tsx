import { AddIcon, AttachmentIcon } from '@chakra-ui/icons';
import { Button, Modal, ModalContent, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react";
import { Root } from "../api";

interface ResumeSelectorProps {
    resumes: Root[];
    openCreationEditor: () => void;
    resumeClick: (resume: Root) => void;
    isOpen: boolean;
}

export const ResumeSelector = (props: ResumeSelectorProps) => {

    // const { isOpen, onOpen, onClose } = useDisclosure({isOpen: props.open})

    return <>{props.resumes && <Modal isOpen={props.isOpen} onClose={() => { }}>
        {/* <DialogTitle>Select resume</DialogTitle> */}
        <ModalOverlay />
        <ModalContent>
            <ModalHeader alignSelf={"center"}>Select resume</ModalHeader>
            <VStack spacing={"16px"} padding={"16px"}>
                {props.resumes?.map(resume =>
                    <Button
                        variant={"ghost"}
                        colorScheme={"gray"}
                        leftIcon={<AttachmentIcon />}
                        w={"100%"}
                        width={"100%"}
                        justifyContent={"start"}
                        onClick={() => { props.resumeClick(resume) }}
                        key={resume.id}
                    >{resume.name ?? resume.id}</Button>
                )}
                <Button
                    colorScheme={"blue"}
                    leftIcon={<AddIcon />}
                    width={"100%"}
                    onClick={(e) => props.openCreationEditor()}
                >Add a resume</Button>
            </VStack>
        </ModalContent>
    </Modal>}</>
}