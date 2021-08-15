// Model and bussiness logic
class OuterData {
  static index = 0;
  constructor(Dtime) {
    this.baseURL = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${Dtime}/`;
    this.images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
  }
  getBaseURL() {
    return this.baseURL;
  }
  setBaseURL(base) {
    this.baseURL = base;
  }
  getNextImageSrc() {
    const index = OuterData.index % this.images.length;
    OuterData.index++;
    const imageSrc = this.baseURL + this.images[index];
    return imageSrc;
  }
}
class DayTime {
  constructor() {
    this.daytimeLastHour = [6, 12, 18, 24, 0, 6];
    this.daytimeNames = ['morning', 'day', 'evening', 'night', 'night'];
  }
  _getDaytimeIndex(currentHour) {
    return this.daytimeLastHour.findIndex((_, index, arr) => currentHour >= arr[index] && currentHour < arr[index + 1]);
  }
  getCurrentHour() {
    return new Date().getHours();
  }
  getDaytime() {
    return this.daytimeNames[this._getDaytimeIndex(this.getCurrentHour())];
  }
}
class CustomFileReader {
  static reader;
  constructor() {
    CustomFileReader.reader = new FileReader();
  }
  read(file) {
    return new Promise((resolve, reject) => {
      CustomFileReader.reader.onload = () => resolve(CustomFileReader.reader.result);
      CustomFileReader.reader.readAsDataURL(file);
    });
  }
  getInputFile() {}
}

class Downloader {
  constructor() {}
  download(url, saveName) {
    const link = document.createElement('a');
    link.href = url;
    link.download = saveName;
    link.click();
  }
}
class Model {
  constructor() {
    this.db = new OuterData(new DayTime().getDaytime());
    this.reader = new CustomFileReader();
    this.downloader = new Downloader();
  }
  readData(file) {
    this.reader.read(file);
  }
  downloadData(url, saveName) {
    this.downloader.download(url, saveName);
  }
}
////////////

// UI elements
class ObjectDOM {
  constructor(node) {
    this.node = node;
  }
  getNode() {
    return this.node;
  }
  setAttribute(name, value) {
    this.node.setAttribute(name, value);
  }
  setStyleAttribute(name, value) {
    this.node.style.setProperty(name, value);
  }
  setWidth(width) {
    this.node.width = width;
  }
  setHeight(height) {
    this.node.height = height;
  }
  getWidth() {
    return this.node.width;
  }
  getHeight() {
    return this.node.height;
  }
}

class Filter extends ObjectDOM {
  constructor(node) {
    super(node);
  }
}

class Input extends ObjectDOM {
  constructor(node) {
    super(node);
  }
}

class Button extends ObjectDOM {
  constructor(node) {
    super(node);
  }
  setUpListener(eventName, eventHandler) {
    this.node.addEventListener(eventName, eventHandler);
  }
}

class FullscreenButton extends Button {
  constructor(node) {
    super(node);
  }
  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}

class ResetButton extends Button {
  constructor(node) {
    super(node);
  }
}

class NextButton extends Button {
  constructor(node) {
    super(node);
  }
}

class SaveButton extends Button {
  constructor(node) {
    super(node);
  }
}

class Canvas extends ObjectDOM {
  constructor(node) {
    super(node);
  }
  getContext() {
    return this.node.getContext("2d");
  }
  drawImg(image) {
    this.getContext().drawImage(image, 0, 0);
  }
  getExportURL() {
    return this.node.toDataURL();
  }
  setFilter(filter) {
    this.getContext().filter = filter;
  }
}

class Image extends ObjectDOM {
  constructor(node) {
    super(node);
    this.filters = new Filter(document.querySelector('.filters'));
    this.setAttribute('crossOrigin', 'anonymous');
    this.setfilter();
    this.setSource('./assets/img/img.jpg');
  }
  setSource(source) {
    this.node.src = source;
  }
  getSource() {
    return this.node.src;
  }
  setfilter() {
    this.filters.node.addEventListener('input', (e) => {
      e.target.nextElementSibling.value = e.target.value;
      this.setStyleAttribute(`--${e.target.name}`, `${e.target.value}` + e.target.dataset.sizing);
    });
  }
  getNaturalWidth() {
    return this.node.naturalWidth;
  }
  getNaturalHeight() {
    return this.node.naturalHeight;
  }
}

class FileInput extends ObjectDOM {
  constructor(node) {
    super(node);
  }
  setUpListener(eventName, eventHandler) {
    this.node.addEventListener(eventName, eventHandler);
  }
  resetInput() {
    this.node.value = null;
  }
  getInputFile() {
    return this.node.files[0];
  }
}

class UI {
  constructor() {
    this.nextButton = new NextButton(document.querySelector('.btn-next'));
    this.resetButton = new ResetButton(document.querySelector('.btn-reset'));
    this.saveButton = new SaveButton(document.querySelector('.btn-save'));
    this.canvas = new Canvas(document.querySelector('canvas'));
    this.image = new Image(document.querySelector('.image'));
    this.inputs = new Input(document.querySelectorAll('input[type = "range"]'));
    this.fileInput = new FileInput(document.querySelector('input[type="file"]'));
    this.fullscreenButton = new FullscreenButton(document.querySelector('.fullscreen'));
    this.drawImageInCanvas();
  }
  setCanvasWidth(width) {
    this.canvas.setWidth(width);
  }
  setCanvasHeight(height) {
    this.canvas.setHeight(height);
  }
  getImageNaturalHeight() {
    return this.image.getNaturalHeight();
  }
  getImageNaturalWidth() {
    return this.image.getNaturalWidth();
  }
  drawImageInCanvas() {
    this.canvas.setWidth(this.image.getNaturalWidth());
    this.canvas.setHeight(this.image.getNaturalHeight());
    this._setCanvasFilters();
    this.canvas.drawImg(this.image.node);
  }
  _setCanvasFilters() {
    const filterOptions = getComputedStyle(this.image.getNode()).filter;
    const blurValue = filterOptions.match(/\d+/)[0];
    const blurCoeff = this.image.getNaturalHeight() / this.image.getHeight();
    this.canvas.setFilter(filterOptions.replace(/\d+/, blurValue * blurCoeff));
  }
  resetInput() {
    this.fileInput.resetInput();
  }
  resetFilters() {
    this.inputs.node.forEach(el => {
      this.image.setStyleAttribute(`--${el.name}`, `${document.documentElement.style.getPropertyValue('--${el.name}')}`);
      el.value = el.name != 'saturate' ? 0 : 100;
      el.nextElementSibling.value = el.value;
    });
  }
  getCanvasURL() {
    return this.canvas.getExportURL();
  }
  getInputFile() {
    return this.fileInput.getInputFile();
  }
  setImageSource(src) {
    this.image.getNode().src = src;
  }
  toggleFullScreen() {
    this.fullscreenButton.toggleFullScreen();
  }
}

class Controller {
  constructor(ui, model) {
    this.ui = ui;
    this.model = model;
  }

  nextButtonClickHandler(e) {
    this.ui.setImageSource(this.model.getNextImageSrc());
  }
  userFileHandler(e) {
    this.model.readData(this.ui.getInputFile()).then((value) => this.ui.setImageSource(value));
    this.ui.resetInput();
  }
  resetButtonClickHandler(e) {
    this.ui.resetFilters.apply(this.ui);
  }
  saveButtonClickHandler(e) {
    this.ui.drawImageInCanvas();
    this.model.downloadData(this.ui.getCanvasURL(), 'download.png');
  }
  fullscreenClickHandler(e) {
    this.ui.toggleFullScreen();
  }
  setUpListeners() {
    this.ui.nextButton.setUpListener('click', this.nextButtonClickHandler.bind(this));
    this.ui.resetButton.setUpListener('click', this.resetButtonClickHandler.bind(this));
    this.ui.saveButton.setUpListener('click', this.saveButtonClickHandler.bind(this));
    this.ui.fileInput.setUpListener('change', this.userFileHandler.bind(this));
    this.ui.fullscreenButton.setUpListener('click', this.fullscreenClickHandler.bind(this));
  }
}

class App {
  constructor() {
    console.log("App started");
    this.controller = new Controller(new UI(), new OuterData((new DayTime()).getDaytime()));
  }
  start() {
    this.controller.setUpListeners();
  }

}
const app = new App();
app.start();

// model = reader+downloader+ dayTime + OuterData?
// add view, ui only for elements, view for methods
//
