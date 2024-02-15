"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { computed, makeObservable } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import defined from "terriajs-cesium/Source/Core/defined";
import ChartView from "../../../Charts/ChartView.ts";
import Result from "../../../Core/Result";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import Icon from "../../../Styled/Icon";
import Loader from "../../Loader";
import Chart from "./BottomDockChart";
import Styles from "./chart-panel.scss";
import { ChartPanelDownloadButton } from "./ChartPanelDownloadButton";
const height = 300;
let ChartPanel = class ChartPanel extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this);
    }
    get chartView() {
        return new ChartView(this.props.terria);
    }
    closePanel() {
        this.chartView.chartItems.forEach((chartItem) => {
            chartItem.updateIsSelectedInWorkbench(false);
        });
    }
    componentDidUpdate() {
        // Required so that components like the splitter that depend on screen
        // height will re-adjust.
        this.props.viewState.triggerResizeEvent();
        if (defined(this.props.onHeightChange)) {
            this.props.onHeightChange();
        }
    }
    render() {
        const chartableCatalogItems = this.chartView.chartableItems;
        const chartItems = this.chartView.chartItems.filter((c) => c.showInChartPanel);
        this.props.terria.currentViewer.notifyRepaintRequired();
        if (chartItems.length === 0) {
            return null;
        }
        const isLoading = false;
        // const isLoading =
        //   chartableItems.length > 0 &&
        //   chartableItems[chartableItems.length - 1].isLoading;
        let loader;
        let chart;
        if (isLoading) {
            loader = _jsx(Loader, { className: Styles.loader });
        }
        const items = this.props.terria.workbench.items;
        if (items.length > 0) {
            // Load all items
            Promise.all(items
                .filter((item) => MappableMixin.isMixedInto(item))
                .map((item) => item.loadMapItems())).then((results) => Result.combine(results, {
                message: "Failed to load chart items",
                importance: -1
            }).raiseError(this.props.terria));
            chart = (_jsx(Chart, { terria: this.props.terria, chartItems: chartItems, xAxis: this.chartView.xAxis, height: height - 34 }));
        }
        const { t } = this.props;
        return (_jsx("div", { className: Styles.holder, children: _jsx("div", { className: Styles.inner, children: _jsx("div", { className: Styles.chartPanel, style: { height: height }, children: _jsxs("div", { className: Styles.body, children: [_jsxs("div", { className: Styles.header, children: [_jsx("label", { className: Styles.sectionLabel, children: loader || t("chart.sectionLabel") }), _jsx(ChartPanelDownloadButton, { chartableItems: chartableCatalogItems }), _jsx("button", { type: "button", title: t("chart.closePanel"), className: Styles.btnCloseChartPanel, onClick: () => this.closePanel(), children: _jsx(Icon, { glyph: Icon.GLYPHS.close }) })] }), _jsx("div", { className: Styles.chart, children: chart })] }) }) }) }));
    }
};
Object.defineProperty(ChartPanel, "displayName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ChartPanel"
});
Object.defineProperty(ChartPanel, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        terria: PropTypes.object.isRequired,
        onHeightChange: PropTypes.func,
        viewState: PropTypes.object.isRequired,
        animationDuration: PropTypes.number,
        t: PropTypes.func.isRequired
    }
});
__decorate([
    computed
], ChartPanel.prototype, "chartView", null);
ChartPanel = __decorate([
    observer
], ChartPanel);
export default withTranslation()(ChartPanel);
//# sourceMappingURL=ChartPanel.js.map