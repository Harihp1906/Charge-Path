import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import '../styles/Landing.css'

const stats = [
  { value: '500+', label: 'Charging Stations' },
  { value: '200+', label: 'Partner Hotels' },
  { value: '10K+', label: 'Happy EV Owners' },
  { value: '24/7', label: 'Support Available' },
]

const features = [
  {
    title: 'Real Time Station Finder',
    description: 'See live charging stations near you on an interactive map. Updated in real time.',
  },
  {
    title: 'Instant Slot Booking',
    description: 'Reserve your charging slot in advance. No waiting, no guessing.',
  },
  {
    title: 'Nearby Hotel Discovery',
    description: 'Find and book hotels near charging stations for long distance EV travel.',
  },
  {
    title: 'Live Availability Updates',
    description: 'Get real time updates on slot availability so you always know before you go.',
  },
]

const chargingData = [
  { name: 'EV Fast Charge Hub', distance: '1.2 km away', status: 'available' },
  { name: 'Green Power Station', distance: '3.5 km away', status: 'busy' },
  { name: 'City Charge Point', distance: '5.8 km away', status: 'available' },
]

const hotelData = [
  { name: 'GreenStay Inn', distance: '0.8 km away', status: 'available', rooms: '3 rooms left' },
  { name: 'EV Traveller Hotel', distance: '2.1 km away', status: 'available', rooms: '7 rooms left' },
  { name: 'ChargeRest Suites', distance: '4.3 km away', status: 'busy', rooms: 'Fully Booked' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

function Landing() {
  const [activeTab, setActiveTab] = useState('charging')

  return (
    <div className="landing">
      <section className="hero">
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="hero-badge">India's EV Travel Companion</span>
          <h1 className="hero-title">
            Navigate. Charge.<br />
            <span className="hero-title-green">Travel Smarter.</span>
          </h1>
          <p className="hero-subtitle">
            Find charging stations, book slots, and discover hotels — all on one intelligent map built for Indian EV owners.
          </p>
          <div className="hero-buttons">
            <Link to="/auth" className="btn-primary">Get Started</Link>
            <Link to="/map" className="btn-outline">Explore Map</Link>
          </div>
        </motion.div>

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="app-preview-card">
            <div className="preview-header">
              <span className="preview-title">Charge-Path</span>
              <span className="live-badge">
                <span className="pulse-dot" />
                Live
              </span>
            </div>

            <div className="preview-tabs">
              <button
                className={`preview-tab ${activeTab === 'charging' ? 'active' : ''}`}
                onClick={() => setActiveTab('charging')}
              >
                Charging Stations
              </button>
              <button
                className={`preview-tab ${activeTab === 'hotels' ? 'active' : ''}`}
                onClick={() => setActiveTab('hotels')}
              >
                Nearby Hotels
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'charging' && (
                <motion.div
                  key="charging"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="preview-list"
                >
                  {chargingData.map((item, index) => (
                    <div key={index} className="preview-station-card">
                      <div className="station-info">
                        <span className="station-name">{item.name}</span>
                        <span className="station-location">{item.distance}</span>
                      </div>
                      <span className={`station-status ${item.status}`}>
                        {item.status === 'available' ? 'Available' : 'Busy'}
                      </span>
                    </div>
                  ))}
                  <div className="preview-booking">
                    <div className="booking-row">
                      <span className="booking-label">Slot Booked</span>
                      <span className="booking-value">Today, 3:00 PM</span>
                    </div>
                    <div className="booking-row">
                      <span className="booking-label">Charger Type</span>
                      <span className="booking-value">DC Fast Charge</span>
                    </div>
                    <div className="booking-row">
                      <span className="booking-label">Status</span>
                      <span className="booking-confirmed">Confirmed</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'hotels' && (
                <motion.div
                  key="hotels"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="preview-list"
                >
                  {hotelData.map((item, index) => (
                    <div key={index} className="preview-station-card">
                      <div className="station-info">
                        <span className="station-name">{item.name}</span>
                        <span className="station-location">{item.distance}</span>
                      </div>
                      <div className="hotel-right">
                        <span className={`station-status ${item.status}`}>
                          {item.status === 'available' ? 'Available' : 'Full'}
                        </span>
                        <span className="rooms-left">{item.rooms}</span>
                      </div>
                    </div>
                  ))}
                  <div className="preview-booking">
                    <div className="booking-row">
                      <span className="booking-label">Hotel</span>
                      <span className="booking-value">GreenStay Inn</span>
                    </div>
                    <div className="booking-row">
                      <span className="booking-label">Check In</span>
                      <span className="booking-value">Today, 6:00 PM</span>
                    </div>
                    <div className="booking-row">
                      <span className="booking-label">Status</span>
                      <span className="booking-confirmed">Confirmed</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      <motion.section
        className="stats-bar"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-item"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </motion.div>
        ))}
      </motion.section>

      <section className="features">
        <motion.h2
          className="features-title"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Everything your EV journey needs
        </motion.h2>

        <motion.div
          className="features-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <motion.section
        className="cta-section"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Ready to drive smarter?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Join thousands of EV owners who plan their journey with Charge-Path.
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link to="/auth" className="btn-primary">Create Free Account</Link>
        </motion.div>
      </motion.section>
    </div>
  )
}

export default Landing