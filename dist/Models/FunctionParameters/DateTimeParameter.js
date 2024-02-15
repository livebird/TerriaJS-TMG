import FunctionParameter from "./FunctionParameter";
class DateTimeParameter extends FunctionParameter {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "dateTime"
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
                    format: "date-time",
                    "date-time": value
                }
            }
        });
    }
}
Object.defineProperty(DateTimeParameter, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "dateTime"
});
export default DateTimeParameter;
//# sourceMappingURL=DateTimeParameter.js.map