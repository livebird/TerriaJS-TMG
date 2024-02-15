import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import Styles from "./fade-in.scss";
export function SlideUpFadeIn({ isVisible, children, onEnter = () => { }, onExited = () => { }, transitionProps }) {
    return (_jsx(CSSTransition, { in: isVisible, timeout: 300, classNames: { ...Styles }, unmountOnExit: true, onEnter: onEnter, onExited: onExited, ...transitionProps, children: children }));
}
SlideUpFadeIn.propTypes = {
    children: PropTypes.node.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
    transitionProps: PropTypes.object
};
export default SlideUpFadeIn;
//# sourceMappingURL=FadeIn.js.map