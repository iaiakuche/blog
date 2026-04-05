const menu = document.getElementById("menu");
const links = document.getElementById("links");
const input = document.getElementById("input");
const sugerencias = document.getElementById("sugerencias");
const contenedor = document.getElementById("contenedor_busqueda");
const recetas_grid = document.getElementById("recetas");
const count_recetas = document.getElementById("recetas_count");

//ingredientes = ["Pollo", "Cebolla", "Tomate", "Lechuga" , "Morron", "Pizza", "Coso", "Salsa", "Naranja", "Rucula"];
let ingredientes = [];
let seleccionados = [];
let recetas = [];

/*
let recetas = [
    {
        "titulo": "Pollo al horno",
        "ingredientes": ["pollo", "lechuga"],
        "imagen": "img/pollo.jpg"
    },

    {
        "titulo": "Pollo al agillo",
        "ingredientes": ["pollo"],
        "imagen": "img/pollo_2.jpg"
    },

    {
        "titulo": "Pollo al ajillo",
        "ingredientes": ["pollo"],
        "imagen": "img/pollo_2.jpg"
    },

    {
        "titulo": "Pollo al ajillo2",
        "ingredientes": ["pollo"],
        "imagen": "img/pollo_2.jpg"
    },

    {
        "titulo": "Pollo al ajillo3",
        "ingredientes": ["pollo"],
        "imagen": "img/pollo_2.jpg"
    },

    {
        "titulo": "Pollo al ajillo4",
        "ingredientes": ["pollo"],
        "imagen": "img/pollo_2.jpg"
    },

    {
        "titulo": "Pollo al ajillo5",
        "ingredientes": ["pollo"],
        "imagen": "img/pollo_2.jpg"
    }
];
*/

fetch("recetas.json")
    .then(responce => responce.json())
    .then(data => {
        recetas = data

        const set = new Set();
        recetas.forEach(r => r.tags.forEach(i => set.add(i)));
        ingredientes = Array.from(set);
    })
    .catch(error => console.error('Error cargando recetas', error));

/*
fetch("recetas.json")
    .then(responce => responce.json())
    .then(data => {recetas = data})    
    .catch(error => console.error('Error cargando recetas', error));
*/

menu.addEventListener("click", () => {
    menu.textContent = links.classList.toggle("show") ? "X" : "☰";
});

document.addEventListener("click", e =>{
    if(!contenedor.contains(e.target)){sugerencias.style.display = "none";}
})

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
        if(seleccionados.length == 0){
            count_recetas.style.display = "none";
        }
        showRecipes();
    })

    contenedor.insertBefore(tag, input);
    input.value = "";
    sugerencias.style.display = "none"
    count_recetas.style.display = "flex";
    showRecipes();
}

function showRecipes(){
    recetas_grid.innerHTML = "";

    if(seleccionados.length == 0){
        return;
    }

    const recetasFiltradas = recetas.filter(receta => 
        seleccionados.every(ingrediente =>
            receta.ingredientes.some(recIngrediente =>
                recIngrediente.toLowerCase() == ingrediente.toLowerCase()
            )
        )
    );

    if(recetasFiltradas.length !== 0){
        count_recetas.textContent = `${recetasFiltradas.length} recetas encontradas:`
    }
    else{
        count_recetas.textContent = "No tenemos recetas para esos ingredientes todavia"
    }

    recetasFiltradas.forEach((receta, i) => {
        const card = document.createElement("a");
        card.className = "receta_card";
        card.href = `receta.html?id=${i}`;

        card.innerHTML = `
            <img src="${receta.imagen}" alt="${receta.titulo}">
            <h3>${receta.titulo}</h3>
        `;

        recetas_grid.appendChild(card);
    });
}
