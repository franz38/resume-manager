import React from "react";
import { Add, InsertDriveFile } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, Button, Grid } from "@mui/material";
import { RootMinimal } from "../api";


interface ResumeSelectorProps {
    resumes: RootMinimal[];
    openCreationEditor: () => void;
    resumeClick: (resume: RootMinimal) => void;
}

export const ResumeSelector = (props: ResumeSelectorProps) => {

    return <>{props.resumes && <Dialog open>
        <DialogTitle>Select resume</DialogTitle>

        <DialogContent>

            <Grid container spacing={1}>
                {props.resumes?.map(resume => 
                    <Grid item xs={4} key={resume.id}>
                        <div onClick={(e) => props.resumeClick(resume)}>
                            <InsertDriveFile />
                            <p>{resume.name}</p>
                        </div>
                    </Grid>
                )}
                <Grid item xs={4}>
                    <div onClick={(e) => props.openCreationEditor()}>
                        <Add />
                        <p>{"Add new"}</p>
                    </div>
                </Grid>
            </Grid>

        </DialogContent>
    </Dialog>}</>
}