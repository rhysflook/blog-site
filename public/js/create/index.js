// configure classes and listeners
import { Blog } from "./blog.js";
import { Colors } from "./Colors.js";
import { ControlBar } from "./ControlBar.js";
import { htmlEscape, htmlUnescape } from "./htmlEscape.js";

const colors = new Colors();
const blog = new Blog(colors);
const controls = new ControlBar();
controls.init();
colors.blog = blog;
let mouseDown = false;

document.body.addEventListener("mouseup", (event) => {
    // if (event.target.id === "content") {
    //     colors.showPalette(event);
    // }
});

document.body.addEventListener("mousedown", (event) => {
    if (event.target.id === "controlBar") {
        event.preventDefault();
    }
    // if (event.target.name !== "colorOption") {
    //     // document.getSelection().removeAllRanges();
    //     colors.removePalette();
    // }
});

document.getElementById("controlBar").addEventListener("mousedown", (event) => {
    event.preventDefault();
});

// Toggle blog list and load in blogs
const postList = document.getElementById("postList");
postList.addEventListener("click", () => {
    blog.togglePostList();
    const userPostList = document.getElementById("userPostList");
    userPostList &&
        userPostList.addEventListener("click", (event) => {
            const { name, id } = event.target;
            name === "userPost" && blog.loadBlogInEditor(id);
        });
});
content.innerHTML = "<div><br></div>";
content.addEventListener("input", (event) => {
    if (content.innerHTML === "") {
        content.innerHTML = "<div><br></div>";
    }
    colors.handleKeyInput(event);
});
