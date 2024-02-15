var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { action, computed, makeObservable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
//@ts-ignore
import { sortable } from "react-anything-sortable";
import { withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import getPath from "../../Core/getPath";
import CatalogMemberMixin, { getName } from "../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../ModelMixins/MappableMixin";
import ReferenceMixin from "../../ModelMixins/ReferenceMixin";
import CommonStrata from "../../Models/Definition/CommonStrata";
import Box, { BoxSpan } from "../../Styled/Box";
import { RawButton } from "../../Styled/Button";
import Checkbox from "../../Styled/Checkbox/Checkbox";
import Icon, { StyledIcon } from "../../Styled/Icon";
import { Li } from "../../Styled/List";
import Spacing from "../../Styled/Spacing";
import { TextSpan } from "../../Styled/Text";
import Loader from "../Loader";
import PrivateIndicator from "../PrivateIndicator/PrivateIndicator";
import WorkbenchItemControls from "./Controls/WorkbenchItemControls";
let WorkbenchItemRaw = class WorkbenchItemRaw extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this);
    }
    toggleDisplay() {
        if (!CatalogMemberMixin.isMixedInto(this.props.item))
            return;
        this.props.item.setTrait(CommonStrata.user, "isOpenInWorkbench", !this.props.item.isOpenInWorkbench);
    }
    toggleVisibility() {
        if (MappableMixin.isMixedInto(this.props.item))
            this.props.item.setTrait(CommonStrata.user, "show", !this.props.item.show);
    }
    /** If workbench item is CatalogMember use CatalogMemberTraits.isOpenInWorkbench
     * Otherwise, defaults to true
     */
    get isOpen() {
        if (!CatalogMemberMixin.isMixedInto(this.props.item))
            return true;
        return this.props.item.isOpenInWorkbench;
    }
    render() {
        const { item, t } = this.props;
        const isLoading = (CatalogMemberMixin.isMixedInto(item) && item.isLoading) ||
            (ReferenceMixin.isMixedInto(item) && item.isLoadingReference);
        return (_jsxs(StyledLi, { style: this.props.style, className: this.props.className, children: [_jsxs(Box, { fullWidth: true, justifySpaceBetween: true, padded: true, styledMinHeight: "38px", children: [_jsx(Box, { fullWidth: true, children: _jsx(Box, { left: true, fullWidth: true, paddedHorizontally: true, centered: true, children: _jsxs(DraggableBox, { onMouseDown: this.props.onMouseDown, onTouchStart: this.props.onTouchStart, title: getPath(item, " → "), fullWidth: true, children: [!item.isMappable && !isLoading && (_jsx(BoxSpan, { paddedHorizontally: true, displayInlineBlock: true, children: _jsx(Box, { padded: true, children: _jsx(StyledIcon, { styledHeight: "18px", light: true, glyph: Icon.GLYPHS.lineChart }) }) })), MappableMixin.isMixedInto(item) ? (_jsx(Box, { left: true, verticalCenter: true, css: `
                      padding-left: 5px;
                    `, children: _jsx(Checkbox, { id: "workbenchtoggleVisibility", isChecked: item.show, title: t("workbench.toggleVisibility"), onChange: () => this.toggleVisibility(), css: `
                        overflow-wrap: anywhere;
                      `, textProps: { medium: true, fullWidth: true }, children: _jsx(TextSpan, { medium: true, maxLines: !this.isOpen ? 2 : false, title: getName(item), children: getName(item) }) }) })) : (_jsx(TextSpan, { medium: true, textLight: true, maxLines: !this.isOpen ? 2 : false, title: getName(item), css: `
                      overflow-wrap: anywhere;
                    `, children: getName(item) }))] }) }) }), CatalogMemberMixin.isMixedInto(item) ? (_jsxs(Box, { centered: true, paddedHorizontally: true, children: [item.isPrivate && (_jsx(BoxSpan, { paddedHorizontally: true, children: _jsx(PrivateIndicator, { inWorkbench: true }) })), _jsx(RawButton, { onClick: () => this.toggleDisplay(), children: _jsx(BoxSpan, { padded: true, children: this.isOpen ? (_jsx(StyledIcon, { styledHeight: "8px", light: true, glyph: Icon.GLYPHS.opened })) : (_jsx(StyledIcon, { styledHeight: "8px", light: true, glyph: Icon.GLYPHS.closed })) }) })] })) : null] }), this.isOpen && (_jsxs(_Fragment, { children: [_jsx(Spacing, { bottom: 2, css: `
                border-top: 1px solid ${this.props.theme.dark};
              ` }), _jsxs(Box, { column: true, paddedHorizontally: 2, children: [_jsx(WorkbenchItemControls, { item: this.props.item, viewState: this.props.viewState }), isLoading ? (_jsx(Box, { paddedVertically: true, children: _jsx(Loader, { light: true }) })) : null] }), _jsx(Spacing, { bottom: 2 })] }))] }));
    }
};
Object.defineProperty(WorkbenchItemRaw, "displayName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "WorkbenchItem"
});
__decorate([
    action.bound
], WorkbenchItemRaw.prototype, "toggleDisplay", null);
__decorate([
    action.bound
], WorkbenchItemRaw.prototype, "toggleVisibility", null);
__decorate([
    computed
], WorkbenchItemRaw.prototype, "isOpen", null);
WorkbenchItemRaw = __decorate([
    observer
], WorkbenchItemRaw);
const DraggableBox = styled(Box) `
  cursor: move;
`;
const StyledLi = styled(Li) `
  background: ${(p) => p.theme.darkWithOverlay};
  color: ${(p) => p.theme.textLight};
  border-radius: 4px;
  margin-bottom: 5px;
  width: 100%;
`;
export default sortable(withTranslation()(withTheme(WorkbenchItemRaw)));
//# sourceMappingURL=WorkbenchItem.js.map