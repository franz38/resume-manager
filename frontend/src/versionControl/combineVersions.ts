import { Version } from "../api";
import { getDeltaString, applyDelta } from "./applyDelta";
import { getDelta } from "./getDelta";
import { Delta } from "./types";

export const combineVersions = (versions: Version[]): Version[] => {
  let parentVersion: Version = versions[0];
  const initialFiles = {};

  (parentVersion.deltas as Delta[]).forEach((d) => {
    initialFiles[d.path + d.filename] = getDeltaString(d);
  });

  const integrated: Version[] = versions.slice(1).map((version) => {
    const ideltas: Delta[] = [];
    (version.deltas as Delta[]).forEach((d) => {
      if (!initialFiles[d.path + d.filename])
        initialFiles[d.path + d.filename] = "";

      const newval = applyDelta(
        initialFiles[d.path + d.filename],
        d.removed,
        d.added,
      );

      const integratedDelta: Delta = getDelta("", newval);
      integratedDelta.filename = d.filename;
      integratedDelta.path = d.path;

      ideltas.push(integratedDelta);
      initialFiles[d.path + d.filename] = newval;
    });
    return {
      ...version,
      deltas: ideltas,
    };
  });

  return [parentVersion, ...integrated];
};
