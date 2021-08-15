const filters = document.querySelector('.filters');
const inputs = document.querySelectorAll('input[type = "range"]');
const outblur = blur.nextElementSibling;
const image = document.querySelector('.image');
image.setAttribute('crossOrigin', 'anonymous');
const resetButton = document.querySelector('.btn-reset');
const nextButton = document.querySelector('.btn-next');
const daytimeLastHour = [6, 12, 18, 0];
const daytimeNames = ['morning', 'day', 'evening', 'night'];
const currentTime = new Date();
const daytime = daytimeNames[daytimeLastHour.findIndex((_, index, arr) => currentTime.getHours() > arr[index] && currentTime.getHours() < arr[index + 1])]
const base = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${daytime}/`;
const images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
let i = 0;
const body = document.querySelector('body');
const btn = document.querySelector('.btn');
const btn_save = document.querySelector('.btn-save');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
const fileInput = document.querySelector('input[type="file"]');
const fullscreen = document.querySelector('.fullscreen');

function viewBgImage(src) {
  image.src = src;
}

function getImage() {
  const index = i % images.length;
  const imageSrc = base + images[index];
  viewBgImage(imageSrc);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  i++;
  btn.disabled = true;
  setTimeout(function() {
    btn.disabled = false;
  }, 1000);
}
nextButton.addEventListener('click', getImage);

resetButton.addEventListener('click', function(e) {
  inputs.forEach(el => {
    console.log(document.documentElement.style.getPropertyValue(`--${el.name}`));
    image.style.setProperty(`--${el.name}`, `${document.documentElement.style.getPropertyValue('--${el.name}')}`);
    el.value = el.name != 'saturate' ? 0 : 100;
    el.nextElementSibling.value = el.value;
  });

});
filters.addEventListener('input', function(e) {
  e.target.nextElementSibling.value = e.target.value;
  image.style.setProperty(`--${e.target.name}`, `${e.target.value}` + e.target.dataset.sizing);
});


fileInput.addEventListener('change', function(e) {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});


function drawImage() {
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = `${base}${images[0]}`;
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
}
drawImage();
btn_save.addEventListener('click', function(e) {
  ctx.filter = getComputedStyle(image)
    .filter;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  var link = document.createElement('a');
  link.href = canvas.toDataURL();
  link.download = 'download.png';
  link.click();
  link.delete;
});
document.querySelector('.fullscreen')
  .addEventListener("click", function(e) {
    toggleFullScreen();
  });

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
