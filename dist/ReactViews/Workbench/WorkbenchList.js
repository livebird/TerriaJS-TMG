var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "!!style-loader!css-loader?sourceMap!./sortable.css";
import { action, makeObservable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
//@ts-ignore
import Sortable from "react-anything-sortable";
import styled from "styled-components";
import { Ul } from "../../Styled/List";
import WorkbenchItem from "./WorkbenchItem";
import WorkbenchSplitScreen from "./WorkbenchSplitScreen";
const StyledUl = styled(Ul) `
  margin: 5px 0;
  li {
    &:first-child {
      margin-top: 0;
    }
  }
`;
let WorkbenchList = class WorkbenchList extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this);
    }
    onSort(sortedArray, currentDraggingSortData, currentDraggingIndex) {
        this.props.terria.workbench.moveItemToIndex(currentDraggingSortData, currentDraggingIndex);
    }
    render() {
        return (_jsxs(StyledUl, { overflowY: "auto", overflowX: "hidden", scroll: true, paddedHorizontally: true, fullWidth: true, fullHeight: true, column: true, children: [this.props.terria.showSplitter && (_jsx(WorkbenchSplitScreen, { terria: this.props.terria })), _jsx(Sortable, { onSort: this.onSort, direction: "vertical", dynamic: true, css: `
            width: 100%;
          `, children: this.props.terria.workbench.items.map((item) => {
                        return (_jsx(WorkbenchItem, { item: item, sortData: item, viewState: this.props.viewState }, item.uniqueId));
                    }) })] }));
    }
};
__decorate([
    action.bound
], WorkbenchList.prototype, "onSort", null);
WorkbenchList = __decorate([
    observer
], WorkbenchList);
export default WorkbenchList;
//# sourceMappingURL=WorkbenchList.js.map