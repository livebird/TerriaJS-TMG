var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectArrayTrait from "../Decorators/objectArrayTrait";
import objectTrait from "../Decorators/objectTrait";
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import { BinStyleTraits, EnumStyleTraits, TableStyleMapSymbolTraits, TableStyleMapTraits } from "./TableStyleMapTraits";
export class PointSymbolTraits extends mixTraits(TableStyleMapSymbolTraits) {
    constructor() {
        super(...arguments);
        this.marker = "point";
        this.height = 16;
        this.width = 16;
    }
}
__decorate([
    primitiveTrait({
        name: "Value",
        description: "The enumerated value to map to a color.",
        type: "string"
    })
], PointSymbolTraits.prototype, "marker", void 0);
__decorate([
    primitiveTrait({
        name: "Color",
        description: "The CSS color to use for the enumerated value.",
        type: "number"
    })
], PointSymbolTraits.prototype, "rotation", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Color",
        description: "The CSS color to use for the enumerated value.",
        type: "number"
    })
], PointSymbolTraits.prototype, "pixelOffset", void 0);
__decorate([
    primitiveTrait({
        name: "Color",
        description: "The CSS color to use for the enumerated value.",
        type: "number"
    })
], PointSymbolTraits.prototype, "height", void 0);
__decorate([
    primitiveTrait({
        name: "Color",
        description: "The CSS color to use for the enumerated value.",
        type: "number"
    })
], PointSymbolTraits.prototype, "width", void 0);
export class EnumPointSymbolTraits extends mixTraits(PointSymbolTraits, EnumStyleTraits) {
}
EnumPointSymbolTraits.isRemoval = EnumStyleTraits.isRemoval;
export class BinPointSymbolTraits extends mixTraits(PointSymbolTraits, BinStyleTraits) {
}
BinPointSymbolTraits.isRemoval = BinStyleTraits.isRemoval;
export default class TablePointStyleTraits extends mixTraits(TableStyleMapTraits) {
    constructor() {
        super(...arguments);
        this.enum = [];
        this.bin = [];
        this.null = new PointSymbolTraits();
    }
}
__decorate([
    objectArrayTrait({
        name: "Enum Colors",
        description: "The colors to use for enumerated values. This property is ignored " +
            "if the `Color Column` type is not `enum`.",
        type: EnumPointSymbolTraits,
        idProperty: "index"
    })
], TablePointStyleTraits.prototype, "enum", void 0);
__decorate([
    objectArrayTrait({
        name: "Enum Colors",
        description: "The colors to use for enumerated values. This property is ignored " +
            "if the `Color Column` type is not `enum`.",
        type: BinPointSymbolTraits,
        idProperty: "index"
    })
], TablePointStyleTraits.prototype, "bin", void 0);
__decorate([
    objectTrait({
        name: "Enum Colors",
        description: "The colors to use for enumerated values. This property is ignored " +
            "if the `Color Column` type is not `enum`.",
        type: PointSymbolTraits
    })
], TablePointStyleTraits.prototype, "null", void 0);
//# sourceMappingURL=TablePointStyleTraits.js.map