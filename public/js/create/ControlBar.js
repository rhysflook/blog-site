export class ControlBar {
    searchingNodes = false;
    mode = "style";
    init = () => {
        document
            .getElementById("controlBar")
            .addEventListener("click", (event) => {
                event.preventDefault();
                const tag = event.target.getAttribute("name");
                if (false) {
                    this.removeStyles(tag);
                } else {
                    const {
                        startContainer,
                        endContainer,
                        startOffset,
                        endOffset,
                    } = this.selection;

                    if (startContainer === endContainer) {
                        this.styleSingleNode(
                            tag,
                            startOffset,
                            endOffset,
                            startContainer
                        );
                    } else {
                        this.applyStyles(
                            tag,
                            startContainer,
                            endContainer,
                            startOffset,
                            endOffset
                        );
                    }
                }
            });
    };

    styleSingleNode = (tag, startOffset, endOffset, node) => {
        const part1 = node.textContent.slice(0, startOffset);
        const part2 = document.createElement(tag);
        part2.innerText = node.textContent.slice(startOffset, endOffset);
        const part3 = node.textContent.slice(endOffset);
        node.replaceWith(part1, part2, part3);
    };

    get container() {
        return document.getElementById("content");
    }

    get content() {
        return this.container.innerHTML;
    }

    get selection() {
        return window.getSelection().getRangeAt(0);
    }

    selectedTags = { b: null, em: null, u: null, s: null };

    get parentNodes() {
        const startParent = this.findTopLvlAncestor(
            this.selection.startContainer
        );
        const endParent = this.findTopLvlAncestor(this.selection.endContainer);
        return { startParent, endParent };
    }

    get htmlTags() {
        return [...this.content.matchAll(/(<[^>]*>)/g)];
    }

    setMode = (direction) => {
        for (tag in this.selectedTags) {
        }
    };

    getAncestor = (node, tag) => {
        const contentBox = document.getElementById("content");
        while (node.parentNode !== contentBox) {
            node = node.parentNode;
            if (node.tagName === tag.toUpperCase()) {
                return node;
            }
        }
    };

    nextNode = (node) => {
        if (node.firstChild) {
            node = node.firstChild;
        } else if (node.nextSibling) {
            node = node.nextSibling;
        } else {
            while (!node.nextSibling) {
                if (node.parentNode === document.getElementById("content")) {
                    return node;
                }
                node = node.parentNode;
            }
            node = node.nextSibling;
        }
        if (node === document.getElementById("content")) {
            throw new Error("Content node reached!");
        }

        return node;
    };

    isSingleNode = () => {
        const { startContainer, endContainer } = this.selection;
        return startContainer === endContainer;
    };

    applyToStartNode = (tag, container, startOffset) => {
        const node = container;
        const unstyledText = node.textContent.slice(0, startOffset);
        const styledText = document.createElement(tag);
        styledText.innerText = node.textContent.slice(startOffset);
        node.replaceWith(unstyledText, styledText);
        return node;
    };

    applyToEndNode = (tag, endContainer, endOffset) => {
        const node = endContainer;

        const unstyledText = node.textContent.slice(endOffset);
        const styledText = document.createElement(tag);
        styledText.innerText = node.textContent.slice(0, endOffset);
        node.replaceWith(styledText, unstyledText);
    };

    nextLine = (node) => {
        while (node.nodeType === 3) {
            node = node.nextSibling;
        }
        return node;
    };

    getPreservedElements = (tag, node) => {
        while (node !== this.findTaggedAncestor(tag, node)) {}
    };

    removeStyles = (tag) => {
        const { startContainer, endContainer, startOffset, endOffset } =
            this.selection;
        const startTagEle = this.findTaggedAncestor(tag, startContainer);
        const start = startTagEle.firstChild;
        let end = startTagEle.lastChild;
        const lastChildOffset = startTagEle.lastChild.textContent.length - 1;
        this.removeTagOccurences(tag, startTagEle, endContainer);
        if (
            startContainer === endContainer &&
            !this.isOnlyChildMatch(tag, startContainer.parentNode)
        ) {
            const section1End = document.createTextNode(
                startContainer.textContent.slice(0, endOffset)
            );
            const section2Start = document.createTextNode(
                startContainer.textContent.slice(endOffset)
            );
            if (end === startContainer) {
                end = section2Start;
            }
            startContainer.replaceWith(section1End, section2Start);

            this.applyStyles(tag, start, section1End, 0, startOffset);
            this.applyStyles(tag, section2Start, end, 0, lastChildOffset);
        } else if (startContainer === endContainer) {
            this.deleteFromSingleNode(
                tag,
                startContainer,
                startOffset,
                endOffset
            );
        } else {
            this.applyStyles(tag, start, startContainer, 0, startOffset);
            this.applyStyles(
                tag,
                endContainer,
                end,
                endOffset,
                lastChildOffset
            );
        }
    };

    deleteFromSingleNode = (tag, node, start, end) => {
        const textStart = node.textContent.slice(0, start);
        const textMid = node.textContent.slice(start, end);
        const textEnd = node.textContent.slice(end);
        const startStyled = document.createElement(tag);
        startStyled.innerText = textStart;
        const endStyled = document.createElement(tag);
        endStyled.innerText = textEnd;
        node.replaceWith(startStyled, textMid, endStyled);
    };

    shouldRemoveStyles = (tag) => {
        const { startContainer, endContainer } = this.selection;
        let node = startContainer;
        if (node === endContainer) {
            return node.tagName === tag.toUpperCase();
        }
        while (node !== endContainer) {
            if (!this.findTaggedAncestor(tag, node)) {
                return false;
            }
            node = this.nextNode(node);
        }
        return true;
    };

    applyStyles = (tag, start, end, startOffset, endOffset) => {
        let endReached = false;
        this.removeTagOccurences(tag, start, end);
        this.combineTextNodes(start, end);
        // let node = start;

        // while (node.parentNode !== this.container) {
        //     if (node.contains(start) || node === start) {
        //         this.tagYoungerSiblingNodes(tag, start, end);
        //         node = node.parentNode;
        //     }
        // }
        // if (node.contains(end) || node === end) {
        //     endReached = true;
        // }

        // if (!endReached) {
        //     node = this.nextLine(node.nextSibling);
        //     while (!node.contains(end)) {
        //         const newNode = document.createElement("div");
        //         const taggedNode = document.createElement(tag);
        //         taggedNode.innerHTML = node.innerHTML;
        //         newNode.appendChild(taggedNode);
        //         node.replaceChildren(...newNode.childNodes);
        //         node = this.nextLine(node.nextSibling);
        //     }

        //     while (node !== end && node !== null) {
        //         this.tagOlderSiblingNodes(tag, node, end);
        //         node = this.getNextAncestor(node, end);
        //     }
        // }
        // this.applyToStartNode(tag, start, startOffset);
        // this.applyToEndNode(tag, end, endOffset);
    };

    getNextAncestor = (node, end) => {
        let ancestor = null;
        node.childNodes.forEach((node) => {
            if (node.contains(end)) {
                ancestor = node;
            }
        });
        return ancestor;
    };

    tagOlderSiblingNodes = (tag, start, end) => {
        let isTarget = true;
        const targetNodes = [];
        const excedingNodes = [];
        start.childNodes.forEach((node) => {
            if (node.contains(end) || node === end) {
                isTarget = false;
            }
            if (isTarget) {
                targetNodes.push(node);
            } else {
                excedingNodes.push(node);
            }
        });

        const newContainer = document.createElement(tag);
        targetNodes.forEach((node) => {
            newContainer.appendChild(node.cloneNode(true));
        });
        const nodes = [newContainer, ...excedingNodes];
        start.replaceChildren(...nodes);
    };

    tagYoungerSiblingNodes = (tag, start, end) => {
        const container = start.parentNode;
        let isTarget = false;
        let excededTarget = false;
        const procedingNodes = [];
        const targetNodes = [];
        const excedingNodes = [];
        container.childNodes.forEach((node, index) => {
            if (node.contains(end) || node === end) {
                excededTarget = true;
            }
            if (excededTarget) {
                excedingNodes.push(node);
            } else if (isTarget) {
                targetNodes.push(node);
            } else {
                procedingNodes.push(node);
            }
            if (node === start) {
                isTarget = true;
            }
        });

        const newContainer = document.createElement(tag);
        targetNodes.forEach((node) => {
            newContainer.appendChild(node.cloneNode(true));
        });
        const nodes = [...procedingNodes, newContainer, ...excedingNodes];
        container.replaceChildren(...nodes);
    };

    removeTagOccurences = (tag, startNode, endNode) => {
        const nodes = [];
        let node = startNode;
        if (node === endNode) {
            if (node.parentNode.tagName === tag.toUpperCase()) {
                node.parentNode.replaceWith(...node.parentNode.childNodes);
            }
        }
        while (node !== endNode) {
            if (node.nodeType !== 3 && node.tagName === tag.toUpperCase()) {
                nodes.push(node);
            }
            node = this.nextNode(node);
        }

        nodes.forEach((node) => {
            node.replaceWith(...node.childNodes);
        });
    };

    combineTextNodes = (start, end) => {
        let node = start;
        let startNode;
        let isCombining = false;
        let textContent = [];
        while (node != end) {
            if (node.nodeType === 3) {
                textContent.push(node.textContent);
                if (!isCombining) {
                    startNode = node;
                    isCombining = true;
                    node = this.nextNode(node);
                } else {
                    const oldNode = node;
                    node = this.nextNode(node);
                    oldNode.remove();
                }
            } else {
                if (textContent.length > 1) {
                    const newNode = this.mergeTextNodes(textContent);
                    startNode.replaceWith(newNode);
                }
                textContent = [];
                startNode = null;
                isCombining = false;
                node = this.nextNode(node);
            }
        }
        if (textContent.length > 1) {
            if (node.nodeType === 3) {
                textContent.push(node.textContent);
                node.remove();
            }

            const newNode = this.mergeTextNodes(textContent);
            startNode.replaceWith(newNode);
        }
    };

    mergeTextNodes = (content) => {
        return document.createTextNode(content.reduce((a, b) => (a += b)));
    };

    findTaggedAncestor = (tag, node) => {
        while (node !== this.container) {
            node = node.parentNode;
            if (node.tagName === tag.toUpperCase()) {
                return node;
            }
        }
        return false;
    };

    removeTags = (node, tag) => {
        return node.outerHTML.replace(`<${tag}>`, "").replace(`</${tag}>`, "");
    };

    getHtmlString = (tag, slice, props = "") => {
        return `<${tag}${props}>${slice}</${tag}>`;
    };

    getNodeSelection = (nodes, startNode, endNode) => {
        if (this.searchingNodes === true) {
            if (!startNode.childNodes) {
                return;
            }
            const children = startNode.childNodes;
            children.forEach((child) => {
                if (this.searchingNodes === true) {
                    if (child === endNode) {
                        this.searchingNodes = false;
                        return;
                    }
                    nodes.push(child);
                    if (this.isAncestor(child, endNode)) {
                        this.getNodeSelection(nodes, child, endNode);
                    }
                }
            });
        }
        return nodes;
    };

    isAncestor = (procedingNode, selectedNode) => {
        const searching = true;
        while (searching) {
            selectedNode = selectedNode.parentNode;
            if (selectedNode === procedingNode) {
                return true;
            } else if (selectedNode === document.getElementById("content")) {
                return false;
            }
        }
    };

    getAllNodes = (nodes, node) => {
        const children = node.childNodes;
        if (!children) {
            return node;
        }
        children.forEach((child) => {
            nodes.push(child);
            this.getAllNodes(nodes, child);
        });
        return nodes;
    };

    isOnlyChildMatch = (tag, parent) => {
        return (
            parent.childNodes.length === 1 &&
            parent.tagName === tag.toUpperCase()
        );
    };
}
