/**
 * Main JS File - Fixed for Dark Mode Slider & Preloader
 */
;(function () {
  "use strict"

  /**
   * ---------------------------------------------------------
   * 1. DARK MODE LOGIC (Slider Version)
   * ---------------------------------------------------------
   */
  function initDarkMode() {
    const toggleCheckbox = document.querySelector("#checkbox")
    const html = document.documentElement

    // A. Check Local Storage or System Preference
    const savedTheme = localStorage.getItem("theme")
    const systemPref = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    const currentTheme = savedTheme || systemPref

    // B. Apply Theme immediately
    html.setAttribute("data-theme", currentTheme)

    // C. Sync the slider position if it exists
    if (toggleCheckbox) {
      if (currentTheme === "dark") {
        toggleCheckbox.checked = true
      } else {
        toggleCheckbox.checked = false
      }

      // D. Event Listener for Slider Change
      toggleCheckbox.addEventListener("change", function (e) {
        if (e.target.checked) {
          html.setAttribute("data-theme", "dark")
          localStorage.setItem("theme", "dark")
        } else {
          html.setAttribute("data-theme", "light")
          localStorage.setItem("theme", "light")
        }
      })
    }
  }
  // Run immediately
  initDarkMode()

  /**
   * ---------------------------------------------------------
   * 2. PRELOADER (Fixes the "Stuck Loading" issue)
   * ---------------------------------------------------------
   */
  const preloader = document.querySelector("#preloader")
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove()
    })
  }

  /**
   * ---------------------------------------------------------
   * 3. SCROLL & NAVIGATION
   * ---------------------------------------------------------
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body")
    const selectHeader = document.querySelector("#header")
    if (
      !selectHeader ||
      (!selectHeader.classList.contains("scroll-up-sticky") &&
        !selectHeader.classList.contains("sticky-top") &&
        !selectHeader.classList.contains("fixed-top"))
    )
      return
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled")
  }
  document.addEventListener("scroll", toggleScrolled)
  window.addEventListener("load", toggleScrolled)

  // Mobile Nav Toggle
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle")
  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active")
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.toggle("bi-list")
      mobileNavToggleBtn.classList.toggle("bi-x")
    }
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToogle)
  }

  // Hide mobile nav on same-page links
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle()
      }
    })
  })

  // Toggle mobile nav dropdowns
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault()
      this.parentNode.classList.toggle("active")
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active")
      e.stopImmediatePropagation()
    })
  })

  // Scroll Top Button
  let scrollTop = document.querySelector(".scroll-top")
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active")
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }
  window.addEventListener("load", toggleScrollTop)
  document.addEventListener("scroll", toggleScrollTop)

  /**
   * ---------------------------------------------------------
   * 4. LIBRARIES (AOS, Swiper, Isotope, GLightbox)
   * ---------------------------------------------------------
   */

  // AOS (Animation on Scroll)
  function aosInit() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 600,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      })
    }
  }
  window.addEventListener("load", aosInit)

  // Typed.js
  const selectTyped = document.querySelector(".typed")
  if (selectTyped && typeof Typed !== "undefined") {
    let typed_strings = selectTyped.getAttribute("data-typed-items")
    typed_strings = typed_strings.split(",")
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    })
  }

  // Pure Counter
  if (typeof PureCounter !== "undefined") {
    new PureCounter()
  }

  // GLightbox
  if (typeof GLightbox !== "undefined") {
    const glightbox = GLightbox({
      selector: ".glightbox",
    })
  }

  // Isotope
  document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute("data-layout") ?? "masonry"
    let filter = isotopeItem.getAttribute("data-default-filter") ?? "*"
    let sort = isotopeItem.getAttribute("data-sort") ?? "original-order"

    let initIsotope
    if (typeof imagesLoaded !== "undefined" && typeof Isotope !== "undefined") {
      imagesLoaded(
        isotopeItem.querySelector(".isotope-container"),
        function () {
          initIsotope = new Isotope(
            isotopeItem.querySelector(".isotope-container"),
            {
              itemSelector: ".isotope-item",
              layoutMode: layout,
              filter: filter,
              sortBy: sort,
            }
          )
        }
      )
    }

    isotopeItem
      .querySelectorAll(".isotope-filters li")
      .forEach(function (filters) {
        filters.addEventListener(
          "click",
          function () {
            isotopeItem
              .querySelector(".isotope-filters .filter-active")
              .classList.remove("filter-active")
            this.classList.add("filter-active")
            if (initIsotope) {
              initIsotope.arrange({
                filter: this.getAttribute("data-filter"),
              })
            }
            aosInit()
          },
          false
        )
      })
  })

  // FAQ Toggle
  document
    .querySelectorAll(".faq-item h3, .faq-item .faq-toggle")
    .forEach((faqItem) => {
      faqItem.addEventListener("click", () => {
        faqItem.parentNode.classList.toggle("faq-active")
      })
    })

  // Swiper Slider
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      )
      if (typeof Swiper !== "undefined") {
        new Swiper(swiperElement, config)
      }
    })
  }
  window.addEventListener("load", initSwiper)

  // Navmenu Scrollspy
  let navmenulinks = document.querySelectorAll(".navmenu a")
  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return
      let section = document.querySelector(navmenulink.hash)
      if (!section) return
      let position = window.scrollY + 200
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((link) => link.classList.remove("active"))
        navmenulink.classList.add("active")
      } else {
        navmenulink.classList.remove("active")
      }
    })
  }
  window.addEventListener("load", navmenuScrollspy)
  document.addEventListener("scroll", navmenuScrollspy)
})()
