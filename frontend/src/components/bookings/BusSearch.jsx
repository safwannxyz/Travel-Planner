import React, { useState } from "react";
import Api from "../../Api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BusSearch = () => {
  const [city, setCity] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/mockBuses.json");
      const data = await response.json();

      const filtered = data.filter(
        (bus) =>
          bus.from.toLowerCase() === city.toLowerCase() &&
          bus.to.toLowerCase() === destination.toLowerCase()
      );

      if (filtered.length === 0) {
        setError("No buses found for the selected city and destination.");
        setBuses([]);
      } else {
        const busesWithExtras = filtered.map((bus) => ({
          ...bus,
          startDate: date || "2025-06-04",
          budget: (Math.random() * 1000 + 500).toFixed(0),
        }));
        setBuses(busesWithExtras);
      }
    } catch (err) {
      console.error(err);
      setError("❌ Failed to fetch buses. Please try again.");
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (bus) => {
    const tripId = localStorage.getItem("selectedTripId");
    if (!tripId) {
      toast.warn(
        "⚠️ No trip selected. Please select a trip to save this booking.",
        {
          position: "top-right",
          autoClose: 4000,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }

    try {
      const bookingData = {
        type: "bus",
        reference: bus.from + "-" + bus.to,
        provider: "StaticBusProvider",
        name: "Bus from " + bus.from + " to " + bus.to,
        location: bus.from,
        details: `Bus from ${bus.from} to ${bus.to}`,
        startDate: bus.startDate,
        endDate: bus.startDate,
        estimatedDate: bus.estimatedDate,
        actualDate: bus.actualDate,
        actualCost:bus.actualCost,
        estimatedCost:bus.estimatedCost
      };

      await Api.post(`/bookings?tripId=${tripId}`, bookingData);
      toast.success("✅ Bus booking saved to itinerary!", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save bus booking.", {
        position: "top-right",
        autoClose: 4000,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="position-relative min-vh-100 p-5">
      {/* Background video */}

      <div className="container py-5 ">
        <div className="card p-4 shadow-lg rounded-4 bg-white bg-opacity-75">
          <h4 className="mb-4 text-center">🚌 Search Buses</h4>
          <form onSubmit={handleSearch}>
            <div className="row g-3 justify-content-center">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Departure City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Destination City"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-5">
                🔍 Search Buses
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <p className="text-center text-white mt-4 fs-5">Loading buses...</p>
        ) : error ? (
          <p className="text-center text-danger mt-4 fs-5">{error}</p>
        ) : (
          <div className="row justify-content-center mt-5">
            {buses.map((bus, index) => (
              <div
                className="col-lg-4 col-md-6 col-sm-12 mb-4 d-flex align-items-stretch"
                key={index}
              >
                <div
                  className="card shadow border-0 rounded-4 w-100"
                  style={{ transition: "transform 0.3s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <img
                    src={
                      bus.image ||
                      "https://img.freepik.com/free-photo/bus-travel-transportation-concept_53876-129396.jpg"
                    }
                    alt={`${bus.from} to ${bus.to}`}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">
                      {bus.from} → {bus.to}
                    </h5>
                    <p className="card-text">
                      Date: {bus.startDate} <br />
                      Budget: ₹{bus.budget}
                    </p>
                    <button
                      className="btn btn-success w-100"
                      onClick={() => handleBook(bus)}
                    >
                      ✅ Book Bus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusSearch;
