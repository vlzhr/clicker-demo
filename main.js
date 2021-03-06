var cursor;

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
        limit: 3,
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
        this.underLoadingBarNode = document.createElement("div");
        this.underLoadingBarNode.classList.add("under-loading-bar");
        this.underLoadingBarNode.style["top"] = defaults.groundHeight - 9 + "px";
        this.node.appendChild(this.underLoadingBarNode);

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
        this.runAnimation("waiting");
    };
    this.setLightened = () => {
        this.bgNode.src= "images/lightened-ground.png";
        this.bgNode.classList.add("lightened");
        window.cursor.show(this.x+6, this.y+2);
    };
    this.show = () => {
        this.addNode();
        window.playground.node.appendChild(this.node);
    };
    this.animateAction = () => {
        this.runAnimation("action");
        this.loadingBarNode.classList.add("animated");
        this.actionNode.classList.add("animated");
        window.setTimeout(() => {
            this.runAnimation("waiting");
            this.loadingBarNode.classList.remove("animated");
            this.actionNode.classList.remove("animated");
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
    this.actionFrames = {
        "spanking": ['la/Spanking/Touch/1-min.png', 'la/Spanking/Touch/2-min.png', 'la/Spanking/Touch/3-min.png', 'la/Spanking/Touch/4-min.png', 'la/Spanking/Touch/5-min.png', 'la/Spanking/Touch/6-min.png', 'la/Spanking/Touch/7-min.png', 'la/Spanking/Touch/8-min.png', 'la/Spanking/Touch/9-min.png', 'la/Spanking/Touch/10-min.png', 'la/Spanking/Touch/11-min.png', 'la/Spanking/Touch/12-min.png'],
        "tickling": ['la/Tickling/Touch/1-min.png', 'la/Tickling/Touch/2-min.png', 'la/Tickling/Touch/3-min.png', 'la/Tickling/Touch/4-min.png', 'la/Tickling/Touch/5-min.png', 'la/Tickling/Touch/6-min.png', 'la/Tickling/Touch/7-min.png', 'la/Tickling/Touch/8-min.png', 'la/Tickling/Touch/9-min.png', 'la/Tickling/Touch/10-min.png', 'la/Tickling/Touch/11-min.png', 'la/Tickling/Touch/12-min.png', 'la/Tickling/Touch/13-min.png', 'la/Tickling/Touch/14-min.png'],
        "scratching": ['la/GlassScratch/Touch/1-min.png', 'la/GlassScratch/Touch/2-min.png', 'la/GlassScratch/Touch/3-min.png', 'la/GlassScratch/Touch/4-min.png', 'la/GlassScratch/Touch/5-min.png', 'la/GlassScratch/Touch/6-min.png', 'la/GlassScratch/Touch/7-min.png', 'la/GlassScratch/Touch/8-min.png', 'la/GlassScratch/Touch/9-min.png', 'la/GlassScratch/Touch/10-min.png', 'la/GlassScratch/Touch/11-min.png', 'la/GlassScratch/Touch/12-min.png', 'la/GlassScratch/Touch/13-min.png', 'la/GlassScratch/Touch/14-min.png']
    };
    this.waitingFrames = {
        "spanking": ['la/Spanking/Idle/1-min.png', 'la/Spanking/Idle/2-min.png', 'la/Spanking/Idle/3-min.png', 'la/Spanking/Idle/4-min.png', 'la/Spanking/Idle/5-min.png', 'la/Spanking/Idle/6-min.png', 'la/Spanking/Idle/7-min.png', 'la/Spanking/Idle/8-min.png', 'la/Spanking/Idle/9-min.png', 'la/Spanking/Idle/10-min.png', 'la/Spanking/Idle/11-min.png'],
        "tickling": ['la/Tickling/Idle/1-min.png', 'la/Tickling/Idle/2-min.png', 'la/Tickling/Idle/3-min.png', 'la/Tickling/Idle/4-min.png', 'la/Tickling/Idle/5-min.png', 'la/Tickling/Idle/6-min.png', 'la/Tickling/Idle/7-min.png', 'la/Tickling/Idle/8-min.png', 'la/Tickling/Idle/9-min.png', 'la/Tickling/Idle/10-min.png', 'la/Tickling/Idle/11-min.png', 'la/Tickling/Idle/12-min.png', 'la/Tickling/Idle/13-min.png', 'la/Tickling/Idle/14-min.png', 'la/Tickling/Idle/15-min.png'],
        "scratching": ['la/GlassScratch/Idle/1-min.png', 'la/GlassScratch/Idle/2-min.png', 'la/GlassScratch/Idle/3-min.png', 'la/GlassScratch/Idle/4-min.png', 'la/GlassScratch/Idle/5-min.png', 'la/GlassScratch/Idle/6-min.png', 'la/GlassScratch/Idle/7-min.png', 'la/GlassScratch/Idle/8-min.png', 'la/GlassScratch/Idle/9-min.png', 'la/GlassScratch/Idle/10-min.png', 'la/GlassScratch/Idle/11-min.png', 'la/GlassScratch/Idle/12-min.png', 'la/GlassScratch/Idle/13-min.png', 'la/GlassScratch/Idle/14-min.png', 'la/GlassScratch/Idle/15-min.png']
    };
    this.stopPreviousAnimation = "";
    this.animationLoop = (nonStop, animationType) => {
        if (this.stopPreviousAnimation === animationType) {this.stopPreviousAnimation = ""; return;}
        var frames = animationType === "waiting" ? this.waitingFrames : this.actionFrames;

        this.actionNode.src = frames[this.animationName][this.step];
        this.step++;
        if (this.step >= frames[this.animationName].length) {
            if (!nonStop) {
                this.on = false;
                return;
            }
            this.step = 0;
        }

        if (!this.on) {return;}
        window.setTimeout(() => { this.animationLoop(nonStop, animationType); }, 1000 / frames[this.animationName].length);
    };
    this.runAnimation = (animationType) => {
        this.stopPreviousAnimation = {"waiting": "action", "action": "waiting"}[animationType];
        this.animationName = this.name.toLowerCase();
        this.step = 0;

        this.on = true;
        this.animationLoop(animationType !== "action", animationType);
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

    window.playground.setSize();

    defaults.groundHeight = window.playground.width * 0.4 * defaults.groundProportion;

    window.cursor = {
        node: document.querySelector(".cursor"),
        show: function (x, y) {
            this.node.style.left = x + "%";
            this.node.style.top = y + "%";
            this.node.classList.add("shown");
        },
        hide: function () { this.node.classList.remove("shown"); }
    };

    window.grounds = [
        new Ground("Spanking", "active", 1, 0, [20, 64]),
        new Ground("Scratching", "non", 10, 3, [36, 49]),
        new Ground("Tickling", "non", 300, 30, [5, 35]),
        new Ground("Spanking", "final", 1, 1000, [27, 24])
    ];

    window.grounds[3].show();
    window.grounds[2].show();
    window.grounds[1].show();
    window.grounds[0].show();

    window.preview = {
        node: document.querySelector(".preview"),
        curtainNode: document.querySelector(".curtain"),
        show: function() {
            this.node.classList.add("shown");
            this.curtainNode.classList.add("shown");
        },
        hide: function() {
            this.node.classList.remove("shown");
            this.curtainNode.classList.remove("shown");
        }
    };

    var images = [];
    function preload() {
        for (var i = 0; i < arguments.length; i++) {
            images[i] = new Image();
            images[i].src = preload.arguments[i];
        }
    }

    //-- usage --//
    preload(
        "images/map.png",
        "images/opened-ground.png",
        "images/lightened-ground.png",
        "animations/Tickling/3.gif",
        "animations/Tickling/2.gif",
        "animations/GlassScratch/3.gif",
        "animations/GlassScratch/2.gif",
        "animations/Spanking/3.gif"
    );

    function showPreview() {
        // window.preview.show();
        window.setTimeout(function () {
            window.preview.hide();
            window.cursor.show(34, 64);
        }, 0); //3000);
    }

    window.setTimeout(() => {
        showPreview();
    }, 0);



});

