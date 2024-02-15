import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * <Guidance /> is the (currently unused) "in app tour" where we have the dots,
 * whereas <Guide /> is the generic "slider/static tour"
 */
import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import Styles from "./guidance.scss";
import Text from "../../Styled/Text";
import GuidanceDot from "./GuidanceDot.jsx";
const GuidanceProgress = (props) => {
    const countArray = Array.from(Array(props.max).keys()).map((e) => e++);
    const countStep = props.step;
    return (_jsx("div", { className: Styles.indicatorWrapper, children: countArray.map((count) => {
            return (_jsx("div", { className: classNames(Styles.indicator, {
                    [Styles.indicatorEnabled]: count < countStep
                }) }, count));
        }) }));
};
GuidanceProgress.propTypes = {
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired
};
const GuidanceContextModal = ({ children }) => {
    const { t } = useTranslation();
    return (_jsxs("div", { className: Styles.context, children: [_jsx(Text, { tallerHeight: true, children: children }), _jsx("button", { className: Styles.btn, children: t("general.next") }), t("general.skip"), _jsx(GuidanceProgress, { step: 2, max: 4 })] }));
};
GuidanceContextModal.propTypes = {
    children: PropTypes.node.isRequired
};
export const Guidance = ({ children }) => {
    const [showGuidance, setShowGuidance] = useState(false);
    return (_jsxs("div", { className: Styles.guidance, children: [_jsx(GuidanceDot, { onClick: () => setShowGuidance(!showGuidance) }), showGuidance && _jsx(GuidanceContextModal, { children: children })] }));
};
Guidance.propTypes = {
    children: PropTypes.node.isRequired
};
export default Guidance;
//# sourceMappingURL=Guidance.js.map