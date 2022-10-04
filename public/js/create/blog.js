import { htmlUnescape } from "./htmlEscape.js";

export class Blog {
    constructor(colors) {
        this.colors = colors;
    }
    debounceTime = 500;
    debounceTimer;
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
            this.colors.handleDelete(event);

        }

        this.showResult(event.target.value);
    };

    showResult = (content) => {
        const contentWindow = document.getElementById("content")
        const coloredContent = this.colors.applyColors(contentWindow.textContent);
        const range = window.getSelection().getRangeAt(0);
        range.selectNodeContents(contentWindow)
        range.collapse(false);
    };

    createRange = (node, chars, range) => {
        if (!range) {
            var range = document.createRange()
            range.selectNode(node);
            range.setStart(node, 0);
        }

        if (chars.count === 0) {
            range.setEnd(node, chars.count);
        } else if (node && chars.count > 0) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.length < chars.count) {
                    chars.count -= node.textContent.length;
                } else {
                    range.setEnd(node, chars.count);
                    chars.count = 0;
                }
            } else {
                for (var lp = 0; lp < node.childNodes.length; lp++) {
                    range = this.createRange(node.childNodes[lp], chars, range);

                    if (chars.count === 0) {
                        break;
                    }
                }
            }
        }

        return range;
    };

    setCurrentCursorPosition = (chars) => {
        if (chars >= 0) {
            var selection = window.getSelection();

            let range = this.createRange(document.getElementById("content"), { count: chars });
            if (range) {
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    };

    debounce = () => {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer)
        }
        this.debounceTimer = setTimeout(() => {
            this.showResult()
        }, this.debounceTime)
    }
}
