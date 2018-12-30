var defaults = {
    proportion: 900/565
};

var score = 0;


function Ground(name, active, productivity, loc) {
    // stages: closed,
    this.name = name;
    this.x = loc[0];
    this.y = loc[1];
    this.type = name;
    this.active = active === "active";
    this.bg = "images/closed-ground.png";
    this.productivity = productivity;
    this.readyValue = 1;  // from 0 to 1
    this.addNode = () => {
        this.node = document.createElement("div");
        this.node.classList.add("ground");
        this.node.classList.add("ground-name");
        this.node.style.top = this.y + "%";
        this.node.style.left = this.x + "%";
        this.node.addEventListener("click", this.click);

        this.bgNode = document.createElement("img");
        this.bgNode.src = this.bg;
        this.bgNode.classList.add("ground-bg");
        this.node.appendChild(this.bgNode);

        if (this.active) { this.setActive() }
    };
    this.setActive = () => {
        this.active = true;
        this.actionNode = document.createElement("img");
        this.actionNode.src = "animations/" + this.name + "/2.gif";
        this.bgNode.src = "images/opened-ground.png";
        this.actionNode.classList.add("action-animation");
        this.node.appendChild(this.actionNode);
    };
    this.show = () => {
        this.addNode();
        window.playground.node.appendChild(this.node);
    };
    this.click = () => {
        if (!this.active) { this.setActive(); }
        else if (this.readyValue) { window.panel.changeScore(this.productivity); }
    };
}

document.addEventListener("DOMContentLoaded", function() {
    window.playground = {
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
    window.panel = {
        node: document.querySelector(".panel"),
        scoreNode: document.querySelector(".score-label"),
        changeScore: function (count) {
            window.score += count;
            this.scoreNode.innerText = window.score;
        }
    };

    window.grounds = [
        new Ground("Spanking", "active", 1, [44, 54]),
        new Ground("GlassScratch", "non", 1, [20, 60]),
        new Ground("Tickling", "non", 1, [5, 35]),
        new Ground("Spanking", "final", 1, [27, 24])
    ];

    window.playground.setSize();

    window.grounds[0].show();
    window.grounds[1].show();
    window.grounds[2].show();
    window.grounds[3].show();
});

