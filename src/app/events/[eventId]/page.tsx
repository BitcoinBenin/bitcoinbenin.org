import Image from 'next/image';
import { EVENTS } from '../../data';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

// 🧩 Génération des routes statiques
export async function generateStaticParams() {
  return EVENTS.map((event) => ({
    eventId: event.id.toString(),
  }));
}

// ✅ Typage compatible Next.js 15
interface EventPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function Page({ params }: EventPageProps) {
  const { eventId } = await params;
  const event = EVENTS.find((e) => e.id.toString() === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800">Événement non trouvé</h1>
      </div>
    );
  }

  const generateGoogleCalendarLink = () => {
    if (!event.startDate || !event.endDate) return '#';

    const formatGoogleDate = (dateStr: string) =>
      new Date(dateStr).toISOString().replace(/-|:|\.\d{3}Z/g, '');

    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const urlParams = new URLSearchParams({
      text: event.title,
      dates: `${formatGoogleDate(event.startDate)}Z/${formatGoogleDate(event.endDate)}Z`,
      details: event.description,
      location: event.location,
      ctz: 'Africa/Porto-Novo',
    });

    return `${baseUrl}&${urlParams.toString()}`;
  };

  return (
    <div className="bg-gray-50 text-gray-800">
      <section className="relative h-[50vh] flex items-center justify-center text-white overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="z-0 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="relative z-20 text-center max-w-3xl px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white text-glow-green">
            {event.title}
          </h1>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-x-4 text-sm mb-6">
            <time dateTime={event.date} className="text-gray-600 flex items-center gap-1">
              <FaCalendarAlt className="text-green-600" /> {event.date} - {event.time}
            </time>
            <a
              href={event.locationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 rounded-full bg-green-50 px-3 py-1.5 font-medium text-green-600 hover:bg-green-100 transition-colors flex items-center gap-1.5"
            >
              <FaMapMarkerAlt className="inline-block" /> {event.location}
            </a>
          </div>

          <p className="mt-6 text-lg leading-8 text-gray-700">{event.description}</p>

          <div className="mt-10 w-full">
            <Image
              src={event.posterImage}
              alt={`Affiche pour ${event.title}`}
              width={800}
              height={1200}
              className="rounded-lg shadow-lg mx-auto"
            />
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-mission inline-flex items-center gap-2 text-white font-bold py-3 px-6 rounded-xl text-sm uppercase"
            >
              S&apos;inscrire à l&apos;événement <FaArrowRight />
            </Link>

            {event.startDate && event.endDate && new Date(event.startDate) >= new Date() && (
              <Link
                href={generateGoogleCalendarLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-green-outline inline-flex items-center gap-2 font-bold py-3 px-6 rounded-xl text-sm uppercase"
              >
                Ajouter à Google Agenda <FaCalendarAlt />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
