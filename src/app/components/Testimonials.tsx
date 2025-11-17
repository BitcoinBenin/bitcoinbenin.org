'use client';

import { FaQuoteLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Jean Akpo",
      role: "Développeur Blockchain",
      content: "Bitcoin Benin m'a permis de découvrir un monde nouveau de possibilités financières. La communauté est très accueillante et les événements très enrichissants.",
      avatar: "/avatar1.png"
    },
    {
      id: 2,
      name: "Fatou Diop",
      role: "Entrepreneure",
      content: "Grâce aux formations de Bitcoin Benin, j'ai pu intégrer Bitcoin comme moyen de paiement dans mon commerce. Une expérience formidable !",
      avatar: "/avatar2.png"
    },
    {
      id: 3,
      name: "Moussa Traoré",
      role: "Étudiant",
      content: "Les ateliers Bitcoin Benin m'ont ouvert les yeux sur l'importance de la technologie blockchain. Je compte poursuivre mes études dans ce domaine.",
      avatar: "/avatar3.png"
    }
  ];

  const sectionVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section 
      className="py-24 bg-gradient-to-br from-gray-50 to-gray-100"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" variants={titleVariants}>
          <h2 className="text-4xl font-bold text-gray-800 sm:text-5xl tracking-tight">
            Ce que disent nos membres
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Découvrez les expériences de nos membres dans la communauté Bitcoin Benin
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={{ show: { transition: { staggerChildren: 0.2 } } }}
        >
          {testimonials.map((testimonial) => (
            <motion.div 
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col"
              variants={cardVariants}
            >
              <div className="flex items-center mb-6">
                <FaQuoteLeft className="text-2xl text-green-500 mr-3" />
                <div className="h-px flex-grow bg-gray-200"></div>
              </div>
              <p className="text-gray-600 mb-6 flex-grow">{testimonial.content}</p>
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
