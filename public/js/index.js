const blogContainer = document.querySelectorAll(".blog")
blogContainer.forEach((blog) => {
    blog.querySelector(".blog-title").addEventListener("click", (e) => {
        // stopPropagation disable eventBubling in other elements of the node
        e.stopPropagation()
        alert("clicked")
    })
    blog.querySelector(".blog-image-src").addEventListener("click", (e) => {
        // stopPropagation disable eventBubling in other elements of the node
        e.stopPropagation()
        alert("clicked")
    })
    blog.querySelector(".blog-description").addEventListener("click", (e) => {
        // stopPropagation disable eventBubling in other elements of the node
        e.stopPropagation()
        alert("clicked")
    })
})

const navigationButtons = document.body.querySelectorAll(".nv")
navigationButtons.forEach((button)=>{
    button.addEventListener(("click"),()=>{
    button.style.backgroundColor = "blue"
        window.location.href = (`?page=${button.innerHTML}`)
    })
})
