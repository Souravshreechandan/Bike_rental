import React, { useEffect, useState } from 'react';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const { currency, axios } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all bookings for the owner
  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner');
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Change booking status
  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post(
        '/api/bookings/change-status',
        { bookingId, status }
      );
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Open modal
  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedBooking(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  // Format date helper
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="px-4 pt-8 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking structures."
      />

      {/* Responsive Table Wrapper */}
      <div className="w-full mt-6 border border-borderColor rounded-md overflow-x-auto">
        <table className="min-w-[700px] w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-600 bg-gray-50">
            <tr>
              <th className="p-3 font-medium">Sl.No</th>
              <th className="p-3 font-medium text-center">Bike</th>
              <th className="p-3 font-medium max-md:hidden">
                Date & Time Slot
              </th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden text-center">
                Payment
              </th>
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => (
              <tr
                key={booking._id}
                className="border-t border-borderColor text-gray-500"
              >
                <td className="p-3">{index + 1}</td>

                {/* Bike */}
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={booking.bike?.image}
                    alt="bike"
                    className="h-10 w-10 rounded-md object-cover"
                  />
                  <p className="font-medium text-xs sm:text-sm">
                    {booking.bike?.brand} {booking.bike?.model}
                  </p>
                </td>

                {/* Date + Slot */}
                <td className="p-3 max-md:hidden">
                  <div className="flex flex-col text-xs sm:text-sm">
                    <span className="font-medium text-gray-700">
                      {formatDate(booking.pickupDate)}
                      {booking.pickupSlot && (
                        <span className="ml-1 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          {booking.pickupSlot}
                        </span>
                      )}
                    </span>

                    <span className="text-xs text-gray-400 my-1">to</span>

                    <span className="font-medium text-gray-700">
                      {formatDate(booking.returnDate)}
                      {booking.returnSlot && (
                        <span className="ml-1 text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                          {booking.returnSlot}
                        </span>
                      )}
                    </span>

                    {booking.totalHours && (
                      <span className="text-[11px] text-primary font-semibold mt-1">
                        Duration: {booking.totalHours} hr
                      </span>
                    )}
                  </div>
                </td>

                {/* Price */}
                <td className="p-3 font-medium text-sm">
                  {currency}{booking.price}
                </td>

                {/* Payment */}
                <td className="p-3 max-md:hidden text-center">
                  {booking.paymentStatus === "paid" && (
                    <span className="bg-green-100 text-green-600 font-semibold px-2 py-1 rounded-full text-xs">
                      Paid
                    </span>
                  )}

                  {booking.paymentStatus === "partial" && (
                    <span className="bg-yellow-100 text-yellow-700 font-semibold px-2 py-1 rounded-full text-xs inline-block">
                      Partial
                    </span>
                  )}

                  {booking.paymentStatus === "unpaid" && (
                    <span className="bg-red-100 text-red-600 font-semibold px-2 py-1 rounded-full text-xs">
                      Unpaid
                    </span>
                  )}

                  {booking.paymentStatus === "refunded" && (
                    <span className="bg-blue-100 text-blue-600 font-semibold px-2 py-1 rounded-full text-xs">
                      Refunded
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    
                    {/* SMALL View Details Button */}
                    <button
                      onClick={() => openModal(booking)}
                      className="px-2.5 py-1 text-[11px] bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 transition"
                    >
                      View Details
                    </button>

                    {/* Status Dropdown / Badge */}
                    {booking.status === "pending" ? (
                      <select
                        onChange={(e) =>
                          changeBookingStatus(
                            booking._id,
                            e.target.value
                          )
                        }
                        value={booking.status}
                        className="px-2 py-1 text-[11px] text-gray-600 border border-borderColor rounded-md outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Responsive Modal */}
      {showModal && selectedBooking && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-xl shadow-xl 
                       max-h-[90vh] overflow-y-auto p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Booking Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-red-500 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Customer Info */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Customer Information
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Name:</strong> {selectedBooking.user?.name || "N/A"}</p>
                <p><strong>Email:</strong> {selectedBooking.user?.email || "N/A"}</p>
                <p><strong>Phone:</strong> {selectedBooking.phone || "N/A"}</p>
                <p><strong>Address:</strong> {selectedBooking.address || "N/A"}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Payment Details
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Total Price:</strong> {currency}{selectedBooking.price}</p>
                <p><strong>Status:</strong> {selectedBooking.paymentStatus}</p>
                <p><strong>Paid:</strong> {currency}{selectedBooking.paidAmount || 0}</p>
                <p><strong>Pending:</strong> {currency}{selectedBooking.pendingAmount || 0}</p>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="w-full bg-primary text-white py-2 rounded-md text-sm font-semibold hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;