import Resource from "terriajs-cesium/Source/Core/Resource";
export function loadJsonp(urlOrResource, callbackParameterName) {
    const resource = typeof urlOrResource === "string"
        ? new Resource({ url: urlOrResource })
        : urlOrResource;
    return resource.fetchJsonp(callbackParameterName);
}
Object.defineProperties(loadJsonp, {
    loadAndExecuteScript: {
        get: function () {
            return Resource._Implementations.loadAndExecuteScript;
        },
        set: function (value) {
            Resource._Implementations.loadAndExecuteScript = value;
        }
    },
    defaultLoadAndExecuteScript: {
        get: function () {
            return Resource._DefaultImplementations.loadAndExecuteScript;
        }
    }
});
//# sourceMappingURL=loadJsonp.js.map