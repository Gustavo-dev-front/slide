export default class Slide {
  constructor(wrapper, slide) {
    this.wrapper = document.querySelector(wrapper);
    this.slide = document.querySelector(slide);
  }

  onMove() {
    console.log(this);
  }

  onEnd() {
    this.wrapper.removeEventListener("mousemove", this.onMove);
  }

  onStart(event) {
    event.preventDefault();
    console.log(this);
    this.wrapper.addEventListener("mousemove", this.onMove);
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
  }

  binder() {
    this.onStart = this.onStart.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onMove = this.onMove.bind(this);
  }

  init() {
    this.binder();
    this.addSlideEvents();
  }
}
