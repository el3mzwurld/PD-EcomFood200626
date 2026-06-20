## **NYAMZA : E-commerce Food ordering and delivery clone application**

This application tries to clone the experience of the average user...going into an e-commerce food ordering and delivery application to order food, groceries, supplies etc. Nyamza Version 1 focuses on the regular MVP of the **food** ordering process, location based restaurants to get you food close to your current location, allowing you to select what meal or offer you'd like to get, customize that meal if possible, manage your selected meals/packages using a persistent cart, then also order and check your orders out. The premise isn't to completely capture the entire process but to try to get as close to it as possible.

**Rather than a database of restaurants and menus to follow (which i don't have and am not creating since this is a front-end only project)**

1.  I will be fetching the restaurant list using the Geoapify places API to capture locations and search for restaurants(just restaurants for v1) in the range of the selected location.
2.  The categories page will be enriched with restaurant cards all showing details for that restaurant.
3.  A local data set will be created and populated with cuisines and their related menu's for supported African locations, else, the cuisines and menu's for other locations will be fetched using themealdb API. The local data set will be made to look as close to themealdb's data skeleton as possible.
4.  Paystack modal/API will be used for checkout and receipt creation/handling will be done using some receipt package i'll get on npm
