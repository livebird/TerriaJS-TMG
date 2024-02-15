var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import { traitClass } from "../Trait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import { GeoJsonTraits } from "./GeoJsonTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import UrlTraits from "./UrlTraits";
let ArcGisFeatureServerCatalogItemTraits = class ArcGisFeatureServerCatalogItemTraits extends mixTraits(UrlTraits, MappableTraits, CatalogMemberTraits, LegendOwnerTraits, GeoJsonTraits) {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "clampToGround", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "useStyleInformationFromService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "layerDef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "1=1"
        });
        Object.defineProperty(this, "where", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "1=1"
        });
        Object.defineProperty(this, "maxFeatures", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5000
        });
        Object.defineProperty(this, "featuresPerRequest", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        });
        Object.defineProperty(this, "supportsPagination", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Clamp to Ground",
        description: "Whether the features in this service should be clamped to the terrain surface."
    })
], ArcGisFeatureServerCatalogItemTraits.prototype, "clampToGround", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Use style information from service",
        description: "Whether to symbolise the data using the drawingInfo object available in the service endpoint."
    })
], ArcGisFeatureServerCatalogItemTraits.prototype, "useStyleInformationFromService", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "layerDef",
        description: "DEPRECATED, use `where` instead. The 'layerDef' string to pass to the server when requesting geometry."
    })
], ArcGisFeatureServerCatalogItemTraits.prototype, "layerDef", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Where clause",
        description: "The 'where' string to pass to the server when requesting geometry."
    })
], ArcGisFeatureServerCatalogItemTraits.prototype, "where", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Maximum features",
        description: "The maximum number of features to be retrieved from the feature service."
    })
], ArcGisFeatureServerCatalogItemTraits.prototype, "maxFeatures", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Features per request",
        description: "The number of features to be retrieved from the feature service in each request. This should be equal to the " +
            "maxRecordCount specified by the server."
    })
], ArcGisFeatureServerCatalogItemTraits.prototype, "featuresPerRequest", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Supports pagination",
        description: "Whether this feature service supports pagination. By default, this will be inferred from the server's response."
    })
], ArcGisFeatureServerCatalogItemTraits.prototype, "supportsPagination", void 0);
ArcGisFeatureServerCatalogItemTraits = __decorate([
    traitClass({
        description: `Creates a single item in the catalog from one ESRI WFS layer.

  <strong>Note:</strong> <i>Must specify <b>layer ID</b>, e.g. <code>/0</code>, in the URL path.</i>`,
        example: {
            url: "https://services5.arcgis.com/OvOcYIrJnM97ABBA/arcgis/rest/services/Australian_Public_Hospitals_WFL1/FeatureServer/0",
            type: "esri-featureServer",
            name: "Australian Public Hospitals",
            id: "some id"
        }
    })
], ArcGisFeatureServerCatalogItemTraits);
export default ArcGisFeatureServerCatalogItemTraits;
//# sourceMappingURL=ArcGisFeatureServerCatalogItemTraits.js.map