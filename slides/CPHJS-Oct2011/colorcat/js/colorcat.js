window.onload = function () {
    var backgrounds = [
        'background-color',
        'background-image'
    ];
    var directions = [
        'top',
        'right',
        'bottom',
        'left'
    ];
    var colorElements = [];
    var traverse = function (el, fn) {
        fn(el);
        for (var i = 0; i < el.childNodes.length; i += 1) {
            if (el.childNodes[i].nodeType === 1) {
                traverse(el.childNodes[i], fn);
            }
        }
    };
    var registerColor = function (el) {
        var cs = getComputedStyle(el),
            styles = [],
            match = false;

        var color = cs.getPropertyCSSValue('color').cssText;
        if (color !== 'rgb(255, 255, 255)') {
            styles.push({
                property: 'color',
                value: one.color.parse(color)
            });
        }

        backgrounds.forEach(function (prop) {
            var val = cs.getPropertyCSSValue(prop).cssText;
            if (val !== 'none' && val !== 'rgba(0, 0, 0, 0)') {
                var color = one.color.parse(val);
                if (color) {
                    styles.push({
                        property: prop,
                        value: one.color.parse(val)
                    });
                } else {
                    var colorStrings = val.match(/rgba?\([^\(]+?\)/g),
                        colors = colorStrings.map(function (rgbaStr) {
                            return one.color.parse(rgbaStr);
                        });

                    for (var i = 0; i < colorStrings.length; i+=1) {
                        val = val.replace(colorStrings[i], '[' + i + ']');
                    }

                    styles.push({
                        property: prop,
                        value: {
                            tpl: val,
                            colors: colors
                        }
                    });
                }
            }
        });
        directions.forEach(function (dir) {
            var val = cs.getPropertyCSSValue('border-' + dir + '-width').cssText;
            if (val !== '0px') {
                styles.push({
                    property: 'border-' + dir + '-color',
                    value: one.color.parse(cs.getPropertyCSSValue('border-' + dir + '-color').cssText)
                });
             }
        });

        if (styles.length) {
            colorElements.push({
                el: el,
                styles: styles
            });
        }
    };

    var colorize = function (fn) {
        colorElements.forEach(function (item) {
            item.styles.forEach(function (style) {
                if (style.value.isColor) {
                    item.el.style[style.property] = fn(style.value).toCSSWithAlpha();
                } else if (style.value.colors) {
                    var val = style.value.tpl;
                    style.value.colors.forEach(function (color, idx) {
                        val = val.replace('[' + idx + ']', fn(color).toCSSWithAlpha());
                    });
                    item.el.style[style.property] = val;
                }
            });
        });
    };

    traverse(document.getElementById('mainContainer'), registerColor);
    colorElements.forEach(function (item) {
        item.styles.map(function (style) {
            style.property = style.property.replace(/-(\w)/g, function (str, p1) {
                return p1.toUpperCase();
            });
            return style;
        });
    });

    var channels = [
        'Red',
        'Green',
        'Blue',
        'Hue',
        'Saturation',
        'Value',
        'Cyan',
        'Magenta',
        'Yellow',
        'Black',
        'Alpha'
    ];
    var handler = function (e) {
        colorize(function (color) {
            inputs.forEach(function (input) {
                var val = parseFloat(input.value);

                color = color[(input.name === 'Alpha' ? 'set' : 'adjust') + input.name](val);
            });
            return color;
        });
    };
    var inputs = channels.map(function (channel) {
        var input = document.getElementById(channel);
        input.onchange = handler;
        return input;
    });
};