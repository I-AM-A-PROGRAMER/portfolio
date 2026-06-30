# Supriyo Pramanik | 3D Developer Portfolio

A stunning, overpowered highly-interactive 3D portfolio website built with modern web technologies. Focuses on an immersive user experience powered by advanced 3D particle mathematics and high-end post-processing bloom effects.

![Portfolio Preview](./preview.png)

## 🚀 Features

*   **Morphing 3D Data Core**: A central high-resolution particle sphere (2,500+ vertices) that dynamically morphs like liquid using complex sine-wave mathematics based on time and scroll position.
*   **Intense Neon Post-Processing**: Complete integration of Three.js `UnrealBloomPass` forcing glowing neon auras onto all 3D geometries.
*   **Dynamic Geometric Halos**: Independent wireframe rings orbiting the core, reacting to the ambient motion of the scene.
*   **Mouse Parallax Physics**: The entire 3D camera rig reacts to mouse coordinates for immersive depth.
*   **Glassmorphism UI**: Sleek, frosted glass aesthetic across all floating interface elements.
*   **GSAP Scroll Reveal**: Smooth, staggered entrance animations triggered organically as you scroll.
*   **Fully Responsive**: Works perfectly on Desktop, Tablet, and Mobile devices.

## 🛠️ Technology Stack

*   **Frontend**: HTML5, CSS3, JavaScript (ES6+)
*   **Build Tool**: [Vite](https://vitejs.dev/) - For lightning-fast Hot Module Replacement and optimized builds
*   **3D Graphics**: [Three.js](https://threejs.org/) - WebGL wrapper for the morphing particles and geometric elements
*   **Animations**: [GSAP](https://greensock.com/gsap/) - For scroll-based and timeline animations
*   **Icons**: Font Awesome

## 💻 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/I-AM-A-PROGRAMER/3d-portfolio.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd 3d-portfolio
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   *(This relies on Vite, Three.js, and GSAP being installed locally)*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The site will be running at `http://localhost:5173`.

## 📦 Building for Production

To create an optimized production build:
```bash
npm run build
```
This generates a `dist/` folder containing the minified HTML, CSS, and hashed JavaScript files ready for deployment on platforms like Netlify or Vercel.

## 🤝 Contact

Designed & Handcrafted by **Supriyo Pramanik**
*   [LinkedIn](https://www.linkedin.com/in/supriyopramanik/)
*   [GitHub](https://github.com/I-AM-A-PROGRAMER)
*   [Discord](https://discordapp.com/users/728864663718330368)

---
*Built with ❤️ and Three.js*
