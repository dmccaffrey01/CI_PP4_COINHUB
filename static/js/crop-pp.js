document.getElementById('imageInput').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = document.createElement('img');
        img.src = event.target.result;

        // Remove any previously added cropper instances
        if (window.cropper) {
          window.cropper.destroy();
        }

        // Attach the new image to the DOM
        const imageContainer = document.querySelector('.crop-pp-img-container');
        imageContainer.innerHTML = '';
        imageContainer.appendChild(img);

        // Initialize Cropper.js
        window.cropper = new Cropper(img, {
          aspectRatio: 1, // Set to 1 for square cropping
          viewMode: 1,    // Set to 1 to restrict the crop box to the container
          crop(event) {
            // Update the cropped preview image
            const croppedImage = document.getElementById('croppedImage');
          },
        });
      };
      reader.readAsDataURL(file);
    }
  });

const previewBtn = document.querySelector(".preview-btn");
const previewImg = document.querySelector("#previewImage");
const previewContainer = document.querySelector(".preview-pp-container");
const editContainer = document.querySelector(".edit-pp-container");
const clearCheck = document.querySelector("#clearPP");

previewBtn.addEventListener("click", () => {
    if (typeof cropper !== "undefined") {
      let croppedImage = cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.7);
      previewImg.src = croppedImage;
    } else if (clearCheck.checked) {
      previewImg.src = 'https://res.cloudinary.com/dzwyiggcp/image/upload/v1689692743/MREEA/default-profile-pic_yp9kzz.png';
    }
    
    editContainer.style.display = "none";
    previewContainer.style.display = "flex";

    const croppedImageData = previewImg.src;
    document.getElementById('id_profile_image_change').value = "changed";
    document.getElementById('croppedImageData').value = croppedImageData;
});