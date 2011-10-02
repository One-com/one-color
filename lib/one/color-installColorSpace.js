/*global one*/
one.include('js:one/color.js');
one.include('js:String-capitalize.js');

/*jslint evil:true*/

one.color.installedColorSpaces = [];

one.color.installColorSpace = function (colorSpaceName, propertyDefinitions, config) {
    var propertyNames = propertyDefinitions.map(function (propertyDefinition) {
            return propertyDefinition.match(/[A-Z]/)[0].toLowerCase();
        }),
        longPropertyNames = propertyDefinitions.map(function (propertyDefinition) {
            return propertyDefinition.toLowerCase().capitalize();
        }),
        Constructor = one.color[colorSpaceName] = new Function(propertyNames.join(","),
            // Allow passing an array to the constructor:
            "if (Object.prototype.toString.apply(" + propertyNames[0] + ") === '[object Array]') {" +
                propertyNames.map(function (propertyName, i) {
                    return propertyName + "=" + propertyNames[0] + "[" + i + "];";
                }).reverse().join("") +
            "}" +
            "if (" + propertyNames.filter(function (propertyName) {
                return propertyName !== 'a';
            }).map(function (propertyName) {
                return "isNaN(" + propertyName + ")";
            }).join("||") + "){" + "throw \"[one.color." + colorSpaceName + "]: Invalid color: (\"+" + propertyNames.join("+\",\"+") + "+\")\";}" +
            propertyNames.map(function (propertyName) {
                if (propertyName === 'h') {
                    return "this.h=h<0?h-Math.floor(h):h%1"; // Wrap
                } else if (propertyName === 'a') {
                    return "this.a=(isNaN(a)||a>1)?1:(a<0?0:a);";
                } else {
                    return "this." + propertyName + "=" + propertyName + "<0?0:(" + propertyName + ">1?1:" + propertyName + ")";
                }
            }).join(";") + ";"
        ),
        prototype = Constructor.prototype;

    Constructor.propertyNames = propertyNames;
    Constructor.longPropertyNames = longPropertyNames;

    ['valueOf', 'toHex', 'toCSS', 'toCSSWithAlpha'].forEach(function (methodName) {
        prototype[methodName] = prototype[methodName] || (colorSpaceName === 'RGB' ? prototype.toHex : new Function("return this.toRGB()." + methodName + "();"));
    });

    prototype.isColor = true;

    prototype.equals = function (otherColor, epsilon) {
        if (typeof epsilon === 'undefined') {
            epsilon = 1e-10;
        }

        otherColor = otherColor['to' + colorSpaceName]();

        for (var i = 0; i < propertyNames.length; i = i + 1) {
            if (Math.abs(this[propertyNames[i]] - otherColor[propertyNames[i]]) > epsilon) {
                return false;
            }
        }

        return true;
    };

    prototype.toJSON = new Function(
        "return ['" + colorSpaceName + "', " +
            propertyNames.map(function (propertyName) {
                return "this." + propertyName;
            }, this).join(", ") +
        "];"
    );

    if (config.fromRGB) {
        one.color.RGB.prototype['to' + colorSpaceName] = config.fromRGB;
        delete config.fromRGB;
    }
    for (var prop in config) {
        if (config.hasOwnProperty(prop)) {
            prototype[prop] = config[prop];
        }
    }

    // It is pretty easy to implement the conversion to the same color space:
    prototype['to' + colorSpaceName] = function () {
        return this;
    };
    prototype.toString = new Function("return \"[one.color." + colorSpaceName + ":\"+" + propertyNames.map(function (propertyName, i) {
        return "\" " + longPropertyNames[i] + "=\"+this." + propertyName;
    }).join("+") + "+\"]\";");

    // Generate getters and setters
    propertyNames.forEach(function (propertyName, i) {
        var longPropertyName = longPropertyNames[i];
        prototype['get' + longPropertyName] = new Function("return this." + propertyName + ";");
        prototype['set' + longPropertyName] = new Function("newValue", "return new this.constructor(" + propertyNames.map(function (otherPropertyName, i) {
            return propertyName === otherPropertyName ? "newValue" : "this." + otherPropertyName;
        }).join(", ") + ");");
        prototype['adjust' + longPropertyName] = new Function("delta", "return new this.constructor(" + propertyNames.map(function (otherPropertyName, i) {
            return "this." + otherPropertyName + (propertyName === otherPropertyName ? "+delta" : "");
        }).join(", ") + ");");
    });

    function installForeignMethods(targetColorSpaceName, sourceColorSpaceName) {
        var obj = {};
        obj['to' + sourceColorSpaceName] = new Function("return this.toRGB().to" + sourceColorSpaceName + "();"); // Fallback
        one.color[sourceColorSpaceName].propertyNames.forEach(function (property, i) {
            var longPropertyName = one.color[sourceColorSpaceName].longPropertyNames[i];
            obj['get' + longPropertyName] = new Function("return this.to" + sourceColorSpaceName + "().get" + longPropertyName + "();");
            obj['set' + longPropertyName] = new Function("newValue", "return this.to" + sourceColorSpaceName + "().set" + longPropertyName + "(newValue);");
            obj['adjust' + longPropertyName] = new Function("delta", "return this.to" + sourceColorSpaceName + "().adjust" + longPropertyName + "(delta);");
        });
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && one.color[targetColorSpaceName].prototype[prop] === undefined) {
                one.color[targetColorSpaceName].prototype[prop] = obj[prop];
            }
        }
    }

    one.color.installedColorSpaces.forEach(function (otherColorSpaceName) {
        installForeignMethods(colorSpaceName, otherColorSpaceName);
        installForeignMethods(otherColorSpaceName, colorSpaceName);
    });

    one.color.installedColorSpaces.push(colorSpaceName);
};
