import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import Checkbox from "./../../../Styled/Checkbox/Checkbox";
import { useTheme } from "styled-components";
import Spacing from "../../../Styled/Spacing";
import { TextSpan } from "../../../Styled/Text";
const DisplayAsPercentSection = (props) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const togglePercentage = () => {
        props.item.displayPercent = !props.item.displayPercent;
    };
    if (!props.item.canDisplayPercent) {
        return null;
    }
    return (_jsxs(_Fragment, { children: [_jsx(Spacing, { bottom: 2 }), _jsx(Checkbox, { id: "workbenchDisplayPercent", isChecked: props.item.displayPercent, onChange: togglePercentage, children: _jsx(TextSpan, { children: t("workbench.displayPercent") }) })] }));
};
DisplayAsPercentSection.displayName = "DisplayAsPercentSection";
export default DisplayAsPercentSection;
//# sourceMappingURL=DisplayAsPercentSection.js.map