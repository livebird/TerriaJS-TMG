import isDefined from "../../Core/isDefined";
export const DEFAULT_PLACEMENT = "default";
export const isEnum = (dim) => dim.type === "select" || dim.type === undefined;
/** Return only SelectableDimensionSelect from array of SelectableDimension */
export const filterEnums = (dims) => dims.filter(isEnum);
export const isGroup = (dim) => dim.type === "group";
export const isNumeric = (dim) => dim.type === "numeric";
export const isText = (dim) => dim.type === "text";
export const isButton = (dim) => dim.type === "button";
export const isCheckbox = (dim) => dim.type === "checkbox";
export const isCheckboxGroup = (dim) => dim.type === "checkbox-group";
export const isColor = (dim) => dim.type === "color";
const isCorrectPlacement = (placement) => (dim) => dim.placement
    ? dim.placement === placement
    : placement === DEFAULT_PLACEMENT;
const isEnabled = (dim) => !dim.disable;
/** Filter out dimensions with only 1 option (unless they have 1 option and allow undefined - which is 2 total options) */
const enumHasValidOptions = (dim) => {
    const minLength = dim.allowUndefined ? 1 : 2;
    return isDefined(dim.options) && dim.options.length >= minLength;
};
/** Filter with SelectableDimension should be shown for a given placement.
 * This will take into account whether SelectableDimension is valid, not disabled, etc...
 */
export const filterSelectableDimensions = (placement) => (selectableDimensions = []) => selectableDimensions.filter((dim) => 
// Filter by placement if defined, otherwise use default placement
(!isDefined(placement) || isCorrectPlacement(placement)(dim)) &&
    isEnabled(dim) &&
    // Check enum (select and checkbox) dimensions for valid options
    ((!isEnum(dim) && !isCheckbox(dim)) || enumHasValidOptions(dim)) &&
    // Only show groups if they have at least one SelectableDimension
    (!isGroup(dim) || dim.selectableDimensions.length > 0));
/** Find human readable name for the current value for a SelectableDimension */
export const findSelectedValueName = (dim) => {
    var _a, _b, _c;
    if (isCheckbox(dim)) {
        return dim.selectedId === "true" ? "Enabled" : "Disabled";
    }
    if (isEnum(dim)) {
        return (_b = (_a = dim.options) === null || _a === void 0 ? void 0 : _a.find((opt) => opt.id === dim.selectedId)) === null || _b === void 0 ? void 0 : _b.name;
    }
    if (isNumeric(dim)) {
        return (_c = dim.value) === null || _c === void 0 ? void 0 : _c.toString();
    }
    if (isText(dim))
        return dim.value;
};
var SelectableDimensions;
(function (SelectableDimensions) {
    function is(model) {
        return "selectableDimensions" in model;
    }
    SelectableDimensions.is = is;
})(SelectableDimensions || (SelectableDimensions = {}));
export default SelectableDimensions;
//# sourceMappingURL=SelectableDimensions.js.map