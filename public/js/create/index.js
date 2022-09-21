// configure classes and listeners
import { Blog } from "./blog.js";
import { Colors } from "./Colors.js";
import { htmlEscape, htmlUnescape } from "./htmlEscape.js";

const colors = new Colors();
const blog = new Blog(colors);
colors.blog = blog;

document.body.addEventListener("mouseup", (event) => {
    if (event.target.id === "content") {
        colors.showPalette(event);
    }
});

document.body.addEventListener("mousedown", (event) => {
    if (event.target.name !== "colorOption") {
        document.getSelection().removeAllRanges();
        colors.removePalette();
    }
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

const content = document.getElementById("content");
content.addEventListener("keyup", (event) => {
    blog.convertText(event);
});

content.addEventListener(
    "keydown",
    (event) => {
        console.log(event.key);
        colors.getCaretPos(event);
    },
    { once: true }
);
