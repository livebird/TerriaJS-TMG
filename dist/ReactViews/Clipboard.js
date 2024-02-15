import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import clipboard from "clipboard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Box from "../Styled/Box";
import Button from "../Styled/Button";
import { verticalAlign } from "../Styled/mixins";
import Spacing from "../Styled/Spacing";
import Icon, { StyledIcon } from "../Styled/Icon";
var CopyStatus;
(function (CopyStatus) {
    CopyStatus[CopyStatus["Success"] = 0] = "Success";
    CopyStatus[CopyStatus["Error"] = 1] = "Error";
    CopyStatus[CopyStatus["NotCopiedOrWaiting"] = 2] = "NotCopiedOrWaiting"; // Copy button hasn't been clicked or clipboard.js hasn't copied the data yet
})(CopyStatus || (CopyStatus = {}));
const Clipboard = (props) => {
    const { id, source, theme, rounded } = props;
    const { t } = useTranslation();
    const [status, setStatus] = useState(CopyStatus.NotCopiedOrWaiting);
    useEffect(() => {
        // Setup clipboard.js and show a tooltip on copy success or error for 3s
        const clipboardBtn = new clipboard(`.btn-copy-${id}`);
        let timerId = null;
        function removeTimeout() {
            if (timerId !== null) {
                clearTimeout(timerId);
                timerId = null;
            }
        }
        function resetTooltipLater() {
            removeTimeout();
            timerId = setTimeout(() => {
                setStatus(CopyStatus.NotCopiedOrWaiting);
            }, 3000);
        }
        clipboardBtn.on("success", (evt) => {
            var _a;
            (_a = props.onCopy) === null || _a === void 0 ? void 0 : _a.call(props, evt.text);
            setStatus(CopyStatus.Success);
            resetTooltipLater();
        });
        clipboardBtn.on("error", () => {
            setStatus(CopyStatus.Error);
            resetTooltipLater();
        });
        return function cleanup() {
            removeTimeout();
            clipboardBtn.destroy();
        };
    }, [id]);
    const isLightTheme = theme === "light";
    return (_jsxs(ClipboardDiv, { children: [_jsxs(Box, { children: [source, _jsx(Button, { primary: true, css: `
            width: 80px;
            border-radius: 2px;
            ${rounded && `border-radius:  0 32px 32px 0;`}
          `, className: `btn-copy-${id}`, "data-clipboard-target": `#${id}`, textProps: { large: true }, children: t("clipboard.copy") })] }), status !== CopyStatus.NotCopiedOrWaiting && (_jsxs(_Fragment, { children: [_jsx(Spacing, { bottom: 2 }), _jsxs(Box, { css: `
              line-height: 10px;
            `, children: [_jsx(StyledIcon, { light: !isLightTheme, realDark: isLightTheme, glyph: status === CopyStatus.Success
                                    ? Icon.GLYPHS.selected
                                    : Icon.GLYPHS.close, styledWidth: "20px", css: `
                margin: 8px;
                margin-left: 0;
                display: inline-block;
              ` }), _jsx(TooltipText, { children: status === CopyStatus.Success
                                    ? t("clipboard.success")
                                    : t("clipboard.unsuccessful") })] })] }))] }));
};
export default Clipboard;
const ClipboardDiv = styled.div `
  position: relative;
`;
const TooltipText = styled.span `
  ${verticalAlign("absolute")}
  left: 30px;
`;
//# sourceMappingURL=Clipboard.js.map