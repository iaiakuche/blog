const menu = document.getElementById("menu");
const links = document.getElementById("links");
const input = document.getElementById("input");
const sugerencias = document.getElementById("sugerencias");
const contenedor = document.getElementById("contenedor_busqueda");
const recetas_grid = document.getElementById("recetas");
const count_recetas = document.getElementById("recetas_count");

let ingredientes = [];
let seleccionados = [];
let recetas = [];

fetch("recetas.json")
    .then(responce => responce.json())
    .then(data => {
        recetas = data;
        console.log("Recetas cargadas:", recetas.length);
        console.log("Primera receta:", recetas[0]);

        const set = new Set();
        // Normalizar todos los tags a minúsculas
        recetas.forEach(r => r.tags.forEach(i => set.add(i.toLowerCase())));
        ingredientes = Array.from(set);
        console.log("Ingredientes disponibles:", ingredientes);
    })
    .catch(error => console.error('Error cargando recetas', error));

menu.addEventListener("click", () => {
    menu.textContent = links.classList.toggle("show") ? "X" : "☰";
});

document.addEventListener("click", e => {
    if(!contenedor.contains(e.target)){
        sugerencias.style.display = "none";
    }
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
});

function addTag(text){
    // Normalizar a minúsculas
    const textoNormalizado = text.toLowerCase();
    seleccionados.push(textoNormalizado);

    const tag = document.createElement("div");
    tag.className = "tag";

    const textoMostrar = text.charAt(0).toUpperCase() + text.slice(1);
    tag.innerHTML = `${textoMostrar}<button>X</button>`;

    tag.querySelector("button").addEventListener("click", () => {
        tag.remove();
        seleccionados = seleccionados.filter(t => t !== textoNormalizado);
        if(seleccionados.length == 0){
            count_recetas.style.display = "none";
        }
        showRecipes();
    });

    contenedor.insertBefore(tag, input);
    input.value = "";
    sugerencias.style.display = "none";
    count_recetas.style.display = "flex";
    showRecipes();
}

function showRecipes(){
    console.log("=== showRecipes llamado ===");
    console.log("Seleccionados:", seleccionados);
    console.log("Total recetas:", recetas.length);
    
    recetas_grid.innerHTML = "";

    if(seleccionados.length == 0){
        return;
    }

    const recetasFiltradas = recetas.filter(receta => {
        console.log("Chequeando receta:", receta.titulo, "con tags:", receta.tags);
        const cumple = seleccionados.every(ingrediente => {
            const encontrado = receta.tags.some(recTag =>
                recTag.toLowerCase() === ingrediente
            );
            console.log(`  ¿Tiene '${ingrediente}'?`, encontrado);
            return encontrado;
        });
        return cumple;
    });

    console.log("Recetas filtradas:", recetasFiltradas.length);

    if(recetasFiltradas.length !== 0){
        count_recetas.textContent = `${recetasFiltradas.length} recetas encontradas:`;
    }
    else{
        count_recetas.textContent = "No tenemos recetas para esos ingredientes todavia";
    }

    recetasFiltradas.forEach((receta, i) => {
        const indiceReal = recetas.indexOf(receta);
        
        const card = document.createElement("a");
        card.className = "receta_card";
        card.href = `receta.html?id=${indiceReal}`;

        card.innerHTML = `
            <img src="${receta.imagen}" alt="${receta.titulo}">
            <h3>${receta.titulo}</h3>
        `;

        recetas_grid.appendChild(card);
    });
}
