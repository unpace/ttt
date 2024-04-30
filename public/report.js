


const container = document.createElement("div");
container.style.position = "fixed";
container.style.bottom = "1rem"
container.style.right = "1rem"
container.style.zIndex = 999

const report = document.createElement("a");
report.style.backgroundColor = "white"
report.style.padding = "0.75rem 1rem"
report.style.border = "1.4px solid black"
report.style.borderRadius = "0.75rem"
report.textContent = "Report a problem"
report.href = "https://github.com/unpace/ttt"
report.target = "_blank"

container.appendChild(report)
document.body.appendChild(container)
