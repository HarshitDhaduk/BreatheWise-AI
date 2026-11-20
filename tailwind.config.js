/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aqi: {
          good: "#10B981", // 0-50 (Green)
          moderate: "#FBBF24", // 51-100 (Yellow)
          unhealthySensitive: "#F97316", // 101-150 (Orange)
          unhealthy: "#EF4444", // 151-200 (Red)
          veryUnhealthy: "#8B5CF6", // 201-300 (Purple)
          hazardous: "#7F1D1D", // 301-500+ (Maroon/Dark Red)
        }
      }
    },
  },
  plugins: [],
}
