import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from "prop-types";
import React from "react";
import LineChart from "./LineChart";
import MomentPointsChart from "./MomentPointsChart";
/**
 * A line chart, where each data point is represented by a circle, and a line is
 * drawn between each point.
 */
class LineAndPointChart extends React.PureComponent {
    constructor() {
        super();
        this.lineRef = React.createRef();
        this.pointRef = React.createRef();
    }
    doZoom(scales) {
        this.lineRef.current.doZoom(scales);
        this.pointRef.current.doZoom(scales);
    }
    render() {
        return (_jsxs(_Fragment, { children: [_jsx(LineChart, { ref: this.lineRef, chartItem: this.props.chartItem, scales: this.props.scales, color: this.props.color, id: this.props.id + "-line" }), _jsx(MomentPointsChart, { ref: this.pointRef, id: this.props.id + "-point", chartItem: this.props.chartItem, scales: this.props.scales, glyph: this.props.glyph })] }));
    }
}
Object.defineProperty(LineAndPointChart, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        id: PropTypes.string.isRequired,
        chartItem: PropTypes.object.isRequired,
        scales: PropTypes.object.isRequired,
        color: PropTypes.string,
        glyph: PropTypes.string
    }
});
export default LineAndPointChart;
//# sourceMappingURL=LineAndPointChart.js.map