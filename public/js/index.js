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
    button.addEventListener(("click"), () => {
        button.style.backgroundColor = "blue"
        console.log(window.location.href)
        console.log(window.location.href.includes(1))
        window.location.href = (`?page=${button.innerHTML}`)
    })
})

//create blog
const createButton = document.body.querySelector(".nav-right-create")
createButton.addEventListener(("click"), () => {
    console.log(document.cookie)
    if(document.cookie === ""){
        return window.open("/html/login.html")
    }
    window.location.href = "/admin/create"
})

document.body.querySelector(".search-btn").addEventListener(("click"),()=>{
   const query = document.body.querySelector(".search").value
   if(!query || query === ""){
    return alert("No query received")
   }
   window.location.href = `/api/v1/blogs/search?query=${query}`
})