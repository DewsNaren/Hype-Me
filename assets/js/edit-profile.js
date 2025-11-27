const form = document.querySelector(".profile-form");
const fromContainer = document.querySelector(".personal-form-container");
const profileImage = fromContainer.querySelector(".profile-image-preview img");
const delProfileInput = fromContainer.querySelector(
  ".profile-image-preview .del-profile-input"
);
const actionBtn = fromContainer.querySelector(
  ".profile-image-preview  .action-btn"
);
const profileUsername = fromContainer.querySelector(".input-wrapper .username");
const firstName = fromContainer.querySelector(".input-wrapper .first-name");
const lastName = fromContainer.querySelector(".input-wrapper .last-name");
const country = fromContainer.querySelector(".input-wrapper .country");
const city = fromContainer.querySelector(".input-wrapper .city");
const zipCode = fromContainer.querySelector(".input-wrapper .zip-code");
const addImageInput = fromContainer.querySelector(
  ".profile-image-preview  .add-image-input"
);

let profileImgSrc;
actionBtn.addEventListener("click", () => {
  if (actionBtn.classList.contains("delete-image-btn")) {
    profileImage.src = "./assets/images/default-profile-pic.jpg";
    delProfileInput.value = "true";
    actionBtn.textContent = "Add Image";
    actionBtn.classList.remove("delete-image-btn");
    actionBtn.classList.add("add-image-btn");
  } else if (actionBtn.classList.contains("add-image-btn")) {
    addImageInput.click();
    addImageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      profileImgSrc = file.name;
      delProfileInput.value = "false";
      profileImage.src = `./assets/images/${profileImgSrc}`;
      actionBtn.classList.remove("add-image-btn");
      actionBtn.classList.add("delete-image-btn");
      actionBtn.textContent = "Delete Image";
    });
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateInputs()) {
    getData();
  }
  e.preventDefault();
});
function validateInputs() {
  const actionBtn = fromContainer.querySelector(
    ".profile-image-preview  .action-btn"
  );
  const profileUsernameVal = profileUsername.value.trim();
  const firstNameVal = firstName.value.trim();
  const lastNameVal = lastName.value.trim();
  const zipCodeVal = zipCode.value.trim();
  let success = true;

  if (profileUsernameVal === "") {
    success = false;
    setInvalid(profileUsername, "Username is required");
  } else {
    setValid(profileUsername);
  }

  if (actionBtn.classList.contains("add-image-btn")) {
    success = false;
    setInvalid(actionBtn.parentElement, "Please provide a profile image");
    console.log(actionBtn.parentElement);
  } else {
    setValid(actionBtn);
    success = true;
  }
  if (firstNameVal === "") {
    success = false;
    setInvalid(firstName, "First name is required");
  } else {
    setValid(firstName);
  }

  if (lastNameVal === "") {
    success = false;
    setInvalid(lastName, "Last name is required");
  } else {
    setValid(lastName);
  }
  if (zipCodeVal === "") {
    success = false;
    setInvalid(zipCode, "Zip code is required");
  } else if (!/^\d{5,6}$/.test(zipCodeVal)) {
    success = false;
    setError(zipCode, "Enter a valid zip code");
  } else {
    setValid(zipCode);
  }
  return success;
}

function setInvalid(element, message) {
  const inputWrapper = element.parentElement;
  const errorElement = inputWrapper.querySelector(".error");

  errorElement.innerText = message;
  inputWrapper.classList.add("error");
}

function setValid(element) {
  const inputWrapper = element.parentElement;
  const errorElement = inputWrapper.querySelector(".error");

  errorElement.innerText = "no error";
  inputWrapper.classList.remove("error");

  if (element === actionBtn) {
    const imagePreview = element.parentElement;
    const imageGroup = imagePreview.parentElement;
    imageGroup.classList.remove("error");
  }
}

function getData() {
  const formData = {
    username: profileUsername.value.trim().toLowerCase(),

    firstName: firstName.value.trim().toLowerCase(),
    lastName: lastName.value.trim().toLowerCase(),
    country: country.value.trim().toLowerCase(),
    city: city.value.trim().toLowerCase(),
    zipCode: zipCode.value.trim().toLowerCase(),
    // delProfile:delProfileInput.value,
    profileImg: profileImgSrc,
  };
//   console.log(formData);
//   window.edit = JSON.stringify(formData);
//   window.location.href = "./my-products.html";
  const body = document.body;
  sessionStorage.setItem("profileData", JSON.stringify(formData));
  editOverlay.classList.remove("active");
  body.classList.remove("not-scroll")
  getProfileData();
}

const editModalcloseBtn = document.querySelector(
  ".edit-modal-main-container .close-btn-container .close-btn"
);

editModalcloseBtn.addEventListener("click", () => {
  const body = document.body;
  form.reset();
  editOverlay.classList.remove("active");
  body.classList.remove("not-scroll")
});
