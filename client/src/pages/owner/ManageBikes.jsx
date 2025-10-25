import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import Title from "../../components/owner/Title";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL; // http://localhost:3000

const ManageBikes = () => {
  const { token, currency, isOwner } = useAppContext();
  const [bikes, setBikes] = useState([]);
  const [editingBike, setEditingBike] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch owner's bikes
  const fetchOwnerBikes = async () => {
    try {
      const { data } = await axios.get("/api/owner/bikes", {
        headers: { Authorization: token },
      });
      if (data.success) setBikes(data.bikes);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (isOwner) fetchOwnerBikes();
  }, [isOwner]);

  // Toggle availability
  const toggleAvailability = async (bikeId) => {
    try {
      const { data } = await axios.post(
        "/api/owner/toggle-bike",
        { bikeId },
        { headers: { Authorization: token } }
      );
      if (data.success) fetchOwnerBikes();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Delete bike
  const deleteBike = async (bikeId) => {
    if (!window.confirm("Are you sure you want to delete this bike?")) return;
    try {
      const { data } = await axios.post(
        "/api/owner/delete-bike",
        { bikeId },
        { headers: { Authorization: token } }
      );
      if (data.success) fetchOwnerBikes();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Update bike
  const handleUpdateBike = async (e) => {
    e.preventDefault();
    if (!editingBike) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("brand", editingBike.brand);
      formData.append("model", editingBike.model);
      formData.append("pricePerDay", editingBike.pricePerDay);
      formData.append("category", editingBike.category);
      formData.append("transmission", editingBike.transmission);
      formData.append("fuelType", editingBike.fuelType);
      if (editingBike.imageFile) formData.append("image", editingBike.imageFile);

      const { data } = await axios.put(
        `/api/owner/bikes/${editingBike._id}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Bike updated successfully!");
        setEditingBike(null);
        fetchOwnerBikes();
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title title="Manage Bikes" subTitle="Edit or remove your listed bikes." />

      <div className="max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        {editingBike ? (
          <form className="p-4 bg-white" onSubmit={handleUpdateBike}>
            <h2 className="text-xl font-semibold mb-4">Edit Bike</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["brand", "model", "pricePerDay", "category", "transmission"].map(
                (field) => (
                  <label key={field} className="flex flex-col">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    <input
                      type={field === "pricePerDay" ? "number" : "text"}
                      value={editingBike[field] || ""}
                      onChange={(e) =>
                        setEditingBike({ ...editingBike, [field]: e.target.value })
                      }
                      className="px-3 py-2 border rounded outline-none w-full"
                      required
                    />
                  </label>
                )
              )}

              {/* Fuel Type Dropdown */}
              <label className="flex flex-col">
                Fuel Type
                <select
                  value={editingBike.fuelType || "Petrol"}
                  onChange={(e) =>
                    setEditingBike({ ...editingBike, fuelType: e.target.value })
                  }
                  className="px-3 py-2 border rounded outline-none w-full"
                  required
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="EV">EV</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </label>

              {/* Image Upload & Preview */}
              <label className="flex flex-col">
                Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditingBike({ ...editingBike, imageFile: e.target.files[0] })
                  }
                  className="px-3 py-2 border rounded outline-none w-full"
                />
                {editingBike.imageFile ? (
                  <img
                    src={URL.createObjectURL(editingBike.imageFile)}
                    alt="preview"
                    className="mt-2 h-24 w-24 object-cover rounded"
                  />
                ) : editingBike.image ? (
                  <img
                    src={
                      editingBike.image.startsWith("http")
                        ? editingBike.image
                        : `${import.meta.env.VITE_BASE_URL}${editingBike.image}`
                    }
                    alt="current"
                    className="mt-2 h-24 w-24 object-cover rounded"
                  />
                ) : null}
              </label>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-full"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Bike"}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded-full"
                onClick={() => setEditingBike(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <table className="w-full border-collapse text-left text-sm text-gray-600">
            <thead className="text-gray-600 bg-gray-100">
              <tr>
                <th className="p-3">Sl.No</th>
                <th className="p-3">Bike</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bikes.map((bike, idx) => (
                <tr key={bike._id} className="border-t border-borderColor">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={
                        bike.image.startsWith("http")
                          ? bike.image
                          : `${import.meta.env.VITE_BASE_URL}${bike.image}`
                      }
                      alt=""
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium">
                        {bike.brand} {bike.model}
                      </p>
                      <p className="text-xs text-gray-500">
                        {bike.transmission} • {bike.fuelType}
                      </p>
                    </div>
                  </td>
                  <td className="p-3">{bike.category}</td>
                  <td className="p-3">
                    {currency}
                    {bike.pricePerDay}/day
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        bike.isAvailable
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {bike.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="p-3 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => setEditingBike(bike)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-full"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleAvailability(bike._id)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-full"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => deleteBike(bike._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-full"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageBikes;
