(()=>{"use strict";const e=document.querySelector("body").querySelector(".header");((e,t,n="beforeend")=>{t.insertAdjacentElement(n,e.getElement())})(new class{getTemplate(){return'<section class="header__profile profile">\n      <p class="profile__rating">Movie Buff</p>\n      <img\n        class="profile__avatar"\n        src="images/bitmap@2x.png"\n        alt="Avatar"\n        width="35"\n        height="35"\n      >\n    </section>\n  '}getElement(){return this.element||(this.element=(e=>{const t=document.createElement("div");return t.innerHTML=e,t.firstElementChild})(this.getTemplate())),this.element}removeElement(){this.element=null}},e)})();
//# sourceMappingURL=bundle.js.map