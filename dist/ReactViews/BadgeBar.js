import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useTheme } from "styled-components";
import { TextSpan } from "../Styled/Text";
const Box = require("../Styled/Box").default;
const BadgeBar = (props) => {
    const theme = useTheme();
    return (_jsxs(Box, { paddedHorizontally: 3, justifySpaceBetween: true, whiteSpace: "nowrap", styledMinHeight: "40px", verticalCenter: true, css: `
        border-top: 1px solid ${theme.darkWithOverlay};
        border-bottom: 1px solid ${theme.darkWithOverlay};
      `, children: [_jsxs(TextSpan, { textLight: true, uppercase: true, overflowHide: true, overflowEllipsis: true, children: [props.label, " ", props.badge ? `(${props.badge})` : null] }), _jsx(Box, { styledMaxWidth: "60%", css: `
          gap: 15px;
        `, children: props.children })] }));
};
export default BadgeBar;
//# sourceMappingURL=BadgeBar.js.map