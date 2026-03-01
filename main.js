const menu = document.getElementById("menu");
const links = document.getElementById("links");
const input = document.getElementById("input");
const sugerencias = document.getElementById("sugerencias");
const contenedor = document.getElementById("contenedor");

ingredientes = ["Pollo", "Cebolla", "Tomate", "Lechuga" , "Morron", "Pizza", "Coso", "Salsa", "Naranja"];
let seleccionados = [];

menu.addEventListener("click", () => {
    menu.textContent = links.classList.toggle("show") ? "X" : "☰";
});

input.addEventListener("input", () => {
    const text = input.value.toLowerCase();
    sugerencias.innerHTML = "";

    if(!text){
        sugerencias.style.display = "none";
        return;
    }

    const lowerCase = ingredientes.filter(element => 
        element.toLowerCase().includes(text) &&
        !seleccionados.includes(element)
    );

    lowerCase.forEach(element => {
        const li = document.createElement("li");
        li.textContent = element;
        li.addEventListener("click", () => addTag(element));
        sugerencias.appendChild(li);
    });

    sugerencias.style.display = lowerCase.length ? "block" : "none";
})

function addTag(text){
    seleccionados.push(text);

    const tag = document.createElement("div");
    tag.className = "tag";

    tag.innerHTML = `${text}<button>X</button>`

    tag.querySelector("button").addEventListener("click", () => {
        tag.remove();
        seleccionados = seleccionados.filter(t => t !== text);
    })

    contenedor.insertBefore(tag, input);
    input.value = "";
    sugerencias.style.display = "none"
}