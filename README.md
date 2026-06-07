# Currency Castle

A mesmerising, professional currency exchange rate calculator.

![Currency Castle](https://img.shields.io/badge/Live-Demo-06b6d4?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=flat-square&logo=tailwindcss)

## Features

- **Live exchange rates** powered by the free Frankfurter API
- **Animated number display**
- **Currency flip** swap base and target with smooth animation
- **30+ currencies** with flag images and full currency names
- **Searchable selectors** filter by code or currency name
- **Historical chart** area chart with gradient fill for any range up to 90 days
- **Excel export** real .xlsx file with styled headers, auto column widths, and a summary tab
- **Dark glassmorphism UI** frosted glass panels, animated gradient background
- **Fully responsive** mobile, tablet, desktop
- **Toast notifications** for export success, API errors, date range warnings
- **Skeleton loaders** smooth loading states throughout

## Tech Stack

- React 18
- Vite
- TailwindCSS 4
- xlsx (SheetJS)
- react-hot-toast
- react-datepicker
- lucide-react
- recharts
- react-number-format

## API Reference

All exchange rate data is sourced from the **Frankfurter API** based on ECB data.

- **Base URL**: `https://api.frankfurter.dev/v2`
- **Docs**: [frankfurter.dev](https://frankfurter.dev)
- **No API key required**

## License

MIT
