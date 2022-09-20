import { htmlUnescape } from "./htmlEscape.js";

export class Blog {
    constructor(colors) {
        this.colors = colors;
    }
    togglePostList = () => {
        const postList = document.getElementById("postList");
        const template = document.getElementById("posts-template");
        console.log(postList.children.length);
        if (postList.children.length === 1) {
            postList.appendChild(template.content.cloneNode(true));
        } else {
            postList.children[1].remove();
        }
    };

    updateBlogElements = (titleVal, contentVal) => {
        const title = document.getElementById("title");
        const content = document.getElementById("content");
        title.value = titleVal;
        content.value = contentVal;
    };

    getBlogElementValues = () => {
        const title = document.getElementById("title");
        const content = document.getElementById("content");
        return { title: title.value, content: content.value };
    };

    loadBlogInEditor = async (id) => {
        const { data } = await axios.get(`api/posts/${id}`);
        this.updateBlogElements(data.title, this.prepContent(data.content));
        this.setMode("PUT", id);
    };

    setMode = (mode, id = null) => {
        const modeInput = document.getElementById("method");
        modeInput.value = mode;
        if (mode === "POST") {
            this.updateBlogElements("", "");
        } else {
            const blogSetting = document.getElementById("blog");
            blogSetting.value = id;
        }
    };

    prepContent = (content) => {
        return content.split("<br>").join("");
    };

    convertText = (event) => {
        if (event.key === "Delete" || event.key === "Backspace") {
            alterColors(event);
        }

        this.showResult(event.target.value);
    };

    showResult = (content) => {
        const coloredContent = this.colors.applyColors(content);
        const markdown = marked.parse(coloredContent);
        document.getElementById("contentPreview").innerHTML =
            htmlUnescape(markdown);
    };
}
