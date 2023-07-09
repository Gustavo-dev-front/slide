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
    const finalPosition = this.updatePosition(event.pageX);
    this.moveSlide(finalPosition);
  }

  onEnd() {
    this.wrapper.removeEventListener("mousemove", this.onMove);
    this.wrapper.removeEventListener("mouseleave", this.onEnd);
    this.dist.finalPosition = this.dist.movePosition;
  }

  onStart(event) {
    event.preventDefault();
    this.dist.startX = event.pageX;
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
