# ThrinGe

A swipe-based marketplace for thrifted clothing. Think Tinder meets sustainable fashion.

Check it out! - thringe-five.vercel.app/

## What is ThrinGe?

ThrinGe makes buying and selling pre-loved clothing easy and fun through a swipe interface. Instead of scrolling through endless listings trying to find something you like, you just swipe right on items that catch your eye. When you swipe right, you instantly match with the seller and can start chatting.

The best part? ThrinGe is built around local meetups. You can set your location and search radius to find items nearby, which means no shipping costs, no waiting, and you get to see the item in person before buying. Plus, you might make some new friends in your local thrifting community.

## Why local meetups matter

Traditional online resale platforms have a problem: shipping is expensive, slow, and you can't see what you're getting until it arrives. With ThrinGe's location-based matching, you meet up with sellers in your area. This saves you money on shipping, lets you inspect the item before paying, and makes the whole transaction faster. It also adds a social element - you're connecting with real people in your community who share your interest in sustainable fashion.

## How to use ThrinGe

### Getting started as a buyer

Create an account with your email and you're ready to start swiping. Head to the Discover page and you'll see a feed of thrifted clothing items. Swipe right on anything you like, swipe left to pass. When you swipe right, you instantly match with the seller and can start a conversation in the Chat section. From there, you can ask questions, negotiate if needed, and arrange a meetup spot.

If you want to find items near you, go to your Profile page and click the Location tab. Toggle on "Enable Location Matching" and click "Get My Location" - your browser will ask for permission. Once you set your location, you can adjust your search radius anywhere from 1 to 500 miles using the slider or by typing in a specific number. Your Discover feed will then prioritize items from sellers within that radius, making it easy to find things you can pick up locally.

### Getting started as a seller

Click on "My Items" and add your thrifted find. You'll need a photo URL (paste a link from Imgur, your phone's cloud storage, etc.), along with details like title, price, size, category, condition, and description. Once listed, your item goes live and buyers in your area can start swiping on it. When someone swipes right on your item, you'll see it in your Matches, and you can chat with them to coordinate the sale. If you enable location matching in your profile, only buyers within their chosen radius will see your items, which helps ensure you're connecting with people who can actually meet up.

## What makes ThrinGe different

Most resale apps make you deal with shipping costs, long wait times, and the risk of items not matching their photos. ThrinGe solves this with location-based matching. When you find something you like, you're connecting with someone in your area who you can actually meet up with. This means you save money on shipping, get to see and try the item before buying, and you can walk away with it the same day. It's also just more fun - you might meet other people who love thrifting and build connections in your local community.

The swipe interface makes browsing way faster than traditional listings. No more filtering through hundreds of items or getting analysis paralysis. You make quick decisions based on what catches your eye, and when something feels right, you swipe right and start a conversation. It's instant, intuitive, and honestly more exciting than scrolling through grid layouts.

## Features at a glance

ThrinGe has everything you need to buy and sell thrifted clothes locally. The swipe interface lets you quickly browse items, and when you find something you like, you instantly match with the seller. Real-time chat makes it easy to ask questions, negotiate, and coordinate meetups. The platform supports 10+ categories including tops, bottoms, dresses, outerwear, shoes, and accessories.

The location feature is optional but highly recommended. Set your position and search radius (anywhere from 1 to 500 miles), and the app will prioritize showing you items from nearby sellers. You can type in an exact distance or use the slider to adjust it. The interactive map shows your location with a draggable marker and a circle representing your search area, so you know exactly what you're searching within.

## Technical implementation

ThrinGe is built as a full-stack web application using Next.js 16 with the App Router architecture and TypeScript for type safety across the entire codebase. The frontend uses React 19 with a modern component-based architecture, styled with Tailwind CSS and Radix UI for accessible, customizable UI components. The swipe interface is implemented with custom gesture handlers and smooth animations.

The backend runs on Supabase, which provides a PostgreSQL database, authentication, and real-time capabilities. User data, clothing listings, swipes, matches, and messages are all stored in a relational database with proper foreign key relationships and row-level security policies. The authentication system handles email/password sign-up and login, with protected routes that redirect unauthenticated users.

For the location-based matching, I integrated Leaflet with OpenStreetMap tiles - completely free with no API keys required. User locations are stored as latitude and longitude coordinates in the database. The distance calculations use the Haversine formula to compute the distance between two points on Earth, filtering items based on the user's chosen search radius. The interactive map lets users drag their location marker or click anywhere to set their position, with a visual circle overlay showing their search area.

Real-time features are handled through SWR for data fetching and automatic revalidation, so messages and matches update without manual refreshes. The chat interface polls the messages API every few seconds to simulate real-time updates. All API routes are built as Next.js API handlers with proper error handling and authentication checks.

### Core technologies

**Frontend:** Next.js 16, React 19, TypeScript 5.7  
**Backend:** Supabase (PostgreSQL database, authentication)  
**Styling:** Tailwind CSS, Radix UI, shadcn/ui  
**Mapping:** Leaflet, React-Leaflet, OpenStreetMap  
**State Management:** SWR, React Hook Form  
**Utilities:** date-fns, Zod validation, Lucide icons  
**Deployment:** Vercel, Git/GitHub  

The entire stack is modern, well-maintained, and production-ready. Most importantly, the mapping solution is completely free with no usage limits or API keys needed.

## Privacy and safety

Your exact location is never shared publicly or shown to other users. Location matching is completely opt-in and disabled by default. You control your search radius and can disable location anytime. Only matched users can message each other, so you won't get spam from random people. The platform is designed to keep you in control of your privacy and who you interact with.

## Tips for using ThrinGe

If you're selling, take clear photos and be honest about any flaws or wear. Price your items fairly to sell faster. Enable location matching if you prefer to sell locally - it helps connect you with buyers who can actually meet up. Respond to messages quickly since buyers are often ready to buy right away.

If you're buying, be thoughtful about your right swipes. Check the details like size and condition before swiping. Don't be afraid to ask questions in the chat - good sellers will be happy to provide more photos or answer concerns. When meeting up, pick a public place like a coffee shop or mall. And if you end up not liking the item in person, it's okay to politely pass.

## Common questions

When you swipe right on an item, you immediately match with the seller - there's no waiting for them to swipe back. This makes the process faster and means sellers only deal with interested buyers. Location matching is optional, so if you disable it, you'll see all available items regardless of distance. Right now you need to paste an image URL when listing items, but file upload support is coming soon. The platform is completely free to use with no fees or commissions.

---

Built for people who love thrifting, care about sustainability, and want to connect with their local community.
