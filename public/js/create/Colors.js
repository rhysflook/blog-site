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
    characterCount = 0;
    coloredAreas = [];
    delStartPos = 0;
    delEndPos = 0;
    currentHighlight;
    palette = null;
    blog;
    toDelete = [];

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
        const { name, id } = event.target;
        if (name === "colorOption") {
            const { start, end } = this.currentHighlight;
            this.coloredAreas.forEach((area, index) => {
                this.adjustArea(area, start, end, index);
            });
            this.deleteAreas();
            this.coloredAreas.push({ color: id, start, end });
        }

        document.getSelection().removeAllRanges();
        this.removePalette();
        this.blog.showResult(document.getElementById("content").value);
    };

    adjustArea = (area, start, end, index) => {
        const oldEnd = area.end;
        const oldStart = area.start;
        if (overlapsStart(start, end, oldStart, oldEnd)) {
            area.start = end;
        } else if (overlapsEnd(start, end, oldStart, oldEnd)) {
            area.end = start;
        } else if (overlapsAll(start, end, oldStart, oldEnd)) {
            this.toDelete.push(index);
        } else if (containedWithin(start, end, oldStart, oldEnd)) {
            this.toDelete.push(index);
            this.appendNewArea(area.color, oldStart, start);
            this.appendNewArea(area.color, end, oldEnd);
        }
    };

    appendNewArea = (color, start, end) => {
        this.coloredAreas.push({ color, start, end });
    };

    deleteAreas = () => {
        this.toDelete
            .slice()
            .reverse()
            .forEach((i) => {
                this.coloredAreas.splice(i, 1);
            });
        this.toDelete = [];
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

    handleKeyInput = (event) => {
        const diff = event.target.value.length - this.characterCount;
        this.characterCount = event.target.value.length;
        if (diff < 0) {
            this.delEndPos = event.target.selectionEnd;
            this.handleDelete(event, diff);
        } else {
            this.shiftColorAreas(event);

        }
        this.blog.showResult(event.target.value)
    };

    shiftColorAreas = (event) => {
        this.coloredAreas.forEach((area, index) => {
            const { start, end } = area;
            const pos = event.target.selectionEnd;
            if (pos < start) {
                area.start++;
                area.end++;
            } else if (pos >= start && pos - 1 <= end) {
                area.end++;
            }
        })
    }

    handleDelete = (event, diff) => {
        this.delStartPos = event.target.selectionStart;
        this.delEndPos = this.delStartPos + Math.abs(diff);
        this.coloredAreas.forEach((area, index) => {
            const { start, end } = area;
            let difference = this.delEndPos - this.delStartPos;
            let calcDiff = difference === 0 ? 1 : difference;
            console.log(`Deleting ${calcDiff} spaces.`)
            console.log(`Start: ${start}, End: ${end}, DelStart: ${this.delStartPos}, DelEnd: ${this.delEndPos}`)
            if (overlapsAll(this.delStartPos, this.delEndPos, start, end)) {
                console.log('Deleting whole area')
                this.toDelete.push(index);
            } else if (this.delEndPos <= start) {
                console.log('Shifting area down')
                if (event.key === 'Delete' && this.delStartPos === start) {
                    if (end - start <= 1) {
                        this.toDelete.push(index);
                    }
                } else {
                    area.start -= calcDiff;

                }
                area.end -= calcDiff;
            } else if (overlapsStart(this.delStartPos, this.delEndPos, start, end)) {
                console.log('Deleting start')

                area.start = this.delStartPos;
                area.end = area.end - (this.delEndPos - area.start)
            } else if (overlapsEnd(this.delStartPos, this.delEndPos, start, end)) {
                console.log('Deleting end')

                area.end = this.delStartPos;
            } else if (containedWithin(this.delStartPos, this.delEndPos, start, end)) {
                console.log('Shifting end down');
                area.end = area.end - calcDiff;

            }
        });
        this.deleteAreas();
    };
}

const overlapsStart = (start, end, oldStart, oldEnd) => {
    return start <= oldStart && end > oldStart && end < oldEnd;
};

const overlapsEnd = (start, end, oldStart, oldEnd) => {
    return start > oldStart && start < oldEnd && end >= oldEnd;
};

const overlapsAll = (start, end, oldStart, oldEnd) => {
    return start <= oldStart && end >= oldEnd;
};

const containedWithin = (start, end, oldStart, oldEnd) => {
    return start > oldStart && end < oldEnd;
};
