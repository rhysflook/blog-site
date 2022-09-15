const loadBlogInEditor = () => {
    const title = document.getElementById("title");
    const content = document.getElementById("content");
    axios.get("/api/posts/1");
};
