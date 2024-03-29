import { BaseModel } from "./Definition/Model";
/**
 * Return the ancestors in the data catalog of the given catalog member,
 * recursively using "member.knownContainerUniqueIds". The "Root Group" is
 * not included.
 *
 * @param  member The catalog member.
 * @return The members' ancestors in its parent tree, starting at the top, not including this member.
 */
export default function getAncestors(member) {
    const result = [];
    // For some reasons without getModelById, the knownContainerUniqueIds is always [],
    // which is why previously it would seem as though the groups don't have ancestors.
    let currentModel = (member === null || member === void 0 ? void 0 : member.uniqueId)
        ? member.terria.getModelById(BaseModel, member.uniqueId)
        : member;
    for (;;) {
        const parentId = currentModel && currentModel.knownContainerUniqueIds.length > 0
            ? currentModel.knownContainerUniqueIds[0]
            : undefined;
        if (parentId === undefined)
            break;
        currentModel = member.terria.getModelById(BaseModel, parentId);
        if (currentModel && currentModel.knownContainerUniqueIds.length > 0) {
            result.splice(0, 0, currentModel);
        }
    }
    return result;
}
//# sourceMappingURL=getAncestors.js.map