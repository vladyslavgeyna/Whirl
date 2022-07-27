"use strict"
//this is for burger menu
let header__burger = document.querySelectorAll('.header__burger');
let header_menu = document.querySelector('.header__menu');
let back = document.querySelector('body');
header__burger.forEach(function (item) {
    item.onclick = function () {
        item.classList.toggle('active');
        header_menu.classList.toggle('active');
        back.classList.toggle('lock');
    }
});
//this is for appeared animation
let animItems = document.querySelectorAll("._anim-items");
if(animItems.length > 0) {
    window.addEventListener("scroll", animOnScroll);
    function animOnScroll(params) {
        for (let index = 0; index < animItems.length; index++) {
            const animItem = animItems[index];
            const animItemHeight = animItem.offsetHeight;
            const animItemOffset = offset(animItem).top;
            const animStart = 4;
            let animItemPoint = window.innerHeight - animItemHeight / animStart;
            if(animItemHeight > window.innerHeight) {
                animItemPoint = window.innerHeight - window.innerHeight / animStart;
            }
            if((scrollY > animItemOffset - animItemPoint) && scrollY < (animItemOffset + animItemHeight)) {
                animItem.classList.add("_active");
            }
            else {
                if(!animItem.classList.contains("_anim-no-hide")) {
                    animItem.classList.remove("_active");
                }
            }
        }
    }
    function offset(el) {
        const rect = el.getBoundingClientRect(),
            scrollLeft = window.scrollX || document.documentElement.scrollLeft,
            scrollTop = window.scrollY || document.documentElement.scrollTop;
        return {top:rect.top + scrollTop, left : rect.left + scrollLeft}
    }
    setTimeout(() => {
        animOnScroll();
    }, 150)
}
//this is for header during scrolling
let header = document.querySelector(".header");
window.addEventListener("scroll", headerScrolled);
document.addEventListener("DOMContentLoaded", headerScrolled);
function headerScrolled() {
    let scrollPosition = window.scrollY;
    if(scrollPosition > 0) {
        header.classList.add("_scroll");
    }
    else {
        header.classList.remove("_scroll");
    }
}
//this is for spoilers
const spoilersArray = document.querySelectorAll("[data-spoilers]");
if(spoilersArray.length > 0) {
    const spoilersRegular = Array.from(spoilersArray).filter(function(item, index, self) {
        return !item.dataset.spoilers.split(",")[0];
    });
    if(spoilersRegular.length > 0) {
        initSpoilers(spoilersRegular);
    }
    const spoilersMedia = Array.from(spoilersArray).filter(function (item, index, self) {
        return item.dataset.spoilers.split(",")[0];
    });
    if(spoilersMedia.length > 0) {
        const breakpointsArray = [];
        spoilersMedia.forEach(item => {
            const params = item.dataset.spoilers;
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        });
        let mediaQueries = breakpointsArray.map(function (item) {
            return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
        });
        mediaQueries = mediaQueries.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        });
        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            const spoilersArray = breakpointsArray.filter(function (item) {
                if(item.value === mediaBreakpoint && item.type === mediaType) {
                    return true;
                }
            });
            matchMedia.addListener(function () {
                initSpoilers(spoilersArray, matchMedia);
            });
            initSpoilers(spoilersArray, matchMedia);
        });
    }
    function initSpoilers(spoilersArray, matchMedia = false) {
        spoilersArray.forEach(spoilersBlock => {
            spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
            if(matchMedia.matches || !matchMedia) {
                spoilersBlock.classList.add("_init");
                initSpoilerBody(spoilersBlock);
                spoilersBlock.addEventListener("click", setSpoilerAction);
            }
            else {
                spoilersBlock.classList.remove("_init");
                initSpoilerBody(spoilersBlock, false);
                spoilersBlock.removeEventListener("click", setSpoilerAction);
            }
        });
    }
    function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
        const spoilerTitles = spoilersBlock.querySelectorAll("[data-spoiler]");
        if(spoilerTitles.length > 0) {
            spoilerTitles.forEach(spoilerTitle => {
                if(hideSpoilerBody) {
                    spoilerTitle.removeAttribute("tabindex");
                    if(!spoilerTitle.classList.contains("_active")) {
                        spoilerTitle.nextElementSibling.hidden = true;
                    }
                }
                else {
                    spoilerTitle.setAttribute("tabindex", "-1");
                    spoilerTitle.nextElementSibling.hidden = false;
                }
            });
        }
    }
    function setSpoilerAction(e) {
        const el = e.target;
        if(el.hasAttribute("data-spoiler") || el.closest("[data-spoiler]")) {
            const spoilerTitle = el.hasAttribute("data-spoiler") ? el : el.closest("[data-spoiler]");
            const spoilersBlock = spoilerTitle.closest("[data-spoilers]");
            const oneSpoiler = spoilersBlock.hasAttribute("data-one-spoiler");
            if(!spoilersBlock.querySelectorAll("._slide").length) {
                if(oneSpoiler && !spoilerTitle.classList.contains("_active")) {
                    hideSpoilersBody(spoilersBlock);
                }
                spoilerTitle.classList.toggle("_active");
                _slideToggle(spoilerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
        }
    }
    function hideSpoilersBody(spoilersBlock) {
        const spoilerActiveTitle = spoilersBlock.querySelector("[data-spoiler]._active");
        if(spoilerActiveTitle) {
            spoilerActiveTitle.classList.remove("_active");
            _slideUp(spoilerActiveTitle.nextElementSibling, 500);
        }
    }
}
let _slideUp = (target, duration = 500) => {
    if(!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = target.offsetHeight + "px";
        target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = "0";
        target.style.paddingTop = "0";
        target.style.paddingBottom = "0";
        target.style.marginTop = "0";
        target.style.marginBottom = "0";
        window.setTimeout(() => {
            target.hidden = true;
            target.style.removeProperty("height");
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            target.style.removeProperty("overflow");
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
        }, duration);
    }
}
let _slideDown = (target, duration = 500) => {
    if(!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        if(target.hidden) {
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = "0";
        target.style.paddingTop = "0";
        target.style.paddingBottom = "0";
        target.style.marginTop = "0";
        target.style.marginBottom = "0";
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        window.setTimeout(() => {
            target.style.removeProperty("height");
            target.style.removeProperty("overflow");
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
        }, duration);
    }
}
let _slideToggle = (target, duration = 500) => {
    if(target.hidden) {
        return _slideDown(target, duration);
    }
    else {
        return _slideUp(target, duration);
    }
}