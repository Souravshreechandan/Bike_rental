import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const HubSettings = () => {
  const { axios, token } = useAppContext();
  const [hubs, setHubs] = useState([]);
  const [selectedHub, setSelectedHub] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch all hubs
  const fetchHubs = async () => {
    try {
      const { data } = await axios.get("/api/hubs", {
        headers: { authorization: token },
      });
      if (data.success) setHubs(data.hubs);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, []);

  // Handlers
  const handleEdit = (hub) => {
    setSelectedHub({ ...hub });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setSelectedHub(null);
    setIsAdding(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedHub || !selectedHub._id) return;
    setIsLoading(true);
    try {
      const { _id, ...updates } = selectedHub;
      const payload = { ...updates, capacity: Number(updates.capacity || 0) };

      const { data } = await axios.put(`/api/hubs/${_id}`, payload, {
        headers: { authorization: token, "Content-Type": "application/json" },
      });

      if (data.success) {
        toast.success("Hub updated successfully!");
        setHubs(hubs.map((h) => (h._id === data.hub._id ? data.hub : h)));
        setSelectedHub(null);
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (hubId) => {
    if (!window.confirm("Are you sure you want to delete this hub?")) return;
    try {
      const { data } = await axios.delete(`/api/hubs/${hubId}`, {
        headers: { authorization: token },
      });
      if (data.success) {
        toast.success("Hub deleted successfully");
        setHubs(hubs.filter((h) => h._id !== hubId));
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedHub) return;
    setIsLoading(true);

    try {
      const { _id, ...newHub } = selectedHub;
      const payload = { ...newHub, capacity: Number(newHub.capacity || 0) };

      const { data } = await axios.post("/api/hubs", payload, {
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (data.success) {
        toast.success("Hub added successfully!");
        setHubs([...hubs, data.hub]);
        setSelectedHub(null);
        setIsAdding(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Hubs"
        subTitle="View all hubs, update their details, remove them or add a new hub."
      />

      {/* Add Hub Button */}
      {!selectedHub && !isAdding && (
        <div className="flex justify-end mt-4 mb-2">
          <button
            onClick={() => {
              setSelectedHub({
                name: "",
                address: "",
                city: "",
                state: "",
                pincode: "",
                phone: "",
                email: "",
                capacity: 0,
                status: "active",
                openTime: "09:00",
                closeTime: "18:00",
              });
              setIsAdding(true);
            }}
            className="px-3 py-1 text-white rounded-full bg-green-500 hover:bg-green-600"
          >
            Add Hub
          </button>
        </div>
      )}

      <div className="max-w-3xl w-full mt-2 border border-borderColor rounded-md overflow-hidden">
        {selectedHub ? (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              {isAdding ? "Add New Hub" : `Edit Hub: ${selectedHub.name}`}
            </h2>
            <form
              className="flex flex-col gap-3"
              onSubmit={isAdding ? handleAdd : handleUpdate}
            >
              {["name", "address", "city", "state", "pincode", "phone", "email"].map(
                (field) => (
                  <label key={field} className="flex flex-col">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    <input
                      type={field === "email" ? "email" : "text"}
                      value={selectedHub[field] || ""}
                      onChange={(e) =>
                        setSelectedHub({ ...selectedHub, [field]: e.target.value })
                      }
                      placeholder={`Enter ${field}`}
                      className="px-3 py-2 border rounded outline-none w-full"
                      required={["name", "address", "city", "state", "pincode"].includes(
                        field
                      )}
                    />
                  </label>
                )
              )}

              <label className="flex flex-col">
                Capacity
                <input
                  type="number"
                  value={selectedHub.capacity || 0}
                  onChange={(e) =>
                    setSelectedHub({ ...selectedHub, capacity: e.target.value })
                  }
                  placeholder="Enter Capacity"
                  className="px-3 py-2 border rounded outline-none w-full"
                  min={0}
                />
              </label>

              <label className="flex flex-col">
                Status
                <select
                  value={selectedHub.status}
                  onChange={(e) =>
                    setSelectedHub({ ...selectedHub, status: e.target.value })
                  }
                  className="px-3 py-2 border rounded outline-none w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>

              <div className="flex gap-2">
                <label className="flex-1 flex flex-col">
                  Open Time
                  <input
                    type="time"
                    value={selectedHub.openTime || "09:00"}
                    onChange={(e) =>
                      setSelectedHub({ ...selectedHub, openTime: e.target.value })
                    }
                    className="px-3 py-2 border rounded outline-none w-full"
                    required
                  />
                </label>
                <label className="flex-1 flex flex-col">
                  Close Time
                  <input
                    type="time"
                    value={selectedHub.closeTime || "18:00"}
                    onChange={(e) =>
                      setSelectedHub({ ...selectedHub, closeTime: e.target.value })
                    }
                    className="px-3 py-2 border rounded outline-none w-full"
                    required
                  />
                </label>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="px-3 py-1 text-white rounded-full bg-primary hover:bg-primary-dark"
                  disabled={isLoading}
                >
                  {isLoading
                    ? isAdding
                      ? "Adding..."
                      : "Updating..."
                    : isAdding
                    ? "Add Hub"
                    : "Update Hub"}
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-white rounded-full bg-gray-300 hover:bg-gray-400"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-600">
              <thead className="text-gray-600 bg-gray-100">
                <tr>
                  <th className="p-3 font-medium">Sl.No</th>
                  <th className="p-3 font-medium">Hub Name</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hubs.length > 0 ? (
                  hubs.map((hub, index) => (
                    <tr
                      key={hub._id}
                      className="border-t border-borderColor text-gray-500"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{hub.name}</td>
                      <td className="p-3">{hub.email || "-"}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            hub.status === "active"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {hub.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(hub)}
                            className="px-3 py-1 text-white rounded-full bg-blue-500 hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(hub._id)}
                            className="px-3 py-1 text-white rounded-full bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No hubs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HubSettings;
