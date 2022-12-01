var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Point from "@mapbox/point-geometry";
import bbox from "@turf/bbox";
import booleanIntersects from "@turf/boolean-intersects";
import circle from "@turf/circle";
import i18next from "i18next";
import { cloneDeep } from "lodash-es";
import { action, observable, runInAction } from "mobx";
import { Labelers, LineSymbolizer, painter, PmtilesSource, TileCache, View, ZxySource } from "protomaps";
import Cartographic from "terriajs-cesium/Source/Core/Cartographic";
import Credit from "terriajs-cesium/Source/Core/Credit";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import CesiumEvent from "terriajs-cesium/Source/Core/Event";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import WebMercatorTilingScheme from "terriajs-cesium/Source/Core/WebMercatorTilingScheme";
import ImageryLayerFeatureInfo from "terriajs-cesium/Source/Scene/ImageryLayerFeatureInfo";
import filterOutUndefined from "../../Core/filterOutUndefined";
import isDefined from "../../Core/isDefined";
import TerriaError from "../../Core/TerriaError";
import { FEATURE_ID_PROP as GEOJSON_FEATURE_ID_PROP, toFeatureCollection } from "../../ModelMixins/GeojsonMixin";
const geojsonvt = require("geojson-vt").default;
/** Buffer (in pixels) used when rendering (and generating - through geojson-vt) vector tiles */
const BUF = 64;
/** Tile size in pixels (for canvas and geojson-vt) */
const tileSize = 256;
/** Extent (of coordinates) of tiles generated by geojson-vt */
const geojsonvtExtent = 4096;
/** Layer name to use with geojson-vt
 *  This must be used in PaintRules/LabelRules (eg `dataLayer: "layer"`)
 */
