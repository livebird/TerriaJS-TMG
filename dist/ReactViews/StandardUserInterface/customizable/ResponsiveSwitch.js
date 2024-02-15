import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import PropTypes from "prop-types";
/**
 * Higher-order component that either shows a one element or the other, depending on whether the "smallScreen" prop
 * passed to it is true or false.
 */
export default (LargeScreenComponent, SmallScreenComponent) => {
    // eslint-disable-next-line require-jsdoc
    function ResponsiveSwitch(props) {
        return props.smallScreen ? (_jsx(SmallScreenComponent, { ...props })) : (_jsx(LargeScreenComponent, { ...props }));
    }
    ResponsiveSwitch.propTypes = {
        smallScreen: PropTypes.bool
    };
    return ResponsiveSwitch;
};
//# sourceMappingURL=ResponsiveSwitch.js.map