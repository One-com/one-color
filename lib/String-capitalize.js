(function () {
    /** @exports stringPrototype as String.prototype*/
    var stringPrototype = String.prototype;

    /**
     * <p>Returns this string with the char at first position in uppercase.</p>
     * <p>Example of use:</p><pre><code>
    "the brown Fox jumped over the lazy Dog".capitalize(); // = "The brown Fox jumped over the lazy Dog"
    </code></pre>
     * @return capitalized string.
     * @memberOf String.prototype
     */
    stringPrototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.substring(1);
    };
}());
