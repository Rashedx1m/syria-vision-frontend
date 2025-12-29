# Syria Vision Frontend

Modern frontend for Syria Vision Platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🏠 **Home Page** - Hero section, featured events, and platform overview
- 📅 **Events** - Browse upcoming and past events, view details, register
- 💬 **Forum** - Community discussions with categories, posts, and replies
- 👤 **Authentication** - Login, register, and profile management
- 📱 **Responsive** - Mobile-first design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios (API calls)
- Lucide React (Icons)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your API URL:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── events/            # Events pages
│   │   ├── page.tsx       # Events list
│   │   └── [id]/          # Event detail
│   ├── forum/             # Forum pages
│   │   ├── page.tsx       # Forum home
│   │   ├── new/           # New post
│   │   └── post/[id]/     # Post detail
│   ├── profile/           # User profile
│   └── about/             # About page
├── components/            # Reusable components
│   ├── Navbar.tsx
│   └── Footer.tsx
├── contexts/              # React contexts
│   └── AuthContext.tsx
├── lib/                   # Utilities
│   └── api.ts            # API client
└── types/                 # TypeScript types
    └── index.ts
```

## API Integration

The frontend connects to the Django backend API. Make sure the backend is running on `http://127.0.0.1:8000`.

### Available API Endpoints

- **Auth**: `/api/auth/` - Login, register, logout
- **Forum**: `/api/forum/` - Categories, posts, replies
- **Events**: `/api/events/` - Events, registration

## Customization

### Colors

Edit `tailwind.config.js` to customize colors:

```js
colors: {
  primary: {
    500: '#14b8a6', // Teal
    600: '#0d9488',
    // ...
  },
  accent: {
    500: '#f59e0b', // Amber
    // ...
  },
}
```

### Fonts

The project uses Tajawal font for Arabic support. Change in `globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');
```

## License

MIT
