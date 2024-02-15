import { min as d3ArrayMin, max as d3ArrayMax } from "d3-array";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
/**
 * A container to pass data to a d3 chart: a single series of data points.
 * For documentation on the custom <chart> tag, see lib/Models/registerCustomComponentTypes.js.
 *
 * @param {ChartDataOptions} [options] Further parameters.
 */
export default class ChartData {
    constructor(options) {
        /**
         * The array of points. Each point should have the format {x: X, y: Y}.
         */
        Object.defineProperty(this, "points", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * A selected point from the array above. Used internally by charting functions for hover/clicking functionality.
         */
        Object.defineProperty(this, "point", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Unique id for this set of points.
         */
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Name of the category for this set of points., eg. the source catalog item.
         */
        Object.defineProperty(this, "categoryName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Name for this set of points.
         */
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Units of this set of points.
         */
        Object.defineProperty(this, "units", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * A function that returns CSS color code for this set of points.
         *
         * We use a function instead of an immediate value so that colors can be
         * assigned lazily; only when it is required.
         */
        Object.defineProperty(this, "getColor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Minimum value for y axis to display, overriding minimum value in data.
         */
        Object.defineProperty(this, "yAxisMin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Maximum value for y axis to display, overriding maximum value in data.
         */
        Object.defineProperty(this, "yAxisMax", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Chart type. If you want these points to be rendered with a certain way. Leave empty for auto detection.
         */
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Click handler (called with (x, y) in data units) if some special behaviour is required on clicking.
         */
        Object.defineProperty(this, "onClick", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Request that the chart be scaled so that this series can be shown entirely.
         * @default true
         */
        Object.defineProperty(this, "showAll", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "yAxisWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.points = options.points;
        this.point = undefined;
        this.id = options.id;
        this.categoryName = options.categoryName;
        this.name = options.name;
        this.units = options.units;
        this.getColor = options.getColor;
        this.yAxisMin = options.yAxisMin;
        this.yAxisMax = options.yAxisMax;
        this.type = options.type;
        this.onClick = options.onClick;
        this.showAll = defaultValue(options.showAll, true);
        this.yAxisWidth = 40;
    }
    /**
     * Calculates the min and max x and y of the points.
     * If there are no points, returns undefined.
     * @return {Object} An object {x: [xmin, xmax], y: [ymin, ymax]}.
     */
    getDomain() {
        const points = this.points;
        if (points.length === 0) {
            return undefined;
        }
        return {
            x: [
                d3ArrayMin(points, (point) => point.x),
                d3ArrayMax(points, (point) => point.x)
            ],
            y: [
                d3ArrayMin(points, (point) => point.y),
                d3ArrayMax(points, (point) => point.y)
            ]
        };
    }
}
//# sourceMappingURL=ChartData.js.map