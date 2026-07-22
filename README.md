## **NYAMZA: E-commerce Food Ordering and Delivery Clone**

Nyamza is a front-end food ordering and delivery clone designed to mimic the core flow of a typical modern food marketplace. The goal of Version 1 is not to recreate every detail of a full production food app, but to capture the essential MVP experience: finding nearby restaurants, browsing meals, customizing selections where possible, managing a persistent cart, and completing the checkout journey.

At its core, the project is a practical demonstration of how a food e-commerce experience can be modeled on the client side, using location-aware restaurant discovery, enriched restaurant cards, menu mappings, and checkout flow logic.

### Core Features

- Location-based restaurant discovery using Geoapify places data.
- Restaurant listing and presentation with enriched cards showing relevant details.
- Menu and cuisine handling for African-supported locations using a local data structure.
- Fallback menu enrichment for unsupported locations via the TheMealDB API.
- Persistent cart behavior so users can keep track of selected meals and packages.
- Checkout flow integrated with Paystack-style payment handling and receipt generation concepts.

### Why the Project Exists

This project does not rely on a backend database of restaurants and menus. Instead, it simulates a realistic front-end-only marketplace experience by combining:

1. Geoapify for restaurant search and location context.
2. Curated local datasets for cuisine and menu structure.
3. API fallback behavior to enrich product data where local coverage is limited.
4. Front-end state and UI patterns that mimic an e-commerce ordering experience.

### Current Pitfalls / Limitations

- Since the application is front-end only, there is no real persistent backend for orders, users, or menu data.
- Data can become inconsistent across sources because restaurant data, cuisines, and menus are stitched together from different origins.
- Menu normalization can be tricky when local data and external API responses do not perfectly match the same schema.
- The user journey is simplified and does not capture the full complexity of real delivery logistics, inventory, or payments.
- Some API-driven flows may be brittle if service responses change or if rate limits and edge cases are not handled carefully.

### Areas of Improvement

- Introduce a proper backend for authentication, orders, restaurants, and persistent checkout data.
- Improve data validation and schema consistency across all fetched and local sources.
- Add stronger error handling and loading states for API-driven restaurant and menu enrichment.
- Expand customization features for items, add-ons, and more realistic cart behavior.
- Improve performance by reducing duplicated data transformations and optimizing map-heavy or menu-heavy pages.
- Strengthen routing patterns to make navigation more predictable, modular, and scalable.
- Elevate the overall UI design with more consistent visual systems, spacing, motion, and polish across the app.
- Add better user feedback, analytics, and order tracking to make the experience feel closer to production.

### Learning Curves Covered in the Project

This project helped build practical understanding in several important frontend engineering areas:

- Context API
  - Used to manage shared app state such as user session, cart behavior, and app-wide access to selected location or restaurant information.
  - The biggest lesson here is how context simplifies prop drilling while also making state ownership more centralized.

- Data Enrichment
  - Restaurant and menu data had to be enriched from multiple sources so the UI remains useful and complete.
  - This taught how to combine local knowledge with external API responses to create a more coherent experience.

- Data Manipulation
  - Handling menu item structure, restaurant card data, and mapped results required transformation and normalization.
  - This included cleaning data for presentation, filling in missing fields, and adapting different formats into one useful shape.

- Mappers and Data Mapping
  - A mapper layer is essential for translating external data structures into the app's expected internal model.
  - The learning here is that good mapping logic makes the rest of the UI much easier to build, maintain, and scale.

### Overall Takeaway

Nyamza is best understood as a front-end product prototype built around realistic food ordering patterns, data enrichment strategy, and state management fundamentals. It is not a fully production-ready food platform, but it is a strong example of translating a marketplace concept into a polished, interaction-driven UI with real engineering tradeoffs.
