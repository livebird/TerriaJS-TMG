"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from "classnames";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import Icon from "../Styled/Icon";
import Styles from "./drag-drop-notification.scss";
import { withViewState } from "./Context";
let DragDropNotification = class DragDropNotification extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "notificationTimeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "lastUploadedFilesReaction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.state = {
            showNotification: false
        };
    }
    componentDidMount() {
        this.lastUploadedFilesReaction = reaction(() => this.props.viewState.lastUploadedFiles, () => {
            clearTimeout(this.notificationTimeout);
            // show notification, restart timer
            this.setState({
                showNotification: true
            });
            // initialise new time out
            this.notificationTimeout = setTimeout(() => {
                this.setState({
                    showNotification: false
                });
            }, 5000);
        });
    }
    componentWillUnmount() {
        clearTimeout(this.notificationTimeout);
        this.lastUploadedFilesReaction();
    }
    handleHover() {
        // reset timer on hover
        clearTimeout(this.notificationTimeout);
    }
    handleMouseLeave() {
        this.notificationTimeout = setTimeout(() => {
            this.setState({
                showNotification: false
            });
        }, 4000);
    }
    handleClick() {
        this.props.viewState.openUserData();
    }
    render() {
        const fileNames = this.props.viewState.lastUploadedFiles.join(",");
        return (_jsxs("button", { className: classNames(Styles.notification, {
                [Styles.isActive]: this.state.showNotification && fileNames.length > 0
            }), onMouseEnter: this.handleHover.bind(this), onMouseLeave: this.handleMouseLeave.bind(this), onClick: this.handleClick.bind(this), children: [_jsx("div", { className: Styles.icon, children: _jsx(Icon, { glyph: Icon.GLYPHS.upload }) }), _jsxs("div", { className: Styles.info, children: [_jsxs("span", { className: Styles.filename, children: ['"', fileNames, '"'] }), " ", this.props.viewState.lastUploadedFiles.length > 1 ? "have" : "has", " ", "been added to ", _jsx("span", { className: Styles.action, children: "My data" })] })] }));
    }
};
Object.defineProperty(DragDropNotification, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        viewState: PropTypes.object
    }
});
DragDropNotification = __decorate([
    observer
], DragDropNotification);
export default withViewState(DragDropNotification);
//# sourceMappingURL=DragDropNotification.js.map