import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import styled from "styled-components";
import isDefined from "../../Core/isDefined";
import { RawButton } from "../../Styled/Button";
import { StyledIcon } from "../../Styled/Icon";
import Text from "../../Styled/Text";
import { CollapseIcon } from "../Custom/Collapsible/Collapsible";
/**
 * A generic panel component for left, right, context items etc.
 */
export const Panel = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        isDefined(props.isOpen) ? setIsOpen(props.isOpen) : null;
    }, [props.isOpen]);
    const toggleOpen = () => {
        const newIsOpen = !isOpen;
        // Only update isOpen state if onToggle doesn't consume the event
        if (!props.onToggle || !props.onToggle(newIsOpen))
            setIsOpen(newIsOpen);
    };
    return props.title && props.collapsible ? (_jsxs(Wrapper, { className: props.className, children: [_jsxs(CollapsibleTitleBar, { onClick: toggleOpen, fullWidth: true, isOpen: isOpen, children: [props.icon !== undefined ? (_jsx(Icon, { glyph: props.icon, styledWidth: "16px", styledHeight: "16px" })) : null, _jsx(Title, { children: props.title }), _jsx(CollapseIcon, { isOpen: isOpen })] }), isOpen ? _jsx(Content, { children: props.children }) : null] })) : (_jsxs(Wrapper, { className: props.className, children: [props.title !== undefined && (_jsxs(TitleBar, { children: [props.icon !== undefined ? (_jsx(Icon, { glyph: props.icon, styledWidth: "16px", styledHeight: "16px" })) : null, _jsx(Title, { children: props.title }), props.menuComponent] })), _jsx(Content, { children: props.children })] }));
};
/** Simple PanelButton - this mimics style of CollapsibleTitleBar */
export const PanelButton = ({ onClick, title }) => (_jsx(Wrapper, { children: _jsx(CollapsibleTitleBar, { onClick: onClick, fullWidth: true, isOpen: false, activeStyles: true, children: _jsx(Title, { css: { textAlign: "center" }, children: title }) }) }));
const Wrapper = styled.div `
  background-color: ${(p) => p.theme.darkWithOverlay};
  margin: 10px 5px 0px 5px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.15);
`;
const TitleBar = styled.div `
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(p) => p.theme.darkLighter};
  padding-left: 0.4em;
`;
const CollapsibleTitleBar = styled(RawButton) `
  text-align: left;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${(p) => (p.isOpen ? `border-bottom: 1px solid ${p.theme.darkLighter}` : "")};
  padding-left: 0.4em;
  padding-right: 0.4em;
`;
const Title = styled(Text).attrs({
    textLight: true,
    bold: true
}) `
  flex-grow: 1;
  padding: 1em 0.4em;
`;
const Icon = styled(StyledIcon).attrs({
    styledWidth: "18px",
    styledHeight: "18px",
    light: true
}) ``;
const Content = styled.div `
  padding: 0.4em;
  color: ${(p) => p.theme.textLight};
`;
//# sourceMappingURL=Panel.js.map