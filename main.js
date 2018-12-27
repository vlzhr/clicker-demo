var defaults = {
    proportion: 900/565
};

var playground;

document.addEventListener("DOMContentLoaded", function() {
    playground = {
        node: document.querySelector(".playground"),
        style: document.querySelector(".playground").style,
        setSize: function() {
            if ((window.innerHeight / window.innerWidth) > defaults.proportion) {
                this.style.left = -(window.innerHeight / defaults.proportion - window.innerWidth) / 2 + "px";
                this.style.height = window.innerHeight + "px";
                this.style.width = window.innerHeight / defaults.proportion + "px";
            } else {
                this.style.top = -(window.innerWidth * defaults.proportion - window.innerHeight) / 2 + "px";
                this.style.width = window.innerWidth + "px";
                this.style.height = window.innerWidth * defaults.proportion + "px";
            }
        }
    };

    playground.setSize();
});

