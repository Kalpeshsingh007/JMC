// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeComponents()
  initializeAnimations()
  initializeAccessibility()
})

// Initialize all components
function initializeComponents() {
  initializeNavigation()
  initializeDropdown()
  initializeCarousel()
  initializeSearch()
  initializeFontSize()
  initializeLanguage()
  initializeServiceCards()
}

// Navigation functionality
function initializeNavigation() {
  const navItems = document.querySelectorAll(".nav-item:not(.dropdown)")

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      // Remove active class from all items
      document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("active"))
      // Add active class to clicked item
      this.classList.add("active")
    })
  })
}

// Dropdown functionality - Fixed
function initializeDropdown() {
  const dropdownToggle = document.getElementById("departmentDropdown")
  const dropdownMenu = document.getElementById("departmentMenu")
  const dropdownItem = dropdownToggle?.closest(".nav-item")

  if (!dropdownToggle || !dropdownMenu || !dropdownItem) {
    console.log("Dropdown elements not found")
    return
  }

  console.log("Initializing dropdown...")

  // Toggle dropdown on click
  dropdownToggle.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()

    console.log("Dropdown clicked")

    // Close other dropdowns if any
    document.querySelectorAll(".nav-item.dropdown.show").forEach((item) => {
      if (item !== dropdownItem) {
        item.classList.remove("show")
      }
    })

    // Toggle current dropdown
    const isCurrentlyOpen = dropdownItem.classList.contains("show")
    if (isCurrentlyOpen) {
      dropdownItem.classList.remove("show")
      console.log("Dropdown closed")
    } else {
      dropdownItem.classList.add("show")
      console.log("Dropdown opened")
    }
  })

  // Show dropdown on hover
  dropdownItem.addEventListener("mouseenter", function () {
    this.classList.add("show")
    console.log("Dropdown shown on hover")
  })

  // Hide dropdown when mouse leaves (with delay)
  dropdownItem.addEventListener("mouseleave", function () {
    
    setTimeout(() => {
      if (!this.matches(":hover")) {
        this.classList.remove("show")
        console.log("Dropdown hidden on mouse leave")
      }
    }, 200)
  })

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdownItem.contains(e.target)) {
      dropdownItem.classList.remove("show")
    }
  })

  // Close dropdown when pressing Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdownItem.classList.remove("show")
    }
  })

  // Handle dropdown item clicks
  const dropdownItems = dropdownMenu.querySelectorAll(".dropdown-item")
  dropdownItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()
      const departmentName = this.textContent.trim()
      showNotification(`${departmentName} विभाग निवडला`, "info")
      dropdownItem.classList.remove("show")
      console.log(`Selected: ${departmentName}`)
    })
  })

  // Update ARIA attributes
  dropdownToggle.setAttribute("aria-haspopup", "true")
  dropdownToggle.setAttribute("aria-expanded", "false")

  // Update aria-expanded when dropdown opens/closes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "class") {
        const isOpen = dropdownItem.classList.contains("show")
        dropdownToggle.setAttribute("aria-expanded", isOpen.toString())
      }
    })
  })

  observer.observe(dropdownItem, { attributes: true })
}

// Carousel enhancements
function initializeCarousel() {
  const carousel = document.querySelector("#mainCarousel")
  if (!carousel) return

  // Auto-pause on hover
  carousel.addEventListener("mouseenter", function () {
    const bsCarousel = window.bootstrap.Carousel.getInstance(this)
    if (bsCarousel) {
      bsCarousel.pause()
    }
  })

  carousel.addEventListener("mouseleave", function () {
    const bsCarousel = window.bootstrap.Carousel.getInstance(this)
    if (bsCarousel) {
      bsCarousel.cycle()
    }
  })
}

// Search functionality
function initializeSearch() {
  const searchInput = document.getElementById("searchInput")
  if (!searchInput) return

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch()
    }
  })
}

function performSearch() {
  const searchInput = document.getElementById("searchInput")
  const query = searchInput.value.trim()

  if (query === "") {
    showNotification("कृपया शोध शब्द टाका", "warning")
    return
  }

  // Simulate search functionality
  showNotification(`"${query}" साठी शोध सुरू आहे...`, "info")

  // Here you would implement actual search logic
  setTimeout(() => {
    showNotification("शोध पूर्ण झाला", "success")
  }, 2000)
}

// Font size controls
function initializeFontSize() {
  // Set default font size
  document.body.style.fontSize = "16px"
}

function changeFontSize(action) {
  const body = document.body
  const currentSize = Number.parseInt(window.getComputedStyle(body).fontSize)
  let newSize

  switch (action) {
    case "increase":
      newSize = Math.min(currentSize + 2, 24)
      break
    case "decrease":
      newSize = Math.max(currentSize - 2, 12)
      break
    case "normal":
    default:
      newSize = 16
      break
  }

  body.style.fontSize = newSize + "px"

  // Update button states
  const fontBtns = document.querySelectorAll(".font-btn")
  fontBtns.forEach((btn) => btn.classList.remove("active"))

  if (action !== "normal") {
    event.target.classList.add("active")
  }

  showNotification(`अक्षर आकार बदलला: ${newSize}px`, "success")
}

// Language functionality
function initializeLanguage() {
  const savedLang = localStorage.getItem("selectedLanguage") || "mr"
  const langSelect = document.querySelector(".language-selector select")
  if (langSelect) {
    langSelect.value = savedLang
  }
}

