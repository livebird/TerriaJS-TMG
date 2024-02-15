"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const React = require("react");
const PropTypes = require("prop-types");
import classNames from "classnames";
import { observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import { Category, ViewAction } from "../../Core/AnalyticEvents/analyticEvents";
import Icon from "../../Styled/Icon";
import withControlledVisibility from "../HOCs/withControlledVisibility";
import { withViewState } from "../Context";
import Styles from "./full_screen_button.scss";
// The button to make the map full screen and hide the workbench.
let FullScreenButton = class FullScreenButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false
        };
    }
    toggleFullScreen() {
        var _a;
        this.props.viewState.setIsMapFullScreen(!this.props.viewState.isMapFullScreen);
        // log a GA event
        (_a = this.props.viewState.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.view, this.props.viewState.isMapFullScreen
            ? ViewAction.exitFullScreen
            : ViewAction.enterFullScreen);
    }
    renderButtonText() {
        const btnText = this.props.btnText ? this.props.btnText : null;
        if (this.props.minified) {
            if (this.props.viewState.isMapFullScreen) {
                return _jsx(Icon, { glyph: Icon.GLYPHS.right });
            }
            else {
                return _jsx(Icon, { glyph: Icon.GLYPHS.closeLight });
            }
        }
        return (_jsxs(_Fragment, { children: [_jsx("span", { children: btnText }), _jsx(Icon, { glyph: Icon.GLYPHS.right })] }));
    }
    render() {
        const btnClassName = classNames(Styles.btn, {
            [Styles.isActive]: this.props.viewState.isMapFullScreen,
            [Styles.minified]: this.props.minified
        });
        const { t } = this.props;
        return (_jsxs("div", { className: classNames(Styles.fullScreen, {
                [Styles.minifiedFullscreenBtnWrapper]: this.props.minified,
                [Styles.trainerBarVisible]: this.props.viewState.trainerBarVisible
            }), children: [this.props.minified && (_jsx("label", { className: Styles.toggleWorkbench, htmlFor: "toggle-workbench", children: this.props.btnText })), _jsx("button", { type: "button", id: "toggle-workbench", "aria-label": this.props.viewState.isMapFullScreen
                        ? t("sui.showWorkbench")
                        : t("sui.hideWorkbench"), onClick: () => this.toggleFullScreen(), className: btnClassName, title: this.props.viewState.isMapFullScreen
                        ? t("sui.showWorkbench")
                        : t("sui.hideWorkbench"), children: this.renderButtonText() })] }));
    }
};
Object.defineProperty(FullScreenButton, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        viewState: PropTypes.object.isRequired,
        btnText: PropTypes.string,
        minified: PropTypes.bool,
        animationDuration: PropTypes.number,
        t: PropTypes.func.isRequired
    }
});
FullScreenButton = __decorate([
    observer
], FullScreenButton);
export default withTranslation()(withViewState(withControlledVisibility(FullScreenButton)));
//# sourceMappingURL=FullScreenButton.js.map