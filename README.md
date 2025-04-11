# MugLife Inventory Management

MugLife Inventory Management is a lightweight, mobile-friendly inventory tracking application built with React. It allows users to easily log, edit, categorize, and export item counts—perfect for café or store managers managing daily stock across multiple sections like the fridge and backroom.

## Features

- **Dynamic Entry Creation**  
  Add entries in bulk or one by one with section-wise headings.

- **Editable Fields**  
  Update item name, fridge count, back count, and remarks inline.

- **Instant Delete with Feedback**  
  Items are deleted immediately with toast notifications for feedback.

- **Sectional Grouping**  
  Group inventory items by heading (e.g., Mugs, Bottles) for clean categorization.

- **PDF & Excel Export**  
  Generate downloadable inventory reports in both `.pdf` and `.xlsx` formats.

- **Local Storage Sync**  
  All inventory entries persist automatically in the browser using localStorage.

- **Responsive Design**  
  Optimized for phone-first usage with scroll-to-top convenience.

## Tech Stack

- **Frontend:** React, Tailwind CSS (via utility classes)
- **Icons:** Lucide React
- **PDF Generation:** jsPDF
- **Excel Export:** SheetJS (xlsx)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/muglife-inventory-management.git
   cd muglife-inventory-management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm start
   ```

4. Visit `http://localhost:3000` in your browser.

## File Structure

- `MugLifeInventoryApp.js` — Main component with inventory logic and UI
- `public/` — Static assets
- `package.json` — Project configuration and dependencies

## Deployment

You can deploy this as a Progressive Web App (PWA) or host it on platforms like Vercel, Netlify, or GitHub Pages for internal use.

## License

This project is open-source and free to use. Attribution is appreciated.