export const GEOJSON_SOURCE_LAYER_NAME = "layer";
const LAYER_NAME_PROP = "__LAYERNAME";
export class GeojsonSource {
    constructor(url) {
        this.data = url;
        if (!(typeof url === "string")) {
            this.geojsonObject = url;
        }
    }
    /** Fetch geoJSON data (if required) and tile with geojson-vt */
    async fetchData() {
        let result;
        if (typeof this.data === "string") {
            result = toFeatureCollection(await (await fetch(this.data)).json());
        }
        else {
            result = this.data;
        }
        runInAction(() => (this.geojsonObject = result));
        return geojsonvt(result, {
            buffer: (BUF / tileSize) * geojsonvtExtent,
            extent: geojsonvtExtent,
            maxZoom: 24
        });
    }
    async get(c, tileSize) {
        if (!this.tileIndex) {
            this.tileIndex = this.fetchData();
        }
        // request a particular tile
        const tile = (await this.tileIndex).getTile(c.z, c.x, c.y);
        let result = new Map();
        const scale = tileSize / geojsonvtExtent;
        if (tile && tile.features && tile.features.length > 0) {
            result.set(GEOJSON_SOURCE_LAYER_NAME, 
            // We have to transform feature objects from GeojsonVtTile to ProtomapsFeature
            tile.features.map((f) => {
                let transformedGeom = [];
                let numVertices = 0;
                // Calculate bbox
                let bbox = {
                    minX: Infinity,
                    minY: Infinity,
                    maxX: -Infinity,
                    maxY: -Infinity
                };
                // Multi geometry (eg polygon, multi-line string)
                if (Array.isArray(f.geometry[0][0])) {
                    const geom = f.geometry;
                    transformedGeom = geom.map((g1) => g1.map((g2) => {
                        g2 = [g2[0] * scale, g2[1] * scale];
                        if (bbox.minX > g2[0]) {
                            bbox.minX = g2[0];
                        }
                        if (bbox.maxX < g2[0]) {
                            bbox.maxX = g2[0];
                        }
                        if (bbox.minY > g2[1]) {
                            bbox.minY = g2[1];
                        }
                        if (bbox.maxY < g2[1]) {
                            bbox.maxY = g2[1];
                        }
                        return new Point(g2[0], g2[1]);
                    }));
                    numVertices = transformedGeom.reduce((count, current) => count + current.length, 0);
                }
                // Flat geometry (line string, point)
                else {
                    const geom = f.geometry;
                    transformedGeom = [
                        geom.map((g1) => {
                            g1 = [g1[0] * scale, g1[1] * scale];
                            if (bbox.minX > g1[0]) {
                                bbox.minX = g1[0];
                            }
                            if (bbox.maxX < g1[0]) {
                                bbox.maxX = g1[0];
                            }
                            if (bbox.minY > g1[1]) {
                                bbox.minY = g1[1];
                            }
                            if (bbox.maxY < g1[1]) {
                                bbox.maxY = g1[1];
                            }
                            return new Point(g1[0], g1[1]);
                        })
                    ];
                    numVertices = transformedGeom.length;
                }
                const feature = {
                    props: f.tags,
                    bbox,
                    geomType: f.type,
                    geom: transformedGeom,
                    numVertices
                };
                return feature;
            }));
        }
        return result;
    }
}
__decorate([
    observable.ref
], GeojsonSource.prototype, "geojsonObject", void 0);
export default class ProtomapsImageryProvider {
    constructor(options) {
        this.errorEvent = new CesiumEvent();
        this.ready = true;
        // Set values to please poor cesium types
        this.defaultNightAlpha = undefined;
        this.defaultDayAlpha = undefined;
        this.hasAlphaChannel = true;
        this.defaultAlpha = undefined;
        this.defaultBrightness = undefined;
        this.defaultContrast = undefined;
        this.defaultGamma = undefined;
        this.defaultHue = undefined;
        this.defaultSaturation = undefined;
        this.defaultMagnificationFilter = undefined;
        this.defaultMinificationFilter = undefined;
        this.proxy = undefined;
        this.readyPromise = Promise.resolve(true);
        this.tileDiscardPolicy = undefined;
        this.data = options.data;
        this.terria = options.terria;
        this.tilingScheme = new WebMercatorTilingScheme();
        this.tileWidth = tileSize;
        this.tileHeight = tileSize;
        this.minimumLevel = defaultValue(options.minimumZoom, 0);
        this.maximumLevel = defaultValue(options.maximumZoom, 24);
        this.rectangle = isDefined(options.rectangle)
            ? Rectangle.intersection(options.rectangle, this.tilingScheme.rectangle) || this.tilingScheme.rectangle
            : this.tilingScheme.rectangle;
        // Check the number of tiles at the minimum level.  If it's more than four,
        // throw an exception, because starting at the higher minimum
        // level will cause too many tiles to be downloaded and rendered.
        const swTile = this.tilingScheme.positionToTileXY(Rectangle.southwest(this.rectangle), this.minimumLevel);
        const neTile = this.tilingScheme.positionToTileXY(Rectangle.northeast(this.rectangle), this.minimumLevel);
        const tileCount = (Math.abs(neTile.x - swTile.x) + 1) * (Math.abs(neTile.y - swTile.y) + 1);
        if (tileCount > 4) {
            throw new DeveloperError(i18next.t("map.mapboxVectorTileImageryProvider.moreThanFourTiles", {
                tileCount: tileCount
            }));
        }
        this.errorEvent = new CesiumEvent();
        this.ready = true;
        this.credit =
            typeof options.credit == "string"
                ? new Credit(options.credit)
                : options.credit;
        // Protomaps
        this.paintRules = options.paintRules;
        this.labelRules = options.labelRules;
        // Generate protomaps source based on this.data
        // - URL of pmtiles, geojson or pbf files
        if (typeof this.data === "string") {
            if (this.data.endsWith(".pmtiles")) {
                this.source = new PmtilesSource(this.data, false);
                let cache = new TileCache(this.source, 1024);
                this.view = new View(cache, 14, 2);
            }
            else if (this.data.endsWith(".json") ||
                this.data.endsWith(".geojson")) {
                this.source = new GeojsonSource(this.data);
            }
            else {
                this.source = new ZxySource(this.data, false);
                let cache = new TileCache(this.source, 1024);
                this.view = new View(cache, 14, 2);
            }
        }
        // Source object
        else if (this.data instanceof GeojsonSource ||
            this.data instanceof PmtilesSource ||
            this.data instanceof ZxySource) {
            this.source = this.data;
        }
        // - GeoJsonObject object
        else {
            this.source = new GeojsonSource(this.data);
        }
        const labelersCanvasContext = document
            .createElement("canvas")
            .getContext("2d");
        if (!labelersCanvasContext)
            throw TerriaError.from("Failed to create labelersCanvasContext");
        this.labelers = new Labelers(labelersCanvasContext, this.labelRules, 16, () => undefined);
    }
    getTileCredits(x, y, level) {
        return [];
    }
    async requestImage(x, y, level) {
        const canvas = document.createElement("canvas");
        canvas.width = this.tileWidth;
        canvas.height = this.tileHeight;
        return await this.requestImageForCanvas(x, y, level, canvas);
    }
    async requestImageForCanvas(x, y, level, canvas) {
        try {
            await this.renderTile({ x, y, z: level }, canvas);
        }
        catch (e) {
            console.log(e);
        }
        return canvas;
    }
    async renderTile(coords, canvas) {
        // Adapted from https://github.com/protomaps/protomaps.js/blob/master/src/frontends/leaflet.ts
        let tile = undefined;
        // Get PreparedTile from source or view
        // Here we need a little bit of extra logic for the GeojsonSource
        if (this.source instanceof GeojsonSource) {
            const data = await this.source.get(coords, this.tileHeight);
            tile = {
                data: data,
                z: coords.z,
                data_tile: coords,
                scale: 1,
                origin: new Point(coords.x * 256, coords.y * 256),
                dim: this.tileWidth
            };
        }
        else if (this.view) {
            tile = await this.view.getDisplayTile(coords);
        }
        if (!tile)
            return;
        const tileMap = new Map().set("", [tile]);
        this.labelers.add(coords.z, tileMap);
        let labelData = this.labelers.getIndex(tile.z);
        const bbox = {
            minX: 256 * coords.x - BUF,
            minY: 256 * coords.y - BUF,
            maxX: 256 * (coords.x + 1) + BUF,
            maxY: 256 * (coords.y + 1) + BUF
        };
        const origin = new Point(256 * coords.x, 256 * coords.y);
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        ctx.setTransform(this.tileWidth / 256, 0, 0, this.tileHeight / 256, 0, 0);
        ctx.clearRect(0, 0, 256, 256);
        if (labelData)
            painter(ctx, coords.z, tileMap, labelData, this.paintRules, bbox, origin, false, "");
    }
    async pickFeatures(x, y, level, longitude, latitude) {
        // If view is set - this means we are using actual vector tiles (that is not GeoJson object)
        // So we use this.view.queryFeatures
        if (this.view) {
            // Get list of vector tile layers which are rendered
            const renderedLayers = [...this.paintRules, ...this.labelRules].map((r) => r.dataLayer);
            return filterOutUndefined(this.view
                .queryFeatures(CesiumMath.toDegrees(longitude), CesiumMath.toDegrees(latitude), level)
                .map((f) => {
                var _a;
                // Only create FeatureInfo for visible features with properties
                if (!f.feature.props ||
                    f.feature.props === {} ||
                    !renderedLayers.includes(f.layerName))
                    return;
                const featureInfo = new ImageryLayerFeatureInfo();
                // Add Layer name property
                featureInfo.properties = Object.assign({ [LAYER_NAME_PROP]: f.layerName }, (_a = f.feature.props) !== null && _a !== void 0 ? _a : {});
                featureInfo.position = new Cartographic(longitude, latitude);
                featureInfo.configureDescriptionFromProperties(f.feature.props);
                featureInfo.configureNameFromProperties(f.feature.props);
                return featureInfo;
            }));
            // No view is set and we have geoJSON object
            // So we pick features manually
        }
        else if (this.source instanceof GeojsonSource &&
            this.source.geojsonObject) {
            // Create circle with 10 pixel radius to pick features
            const buffer = circle([CesiumMath.toDegrees(longitude), CesiumMath.toDegrees(latitude)], 10 * this.terria.mainViewer.scale, {
                steps: 10,
                units: "meters"
            });
            // Create wrappedBuffer with only positive coordinates - this is needed for features which overlap antemeridian
            const wrappedBuffer = cloneDeep(buffer);
            wrappedBuffer.geometry.coordinates.forEach((ring) => ring.forEach((point) => {
                point[0] = point[0] < 0 ? point[0] + 360 : point[0];
            }));
            const bufferBbox = bbox(buffer);
            // Get array of all features
            let features = this.source.geojsonObject.features;
            const pickedFeatures = [];
            for (let index = 0; index < features.length; index++) {
                const feature = features[index];
                if (!feature.bbox) {
                    feature.bbox = bbox(feature);
                }
                // Filter by bounding box and then intersection with buffer (to minimize calls to booleanIntersects)
                if (Math.max(feature.bbox[0], 
                // Wrap buffer bbox if necessary
                feature.bbox[0] > 180 ? bufferBbox[0] + 360 : bufferBbox[0]) <=
                    Math.min(feature.bbox[2], 
                    // Wrap buffer bbox if necessary
                    feature.bbox[2] > 180 ? bufferBbox[2] + 360 : bufferBbox[2]) &&
                    Math.max(feature.bbox[1], bufferBbox[1]) <=
                        Math.min(feature.bbox[3], bufferBbox[3])) {
                    // If we have longitudes greater than 180 - used wrappedBuffer
                    if (feature.bbox[0] > 180 || feature.bbox[2] > 180) {
                        if (booleanIntersects(feature, wrappedBuffer))
                            pickedFeatures.push(feature);
                    }
                    else if (booleanIntersects(feature, buffer))
                        pickedFeatures.push(feature);
                }
            }
            // Convert pickedFeatures to ImageryLayerFeatureInfos
            return pickedFeatures.map((f) => {
                const featureInfo = new ImageryLayerFeatureInfo();
                featureInfo.data = f;
                featureInfo.properties = f.properties;
                if (f.geometry.type === "Point" &&
                    typeof f.geometry.coordinates[0] === "number" &&
                    typeof f.geometry.coordinates[1] === "number") {
                    featureInfo.position = Cartographic.fromDegrees(f.geometry.coordinates[0], f.geometry.coordinates[1]);
                }
                featureInfo.configureDescriptionFromProperties(f.properties);
                featureInfo.configureNameFromProperties(f.properties);
                return featureInfo;
            });
        }
        return [];
    }
    clone(options) {
        var _a, _b, _c, _d, _e, _f, _g;
        let data = options === null || options === void 0 ? void 0 : options.data;
        // To clone data/source, we want to minimize any unnecessary processing
        if (!data) {
            // These can be passed straight in without processing
            if (typeof this.data === "string" || this.data instanceof PmtilesSource) {
                data = this.data;
                // We can't just clone ZxySource objects, so just pass in URL
            }
            else if (this.data instanceof ZxySource) {
                data = this.data.url;
                // If GeojsonSource was passed into data, create new one and copy over tileIndex
            }
            else if (this.data instanceof GeojsonSource) {
                if (this.data.geojsonObject) {
                    data = new GeojsonSource(this.data.geojsonObject);
                    // Copy over tileIndex so it doesn't have to be re-processed
                    data.tileIndex = this.data.tileIndex;
                }
                // If GeoJson FeatureCollection was passed into data (this.data), and the source is GeojsonSource
                // create a GeojsonSource with the GeoJson and copy over tileIndex
            }
            else if (this.source instanceof GeojsonSource) {
                data = new GeojsonSource(this.data);
                // Copy over tileIndex so it doesn't have to be re-processed
                data.tileIndex = this.source.tileIndex;
            }
        }
        if (!data)
            return;
        return new ProtomapsImageryProvider({
            terria: (_a = options === null || options === void 0 ? void 0 : options.terria) !== null && _a !== void 0 ? _a : this.terria,
            data,
            minimumZoom: (_b = options === null || options === void 0 ? void 0 : options.minimumZoom) !== null && _b !== void 0 ? _b : this.minimumLevel,
            maximumZoom: (_c = options === null || options === void 0 ? void 0 : options.maximumZoom) !== null && _c !== void 0 ? _c : this.maximumLevel,
            maximumNativeZoom: options === null || options === void 0 ? void 0 : options.maximumNativeZoom,
            rectangle: (_d = options === null || options === void 0 ? void 0 : options.rectangle) !== null && _d !== void 0 ? _d : this.rectangle,
            credit: (_e = options === null || options === void 0 ? void 0 : options.credit) !== null && _e !== void 0 ? _e : this.credit,
            paintRules: (_f = options === null || options === void 0 ? void 0 : options.paintRules) !== null && _f !== void 0 ? _f : this.paintRules,
            labelRules: (_g = options === null || options === void 0 ? void 0 : options.labelRules) !== null && _g !== void 0 ? _g : this.labelRules
        });
    }
    /** Clones ImageryProvider, and sets paintRules to highlight picked features */
    createHighlightImageryProvider(feature) {
        var _a, _b, _c, _d;
        // Depending on this.source, feature IDs might be FID (for actual vector tile sources) or they will use GEOJSON_FEATURE_ID_PROP
        let featureProp;
        // Similarly, feature layer name will be LAYER_NAME_PROP for mvt, whereas GeoJSON features will use the constant GEOJSON_SOURCE_LAYER_NAME
        let layerName;
        if (this.source instanceof GeojsonSource) {
            featureProp = GEOJSON_FEATURE_ID_PROP;
            layerName = GEOJSON_SOURCE_LAYER_NAME;
        }
        else {
            featureProp = "FID";
            layerName = (_b = (_a = feature.properties) === null || _a === void 0 ? void 0 : _a[LAYER_NAME_PROP]) === null || _b === void 0 ? void 0 : _b.getValue();
        }
        const featureId = (_d = (_c = feature.properties) === null || _c === void 0 ? void 0 : _c[featureProp]) === null || _d === void 0 ? void 0 : _d.getValue();
        if (isDefined(featureId) && isDefined(layerName)) {
            return this.clone({
                labelRules: [],
                paintRules: [
                    {
                        dataLayer: layerName,
                        symbolizer: new LineSymbolizer({
                            color: this.terria.baseMapContrastColor,
                            width: 4
                        }),
                        minzoom: 0,
                        maxzoom: Infinity,
                        filter: (zoom, feature) => { var _a; return ((_a = feature.props) === null || _a === void 0 ? void 0 : _a[featureProp]) === featureId; }
                    }
                ]
            });
        }
        return;
    }
}
__decorate([
    action
], ProtomapsImageryProvider.prototype, "createHighlightImageryProvider", null);
//# sourceMappingURL=ProtomapsImageryProvider.js.map