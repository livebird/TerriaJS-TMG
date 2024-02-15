import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components";
import { RawButton } from "../../../Styled/Button";
import Icon, { StyledIcon } from "../../../Styled/Icon";
export const CollapseBtn = ({ isCollapsed, onClick }) => {
    const { t } = useTranslation();
    return (_jsx(RawButton, { title: isCollapsed ? t("story.expand") : t("story.collapse"), onClick: onClick, children: isCollapsed ? (_jsx(StoryIcon, { styledWidth: "20px", glyph: Icon.GLYPHS.info })) : (_jsx(StoryIcon, { styledWidth: "12px", glyph: Icon.GLYPHS.arrowDown })) }));
};
export const ExitBtn = ({ onClick }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    return (_jsx(RawButton, { onClick: onClick, title: t("story.exitBtn"), children: _jsx(StoryIcon, { styledWidth: "12px", glyph: Icon.GLYPHS.close, css: `
          border-radius: 50%;
          border: 2px solid ${theme.textDark};
          padding: 2px;
          &:hover {
            border-color: ${theme.colorPrimary};
          }
        ` }) }));
};
export const StoryIcon = styled(StyledIcon).attrs((props) => ({
    fillColor: props.theme.textDark,
    opacity: 0.5
})) `
  &:hover {
    fill: ${(p) => p.theme.colorPrimary};
  }
`;
//# sourceMappingURL=StoryButtons.js.map