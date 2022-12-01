var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed } from "mobx";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import HeadingPitchRoll from "terriajs-cesium/Source/Core/HeadingPitchRoll";
import Transforms from "terriajs-cesium/Source/Core/Transforms";
import ConstantPositionProperty from "terriajs-cesium/Source/DataSources/ConstantPositionProperty";
import ConstantProperty from "terriajs-cesium/Source/DataSources/ConstantProperty";
import CustomDataSource from "terriajs-cesium/Source/DataSources/CustomDataSource";
import Entity from "terriajs-cesium/Source/DataSources/Entity";
import ModelGraphics from "terriajs-cesium/Source/DataSources/ModelGraphics";
import HeightReference from "terriajs-cesium/Source/Scene/HeightReference";
import CatalogMemberMixin from "./CatalogMemberMixin";
import MappableMixin from "./MappableMixin";
import ShadowMixin from "./ShadowMixin";
import proxyCatalogItemUrl from "../Models/Catalog/proxyCatalogItemUrl";
// We want TS to look at the type declared in lib/ThirdParty/terriajs-cesium-extra/index.d.ts
// and import doesn't allows us to do that, so instead we use require + type casting to ensure
// we still maintain the type checking, without TS screaming with errors
const Axis = require("terriajs-cesium/Source/Scene/Axis").default;
function GltfMixin(Base) {
    class GltfMixin extends ShadowMixin(CatalogMemberMixin(MappableMixin(Base))) {
        get hasGltfMixin() {
            return true;
        }
        get cesiumUpAxis() {
            if (this.upAxis === undefined) {
                return Axis.Y;
            }
            return Axis.fromName(this.upAxis);
        }
        get cesiumForwardAxis() {
            if (this.forwardAxis === undefined) {
                return Axis.Z;
            }
            return Axis.fromName(this.forwardAxis);
        }
        get cesiumHeightReference() {
            const heightReference = 
            // @ts-ignore
            HeightReference[this.heightReference] || HeightReference.NONE;
            return heightReference;
        }
        get cesiumPosition() {
            if (this.origin !== undefined &&
                this.origin.longitude !== undefined &&
                this.origin.latitude !== undefined &&
                this.origin.height !== undefined) {
                return Cartesian3.fromDegrees(this.origin.longitude, this.origin.latitude, this.origin.height);
            }
            else {
                return Cartesian3.ZERO;
            }
        }
        /**
         * Returns the orientation of the model in the ECEF frame
         */
        get orientation() {
            const { heading, pitch, roll } = this.rotation;
            const hpr = HeadingPitchRoll.fromDegrees(heading !== null && heading !== void 0 ? heading : 0, pitch !== null && pitch !== void 0 ? pitch : 0, roll !== null && roll !== void 0 ? roll : 0);
            const orientation = Transforms.headingPitchRollQuaternion(this.cesiumPosition, hpr);
            return orientation;
        }
        get model() {
            if (this.gltfModelUrl === undefined) {
                return undefined;
            }
            const options = {
                uri: new ConstantProperty(proxyCatalogItemUrl(this, this.gltfModelUrl)),
                upAxis: new ConstantProperty(this.cesiumUpAxis),
                forwardAxis: new ConstantProperty(this.cesiumForwardAxis),
                scale: new ConstantProperty(this.scale !== undefined ? this.scale : 1),
                shadows: new ConstantProperty(this.cesiumShadows),
                heightReference: new ConstantProperty(this.cesiumHeightReference)
            };
            return new ModelGraphics(options);
        }
        forceLoadMetadata() {
            return Promise.resolve();
        }
        forceLoadMapItems() {
            return Promise.resolve();
        }
        get shortReport() {
            if (this.terria.currentViewer.type === "Leaflet") {
                return i18next.t("models.commonModelErrors.3dTypeIn2dMode", this);
            }
            return super.shortReport;
        }
        get mapItems() {
            if (this.model === undefined) {
                return [];
            }
            this.model.show = new ConstantProperty(this.show);
            const dataSource = new CustomDataSource(this.name || "glTF model");
            dataSource.entities.add(new Entity({
                position: new ConstantPositionProperty(this.cesiumPosition),
                orientation: new ConstantProperty(this.orientation),
                model: this.model
            }));
            return [dataSource];
        }
    }
    __decorate([
        computed
    ], GltfMixin.prototype, "cesiumUpAxis", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "cesiumForwardAxis", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "cesiumHeightReference", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "cesiumPosition", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "orientation", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "model", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "shortReport", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "mapItems", null);
    return GltfMixin;
}
(function (GltfMixin) {
    function isMixedInto(model) {
        return model && model.hasGltfMixin;
    }
    GltfMixin.isMixedInto = isMixedInto;
})(GltfMixin || (GltfMixin = {}));
export default GltfMixin;
//# sourceMappingURL=GltfMixin.js.map