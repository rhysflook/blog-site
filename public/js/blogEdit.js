const colorHexCodes = {
    constCol: "#4FC1FF",
    varCol: "#9CDCFE",
    bracket: "#D4D4D4",
    funcCol: "#DCDCAA",
    declareCol: "	#569CD6",
    keywordCol: "#C586C0",
    textCol: "#CE9178",
    regExCol: "#D16969",
    classCol: "#4EC9B0",
};

const coloredAreas = [];

const updateBlogElements = (titleVal, contentVal) => {
    const title = document.getElementById("title");
    const content = document.getElementById("content");
    title.value = titleVal;
    content.value = contentVal;
};

const getBlogElementValues = () => {
    const title = document.getElementById("title");
    const content = document.getElementById("content");
    return { title: title.value, content: content.value };
};

const loadBlogInEditor = async (id) => {
    const { data } = await axios.get(`api/posts/${id}`);
    updateBlogElements(data.title, prepContent(data.content));
    setMode("PUT", id);
};

const setMode = (mode, id = null) => {
    const modeInput = document.getElementById("method");
    modeInput.value = mode;
    if (mode === "POST") {
        updateBlogElements("", "");
    } else {
        const blogSetting = document.getElementById("blog");
        blogSetting.value = id;
    }
};

const prepContent = (content) => {
    return content.split("<br>").join("");
};

const _htmlEscape = (string) =>
    string
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

const _htmlUnescape = (htmlString) =>
    htmlString
        .replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<")
        .replace(/&#0?39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");

const htmlEscape = (strings, ...values) => {
    if (typeof strings === "string") {
        return _htmlEscape(strings);
    }

    let output = strings[0];
    for (const [index, value] of values.entries()) {
        output = output + _htmlEscape(String(value)) + strings[index + 1];
    }

    return output;
};

let tester = "tester";
const test = "test";
const htmlUnescape = (strings, ...values) => {
    if (typeof strings === "string") {
        return _htmlUnescape(strings);
    }

    let output = strings[0];
    for (const [index, value] of values.entries()) {
        output = output + _htmlUnescape(String(value)) + strings[index + 1];
    }

    return output;
};

const convertText = (event) => {
    if (event.key === "Delete" || event.key === "Backspace") {
        alterColors(event);
    }
    const content = addColorSpan(event.target.value);
    const markdown = marked.parse(content);

    document.getElementById("contentPreview").innerHTML =
        htmlUnescape(markdown);
};

const addColorSpan = (textContent) => {
    return textContent.replace(
        /~([a-zA-Z]+):(.+)~/gi,
        (_, textType, content) => {
            return `<span style="color: ${colorHexCodes[textType]};">${content}</span>`;
        }
    );
};

const togglePostList = () => {
    const postList = document.getElementById("postList");
    const template = document.getElementById("posts-template");
    console.log(postList.children.length);
    if (postList.children.length === 1) {
        postList.appendChild(template.content.cloneNode(true));
    } else {
        postList.children[1].remove();
    }
};

const removePalette = (event) => {
    if (event.target.id !== "colorPalette") {
        document.getSelection().removeAllRanges();
        const palette = document.getElementById("colorPalette");
        if (palette) {
            palette.remove();
        }
    }
};

const createColorArea = (color, selStart, selEnd) => {
    coloredAreas.push({ color: colorHexCodes[color], selStart, selEnd });
};

const applyColors = () => {};

const getCaretPos = (event) => {
    if (event.key === "Delete" || event.key === "Backspace") {
        console.log(event.target.selectionStart);
        console.log(event.target.selectionEnd);
    }
};

const alterColors = (event) => {
    console.log(event);
    console.log(event.target.selectionStart);
    console.log(event.target.selectionEnd);
};

const createColorPalette = (event) => {
    if (event.target.id !== "content") {
        return;
    }
    const { selectionStart, selectionEnd } = event.target;
    const highlight = document.getSelection().toString();
    if (highlight !== "") {
        const frag = document.createDocumentFragment();
        const colorBox = document.createElement("div");
        colorBox.className = colorBox.id = "colorPalette";
        colorBox.style.left = event.pageX + "px";
        colorBox.style.top = event.pageY + "px";
        colorBox.style.position = "absolute";
        for (const color in colorHexCodes) {
            const colorOption = document.createElement("div");
            colorOption.className = "color-option";
            colorOption.onclick = () =>
                createColorArea(color, selectionStart, selectionEnd);
            colorOption.style.backgroundColor = colorHexCodes[color];
            colorBox.appendChild(colorOption);
        }
        frag.appendChild(colorBox);
        document.body.appendChild(frag);
    }
    console.log(coloredAreas);
};
