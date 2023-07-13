import { AddIcon, AttachmentIcon } from '@chakra-ui/icons';
import { HStack, Modal, ModalContent, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react";
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
            <ModalHeader>Select resume</ModalHeader>
            <VStack>
                {props.resumes?.map(resume =>
                    <HStack onClick={(e) => props.resumeClick(resume)}>
                        <AttachmentIcon />
                        <p>{resume.name ?? resume.id}</p>
                    </HStack>
                )}
                <HStack w='100px' onClick={(e) => props.openCreationEditor()}>
                    <AddIcon />
                    <p>{"Add new"}</p>
                </HStack>
            </VStack>
        </ModalContent>
    </Modal>}</>
}