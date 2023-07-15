import * as d3 from 'd3';
import { useEffect, useRef, useState } from "react";
import { OpenAPI, Root, RootService, Version, VersionsService } from "../api";
import { BuildVersionTree, VersionTree } from "../types/versionTree";
import { EditorMode, VersionEditor } from "./VersionEditor";
import { ResumeSelector } from "./ResumeSelector";
import { combineVersions } from '../versionControl/combineVersions';

OpenAPI.BASE = 'http://localhost:8000';

interface ResumeShortExtended extends VersionTree {
    x: number;
    y: number;
}

export const Canvas = () => {

    const canvasRef = useRef<HTMLInputElement>(null);

    const [resumes, setResumes] = useState<Root[]>();
    const [selectedResume, setSelectedResume] = useState<Root>()
    const [versions, setVersions] = useState<Version[]>([])
    const [selectedVersion, setSelectedVersion] = useState<Version>();
    const [editPanel, setEditPanel] = useState<EditorMode>(EditorMode.HIDDEN);

    // resume selector
    // const { isRSOpen, onRSOpen, onRSClose } = useDisclosure()

    const drawChart = async () => {

        const svg = d3.select(canvasRef.current).select("svg")
        const svgNode = svg.node() as SVGGraphicsElement

        if (versions.length == 0)
            return

        const data: VersionTree = BuildVersionTree(versions)

        // Create the cluster layout:
        var cluster = d3.tree<VersionTree>()
            .nodeSize([150, 150])
            .separation(function (a, b) {
                return a.parent == b.parent ? 1 : 1;
            });


        // Give the data to this cluster layout:
        var root = d3.hierarchy<VersionTree>(data, function (d) {
            return d.children;
        });
        cluster(root);

        const x1 = Math.min(...root.descendants().map((el: any) => (el.x as number)))
        const x2 = Math.max(...root.descendants().map((el: any) => (el.x as number)))
        const y1 = Math.min(...root.descendants().map((el: any) => (el.y as number)))
        const y2 = Math.max(...root.descendants().map((el: any) => (el.y as number)))
        console.log(x1, x2)
        const w = Math.max(x2 - x1 + 120, 900)
        const h = y2 - y1 + 48


        svg.attr("viewBox", (Math.min(x1, -450) - 50) + " " + "-50" + " " + (w + 100) + " " + (h + 100))

        svg.select("rect#background1").attr("transform", "translate(" + (x1 - 50) + " " + "-150" + ")")
        svg.select("rect#background2").attr("transform", "translate(" + (x1 - 50) + " " + "-150" + ")")

        console.log(root.descendants().slice(1))

        // Add the links between nodes:
        svg.selectAll<SVGPathElement, VersionTree>('path')
            .data<any>(root.descendants().slice(1), d => d.data.id)
            .enter()
            .append('path')
            .attr("d", function (d) {
                return "M" + (d.x + 60) + "," + d.y
                    + "C" + (d.x + 60) + "," + (d.y - 48)
                    + " " + (d.parent.x + 60) + "," + (d.parent.y + 96)
                    + " " + (d.parent.x + 60) + "," + (d.parent.y + 48);
            })
            .style("fill", 'none')
            .attr("stroke", '#ccc')
            .attr("stroke-width", "2")
            .transition()
            .duration(1000)

        const canvasItems = svg.selectAll<SVGPathElement, VersionTree>("g.canvasItem")
            .data<any>(root.descendants(), d => d.data.id)
            .enter()
            .append("g")
            .attr("class", "canvasItem")
            .attr("transform", (d: any) => `translate(${d.x},${d.y})`)

        // .on("click", (d: any, x: any) => {selectResume({...d.target.__data__.data, x: d.target.__data__.x, y: d.target.__data__.y}); console.log(x)})
        // .attr("y", (d: any) => d.y)


        canvasItems.append("rect")
            .attr("class", "item-box")
            .attr("width", "120")
            .attr("height", "48")
            .attr("rx", 10)


        canvasItems.append("circle")
            .attr("r", "4")
            .attr("cy", "48")
            .attr("cx", "60")
            .attr("fill", "gray")
            .attr("stroke", "#fff")

        const addButtons = canvasItems.append("g")
            .attr("transform", "translate(25 0)")
            .on("click", (a, b) => { setSelectedVersion(b.data); setEditPanel(EditorMode.EDITING) })

        addButtons.append("circle")
            .attr("class", "button")
            .attr("r", "10")
            .attr("cy", "0")
            .attr("cx", "0")

        addButtons.append("path")
            .attr("d", "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z")
            .attr("fill", "#fff")
            .attr("transform", "translate(-11 -11) scale(0.9)")

        const viewButton = canvasItems.append("g")
            .attr("transform", "translate(50 0)")
            .on("click", (a, b) => { setSelectedVersion(b.data); setEditPanel(EditorMode.EDITING) })

        viewButton.append("circle")
            .attr("class", "button")
            .attr("r", "10")
            .attr("cy", "0")
            .attr("cx", "0")

        viewButton.append("path")
            .attr("d", "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z")
            .attr("fill", "#fff")
            .attr("transform", "translate(-9 -9) scale(0.7)")

        canvasItems.append("text")
            .attr("dy", 30)
            .attr("dx", 10)
            .text(d => d.data.name ?? d.data.id ?? "")

    }


    const fetchResume = async (resumeBase: Root) => {
        let versions = await VersionsService.getVersionApiV1VersionsResumeIdGet(resumeBase.id)
        versions = combineVersions(versions)
        setSelectedResume(resumeBase)
        setVersions(versions)
    }

    useEffect(() => {
        RootService.getResumesApiV1RootsGet().then(resumes_ => {
            setResumes(resumes_)
        })
    }, []);

    useEffect(() => {
        drawChart()
    }, [versions])

    const closeEditor = (createdVersion: Version | undefined) => {

        if (!createdVersion) {
            setEditPanel(EditorMode.HIDDEN)
            return
        }

        if (editPanel == EditorMode.CREATING)
            setVersions([createdVersion])
        else if (editPanel == EditorMode.EDITING)
            setVersions([...versions, createdVersion])
        setEditPanel(EditorMode.HIDDEN)
    }

    return <>

        <div ref={canvasRef} className={"canvas"} >
            <svg width="100vw" height="100vh">
                <defs>
                    <pattern id="svg-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="translate(30, 30) rotate(0) skewX(0)">
                        <svg width="5" height="5" viewBox="0 0 60 60"><g fill="#efefef" opacity="1">
                            <circle cx="50" cy="50" r="50"></circle></g>
                        </svg>
                    </pattern>
                </defs>
                <rect id="background1" x="0" y="0" width="100%" height="100%" fill="#f5f5f5"></rect>
                <rect id="background2" x="0" y="0" width="100%" height="100%" fill="url(#svg-pattern)"></rect>
            </svg>
        </div>

        <VersionEditor
            open={editPanel != EditorMode.HIDDEN}
            addVersion={v => closeEditor(v)}
            resume={selectedResume}
            mode={editPanel}
            parentVersion={selectedVersion}
        />

        <ResumeSelector
            isOpen={!(selectedResume || editPanel != EditorMode.HIDDEN)}
            resumes={resumes}
            openCreationEditor={() => setEditPanel(EditorMode.CREATING)}
            resumeClick={resume => fetchResume(resume)}
        />

    </>
}