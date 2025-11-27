;(function () {
  "use strict"

  /**
   * 1. DARK MODE LOGIC
   */
  function initDarkMode() {
    const toggleCheckbox = document.querySelector("#checkbox")
    const html = document.documentElement
    const savedTheme = localStorage.getItem("theme")
    const systemPref = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    const currentTheme = savedTheme || systemPref

    html.setAttribute("data-theme", currentTheme)

    if (toggleCheckbox) {
      toggleCheckbox.checked = currentTheme === "dark"
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
  initDarkMode()

  /**
   * 2. MOBILE NAVIGATION
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle")

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active")
    mobileNavToggleBtn.classList.toggle("bi-list")
    mobileNavToggleBtn.classList.toggle("bi-x")
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToogle)
  }

  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle()
      }
    })
  })

  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault()
      this.parentNode.classList.toggle("active")
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active")
      e.stopImmediatePropagation()
    })
  })

  /**
   * 3. PRELOADER
   */
  const preloader = document.querySelector("#preloader")
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove()
    })
  }

  /**
   * 4. SCROLL EFFECTS
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
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }
  window.addEventListener("load", toggleScrollTop)
  document.addEventListener("scroll", toggleScrollTop)

  /**
   * 5. VENDOR LIBRARIES
   */
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

  if (typeof PureCounter !== "undefined") {
    new PureCounter()
  }

  if (typeof GLightbox !== "undefined") {
    const glightbox = GLightbox({ selector: ".glightbox" })
  }

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
              initIsotope.arrange({ filter: this.getAttribute("data-filter") })
            }
            aosInit()
          },
          false
        )
      })
  })

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

  /**
   *
   * 6. IMAGE MODAL / LIGHTBOX
   *
   */
  function initModalLogic() {
    // 1. Find the modal in the document
    const modal = document.getElementById("myImageModal")

    // If modal is missing, stop here to prevent errors
    if (!modal) {
      console.warn("Modal HTML not found! Did you paste the HTML snippet?")
      return
    }

    const modalImg = document.getElementById("img01")
    const captionText = document.getElementById("caption")
    const closeBtn = document.querySelector(".modal-close")
    const links = document.querySelectorAll(".preview-link")

    // 2. Add click listeners to buttons
    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault() // Stop link from navigating

        console.log("Zoom button clicked") // Debug message in console

        modal.style.display = "block" // Show the window
        modalImg.src = this.getAttribute("href") // Get image URL
        captionText.innerHTML = this.getAttribute("title") // Get Title
      })
    })

    // 3. Close Logic
    if (closeBtn) {
      closeBtn.onclick = function () {
        modal.style.display = "none"
      }
    }

    modal.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none"
      }
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        modal.style.display = "none"
      }
    })
  }

  window.addEventListener("load", initModalLogic)
})()
