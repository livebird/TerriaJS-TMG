import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import PropTypes from "prop-types";
import Styles from "./guidance-dot.scss";
export const GuidanceDot = ({ onClick }) => {
    return (_jsxs("button", { className: Styles.oval, onClick: onClick, children: [_jsx("div", { className: Styles.innerClone }), _jsx("div", { className: Styles.inner })] }));
};
GuidanceDot.propTypes = {
    onClick: PropTypes.func.isRequired
};
export default GuidanceDot;
//# sourceMappingURL=GuidanceDot.js.map