function changeLanguage(lang) {
  localStorage.setItem("selectedLanguage", lang)

  const langNames = {
    mr: "मराठी",
    hi: "हिंदी",
    en: "English",
  }

  showNotification(`भाषा बदलली: ${langNames[lang]}`, "success")

  // Here you would implement actual language switching logic
  // For now, we'll just show a notification
  if (lang !== "mr") {
    setTimeout(() => {
      showNotification("भाषा बदल सुविधा लवकरच उपलब्ध होईल", "info")
    }, 1000)
  }
}

// Service cards interaction
function initializeServiceCards() {
  const serviceCards = document.querySelectorAll(".service-card")

  serviceCards.forEach((card) => {
    card.addEventListener("click", function () {
      const serviceName = this.querySelector("h6").textContent
      showNotification(`${serviceName} सेवा निवडली`, "info")

      // Add click animation
      this.style.transform = "scale(0.95)"
      setTimeout(() => {
        this.style.transform = ""
      }, 150)
    })
  })

  // Service buttons in the service rights section
  const serviceBtns = document.querySelectorAll(".service-btn")
  serviceBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const serviceName = this.textContent.trim()
      showNotification(`${serviceName} सेवा उघडली जात आहे...`, "info")
    })
  })
}

// Animation on scroll
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in")
      }
    })
  }, observerOptions)

  // Observe content boxes
  const contentBoxes = document.querySelectorAll(".content-box, .service-card")
  contentBoxes.forEach((box) => {
    observer.observe(box)
  })
}

// Accessibility features
function initializeAccessibility() {
  // Add keyboard navigation for service cards
  const serviceCards = document.querySelectorAll(".service-card")
  serviceCards.forEach((card) => {
    card.setAttribute("tabindex", "0")
    card.setAttribute("role", "button")

    card.addEventListener("keypress", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        this.click()
      }
    })
  })

  // Add ARIA labels
  const searchBtn = document.querySelector(".search-container button")
  if (searchBtn) {
    searchBtn.setAttribute("aria-label", "शोध करा")
  }

  // Add skip to content link
  const skipLink = document.createElement("a")
  skipLink.href = "#main-content"
  skipLink.textContent = "मुख्य सामग्रीवर जा"
  skipLink.className = "sr-only"
  skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-blue);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
    `

  skipLink.addEventListener("focus", function () {
    this.style.top = "6px"
  })

  skipLink.addEventListener("blur", function () {
    this.style.top = "-40px"
  })

  document.body.insertBefore(skipLink, document.body.firstChild)

  // Dropdown accessibility
  const dropdownToggle = document.getElementById("departmentDropdown")
  if (dropdownToggle) {
    dropdownToggle.setAttribute("aria-haspopup", "true")
    dropdownToggle.setAttribute("aria-expanded", "false")

    // Update aria-expanded when dropdown opens/closes
    const dropdownItem = dropdownToggle.closest(".nav-item")
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const isOpen = dropdownItem.classList.contains("show")
          dropdownToggle.setAttribute("aria-expanded", isOpen.toString())
        }
      })
    })

    observer.observe(dropdownItem, { attributes: true })
  }
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification-toast")
  existingNotifications.forEach((notification) => {
    notification.remove()
  })

  const notification = document.createElement("div")
  notification.className = `alert alert-${type} notification-toast`
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-radius: 8px;
        font-weight: 500;
    `

  // Add icon based on type
  let icon = ""
  switch (type) {
    case "success":
      icon = '<i class="fas fa-check-circle me-2"></i>'
      break
    case "warning":
      icon = '<i class="fas fa-exclamation-triangle me-2"></i>'
      break
    case "danger":
      icon = '<i class="fas fa-times-circle me-2"></i>'
      break
    case "info":
    default:
      icon = '<i class="fas fa-info-circle me-2"></i>'
      break
  }

  notification.innerHTML = icon + message

  // Add close button
  const closeBtn = document.createElement("button")
  closeBtn.innerHTML = "&times;"
  closeBtn.className = "btn-close"
  closeBtn.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.7;
    `

  closeBtn.addEventListener("click", () => {
    notification.remove()
  })

  notification.appendChild(closeBtn)
  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOutRight 0.3s ease"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove()
        }
      }, 300)
    }
  }, 5000)
}

// News item interactions
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("news-link")) {
    e.preventDefault()
    const newsTitle = e.target.textContent.trim()
    showNotification(`बातमी उघडली जात आहे: "${newsTitle}"`, "info")
  }
})

// Floating button interactions
document.addEventListener("click", (e) => {
  if (e.target.closest(".floating-btn")) {
    const btn = e.target.closest(".floating-btn")
    const btnText = btn.textContent.trim()

    if (btnText.includes("आपत्काल")) {
      showNotification("आपत्कालीन सेवा संपर्क: 108, 102", "warning")
    } else if (btnText.includes("तक्रार")) {
      showNotification("तक्रार नोंदणी फॉर्म उघडला जात आहे...", "info")
    }
  }
})

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .font-btn.active {
        background: rgba(255,255,255,0.4) !important;
        font-weight: bold;
    }
`
document.head.appendChild(style)

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript Error:", e.error)
  showNotification("तांत्रिक त्रुटी आली आहे", "danger")
})

// Performance monitoring
window.addEventListener("load", () => {
  const loadTime = performance.now()
  console.log(`पृष्ठ लोड झाले: ${Math.round(loadTime)}ms मध्ये`)
})
