import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/BookingModal.css";

function BookingModal({ station, onClose }) {
  const { user, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      navigate("/auth");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(
        "http://127.0.0.1:5000/api/bookings",
        {
          station_name: station.name || "Unnamed Station",
          station_lat: station.lat,
          station_lon: station.lon,
          station_type: "charging",
          date,
          time,
          duration: parseInt(duration),
        },
        { headers: getAuthHeader() }
      );
      setDone(true);
    } catch (err) {
      setError("Booking failed. Please try again.");
    }
    setLoading(false);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-box"
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          {!done ? (
            <>
              <div className="modal-header">
                <div>
                  <h2 className="modal-title">Book a Slot</h2>
                  <p className="modal-station">{station.name || "Unnamed Station"}</p>
                </div>
                <button className="modal-close" onClick={onClose}>X</button>
              </div>

              <div className="modal-badge-row">
                <span className="modal-badge-green">EV Charging Station</span>
                {station.distance && (
                  <span className="modal-badge-gray">{station.distance}</span>
                )}
              </div>

              {!user && (
                <p className="modal-warn">
                  You are not signed in. You will be redirected to Sign In.
                </p>
              )}

              {error && <p className="modal-error">{error}</p>}

              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="modal-field">
                  <label>Select Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}
                    required
                  />
                </div>

                <div className="modal-field">
                  <label>Select Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-field">
                  <label>Duration (hours)</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="5">5 hours</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="modal-submit"
                  disabled={loading}
                >
                  {loading ? "Confirming..." : user ? "Confirm Booking" : "Sign In to Book"}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              className="modal-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="success-circle">✓</div>
              <h2>Booking Confirmed!</h2>
              <p className="success-station">{station.name || "Unnamed Station"}</p>
              <div className="success-details">
                <div className="success-row">
                  <span>Date</span>
                  <span>{date}</span>
                </div>
                <div className="success-row">
                  <span>Time</span>
                  <span>{time}</span>
                </div>
                <div className="success-row">
                  <span>Duration</span>
                  <span>{duration} hour(s)</span>
                </div>
              </div>
              <button className="modal-submit" onClick={onClose}>Done</button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default BookingModal;