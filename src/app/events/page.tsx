import React from 'react';
import Image from 'next/image';
import { EVENTS } from '../data';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Événements",
  description: "Découvrez les événements Bitcoin Bénin : meetups, conférences, ateliers et formations. Participez à notre communauté pour apprendre et échanger sur Bitcoin au Bénin.",
};

export default function EventsPage() {
  const now = new Date();
  // Upcoming events are those with no start date (recurring) or a future start date
  const upcomingEvents = EVENTS.filter(
    (event) => !event.startDate || new Date(event.startDate) >= now
  );
  // Past events are those with a start date in the past
  const pastEvents = EVENTS.filter(
    (event) => event.startDate && new Date(event.startDate) < now
  );

  const EventCard = ({ event }: { event: (typeof EVENTS)[0] }) => (
    <article key={event.id} className="group relative flex flex-col items-start justify-between bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-green-500/20 transform hover:-translate-y-2 transition-all duration-300">
      <div className="relative w-full h-72 rounded-xl overflow-hidden mb-6">
        <Image
          src={event.posterImage}
          alt={`Affiche pour ${event.title}`}
          fill
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-105 transition-transform duration-500"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>
      <div className="w-full">
        <div className="flex items-center gap-x-4 text-xs mb-3">
          <time dateTime={event.date} className="text-gray-600 font-semibold flex items-center gap-1.5">
            {React.createElement(event.iconCalendar, { className: "h-4 w-4 text-green-600" })} {event.date}
          </time>
          <span className="relative z-10 rounded-full bg-green-100 px-3 py-1.5 font-medium text-green-700">
            {event.time}
          </span>
        </div>
        <h3 className="mt-2 text-xl font-bold leading-7 text-gray-900 group-hover:text-green-600 transition-colors">
          <Link href={`/events/${event.id}`}>
            <span className="absolute inset-0" />
            {event.title}
          </Link>
        </h3>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">{event.description}</p>
        <div className="relative mt-6 flex items-center gap-x-3">
          {React.createElement(event.iconLocation, { className: "h-5 w-5 text-green-600 flex-shrink-0" })}
          <div className="text-sm leading-6">
            <a 
              href={event.locationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-800 hover:text-green-600 transition-colors duration-300"
            >
              {event.location}
            </a>
          </div>
        </div>
        <div className="mt-8 w-full">
          <Link href={`/events/${event.id}`} className="btn-primary-green w-full text-center inline-flex items-center justify-center gap-2 text-white font-bold py-3 px-6 rounded-lg text-base">
            Détails et Inscription {React.createElement(event.iconArrowRight, { className: "h-4 w-4" })}
          </Link>
        </div>
      </div>
    </article>
  );

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
        <Image
          src="/event.webp"
          alt="Événements Bitcoin Bénin"
          fill
          style={{ objectFit: 'cover' }}
          className="z-0"
          priority
          quality={80}
        />
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <div className="relative z-20 text-center max-w-3xl px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white text-glow-green animate-float">
            Nos Évènements
          </h1>
          <p className="mt-6 text-xl text-gray-200 max-w-2xl mx-auto">
            Découvrez les rencontres, ateliers et conférences organisés par la communauté Bitcoin Bénin.
          </p>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center w-full">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl text-center w-full">
                Événements à venir
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 text-center w-full">
                Participez à nos prochains événements pour apprendre, échanger et vous connecter avec la communauté.
              </p>
            </div>
            <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <section className="py-20 sm:py-32 bg-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center w-full">
              <h2 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl text-center w-full">
                Événements passés
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 text-center w-full">
                Revivez nos anciens événements et consultez les ressources associées.
              </p>
            </div>
            <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}