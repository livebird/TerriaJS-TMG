import FunctionParameter from "./FunctionParameter";
class DateParameter extends FunctionParameter {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "date"
        });
        Object.defineProperty(this, "variant", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "complex"
        });
    }
    /**
     * Process value so that it can be used in an URL.
     */
    static formatValueForUrl(value) {
        return JSON.stringify({
            type: "object",
            properties: {
                timestamp: {
                    type: "string",
                    format: "date",
                    date: value
                }
            }
        });
    }
}
Object.defineProperty(DateParameter, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "date"
});
export default DateParameter;
//# sourceMappingURL=DateParameter.js.map