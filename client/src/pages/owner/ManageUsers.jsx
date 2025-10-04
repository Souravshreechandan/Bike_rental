import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const { axios } = useAppContext();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/owner/users");
        if (data.success) {
          setUsers(data.users);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  //  Block/Unblock user
  const handleBlockToggle = async (userId) => {
    try {
      const { data } = await axios.patch(`/api/owner/users/${userId}/block`);
      setUsers(users.map((u) => (u._id === userId ? data.user : u)));
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error blocking/unblocking user");
    }
  };

  //  Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const { data } = await axios.delete(`/api/owner/users/${userId}`);
      if (data.success) {
        setUsers(users.filter((u) => u._id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting user");
    }
  };

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Users"
        subTitle="View and manage registered users, block/unblock accounts or delete users."
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-600 bg-gray-100">
            <tr>
              <th className="p-3 font-medium">Sl.No</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium max-md:hidden">Email</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users
                .filter((u) => u.role === "user") // show only normal users
                .map((user, index) => (
                  <tr key={user._id} className="border-t border-borderColor text-gray-500">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3 max-md:hidden">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isBlocked
                            ? "bg-red-100 text-red-500"
                            : "bg-green-100 text-green-500"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      {/* Block/Unblock button */}
                      <button
                        onClick={() => handleBlockToggle(user._id)}
                        className={`px-3 py-1 rounded text-white ${
                          user.isBlocked
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
