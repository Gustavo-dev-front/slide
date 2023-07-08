export default class Slide {
  constructor(wrapper, slide) {
    this.wrapper = document.querySelector(wrapper);
    this.slide = document.querySelector(slide);
    this.dist = { startX: 0, moviment: 0, finalPosition: 0 };
  }

  onMove(event) {
    this.dist.moviment = event.pageX - this.dist.startX;
    this.slide.style.transform = `translateX(${this.dist.moviment}px)`;
  }

  onEnd() {
    this.wrapper.removeEventListener("mousemove", this.onMove);
    this.wrapper.removeEventListener("mouseleave", this.onEnd);
  }

  onStart(event) {
    event.preventDefault();
    this.dist.startX = event.pageX - this.dist.moviment;
    this.wrapper.addEventListener("mousemove", this.onMove);
    this.wrapper.addEventListener("mouseleave", this.onEnd);
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
  }

  binder() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    this.binder();
    this.addSlideEvents();
  }
}
