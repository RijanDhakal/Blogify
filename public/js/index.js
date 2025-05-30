const blogContainer = document.querySelectorAll(".blog")
blogContainer.forEach((blog) => {
    blog.querySelector(".blog-title").addEventListener("click", (e) => {
        // stopPropagation disable eventBubling in other elements of the node
        e.stopPropagation()
        window.location.href = `http://localhost:4000/api/v1/blogs/getBlog/${blog.querySelector(".blogId").innerHTML}`
    })
    blog.querySelector(".blog-image-src").addEventListener("click", (e) => {
        // stopPropagation disable eventBubling in other elements of the node
        e.stopPropagation()
        window.location.href = `http://localhost:4000/api/v1/blogs/getBlog/${blog.querySelector(".blogId").innerHTML}`
    })
    blog.querySelector(".blog-description").addEventListener("click", (e) => {
        // stopPropagation disable eventBubling in other elements of the node
        e.stopPropagation()
        window.location.href = `http://localhost:4000/api/v1/blogs/getBlog/${blog.querySelector(".blogId").innerHTML}`
    })
})

const navigationButtons = document.body.querySelectorAll(".nv")
navigationButtons.forEach((button) => {
    button.addEventListener(("click"), () => {
        button.style.backgroundColor = "blue"
        window.location.href = (`?page=${button.innerHTML}`)
    })
})
