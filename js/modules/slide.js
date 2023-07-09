export default class Slide {
  constructor(wrapper, slide) {
    this.wrapper = document.querySelector(wrapper);
    this.slide = document.querySelector(slide);
    this.dist = { startX: 0, moviment: 0, finalPosition: 0 };
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translateX(${distX}px)`;
  }

  updatePosition(pageX) {
    this.dist.moviment = (pageX - this.dist.startX) * 1.6;
    return this.dist.finalPosition + this.dist.moviment;
  }

  onMove(event) {
    let pageX = event.type === "mousemove" ? event.pageX : event.changedTouches[0].pageX;
    const finalPosition = this.updatePosition(pageX);
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    if (event.type === "touchend") {
      this.wrapper.removeEventListener("touchmove", this.onMove);
    } else {
      this.wrapper.removeEventListener("mousemove", this.onMove);
      this.wrapper.removeEventListener("mouseleave", this.onEnd);
    }
    this.dist.finalPosition = this.dist.movePosition;
  }

  onStart(event) {
    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.pageX;
      this.wrapper.addEventListener("mousemove", this.onMove);
      this.wrapper.addEventListener("mouseleave", this.onEnd);
    } else {
      this.dist.startX = event.changedTouches[0].pageX;
      this.wrapper.addEventListener("touchmove", this.onMove);
    }
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
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
