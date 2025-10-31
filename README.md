<p>
  <img src="./src/assets/logo.svg" alt="Logo" width="160"/>
</p>

**beanly** is more than a café catalog — it’s a vibrant community of coffee lovers.  
Whether you’re searching for a cozy spot to work, a lively place to meet friends, or simply the best coffee in town, beanly helps you discover cafés by **vibe, amenities, and atmosphere**.  

## Live Site: [beanly](https://beanly.vercel.app)

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

**Our mission:** make finding your perfect café as easy and inspiring as ordering your favorite coffee.  

---

## 🚀 Core Features

- Browse cafés with **ratings, photos, and details**  
- Save favourites for quick access  
- Share **reviews and check-ins** with the community  
- Like & sort reviews by popularity  
- Unlock **achievements** (Bronze, Silver, Gold) and profile badges  
- Express yourself with **statuses**  
- **Multilingual support** — available in multiple languages  
- **Light/Dark mode** for personalization  
- Fully **responsive design** — mobile & desktop  
- **User accounts & profiles** — private and public  
- Share cafés easily with friends  

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

- **Angular 20** — used to build all main pages and components  
- **Reactive Forms & RxJS** — implemented for efficient state management and handling asynchronous data streams  
- **Signals** — used for a more predictable and reactive data flow  
- **@ngx-translate/core** — used for internationalization (i18n), adding multilingual support and easy localization  
- **TailwindCSS** — used for fast and modern UI styling  
- **Responsive design & dark/light mode** — implemented for better user experience across all devices and preferences  
- **Vercel** — used for fast and seamless project deployment  
- **Prettier & Stylelint** — ensured clean, readable, and maintainable code

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









