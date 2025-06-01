const blogContainer = document.querySelectorAll(".blog")
//redirecting for full-view of the blog
blogContainer.forEach((blog) => {
    blog.addEventListener("click", (e) => {
        // stopPropagation disable eventBubling in other elements of the node
        e.stopPropagation()
        window.open(`http://localhost:4000/api/v1/blogs/getBlog/${blog.querySelector(".blogId").innerHTML}`, '_blank')
    })
})

const navigationButtons = document.body.querySelectorAll(".nv")
//page navigation
navigationButtons.forEach((button) => {
    button.addEventListener(("click"), (e) => {
        e.preventDefault()
        button.style.backgroundColor = "blue"
        console.log(window.location.href)
        console.log(window.location.href.includes(1))
        window.location.href = (`?page=${button.innerHTML}`)
    })
})

//create blog
const createButton = document.body.querySelector(".nav-right-create")
createButton.addEventListener(("click"), (e) => {
    e.preventDefault()
    console.log(document.cookie)
    if (document.cookie === "") {
        return window.open("/html/login.html")
    }
    window.location.href = "/admin/create"
})

document.body.querySelector(".search-btn").addEventListener(("click"), (e) => {
    e.preventDefault()
    const query = document.body.querySelector(".search").value
    if (!query || query === "") {
        return alert("No query received")
    }
    window.location.href = `/api/v1/blogs/search?query=${query}`
})

const deleteButtonCollections = document.body.querySelectorAll(".delete-blog")
deleteButtonCollections.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        const blog = deleteButton.parentElement
        const blogID = blog.querySelector(".blogId").innerHTML
        console.log(blogID)
        const delete_response = async () => {
            const response = await fetch("/api/v1/blogs/delete", {
                method: "POST",
                body: JSON.stringify({
                    blogId : blogID
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            if (data.statuscode === 200) {
                alert("Blog deleted sucessfully !");
                return window.location.reload();
            }
            else {
                return alert("something went wrong")
            }
        }
        delete_response();
    })
})