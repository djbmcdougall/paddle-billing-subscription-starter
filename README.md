# Murmur MVP - Voice-Based Local Recommendations

Murmur is a social platform where users share voice recommendations about local places, experiences, and discoveries. Think of it as a voice-first approach to local reviews and recommendations.

## Features

- **Voice Recommendations**: Users can record and share audio recommendations
- **Location-Based Discovery**: Find recommendations near you on an interactive map
- **Social Features**: Follow other users, save recommendations, and build trust scores
- **Category Filtering**: Browse by Food, Travel, Shopping, Entertainment, Books, and more
- **Trust System**: User credibility scores based on community feedback
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Audio:** HTML5 Audio API
- **Maps:** Interactive location-based recommendations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd murmur-mvp
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
murmur-mvp/
├── app/                    # Next.js App Router pages
│   ├── discover/          # Trending recommendations
│   ├── map/               # Location-based view
│   ├── profile/           # User profiles
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   ├── recommendation-card.tsx
│   ├── audio-player.tsx
│   └── ...
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
└── public/                # Static assets
\`\`\`

## Key Components

- **RecommendationCard**: Displays voice recommendations with audio playback
- **AudioPlayer**: Custom audio controls with waveform visualization
- **MapView**: Interactive map showing location-based recommendations
- **CategoryIcon**: Modern gradient-based category icons
- **SavedMurmursContext**: Manages user's saved recommendations

## Features Overview

### Voice Recommendations
Users can share audio recommendations about local places, creating a more personal and authentic review experience.

### Interactive Map
Discover recommendations based on your location with an intuitive map interface showing trust scores and categories.

### Social Features
- Follow interesting users
- Save recommendations for later
- Build trust through community engagement
- View user profiles and listening lists

### Trust System
Community-driven credibility scores help users identify reliable recommendations.

## Development

### Adding New Categories
Update the `CategoryIcon` component to add new recommendation categories with custom icons and gradients.

### Customizing Audio
The `AudioPlayer` component can be extended with additional features like speed control, bookmarking, or sharing.

### Extending User Profiles
User profiles support additional tabs and sections for enhanced social features.

## Deployment

This app is ready for deployment on platforms like:
- [Vercel](https://vercel.com) (recommended)
- [Netlify](https://netlify.com)
- [Railway](https://railway.app)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Future Enhancements

- Real-time voice recording and playback
- Push notifications for new recommendations
- Advanced search and filtering
- User verification system
- Integration with mapping services
- Mobile app development
