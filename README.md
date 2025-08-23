# ☕ beanly — Discover & Explore Cafés  

**beanly** is more than a café catalog — it’s a vibrant community of coffee lovers.  
Whether you’re searching for a cozy spot to work, a lively place to meet friends, or simply the best coffee in town, beanly helps you discover cafés by **vibe, amenities, and atmosphere**.  

---

## ✨ Why beanly?

Finding the right café isn’t always easy:  

- Information is scattered across Google Maps, blogs, and social media.  
- Ratings alone don’t reflect the **real experience**.  
- People care about the **vibe** — music, design, crowd, and atmosphere.  

That’s why we built **beanly**:  

- A unified **café discovery platform**.  
- Powered by **real reviews and check-ins** from the community.  
- Enriched with **social features** — statuses, achievements, badges.  
- Designed to **motivate exploration** through gamification.  

> **Our mission:** make finding your perfect café as easy and inspiring as ordering your favorite coffee.  

---

## 🚀 Core Features

- 📍 Browse cafés with **ratings, photos, and details**  
- ⭐ Save favourites for quick access  
- 📝 Share **reviews and check-ins** with the community  
- 👍 Like & sort reviews by popularity  
- 🏆 Unlock **achievements** (Bronze, Silver, Gold) and profile badges  
- 🎭 Express yourself with **statuses**  
- 🌍 **Multilingual support** — available in multiple languages  
- 🌙 **Light/Dark mode** for personalization  
- 📱 Fully **responsive design** — mobile & desktop  
- 👤 **User accounts & profiles** — private and public  
- 🔗 Share cafés easily with friends  

---

## 🎨 Design Philosophy

- Minimal, modern, and **user-friendly** interface  
- Card-based browsing for quick café exploration  
- Playful branding with a **friendly identity & logo**  
- Gamification baked into the user journey  

---

## 🌟 Impact

With beanly, we:  

- Simplify café discovery for different needs (work, relax, coffee-to-go).  
- Drive user engagement through interactive features.  
- Build a community centered around **coffee culture**.  

**beanly** is where discovery meets community — and every coffee visit becomes part of your personal story.  

---

## 🛠 Tech Stack  
[![My Skills](https://skillicons.dev/icons?i=angular,tailwind,ts,html,css,sass,vscode,github,figma)](https://skillicons.dev)

- **Frontend:** Angular 20, TypeScript  
- **Styling:** SCSS, TailwindCSS, PostCSS, Stylelint  
- **Routing & Animations:** @angular/router, @angular/animations  
- **Internationalization (i18n):** @ngx-translate/core, @ngx-translate/http-loader  
- **State / Reactive:** RxJS  
- **Testing:** Jasmine, Karma  
- **Deployment:** angular-cli-ghpages  
- **Code Formatting:** Prettier + Prettier Plugin TailwindCSS  

---

## 📁 Project Structure

```text
src/
├─ app/                 [Main application code]
│  ├─ environments/     [Environment configs]
│  │  └─ api-endpoints.ts
│  ├─ layout/           [UI elements: Header, Footer]
│  │  ├─ Header/
│  │  │  ├─ components/ [Header sub-components]
│  │  │  └─ header.component.ts
│  │  └─ footer.component.ts
│  ├─ pages/            [App pages]
│  │  ├─ auth-page/
│  │  ├─ catalog-page/
│  │  ├─ home-page/
│  │  ├─ place-details-page/
│  │  ├─ profile-page/
│  │  └─ public-user-profile/
│  ├─ shared/           [Reusable components, services, models]
│  ├─ app.component.ts
│  └─ app-routing.routes.ts
├─ assets/              [Images, icons, translations]
├─ styles/              [SCSS & Tailwind styles]
├─ index.html
├─ main.ts
└─ polyfills.ts

