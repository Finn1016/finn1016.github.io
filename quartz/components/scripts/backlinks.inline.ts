document.querySelectorAll(".backlinks-header").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("collapsed")
  })
})
