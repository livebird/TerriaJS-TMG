var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx } from "react/jsx-runtime";
import { comparer, reaction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import addedByUser from "../../Core/addedByUser";
import getPath from "../../Core/getPath";
import removeUserAddedData from "../../Models/Catalog/removeUserAddedData";
import CatalogGroup from "./CatalogGroup";
import DataCatalogMember from "./DataCatalogMember";
import { addRemoveButtonClicked, allMappableMembersInWorkbench } from "./DisplayGroupHelper";
let DataCatalogGroup = class DataCatalogGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            /** Only used if manageIsOpenLocally === true */
            isOpen: false
        };
    }
    isOpen() {
        if (this.props.manageIsOpenLocally) {
            return this.state.isOpen;
        }
        return this.props.group.isOpen;
    }
    async clickGroup() {
        if (this.props.manageIsOpenLocally) {
            this.setState({
                isOpen: !this.state.isOpen
            });
        }
        (await this.props.viewState.viewCatalogMember(this.props.group, !this.props.group.isOpen)).raiseError(this.props.viewState.terria);
    }
    isSelected() {
        return addedByUser(this.props.group)
            ? this.props.viewState.userDataPreviewedItem === this.props.group
            : this.props.viewState.previewedItem === this.props.group;
    }
    getNameOrPrettyUrl() {
        // Grab a name via nameInCatalog, if it's a blank string, try and generate one from the url
        const group = this.props.group;
        const nameInCatalog = group.nameInCatalog || "";
        if (nameInCatalog !== "") {
            return nameInCatalog;
        }
        const url = group.url || "";
        // strip protocol
        return url.replace(/^https?:\/\//, "");
    }
    componentDidMount() {
        this._cleanupLoadMembersReaction = reaction(() => [this.props.group, this.isOpen()], ([group, isOpen]) => {
            if (isOpen) {
                group.loadMembers();
            }
        }, { equals: comparer.shallow, fireImmediately: true });
    }
    componentWillUnmount() {
        this._cleanupLoadMembersReaction();
    }
    render() {
        const group = this.props.group;
        const { t } = this.props;
        return (_jsx(CatalogGroup, { text: this.getNameOrPrettyUrl(), isPrivate: group.isPrivate, title: getPath(this.props.group, " → "), topLevel: this.props.isTopLevel, open: this.isOpen(), loading: group.isLoading || group.isLoadingMembers, emptyMessage: t("dataCatalog.groupEmpty"), onClick: () => this.clickGroup(), removable: this.props.removable, removeUserAddedData: removeUserAddedData.bind(this, this.props.terria, this.props.group), selected: this.isSelected(), 
            // Pass these next three props down to deal with displayGroup functionality
            displayGroup: group.displayGroup, addRemoveButtonFunction: (event) => {
                addRemoveButtonClicked(this.props.group, this.props.viewState, this.props.terria, event.shiftKey || event.ctrlKey);
            }, allItemsLoaded: allMappableMembersInWorkbench(this.props.group.members, this.props.terria), children: this.isOpen()
                ? group.memberModels.map((item) => (_jsx(DataCatalogMember, { member: item, terria: this.props.terria, viewState: this.props.viewState, userData: this.props.userData, overrideOpen: this.props.manageIsOpenLocally, onActionButtonClicked: this.props.onActionButtonClicked }, item.uniqueId)))
                : null }));
    }
};
Object.defineProperty(DataCatalogGroup, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        group: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        /** Overrides whether to get the open state of the group from the group model or manage it internally */
        manageIsOpenLocally: PropTypes.bool,
        userData: PropTypes.bool,
        onActionButtonClicked: PropTypes.func,
        removable: PropTypes.bool,
        terria: PropTypes.object,
        t: PropTypes.func.isRequired,
        isTopLevel: PropTypes.bool
    }
});
Object.defineProperty(DataCatalogGroup, "defaultProps", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        manageIsOpenLocally: false,
        userData: false
    }
});
DataCatalogGroup = __decorate([
    observer
], DataCatalogGroup);
module.exports = withTranslation()(DataCatalogGroup);
//# sourceMappingURL=DataCatalogGroup.js.map