import isDefined from "./isDefined";
export default function arraysAreEqual(left, right) {
    if (left === right) {
        return true;
    }
    if (!isDefined(left) || !isDefined(right) || left.length !== right.length) {
        return false;
    }
    for (let i = 0; i < left.length; ++i) {
        if (left[i] !== right[i]) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=arraysAreEqual.js.map