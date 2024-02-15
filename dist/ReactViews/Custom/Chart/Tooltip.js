var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { observer } from "mobx-react";
import { computed, makeObservable } from "mobx";
import { Tooltip as VisxTooltip } from "@visx/tooltip";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";
import React from "react";
import dateformat from "dateformat";
import groupBy from "lodash-es/groupBy";
import Styles from "./tooltip.scss";
let Tooltip = class Tooltip extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "prevItems", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        makeObservable(this);
    }
    get items() {
        // When items` is unset, hold on to its last value. We do this because we
        // want to keep showing the tooltip. We then fade it out using the
        // CSSTransition below.
        const items = this.props.items;
        if (items && items.length > 0) {
            this.prevItems = items;
            return items;
        }
        else {
            return this.prevItems;
        }
    }
    get title() {
        const items = this.items;
        if (items.length > 0) {
            // derive title from first item x
            const x = items[0].point.x;
            return x instanceof Date ? dateformat(x, "dd/mm/yyyy, HH:MMTT") : x;
        }
        else
            return undefined;
    }
    get groups() {
        // momentLines and momentPoints are not shown in the tooltip body
        const tooltipItems = this.items.filter(({ chartItem }) => chartItem.type !== "momentLines" && chartItem.type !== "momentPoints");
        return Object.entries(groupBy(tooltipItems, "chartItem.categoryName")).map((o) => ({
            name: o[0],
            items: o[1]
        }));
    }
    get style() {
        const { left, right, top, bottom } = this.props;
        return {
            left: left === undefined ? "" : `${left}px`,
            right: right === undefined ? "" : `${right}px`,
            top: top === undefined ? "" : `${top}px`,
            bottom: bottom === undefined ? "" : `${bottom}px`,
            position: "absolute",
            boxShadow: "0 1px 2px rgba(33,33,33,0.2)"
        };
    }
    render() {
        const { items } = this.props;
        const show = items.length > 0;
        return (_jsx(CSSTransition, { in: show, classNames: "transition", timeout: 1000, unmountOnExit: true, children: _jsxs(VisxTooltip, { className: Styles.tooltip, style: this.style, children: [_jsx("div", { className: Styles.title, children: this.title }), _jsx("div", { children: this.groups.map((group) => (_jsx(TooltipGroup, { name: this.groups.length > 1 ? group.name : undefined, items: group.items }, `tooltip-group-${group.name}`))) })] }, Math.random()) }));
    }
};
Object.defineProperty(Tooltip, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        items: PropTypes.array.isRequired,
        left: PropTypes.number,
        right: PropTypes.number,
        top: PropTypes.number,
        bottom: PropTypes.number
    }
});
__decorate([
    computed
], Tooltip.prototype, "items", null);
__decorate([
    computed
], Tooltip.prototype, "title", null);
__decorate([
    computed
], Tooltip.prototype, "groups", null);
__decorate([
    computed
], Tooltip.prototype, "style", null);
Tooltip = __decorate([
    observer
], Tooltip);
class TooltipGroup extends React.PureComponent {
    render() {
        const { name, items } = this.props;
        return (_jsxs("div", { className: Styles.group, children: [name && _jsx("div", { className: Styles.groupName, children: name }), items.map((item) => (_jsx(TooltipItem, { item: item }, `tooltipitem-${item.chartItem.key}`)))] }));
    }
}
Object.defineProperty(TooltipGroup, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        name: PropTypes.string,
        items: PropTypes.array.isRequired
    }
});
let TooltipItem = class TooltipItem extends React.Component {
    render() {
        const chartItem = this.props.item.chartItem;
        const value = this.props.item.point.y;
        const formattedValue = isNaN(value) ? value : value.toFixed(2);
        return (_jsxs("div", { className: Styles.item, children: [_jsx("div", { className: Styles.itemSymbol, style: { backgroundColor: chartItem.getColor() } }), _jsx("div", { className: Styles.itemName, children: chartItem.name }), _jsx("div", { className: Styles.itemValue, children: formattedValue }), _jsx("div", { className: Styles.itemUnits, children: chartItem.units })] }));
    }
};
Object.defineProperty(TooltipItem, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        item: PropTypes.object.isRequired
    }
});
TooltipItem = __decorate([
    observer
], TooltipItem);
export default Tooltip;
//# sourceMappingURL=Tooltip.js.map