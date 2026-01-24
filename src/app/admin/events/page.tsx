'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/app/components/ui/Button';
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';

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
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
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
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    fetchEvents();
  }, []);

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
    if (!supabase) return;
    if (!eventForm.title.trim()) return;

    try {
      let imageUrl = eventForm.image;

      // Upload de l'affiche si un fichier est sélectionné
      if (posterFile) {
        setUploadingPoster(true);
        const fileExt = posterFile.name.split('.').pop();
        const fileName = `event-poster-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(`events/${fileName}`, posterFile);

        if (uploadError) {
          console.error('Erreur upload affiche:', uploadError);
          setUploadingPoster(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(uploadData.path);
        
        imageUrl = publicUrl;
        setUploadingPoster(false);
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventForm.title,
          description: eventForm.description,
          date: eventForm.date,
          time: eventForm.time,
          location: eventForm.location,
          location_link: eventForm.location_link,
          image: imageUrl,
          registration_link: eventForm.registration_link
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de l\'événement:', error);
      } else {
        setEvents([data, ...events]);
        resetEventForm();
      }
    } catch (error) {
      console.error('Erreur:', error);
      setUploadingPoster(false);
    }
  };

  const updateEvent = async () => {
    if (!supabase || !editingEvent) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          title: eventForm.title,
          description: eventForm.description,
          date: eventForm.date,
          time: eventForm.time,
          location: eventForm.location,
          location_link: eventForm.location_link,
          image: eventForm.image,
          registration_link: eventForm.registration_link
        })
        .eq('id', editingEvent.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour de l\'événement:', error);
      } else {
        setEvents(events.map(e => e.id === editingEvent.id ? data : e));
        resetEventForm();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!supabase || !confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

    try {
      await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      setEvents(events.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
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
    if (!supabase) return;
    
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
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
              href="/admin/gallery"
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
              <input
                type="text"
                placeholder="Titre de l'événement"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
              />
              
              <input
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
              />
              
              <input
                type="text"
                placeholder="Heure (ex: 16h00 - 18h00)"
                value={eventForm.time}
                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
              />
              
              <input
                type="text"
                placeholder="Lieu"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
              />
              
              <input
                type="url"
                placeholder="Lien Google Maps (optionnel)"
                value={eventForm.location_link}
                onChange={(e) => setEventForm({ ...eventForm, location_link: e.target.value })}
                className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
              />
              
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
              
              <input
                type="url"
                placeholder="Lien inscription (optionnel)"
                value={eventForm.registration_link}
                onChange={(e) => setEventForm({ ...eventForm, registration_link: e.target.value })}
                className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
              />
            </div>
            
            <textarea
              placeholder="Description de l'événement"
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green resize-none mb-6"
              rows={4}
            />
            
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
    </div>
  );
}
