import React, { useEffect, useState } from 'react';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const { currency, axios } = useAppContext();
  const [bookings, setBookings] = useState([]);

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
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status });
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
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking structures."
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-600">
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

                <td className="p-3 flex items-center gap-3">
                  <img
                    src={booking.bike.image}
                    alt={`${booking.bike.brand} ${booking.bike.model}`}
                    className="h-12 w-12 aspect-square rounded-md object-cover"
                  />
                  <p className="font-medium max-md:hidden">
                    {booking.bike.brand} {booking.bike.model}
                  </p>
                </td>

                {/* 🔥 UPDATED: Date + Slot + Duration */}
                <td className="p-3 max-md:hidden">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">
                      {formatDate(booking.pickupDate)}
                      {booking.pickupSlot && (
                        <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          {booking.pickupSlot}
                        </span>
                      )}
                    </span>

                    <span className="text-xs text-gray-400 my-1">to</span>

                    <span className="font-medium text-gray-700">
                      {formatDate(booking.returnDate)}
                      {booking.returnSlot && (
                        <span className="ml-1 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                          {booking.returnSlot}
                        </span>
                      )}
                    </span>

                    {/* Show total hours if exists */}
                    {booking.totalHours && (
                      <span className="text-xs text-primary font-semibold mt-1">
                        Duration: {booking.totalHours} hour
                        {booking.totalHours > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </td>

                <td className="p-3">
                  {currency}
                  {booking.price}
                </td>

                <td className="p-3 max-md:hidden text-center">
                  {booking.paymentStatus === "paid" && (
                    <span className="bg-green-100 text-green-500 font-semibold px-3 py-1 rounded-full text-xs inline-block text-center">
                      Paid
                    </span>
                  )}

                  {booking.paymentStatus === "partial" && (
                    <span className="bg-yellow-100 text-gray-500 font-semibold px-3 py-1 rounded-full text-xs inline-block text-center">
                      Partially Paid: {currency}
                      {booking.paidAmount} <br />
                      Remaining: {currency}
                      {booking.pendingAmount}
                    </span>
                  )}

                  {booking.paymentStatus === "unpaid" && (
                    <span className="bg-red-100 text-red-500 font-semibold px-3 py-1 rounded-full text-xs inline-block text-center">
                      Unpaid
                    </span>
                  )}

                  {booking.paymentStatus === "refunded" && (
                    <span className="bg-blue-100 text-blue-500 font-semibold px-3 py-1 rounded-full text-xs inline-block text-center">
                      Refunded
                    </span>
                  )}
                </td>

                <td className="p-3 text-center">
                  {booking.status === "pending" ? (
                    <select
                      onChange={(e) =>
                        changeBookingStatus(booking._id, e.target.value)
                      }
                      value={booking.status}
                      className="px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {booking.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;