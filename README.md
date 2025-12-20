# Expo Starter Kit

This is a comprehensive starter kit for Universal React Native applications built with **Expo**. It is designed to serve as a solid foundation for your projects, with **Expo Router** pre-configured and ready to use.

## Features

- **Expo Router**: File-based routing for React Native and web.
- **TypeScript**: Statically typed code for better maintainability.
- **Absolute Paths**: Cleaner imports using the `@/` alias (e.g., `@/components/Test`).
- **Lucide Icons**: Beautiful & consistent icons via `lucide-react-native`.
- **State Management**: Simple and fast state management with **Zustand**.
- **Forms & Validation**: Built with **React Hook Form** and **Zod** schema validation.
- **Dark Mode**: System-aware dark mode with persistence using **AsyncStorage**.
- **Data Fetching**: Powerful asynchronous state management with **TanStack React Query** and **Axios**.
- **High Performance Lists**: Fast & efficient lists using **FlashList**.
- **Organized Structure**: Robust folder structure including `components/ui`, `hooks`, `constants`, and `utils`.
- **Expo**: A framework for universal React applications.
- **Scalable Structure**: Designed to support additional features and integrations.

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

## Project Structure

- `app/`: Contains the routes for your application.
  - `app/_layout.tsx`: The root layout file (Stack Navigator).
  - `app/index.tsx`: The entry screen (Home).
  - `app/details.tsx`: An example detail screen.
- `assets/`: Contains images and other static assets.

## Documentation

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Expo Documentation](https://docs.expo.dev/)

## License

This project is open source and available under the [MIT License](LICENSE).
