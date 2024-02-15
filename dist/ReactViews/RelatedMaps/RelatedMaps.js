var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { observer } from "mobx-react";
import React from "react";
import { withTranslation } from "react-i18next";
import { withTheme } from "styled-components";
import Box from "../../Styled/Box";
import { ExternalLinkIcon } from "../Custom/ExternalLink";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
import { withViewState } from "../Context";
import Styles from "./related-maps.scss";
const MenuPanel = require("../StandardUserInterface/customizable/MenuPanel").default;
let RelatedMaps = class RelatedMaps extends React.Component {
    /**
     * @param {Props} props
     */
    constructor(props) {
        super(props);
    }
    render() {
        const dropdownTheme = {
            inner: Styles.dropdownInner,
            icon: "gallery"
        };
        const smallScreen = this.props.viewState.useSmallScreenInterface;
        return (_jsxs(MenuPanel, { theme: dropdownTheme, btnText: "Related Maps", smallScreen: smallScreen, viewState: this.props.viewState, btnTitle: "See related maps", showDropdownInCenter: true, children: [_jsx("h2", { children: "Related Maps" }), _jsx("p", { children: "Clicking on a map below will open it in a separate window or tab." }), this.props.relatedMaps.map((map, i) => (_jsxs(Box, { flex: true, children: [_jsx(Box, { children: _jsx("a", { target: "_blank", href: map.url, rel: "noreferrer", children: _jsx("img", { style: {
                                        marginRight: "10px",
                                        marginBottom: "10px",
                                        width: "200px",
                                        height: "150px"
                                    }, src: map.imageUrl, alt: map.title }) }) }), _jsxs(Box, { displayInlineBlock: true, children: [_jsxs("a", { target: "_blank", style: { color: this.props.theme.colorPrimary }, href: map.url, rel: "noreferrer", children: [map.title, _jsx(ExternalLinkIcon, {})] }), parseCustomMarkdownToReact(map.description)] })] }, i)))] }));
    }
};
RelatedMaps = __decorate([
    observer
], RelatedMaps);
export default withTranslation()(withTheme(withViewState(RelatedMaps)));
//# sourceMappingURL=RelatedMaps.js.map