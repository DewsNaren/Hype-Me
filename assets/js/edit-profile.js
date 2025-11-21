const form = document.querySelector('.profile-form');
const fromContainer=document.querySelector('.personal-form-container');
const profileImage = fromContainer.querySelector('.profile-image-preview img');
const delProfileInput=fromContainer.querySelector('.profile-image-preview .del-profile-input');
const actionBtn = fromContainer.querySelector('.profile-image-preview  .action-btn');
const profileUsername = fromContainer.querySelector('.input-wrapper .username');
const firstName = fromContainer.querySelector('.input-wrapper .first-name');
const lastName = fromContainer.querySelector('.input-wrapper .last-name');
const country = fromContainer.querySelector('.input-wrapper .country');
const city = fromContainer.querySelector('.input-wrapper .city');
const zipCode = fromContainer.querySelector('.input-wrapper .zip-code');
const addImageInput=fromContainer.querySelector('.profile-image-preview  .add-image-input');


let profileImgSrc="profile-pic.jpg";
actionBtn.addEventListener('click', () => {
    if (actionBtn.classList.contains('delete-image-btn')) {
        profileImage.src = './assets/images/default-profile-pic.jpg';
        delProfileInput.value = 'true';
        actionBtn.textContent = 'Add Image';
        actionBtn.classList.remove('delete-image-btn');
        actionBtn.classList.add('add-image-btn');
    } 
    else if(actionBtn.classList.contains('add-image-btn')){
        addImageInput.click()
        addImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            profileImgSrc=file.name;
            delProfileInput.value = 'false';
            profileImage.src=`./assets/images/${profileImgSrc}`
        })
        
    }

})


form.addEventListener('submit', (e) => {

     e.preventDefault();
    if (validateInputs()) {
        getData();
        // form.reset();
    }
    e.preventDefault();
});
function validateInputs(){
    const profileUsernameVal = profileUsername.value.trim()
    const firstNameVal = firstName.value.trim();
    const lastNameVal = lastName.value.trim();
    const zipCodeVal = zipCode.value.trim();
    let success = true

    if(profileUsernameVal ===''){
        success=false;
        setError(profileUsername,'Username is required')
    }
    else{
        setSuccess(profileUsername)
    }
    if(firstNameVal ===''){
        success=false;
        setError(firstName,'First name is required')
    }
    else{
        setSuccess(firstName)
    }
    
   if (lastNameVal === '') {
        success = false;
        setError(lastName, 'Last name is required');
    } else {
        setSuccess(lastName);
    }
     if (zipCodeVal === '') {
        success = false;
        setError(zipCode, 'Zip code is required');
    } else if (!/^\d{5,6}$/.test(zipCodeVal)) {
        success = false;
        setError(zipCode, 'Enter a valid zip code');
    } else {
        setSuccess(zipCode);
    }
    return success;

}

function setError(element,message){
    const inputWrapper = element.parentElement;
    const errorElement = inputWrapper.querySelector('.error')

    errorElement.innerText = message;
    inputWrapper.classList.add('error')
}

function setSuccess(element){
    const inputWrapper = element.parentElement;
    const errorElement = inputWrapper.querySelector('.error')

    errorElement.innerText = 'no error';
    inputWrapper.classList.remove('error')
}

function getData(){
    const formData = {
        username: profileUsername.value.trim().toLowerCase(),
        
        firstName: firstName.value.trim().toLowerCase(),
        lastName: lastName.value.trim().toLowerCase(),
        country: country.value.trim().toLowerCase(),
        city: city.value.trim().toLowerCase(),
        zipCode: zipCode.value.trim().toLowerCase(),
        delProfile:delProfileInput.value,
        profileImg:profileImgSrc,
    };
    console.log(formData)
    window.edit=JSON.stringify(formData)
    // window.location.href = './my-products.html';
        editOverlay.classList.remove("active");
    body.classList.remove("not-active");
    getProfileData();
}


const editModalcloseBtn=document.querySelector(".edit-modal-main-container .close-btn-container .close-btn");

editModalcloseBtn.addEventListener('click',()=>{
    editOverlay.classList.remove("active");
    body.classList.remove("not-active");
})