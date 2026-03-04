'use client';

import { useState, useEffect } from 'react';
import { supabase, clearSupabaseSession } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/app/components/ui/Button';
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaArrowLeft, FaSignOutAlt, FaEye } from 'react-icons/fa';
import { getAllFeaturedEvents } from '@/app/lib/events';
import { FeaturedEvent } from '@/app/types/events';
import {
  createEvent as createEventAction,
  updateEvent as updateEventAction,
  deleteEvent as deleteEventAction,
} from '../event-actions';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  location_link?: string;
  image?: string;
  registration_link?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showFeaturedForm, setShowFeaturedForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingFeatured, setEditingFeatured] = useState<FeaturedEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    location_link: '',
    image: '',
    registration_link: ''
  });
  const [featuredForm, setFeaturedForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    registration_url: '',
    is_active: true
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      if (!supabase) {
        setLoading(false);
        router.replace('/login');
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        router.replace('/login');
        return;
      }

      fetchEvents();
      fetchFeaturedEvents();
    };

    init();
  }, [router]);

  const fetchFeaturedEvents = async () => {
    if (!supabase) return;

    try {
      console.log('Chargement événements vedettes depuis l\'admin...');
      const events = await getAllFeaturedEvents();
      console.log('Événements reçus:', events);
      setFeaturedEvents(events);
    } catch (error) {
      console.error('Erreur chargement événements vedettes:', error);
    }
  };

  const fetchEvents = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async () => {
    const title = eventForm.title.trim();
    const description = eventForm.description.trim();
    const date = eventForm.date.trim();
    const time = eventForm.time.trim();
    const location = eventForm.location.trim();
    const location_link = eventForm.location_link.trim() || undefined;
    const image = eventForm.image.trim() || undefined;
    const registration_link = eventForm.registration_link.trim() || undefined;

    if (!title || !date || !location) {
      alert('Merci de renseigner au minimum le titre, la date et le lieu.');
      return;
    }

    try {
      setUploadingPoster(true);

      const result = await createEventAction(
        title,
        description,
        date,
        time,
        location,
        location_link,
        image,
        registration_link,
        posterFile || undefined
      );

      if (result.success) {
        setEvents([result.data, ...events]);
        resetEventForm();
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      alert('Erreur lors de la création de l\'événement');
    } finally {
      setUploadingPoster(false);
    }
  };

  const updateEvent = async () => {
    if (!editingEvent) return;

    try {
      setUploadingPoster(true);

      const result = await updateEventAction(
        editingEvent.id,
        String(eventForm.title),
        String(eventForm.description),
        String(eventForm.date),
        String(eventForm.time),
        String(eventForm.location),
        eventForm.location_link ? String(eventForm.location_link) : undefined,
        eventForm.image ? String(eventForm.image) : undefined,
        eventForm.registration_link ? String(eventForm.registration_link) : undefined,
        posterFile || undefined
      );

      if (result.success) {
        setEvents(events.map(e => e.id === editingEvent.id ? result.data : e));
        resetEventForm();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      alert('Erreur lors de la mise à jour de l\'événement');
    } finally {
      setUploadingPoster(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

    try {
      const result = await deleteEventAction(eventId);

      if (result.success) {
        setEvents(events.filter(e => e.id !== eventId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      alert('Erreur lors de la suppression de l\'événement');
    }
  };

  // Fonctions pour gérer les événements vedettes
  const handleSaveFeatured = async () => {
    if (!supabase) return;

    try {
      // Validation des champs requis
      if (!featuredForm.title || !featuredForm.location || !featuredForm.start_date) {
        alert('Veuillez remplir tous les champs obligatoires (titre, lieu, date début)');
        return;
      }

      const eventData = {
        title: featuredForm.title,
        description: featuredForm.description || null,
        start_date: featuredForm.start_date,
        end_date: featuredForm.end_date || null,
        location: featuredForm.location,
        registration_url: featuredForm.registration_url || null,
        is_active: featuredForm.is_active
      };

      console.log('Données à sauvegarder:', eventData);

      let result;
      if (editingFeatured) {
        result = await supabase
          .from('featured_events')
          .update({
            ...eventData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingFeatured.id);
      } else {
        result = await supabase
          .from('featured_events')
          .insert({
            ...eventData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }

      console.log('Résultat Supabase:', result);

      if (result.error) {
        console.error('Erreur Supabase:', result.error);
        throw new Error(result.error.message || 'Erreur inconnue');
      }

      // Réinitialiser le formulaire
      setFeaturedForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        registration_url: '',
        is_active: true
      });
      setShowFeaturedForm(false);
      setEditingFeatured(null);
      
      // Recharger les événements
      fetchFeaturedEvents();
      
      alert('Événement vedette sauvegardé avec succès !');
    } catch (error: unknown) {
      console.error('Erreur sauvegarde événement vedette:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Erreur lors de la sauvegarde: ${errorMessage}`);
    }
  };

  const handleEditFeatured = (event: FeaturedEvent) => {
    setFeaturedForm({
      title: event.title,
      description: event.description || '',
      start_date: event.start_date,
      end_date: event.end_date || '',
      location: event.location,
      registration_url: event.registration_url || '',
      is_active: event.is_active
    });
    setEditingFeatured(event);
    setShowFeaturedForm(true);
  };

  const handleDeleteFeatured = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement vedette ?')) return;
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('featured_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchFeaturedEvents();
    } catch (error) {
      console.error('Erreur suppression événement vedette:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      location_link: '',
      image: '',
      registration_link: ''
    });
    setPosterFile(null);
    setEditingEvent(null);
    setShowEventForm(false);
  };

  const startEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      location_link: event.location_link || '',
      image: event.image || '',
      registration_link: event.registration_link || ''
    });
    setShowEventForm(true);
  };

  const handleLogout = async () => {
    try {
      await clearSupabaseSession();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      router.replace('/login');
    }
  };

  // Séparer les événements passés et à venir
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Début de la journée

  const upcomingEvents = events.filter(event => new Date(event.date) >= today);
  const pastEvents = events.filter(event => new Date(event.date) < today);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Configuration requise</h2>
          <p className="text-gray-400">Veuillez configurer Supabase pour accéder à l&apos;administration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-brand-green hover:text-brand-accent transition-colors"
            >
              <FaArrowLeft />
              Retour admin
            </Link>
            <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
              <FaCalendarAlt />
              Événements
            </h1>
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400"
          >
            <FaSignOutAlt />
            Déconnexion
          </Button>
        </div>

        {/* Bouton créer */}
        <div className="flex justify-end mb-6">
          <Button
            variant="primary"
            onClick={() => setShowEventForm(true)}
            className="flex items-center gap-2"
          >
            <FaPlus />
            Nouvel événement
          </Button>
        </div>

        {/* Formulaire événement */}
        {showEventForm && (
          <div className="bg-brand-charcoal/50 border border-white/5 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-bold text-white">
                {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetEventForm}
                className="p-2"
              >
                <FaTimes />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Titre de l&apos;événement
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Heure
                </label>
                <input
                  type="text"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lieu
                </label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lien Google Maps (optionnel)
                </label>
                <input
                  type="url"
                  value={eventForm.location_link}
                  onChange={(e) => setEventForm({ ...eventForm, location_link: e.target.value })}
                  className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                />
              </div>

              {/* Upload d'affiche */}
              <div className="md:col-span-2">
                <label className="block text-white mb-2">Affiche de l&apos;événement</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="poster-upload"
                  />
                  <label
                    htmlFor="poster-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-brand-dark border border-white/10 text-gray-300 rounded-lg hover:border-brand-green/50 cursor-pointer transition-colors"
                  >
                    <FaPlus />
                    {posterFile ? posterFile.name : 'Choisir une affiche'}
                  </label>
                  {posterFile && (
                    <button
                      type="button"
                      onClick={() => setPosterFile(null)}
                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  )}
                  {uploadingPoster && (
                    <span className="text-brand-green">Upload en cours...</span>
                  )}
                </div>
                {posterFile && (
                  <div className="mt-2 text-sm text-gray-400">
                    Aperçu : {posterFile.name} ({Math.round(posterFile.size / 1024)}KB)
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lien d&apos;inscription (optionnel)
                </label>
                <input
                  type="url"
                  value={eventForm.registration_link}
                  onChange={(e) => setEventForm({ ...eventForm, registration_link: e.target.value })}
                  className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description de l&apos;événement
              </label>
              <textarea
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green resize-none mb-6"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={editingEvent ? updateEvent : createEvent}
                disabled={!eventForm.title.trim() || uploadingPoster}
                className="flex items-center gap-2"
              >
                <FaSave />
                {uploadingPoster ? 'Upload en cours...' : (editingEvent ? 'Mettre à jour' : 'Créer')}
              </Button>
              <Button
                variant="ghost"
                onClick={resetEventForm}
                disabled={uploadingPoster}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Liste des événements */}
        <div className="space-y-8">
          {/* Événements à venir */}
          <div>
            <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-brand-green" />
              Événements à venir ({upcomingEvents.length})
            </h2>
            {upcomingEvents.length === 0 ? (
              <div className="bg-brand-charcoal/30 border border-white/5 rounded-xl p-8 text-center">
                <p className="text-gray-400">Aucun événement à venir programmé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-brand-charcoal/50 border border-white/5 rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-display font-bold text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-400 mb-4 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-500">
                            <span className="text-brand-green">Date:</span> {event.date}
                          </div>
                          <div className="text-gray-500">
                            <span className="text-brand-green">Heure:</span> {event.time}
                          </div>
                          <div className="text-gray-500">
                            <span className="text-brand-green">Lieu:</span> {event.location}
                          </div>
                          {event.registration_link && (
                            <div className="text-gray-500">
                              <span className="text-brand-green">Inscription:</span>
                              <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="text-brand-green hover:text-brand-accent ml-1">
                                Lien disponible
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Link href={`/events/${event.id}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2"
                            title="Voir l'événement"
                          >
                            <FaEye className="text-brand-blue" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditEvent(event)}
                          className="p-2"
                        >
                          <FaEdit className="text-brand-green" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEvent(event.id)}
                          className="p-2"
                        >
                          <FaTrash className="text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Événements passés */}
          <div>
            <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" />
              Événements passés ({pastEvents.length})
            </h2>
            {pastEvents.length === 0 ? (
              <div className="bg-brand-charcoal/30 border border-white/5 rounded-xl p-8 text-center">
                <p className="text-gray-400">Aucun événement passé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-brand-charcoal/30 border border-white/5 rounded-xl p-6 opacity-75"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-display font-bold text-gray-300 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-500 mb-4 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-600">
                            <span className="text-gray-400">Date:</span> {event.date}
                          </div>
                          <div className="text-gray-600">
                            <span className="text-gray-400">Heure:</span> {event.time}
                          </div>
                          <div className="text-gray-600">
                            <span className="text-gray-400">Lieu:</span> {event.location}
                          </div>
                          {event.registration_link && (
                            <div className="text-gray-600">
                              <span className="text-gray-400">Inscription:</span>
                              <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 ml-1">
                                Lien disponible
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Link href={`/events/${event.id}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2"
                            title="Voir l'événement"
                          >
                            <FaEye className="text-gray-400" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditEvent(event)}
                          className="p-2"
                        >
                          <FaEdit className="text-gray-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEvent(event.id)}
                          className="p-2"
                        >
                          <FaTrash className="text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Événements Vedettes */}
        <div className="bg-brand-charcoal rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <FaCalendarAlt className="text-brand-orange" />
              Événements Vedettes ({featuredEvents.length})
            </h2>
            <Button
              onClick={() => {
                setEditingFeatured(null);
                setFeaturedForm({
                  title: '',
                  description: '',
                  start_date: '',
                  end_date: '',
                  location: '',
                  registration_url: '',
                  is_active: true
                });
                setShowFeaturedForm(true);
              }}
              className="bg-brand-orange hover:bg-brand-orange/80"
            >
              <FaPlus className="mr-2" />
              Nouvel événement vedette
            </Button>
          </div>

          {showFeaturedForm && (
            <div className="bg-brand-dark/50 border border-white/10 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {editingFeatured ? 'Modifier l&apos;événement vedette' : 'Nouvel événement vedette'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Titre</label>
                  <input
                    type="text"
                    value={featuredForm.title}
                    onChange={(e) => setFeaturedForm({...featuredForm, title: e.target.value})}
                    className="w-full p-3 rounded-lg bg-brand-dark border border-white/10 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Lieu</label>
                  <input
                    type="text"
                    value={featuredForm.location}
                    onChange={(e) => setFeaturedForm({...featuredForm, location: e.target.value})}
                    className="w-full p-3 rounded-lg bg-brand-dark border border-white/10 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date de début</label>
                  <input
                    type="datetime-local"
                    value={featuredForm.start_date}
                    onChange={(e) => setFeaturedForm({...featuredForm, start_date: e.target.value})}
                    className="w-full p-3 rounded-lg bg-brand-dark border border-white/10 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date de fin</label>
                  <input
                    type="datetime-local"
                    value={featuredForm.end_date}
                    onChange={(e) => setFeaturedForm({...featuredForm, end_date: e.target.value})}
                    className="w-full p-3 rounded-lg bg-brand-dark border border-white/10 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={featuredForm.description}
                    onChange={(e) => setFeaturedForm({...featuredForm, description: e.target.value})}
                    className="w-full p-3 rounded-lg bg-brand-dark border border-white/10 text-white h-24"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">URL d&apos;inscription</label>
                  <input
                    type="url"
                    value={featuredForm.registration_url}
                    onChange={(e) => setFeaturedForm({...featuredForm, registration_url: e.target.value})}
                    className="w-full p-3 rounded-lg bg-brand-dark border border-white/10 text-white"
                    placeholder="https://..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={featuredForm.is_active}
                      onChange={(e) => setFeaturedForm({...featuredForm, is_active: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Événement actif</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSaveFeatured}
                  className="bg-brand-green hover:bg-brand-green/80"
                >
                  <FaSave className="mr-2" />
                  {editingFeatured ? 'Mettre à jour' : 'Créer'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowFeaturedForm(false);
                    setEditingFeatured(null);
                  }}
                >
                  <FaTimes className="mr-2" />
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {featuredEvents.length === 0 ? (
            <div className="bg-brand-dark/30 border border-white/5 rounded-xl p-8 text-center">
              <p className="text-gray-400">Aucun événement vedette</p>
            </div>
          ) : (
            <div className="space-y-4">
              {featuredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-brand-dark/30 border border-white/5 rounded-xl p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-display font-bold text-white">
                          {event.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          event.is_active ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                        }`}>
                          {event.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 mb-2">{event.location}</p>
                      
                      <p className="text-gray-300 text-sm mb-2">
                        {new Date(event.start_date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {event.end_date && event.end_date !== event.start_date && (
                          <> - {new Date(event.end_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}</>
                        )}
                      </p>
                      
                      {event.description && (
                        <p className="text-gray-400 text-sm">{event.description}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditFeatured(event)}
                        className="p-2"
                      >
                        <FaEdit className="text-brand-green" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFeatured(event.id)}
                        className="p-2"
                      >
                        <FaTrash className="text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
