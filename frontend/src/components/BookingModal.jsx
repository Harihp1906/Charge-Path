import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/BookingModal.css";

function BookingModal({ station, type, onClose }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("1");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

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
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {!submitted ? (
            <>
              <div className="modal-header">
                <h2>Book a Slot</h2>
                <button className="modal-close" onClick={onClose}>✕</button>
              </div>

              <div className="modal-station-info">
                <p className="modal-station-name">{station.name || "Unnamed Station"}</p>
                <span className={`modal-badge ${type === "charging" ? "badge-green" : "badge-blue"}`}>
                  {type === "charging" ? "⚡ Charging Station" : "🏨 Hotel"}
                </span>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{type === "charging" ? "Duration (hours)" : "Nights"}</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <button type="submit" className="modal-submit-btn">
                  Confirm Booking
                </button>
              </form>
            </>
          ) : (
            <motion.div
              className="modal-success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="success-icon">✅</div>
              <h2>Booking Confirmed!</h2>
              <p>{station.name || "Unnamed Station"}</p>
              <p>{date} at {time} — {duration} {type === "charging" ? "hour(s)" : "night(s)"}</p>
              <button className="modal-submit-btn" onClick={onClose}>Close</button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default BookingModal;