import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { observer } from "mobx-react";
import React from "react";
import { useTranslation, withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import Box from "../../Styled/Box";
import Button from "../../Styled/Button";
import Icon, { StyledIcon } from "../../Styled/Icon";
import Spacing from "../../Styled/Spacing";
import Text from "../../Styled/Text";
import { ExplorerWindowElementName } from "../ExplorerWindow/ExplorerWindow";
import { useRefForTerria } from "../Hooks/useRefForTerria";
import SearchBoxAndResults from "../Search/SearchBoxAndResults";
import { withViewState } from "../Context";
import Workbench from "../Workbench/Workbench";
import { applyTranslationIfExists } from "../../Language/languageHelpers";
const BoxHelpfulHints = styled(Box) ``;
const ResponsiveSpacing = styled(Box) `
  height: 110px;
  height: 110px;
  // Hardcoded px value, TODO: make it not hardcoded
  @media (max-height: 700px) {
    height: 3vh;
  }
  @media (max-height: 700px) {
    height: 3vh;
  }
`;
const HelpfulHintsIcon = () => {
    return (_jsx(StyledIcon, { glyph: Icon.GLYPHS.bulb, styledWidth: "14px", styledHeight: "14px", light: true, css: `
        padding: 2px 1px;
      ` }));
};
const EmptyWorkbench = (props) => {
    const { t } = useTranslation();
    return (_jsx(Text, { large: true, textLight: true, children: _jsxs(Box, { column: true, fullWidth: true, justifySpaceBetween: true, children: [_jsxs(Box, { centered: true, column: true, children: [_jsx(ResponsiveSpacing, {}), _jsx(Text, { large: true, color: props.theme.textLightDimmed, children: t("emptyWorkbench.emptyArea") }), _jsx(ResponsiveSpacing, {})] }), _jsxs(BoxHelpfulHints, { column: true, paddedRatio: 3, overflowY: "auto", scroll: true, children: [_jsx(Box, { left: true, children: _jsx(Text, { extraLarge: true, bold: true, children: t("emptyWorkbench.helpfulHints") }) }), _jsx(Spacing, { bottom: 4 }), _jsxs(Box, { children: [_jsx(HelpfulHintsIcon, {}), _jsx(Spacing, { right: 1 }), _jsx(Text, { medium: true, light: true, children: t("emptyWorkbench.helpfulHintsOne") })] }), _jsx(Spacing, { bottom: 3 }), _jsxs(Box, { children: [_jsx(HelpfulHintsIcon, {}), _jsx(Spacing, { right: 1 }), _jsx(Text, { medium: true, light: true, children: t("emptyWorkbench.helpfulHintsTwo") })] }), _jsx(Spacing, { bottom: 3 }), _jsxs(Box, { children: [_jsx(HelpfulHintsIcon, {}), _jsx(Spacing, { right: 1 }), _jsx(Text, { medium: true, light: true, children: t("emptyWorkbench.helpfulHintsThree") })] }), _jsx(ResponsiveSpacing, {})] })] }) }));
};
const SidePanelButton = React.forwardRef(function SidePanelButton(props, ref) {
    const { btnText, ...rest } = props;
    return (_jsx(Button, { primary: true, ref: ref, renderIcon: props.children && (() => props.children), textProps: {
            large: true
        }, ...rest, children: btnText ? btnText : "" }));
});
export const EXPLORE_MAP_DATA_NAME = "ExploreMapDataButton";
export const SIDE_PANEL_UPLOAD_BUTTON_NAME = "SidePanelUploadButton";
const SidePanel = observer(({ viewState, theme, refForExploreMapData, refForUploadData }) => {
    const terria = viewState.terria;
    const { t, i18n } = useTranslation();
    const onAddDataClicked = (e) => {
        e.stopPropagation();
        viewState.setTopElement(ExplorerWindowElementName);
        viewState.openAddData();
    };
    const onAddLocalDataClicked = (e) => {
        e.stopPropagation();
        viewState.setTopElement(ExplorerWindowElementName);
        viewState.openUserData();
    };
    const addData = t("addData.addDataBtnText");
    const uploadText = t("models.catalog.upload");
    return (_jsxs(Box, { column: true, styledMinHeight: "0", flex: 1, children: [_jsxs("div", { css: `
            padding: 0 5px;
            background: ${theme.dark};
          `, children: [_jsx(SearchBoxAndResults, { viewState: viewState, terria: terria, placeholder: applyTranslationIfExists(terria.searchBarModel.placeholder, i18n) }), _jsx(Spacing, { bottom: 2 }), _jsxs(Box, { justifySpaceBetween: true, children: [_jsx(SidePanelButton, { ref: refForExploreMapData, onClick: onAddDataClicked, title: addData, btnText: addData, styledWidth: "200px", children: _jsx(StyledIcon, { glyph: Icon.GLYPHS.add, light: true, styledWidth: "20px" }) }), _jsx(SidePanelButton, { ref: refForUploadData, onClick: onAddLocalDataClicked, title: t("addData.load"), btnText: uploadText, styledWidth: "130px", children: _jsx(StyledIcon, { glyph: Icon.GLYPHS.uploadThin, light: true, styledWidth: "20px" }) })] }), _jsx(Spacing, { bottom: 1 })] }), _jsx(Box, { styledMinHeight: "0", flex: 1, css: `
            overflow: hidden;
          `, children: terria.workbench.items && terria.workbench.items.length > 0 ? (_jsx(Workbench, { viewState: viewState, terria: terria })) : (_jsx(EmptyWorkbench, { theme: theme })) })] }));
});
// Used to create two refs for <SidePanel /> to consume, rather than
// using the withTerriaRef() HOC twice, designed for a single ref
const SidePanelWithRefs = (props) => {
    const refForExploreMapData = useRefForTerria(EXPLORE_MAP_DATA_NAME, props.viewState);
    const refForUploadData = useRefForTerria(SIDE_PANEL_UPLOAD_BUTTON_NAME, props.viewState);
    return (_jsx(SidePanel, { ...props, refForExploreMapData: refForExploreMapData, refForUploadData: refForUploadData }));
};
export default withTranslation()(withViewState(withTheme(SidePanelWithRefs)));
//# sourceMappingURL=SidePanel.js.map