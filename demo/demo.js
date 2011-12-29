window.onload = function () {
    var demo = {
        rainbow: function (el) {
            el.innerHTML = '<span>' + el.innerHTML.split('').join('</span><span>') + '</span>';

            var collection = el.getElementsByTagName('span'),
                len = collection.length,
                frac = 1 / (len + 1);

            window.setInterval(function () {
                var date = new Date().getTime();
                for (var i = 0; i < len; i += 1) {
                    collection[i].style.color = new one.color.HSV(
                        i * frac + date / 10000,
                        (1 + Math.cos(date/1000)) / 3 + 0.2,
                        1,
                        (1 + Math.sin(date/1000)) / 3 + 0.5
                    ).cssa();

                }
            }, 100);
        }
    };

    document.getElementById('demo').onclick = function () {
        demo.rainbow(document.getElementsByTagName('h1')[0]);
        demo.rainbow(document.getElementsByTagName('h2')[0]);

        document.getElementById('demo').onclick = function () {
            return false;
        }

        return false;
    }
}