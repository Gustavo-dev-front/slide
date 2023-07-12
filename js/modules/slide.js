import debounce from "./debounce.js";

export class Slide {
  constructor(wrapper, slide) {
    this.wrapper = document.querySelector(wrapper);
    this.slide = document.querySelector(slide);
    this.dist = { startX: 0, moviment: 0, finalPosition: 0 };
    this.activeClass = "active";
  }

  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
  }

  moveSlide(distX) {
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
    this.dist.finalPosition = this.dist.startX + this.dist.moviment;
    this.changeSlideOnEnd();
    this.transition(true);
    this.dist.moviment = 0;
  }

  changeSlideOnEnd() {
    if (this.dist.moviment >= 120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else if (this.dist.moviment <= -120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else {
      this.changeSlide(this.index.active);
    }
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
    this.transition(false);
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
    window.addEventListener("resize", this.onResize);
  }

  onResize() {
    this.slidesConfig();
    this.changeSlide(this.index.active);
  }

  binder() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 50);
    this.activeNextSlide = this.activeNextSlide.bind(this);
    this.activePrevSlide = this.activePrevSlide.bind(this);
  }

  slidesPosition(slideElement) {
    const margin = (this.wrapper.offsetWidth - slideElement.offsetWidth) / 2;
    return margin - slideElement.offsetLeft;
  }

  slidesConfig() {
    this.slides = [...this.slide.children].map((element) => {
      return { element: element, position: this.slidesPosition(element) };
    });
  }

  slidesIndexNav(index) {
    const last = this.slides.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeActiveClass() {
    const prev = this.slides[this.index.prev];
    const next = this.slides[this.index.next];
    if (prev !== undefined) prev.element.classList.remove(this.activeClass);
    if (next !== undefined) next.element.classList.remove(this.activeClass);
    this.slides[this.index.active].element.classList.add(this.activeClass);
  }

  changeSlide(index) {
    const activeSlide = this.slides[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
    this.wrapper.dispatchEvent(this.changeEvent);
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
  }

  activeNextSlide() {
    if (this.index.next !== undefined) this.changeSlide(this.index.next);
  }

  init() {
    this.binder();
    this.slidesConfig();
    this.addSlideEvents();
    this.changeSlide(0);
    return this;
  }
}

export class SlideNav extends Slide {
  constructor(slide, wrapper) {
    super(slide, wrapper);
    this.bindControlEvents();
    this.changeEvent = new Event("changeEvent");
  }

  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvents();
  }

  addArrowEvents() {
    this.prevElement.addEventListener("click", this.activePrevSlide);
    this.nextElement.addEventListener("click", this.activeNextSlide);
  }

  createControl() {
    const control = document.createElement("ul");
    control.dataset.control = "slide";
    this.slides.forEach((item, index) => {
      control.innerHTML += `<li><a href="#slide${index + 1}">${index + 1}</a></li>`;
    });
    this.wrapper.appendChild(control);
    return control;
  }

  eventControl(item, index) {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      this.changeSlide(index);
    });
    this.wrapper.addEventListener("changeEvent", this.activeControlItem);
  }

  activeControlItem() {
    this.controlArray.forEach((element) => element.classList.remove(this.activeClass));
    this.controlArray[this.index.active].classList.add(this.activeClass);
  }

  addControl(customControl) {
    this.control = document.querySelector(customControl) || this.createControl();
    this.controlArray = [...this.control.children];
    this.controlArray.forEach(this.eventControl);
    this.activeControlItem();
  }

  bindControlEvents() {
    this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
  }
}
