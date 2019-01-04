var defaults = {
    proportion: 900/565,
    groundProportion: 69/142, //  = height / width
    interval: 1000
};

var score = 0;
score.__proto__.tryChange = function (value) {
    if (score >= value) {
        panel.changeScore(-value);
        return true;
    }
    return false;
};


var triggers = [
    {
        limit: 1,
        reaction: function () {
            window.grounds[1].setLightened();
        }
    },
    {
        limit: 30,
        reaction: function () {
            window.grounds[2].setLightened();
        }
    },
    {
        limit: 1000,
        reaction: function () {
            window.grounds[3].setLightened();
        }
    }
];
function trigger() {
    if (score >= triggers[0].limit) {
        triggers[0].reaction();
        triggers.splice(0, 1);
    }
}


function Ground(name, active, productivity, price, loc) {
    // stages: closed,
    this.name = name;
    this.x = loc[0];
    this.y = loc[1];
    this.type = name;
    this.price = price;
    this.active = active === "active";
    this.bg = "images/closed-ground.png";
    this.productivity = productivity;
    this.readyValue = 1;  // 0 or 1
    this.addNode = () => {
        this.node = document.createElement("div");
        this.node.classList.add("ground");
        this.node.classList.add("ground-"+this.name);
        this.node.style.top = this.y + "%";
        this.node.style.left = this.x + "%";
        this.node.addEventListener("click", this.click);

        this.bgNode = document.createElement("img");
        this.bgNode.src = this.bg;
        this.bgNode.classList.add("ground-bg");
        this.node.appendChild(this.bgNode);

        if (this.active) { this.setActive() }
        else { this.showPriceNode() }
    };
    this.showPriceNode = () => {
        this.priceNode = document.createElement("div");
        this.priceNode.classList.add("ground-price");

        this.priceNodeLabel = document.createElement("div");
        this.priceNodeLabel.classList.add("ground-price-label");
        this.priceNodeLabel.innerText = this.price;

        this.priceNodeIcon = document.createElement("div");
        this.priceNodeIcon.classList.add("ground-price-icon");

        this.priceNode.appendChild(this.priceNodeIcon);
        this.priceNode.appendChild(this.priceNodeLabel);
        this.node.appendChild(this.priceNode);
    };
    this.hidePriceNode = () => {
        if (this.priceNode) { this.priceNode.classList.add("hidden"); }
    };
    this.addLoadingBar  = () => {
        this.loadingBarNode = document.createElement("div");
        this.loadingBarNode.classList.add("loading-bar");
        this.loadingBarNode.style["top"] = defaults.groundHeight - 9 + "px";
        this.node.appendChild(this.loadingBarNode);

        this.loadingBarLabelNode = document.createElement("div");
        this.loadingBarLabelNode.classList.add("loading-bar-label");
        this.loadingBarLabelNode.style["top"] = defaults.groundHeight + "px";
        this.loadingBarLabelNode.innerText = this.productivity;
        this.node.appendChild(this.loadingBarLabelNode);
    };
    this.setActive = () => {
        this.active = true;
        this.hidePriceNode();
        this.addLoadingBar();
        this.actionNode = document.createElement("img");
        this.actionNode.src = "animations/" + this.name + "/2.gif";
        this.bgNode.src = "images/opened-ground.png";
        this.actionNode.classList.add("action-animation");
        this.bgNode.classList.remove("lightened");
        this.bgNode.classList.add("active");
        this.node.appendChild(this.actionNode);
    };
    this.setLightened = () => {
        this.bgNode.src= "images/lightened-ground.png";
        this.bgNode.classList.add("lightened");
    };
    this.show = () => {
        this.addNode();
        window.playground.node.appendChild(this.node);
    };
    this.animateAction = () => {
        this.actionNode.src = "animations/" + this.name + "/3.gif";
        this.loadingBarNode.classList.add("animated");
        window.setTimeout(() => {
            this.actionNode.src = "animations/" + this.name + "/2.gif";
            this.loadingBarNode.classList.remove("animated");
        }, defaults.interval);
    };
    this.click = (event) => {
        cursor.hide();
        if (!this.active) {
            if (score.tryChange(this.price)) {
                if (active === "final") { winscreen.show() }
                else { this.setActive(); }
            }
        }
        else if (this.readyValue) {
            this.readyValue = 0;
            window.setTimeout(() => { window.panel.changeScore(this.productivity); }, 1000);
            this.animateAction();
            movingIcon.fly(event.clientX, event.clientY);
            window.setTimeout(() => {
                this.readyValue=1;
                trigger();
            }, 1000);
        }
    };
}

document.addEventListener("DOMContentLoaded", function() {
    window.playground = {
        node: document.querySelector(".playground"),
        style: document.querySelector(".playground").style,
        setSize: function() {
            if (window.innerWidth > 430) {
                this.left = 0;
                this.height = 600;
                this.width = 377;
            }
            else if ((window.innerHeight / window.innerWidth) > defaults.proportion) {
                this.left = -(window.innerHeight / defaults.proportion - window.innerWidth) / 2;
                this.height = window.innerHeight;
                this.width = window.innerHeight / defaults.proportion;
            } else {
                this.top = -(window.innerWidth * defaults.proportion - window.innerHeight) / 2;
                this.width = window.innerWidth;
                this.height = window.innerWidth * defaults.proportion;
            }
            this.style.left = this.left+ "px";
            this.style.height = this.height+ "px";
            this.style.width = this.width+ "px";

        }
    };

    window.panel = {
        node: document.querySelector(".panel"),
        scoreNode: document.querySelector(".score-label"),
        changeScore: function (count) {
            window.score += count;
            this.scoreNode.innerText = window.score;
        }
    };

    window.winscreen = {
        show: () => {
            document.querySelector(".winscreen").classList.add("shown");
        }
    };

    window.movingIcon = {
        node: document.querySelector(".moving-icon"),
        dest: [window.panel.node.getBoundingClientRect().left-15, window.panel.node.getBoundingClientRect().top],
        fly: function (x2, y2) {
            this.node.classList.remove("shown");
            this.node.style.cssText = "";

            this.node.style.left = x2 + "px";
            this.node.style.top = y2 + "px";
            window.setTimeout(() => {
                this.node.classList.add("shown");
                this.node.style["margin-left"] = -x2 + this.dest[0] + "px";
                this.node.style["margin-top"] = -y2 + this.dest[1] + "px";
            }, 100);
        }
    };

    window.cursor = {
        node: document.querySelector(".cursor"),
        show: function (x, y) {
            this.node.style.left = x + "%";
            this.node.style.top = y + "%";
            this.node.classList.add("shown");
        },
        hide: function () { this.node.classList.remove("shown"); }
    };

    window.playground.setSize();

    defaults.groundHeight = window.playground.width * 0.4 * defaults.groundProportion;

    window.grounds = [
        new Ground("Spanking", "active", 1, 0, [20, 64]),
        new Ground("GlassScratch", "non", 10, 1, [36, 49]),
        new Ground("Tickling", "non", 300, 30, [5, 35]),
        new Ground("Spanking", "final", 1, 1000, [27, 24])
    ];

    window.grounds[3].show();
    window.grounds[2].show();
    window.grounds[1].show();
    window.grounds[0].show();

    cursor.show(34,64);

    playground.node.addEventListener("click", function(event) {

    });
});

