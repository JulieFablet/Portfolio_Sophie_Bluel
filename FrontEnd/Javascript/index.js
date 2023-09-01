// Constantes
const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filters-container");
const modifyBanner = document.querySelector(".modify-banner");
const editBtn = document.querySelectorAll(".edit-btn");
const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const modalGalleryWork = document.querySelector(".modal-gallery-work");
const header = document.querySelector("header");
const portfolio = document.getElementById("portfolio");
const log = document.querySelector(".log-link-title");
const modal1 = document.querySelector(".pictures-gallery");
const modal2 = document.querySelector(".add-picture-gallery");
const addPictureBtn = document.querySelector(".addPicture-btn");
const returnArrow = document.querySelector(".return-arrow");
const addPicture = document.querySelector(".addPictures");
const addImageModal = document.querySelector(".btn-addImage");
const validateBtn = document.querySelector(".validate-btn");
const addTitle = document.getElementById("add-title");
const addCategorie = document.getElementById("add-categories");
const previewImg = document.querySelector(".preview-img");
const imgContainer = document.querySelector(".img-container");
const errorAdd = document.querySelector(".error-add");
const deleteMsg = document.querySelector(".delete-msg");
const filters = new Set();

// Variables
let tokenValeur = localStorage.token;
let imageForm = "";
let categoryForm = "";
let titleForm;

// Récupération des travaux via l'API
const Get = async () => {
  // Lien vers l'API
  await fetch("http://" + window.location.hostname + ":5678/api/works")
    .then((res) => res.json().then((data) => (works = data)))
    .catch((err) => {
      console.log(`Erreur : ${err}`);
    });
  console.log(works[2]);

  // Affichage des travaux dans la galerie
  galleryWork(works);
  modalWork(works);
};

// Récupération des catégories via l'API
const Category = async () => {
  await fetch("http://" + window.location.hostname + ":5678/api/categories")
    .then((res) => res.json().then((cat) => (categories = cat)))
    .catch((err) => {
      console.log(`Erreur : ${err}`);
    });

  // Ajout des filtres
  filtres(categories);
};

