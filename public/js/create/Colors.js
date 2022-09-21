export class Colors {
    colorHexCodes = {
        constCol: "#4FC1FF",
        varCol: "#9CDCFE",
        bracket: "#D4D4D4",
        funcCol: "#DCDCAA",
        declareCol: "#569CD6",
        keywordCol: "#C586C0",
        textCol: "#CE9178",
        regExCol: "#D16969",
        classCol: "#4EC9B0",
    };
    coloredAreas = [];
    delStartPos = 0;
    currentHighlight;
    palette = null;
    blog;

    showPalette = (event) => {
        const highlight = document.getSelection().toString();
        if (highlight !== "") {
            const { selectionStart, selectionEnd } = event.target;
            this.currentHighlight = {
                start: selectionStart,
                end: selectionEnd,
            };
            const frag = document.createDocumentFragment();
            this.palette = this.createPalette(event);
            for (const color in this.colorHexCodes) {
                this.createOption(color);
            }
            frag.appendChild(this.palette);
            document.body.appendChild(frag);
        }
    };

    createPalette = (event) => {
        const palette = document.createElement("div");
        palette.className = "color-palette";
        palette.id = "colorPalette";
        palette.style.left = event.pageX + "px";
        palette.style.top = event.pageY + "px";
        palette.style.position = "absolute";
        palette.addEventListener("mousedown", (event) =>
            this.createColorArea(event)
        );
        return palette;
    };

    createOption = (color) => {
        const colorOption = document.createElement("div");
        colorOption.className = "color-option";
        colorOption.name = "colorOption";
        colorOption.id = this.colorHexCodes[color];
        colorOption.style.backgroundColor = this.colorHexCodes[color];
        this.palette.appendChild(colorOption);
    };

    removePalette = () => {
        if (this.palette) {
            this.palette.remove();
            this.palette = null;
        }
    };

    createColorArea = (event) => {
        console.log(this.currentHighlight);
        const { name, id } = event.target;
        if (name === "colorOption") {
            const { start, end } = this.currentHighlight;
            const toDelete = [];
            this.coloredAreas.forEach((area, index) => {
                const oldEnd = area.end;
                const oldStart = area.start;
                if (start <= oldStart && end > oldStart && end < oldEnd) {
                    area.start = end;
                } else if (
                    start > oldStart &&
                    start < oldEnd &&
                    end >= oldEnd
                ) {
                    area.end = start;
                } else if (start <= oldStart && end >= oldEnd) {
                    toDelete.push(index);
                } else if (start > oldStart && end < oldEnd) {
                    toDelete.push(index);
                    this.appendNewArea(area.color, oldStart, start);
                    this.appendNewArea(area.color, end, oldEnd);
                }
            });
            toDelete
                .slice()
                .reverse()
                .forEach((i) => {
                    this.coloredAreas.splice(i, 1);
                });

            this.coloredAreas.push({ color: id, start, end });
        }
        console.log(this.coloredAreas);

        document.getSelection().removeAllRanges();
        this.removePalette();
        this.blog.showResult(document.getElementById("content").value);
    };

    appendNewArea = (color, start, end) => {
        this.coloredAreas.push({ color, start, end });
    };

    applyColors = (content) => {
        let newString = content;
        this.coloredAreas = this.coloredAreas.sort((a, b) => b.start - a.start);
        this.coloredAreas.forEach((area) => {
            const { start, end, color } = area;
            const partOne = newString.slice(0, start);
            const partTwo = `<span style="color: ${color};">${newString.slice(
                start,
                end
            )}</span>`;
            const partThree = newString.slice(end, newString.length);

            newString = partOne + partTwo + partThree;
        });
        return newString;
    };

    getCaretPos = (event) => {
        if (event.key === "Delete" || event.key === "Backspace") {
            console.log(event.target.selectionStart);
            console.log(event.target.selectionEnd);
        }
    };

    alterColors = (event) => {
        console.log(event);
        console.log(event.target.selectionStart);
        console.log(event.target.selectionEnd);
    };
}
