'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import { FaImages, FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { createEvent, updateEvent as updateEventAction, deleteEvent as deleteEventAction } from './event-actions';

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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'events'>('gallery');
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

  const handleLogout = async () => {
    if (!supabase) return;
    
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const fetchEvents = async () => {
    console.log('fetchEvents appelé, supabase:', !!supabase);
    
    if (!supabase) {
      console.log('Supabase non configuré, arrêt');
      setLoading(false);
      return;
    }

    try {
      console.log('Tentative de chargement des événements...');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Erreur lors du chargement des événements:', error);
        console.error('Détails erreur:', error.message, error.code, error.details);
      } else {
        console.log('Événements chargés:', data?.length || 0);
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Erreur catch:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.location) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    console.log('📝 Formulaire brut:', eventForm);
    
    // Nettoyage et validation des données
    const cleanTitle = String(eventForm.title).trim();
    const cleanDescription = String(eventForm.description).trim();
    const cleanDate = String(eventForm.date).trim();
    const cleanTime = String(eventForm.time).trim();
    const cleanLocation = String(eventForm.location).trim();
    const cleanLocationLink = eventForm.location_link ? String(eventForm.location_link).trim() : undefined;
    const cleanImage = eventForm.image ? String(eventForm.image).trim() : undefined;
    const cleanRegistrationLink = eventForm.registration_link ? String(eventForm.registration_link).trim() : undefined;

    console.log('📝 Données nettoyées:', {
      cleanTitle,
      cleanDate,
      cleanLocation,
      originalDate: eventForm.date,
      dateType: typeof eventForm.date
    });

    // Validation finale après nettoyage
    if (cleanTitle === '') {
      alert('Le titre ne peut pas être vide');
      return;
    }
    if (cleanDate === '') {
      alert('La date ne peut pas être vide');
      return;
    }
    if (cleanLocation === '') {
      alert('Le lieu ne peut pas être vide');
      return;
    }

    console.log('📝 Envoi formulaire nettoyé:', {
      title: cleanTitle,
      date: cleanDate,
      location: cleanLocation
    });

    try {
      setUploadingPoster(true);
      
      const result = await createEvent(
        cleanTitle,
        cleanDescription,
        cleanDate,
        cleanTime,
        cleanLocation,
        cleanLocationLink,
        cleanImage,
        cleanRegistrationLink,
        posterFile || undefined
      );
      
      if (result.success) {
        setEvents([result.data, ...events]);
        resetEventForm();
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de l\'événement');
    } finally {
      setUploadingPoster(false);
    }
  };

  const updateEventLocal = async () => {
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
      console.error('Erreur:', error);
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
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de l\'événement');
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
        <div className="flex justify-between items-center mb-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
              Administration
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-2">
                Bitcoin Bénin
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Gérez la gallery et les événements de la communauté.
            </p>
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

        {/* Navigation par onglets */}
        <div className="flex justify-center mb-8">
          <div className="bg-brand-charcoal/50 border border-white/5 rounded-full p-1 flex">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'gallery'
                  ? 'bg-brand-green text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FaImages className="mr-2" />
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'events'
                  ? 'bg-brand-green text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FaCalendarAlt className="mr-2" />
              Événements
            </button>
          </div>
        </div>

        {/* Contenu dynamique */}
        {activeTab === 'gallery' && (
          <div>
            <div className="bg-brand-charcoal/50 border border-white/5 rounded-xl p-6 text-center">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Gestion de la Gallery</h2>
              <p className="text-gray-400 mb-6">
                Accédez à l&apos;interface complète de gestion des albums et photos.
              </p>
              <Button
                variant="primary"
                onClick={() => window.location.href = '/admin/gallery'}
                className="inline-flex items-center gap-2"
              >
                <FaImages />
                Gérer la Gallery
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            {/* Header événements */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <FaCalendarAlt />
                Événements
              </h2>
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
                        id="poster-upload-admin"
                      />
                      <label
                        htmlFor="poster-upload-admin"
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
                    onClick={editingEvent ? updateEventLocal : addEvent}
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
            </div>
            )}

            {/* Liste des événements */}
            <div className="space-y-4">
              {events.map((event) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