// Suppression d'un travail via l'API
const Delete = async (id) => {
  await fetch("http://" + window.location.hostname + ":5678/api/works/" + id, {
    method: "DELETE",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenValeur}`,
    },
    mode: "cors",
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.confirmation === "OK") {
        id.remove();
      }
      console.log(res);
    })
    .catch((err) => console.log("Il y a eu une erreur sur le Fetch: " + err));
};

// Ajout des travaux à la galerie
function galleryWork(works) {
  works.map((work) => {
    const post = document.createElement("figure");
    post.setAttribute("id", `${work.id}.`);
    post.innerHTML = `
    <img src=${work.imageUrl} alt="image de ${work.title}">
    <figcaption>${work.title}</figcaption> 
    `;
    gallery.appendChild(post);
  });
}

// Ajout des travaux à la galerie dans la modal
function modalWork(works) {
  works.map((work) => {
    const workPost = document.createElement("figure");
    workPost.setAttribute("id", `${work.id}`);
    workPost.innerHTML = `
    <div class="workgallery-container">
      <i id="${work.id}"  class="fa-solid fa-trash-can trash-icon" ></i>
      <img class="modal-image" src=${work.imageUrl} alt="image de ${work.title}">
    </div>    
    <figcaption>éditer</figcaption> 
    `;
    modalGalleryWork.appendChild(workPost);

    // Appel de la fonction pour la suppression d'image
    deleteImage(workPost);
  });
}

// Création des filtres
function filtres(categories) {
  categories.map((filter) => {
    filters.add(filter.name);
  });

  // Transformation de l'objet Set en tableau
  const filtersArray = Array.from(filters);

  // Création des éléments boutons de filtre
  for (let i = 0; i < filtersArray.length; i++) {
    const filtre = document.createElement("button");
    filtre.classList.add(
      "filter-btn",
      `${filtersArray[i].split(" ").join("")}`
    );
    filtre.innerText = filtersArray[i];
    filtersContainer.appendChild(filtre);
  }

  // Filtre au clic
  // Filtre pour le bouton "Tous"
  const btnTous = document.getElementById("tous");
  btnTous.addEventListener("click", () => {
    gallery.innerHTML = "";
    Get();
  });

  // Filtre pour les autres catégories
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      buttons.forEach((button) => button.classList.remove("active"));
      gallery.innerHTML = "";
      const workFiltered = works.filter((work) => {
        return work.category.name === e.target.innerText;
      });
      button.classList.add("active");
      galleryWork(workFiltered);
    });
  });
}

// Affichage du mode édition si connecté
function editMode() {
  if (localStorage.login === "true") {
    filtersContainer.style.setProperty("visibility", "hidden");
    header.style.setProperty("margin-top", "100px");
    portfolio.style.setProperty("margin-top", "150px");
    modifyBanner.style.setProperty("display", "flex");
    log.innerText = "logout";
    editBtn.forEach((btn) => {
      btn.style.setProperty("display", "flex");
    });
    console.log("Vous êtes connecté !");
  } else {
    console.log("Vous n'êtes pas connecté ! Identifiez-vous !");
  }
}

// Au clic sur "logout", supprime dans le local storage login: true et token
log.addEventListener("click", () => {
  localStorage.removeItem("login");
  localStorage.removeItem("token");
  log.innerText = "login";
});

// Affichage de la modal
function toggleModal() {
  modalContainer.classList.toggle("target");
}
modalTriggers.forEach((trigger) =>
  trigger.addEventListener("click", toggleModal)
);

// Affichage de la modal d'ajout d'image
function showAddPictureModal() {
  modal1.style.display = "none";
  modal2.style.display = "flex";
}

addPictureBtn.addEventListener("click", (e) => {
  e.preventDefault();
  showAddPictureModal();
});

// Au clic sur la flèche retour de la modal, retour à la modale précédente
function returnModal1() {
  modal1.style.display = "block";
  modal2.style.display = "none";
  previewImg.src = "";
  previewImg.style.setProperty("display", "none");
  imgContainer.style.setProperty("display", "flex");
}

returnArrow.addEventListener("click", returnModal1);

// Fonction pour la suppression d'image
function deleteImage(imgValue) {
  const deleteIcon = document.querySelectorAll(".trash-icon");
  deleteIcon.forEach((delIcon) => {
    delIcon.addEventListener("click", (e) => {
      e.preventDefault();
      const idRemove = document.getElementById(e.target.id);
      const portfolioRemove = document.getElementById(e.target.id + ".");
      Delete(parseInt(e.target.id));
      console.log(e.target.id);
      idRemove.remove();
      portfolioRemove.remove();
      deleteMsg.innerText = "Supprimé !";
      setTimeout(() => {
        deleteMsg.innerText = "";
      });
    });
  });
}

// Fonction pour ajouter une image
function addImage() {
  // Gestion de l'image
  addImageModal.addEventListener("input", (e) => {
    imageForm = e.target.files[0];
    const img = URL.createObjectURL(imageForm);
    previewImg.src = img;
    previewImg.style.setProperty("display", "block");
    imgContainer.style.setProperty("display", "none");
  });

  // Gestion du titre
  addTitle.addEventListener("input", (e) => {
    titleForm = e.target.value;
  });

  // Gestion de la catégorie
  addCategorie.addEventListener("input", (e) => {
    categoryForm = e.target.selectedIndex;
  });

  // Soumission du formulaire
  addPicture.addEventListener("submit", (e) => {
    e.preventDefault();
    if (imageForm && titleForm && categoryForm) {
      const formData = new FormData();
      formData.append("image", imageForm);
      formData.append("title", titleForm);
      formData.append("category", categoryForm);

      // Envoi des données via l'API pour ajouter un travail
      fetch("http://" + window.location.hostname + ":5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenValeur}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((res) => {
          console.log(res);
          errorAdd.innerText = "Posté !";
          errorAdd.style.color = "green";

          // Nettoyage des galeries
          gallery.innerHTML = "";
          modalGalleryWork.innerHTML = "";
          Get();
          addPicture.reset();
          previewImg.src = "";
          previewImg.style.setProperty("display", "none");
          imgContainer.style.setProperty("display", "flex");
          setTimeout(() => {
            errorAdd.innerText = "";
          });
        })
        .catch((err) =>
          console.log("Il y a eu une erreur sur le Fetch: " + err)
        );
    } else {
      errorAdd.innerText = "Veuillez remplir tous les champs.";
      errorAdd.style.color = "red";
      setTimeout(() => {
        errorAdd.innerText = "";
      });
      console.log("Tous les champs ne sont pas remplis !");
    }
  });
}

// Appel des différentes fonctions lors du chargement de la page
Get();
Category();
editMode();
addImage();
