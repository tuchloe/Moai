import api from "./api"; // Import the existing Axios instance

// ✅ Send Friend Request
export const sendFriendRequest = async (senderId, receiverId, token) => {
  try {
    const response = await api.post(
      "/api/friends/request",
      { senderId, receiverId },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include auth token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error sending friend request:", error.response?.data || error);
    throw error;
  }
};

// ✅ Accept Friend Request
export const acceptFriendRequest = async (friendRequestId, token) => {
  try {
    const response = await api.put(
      `/api/friends/accept/${friendRequestId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error accepting friend request:", error.response?.data || error);
    throw error;
  }
};

// ✅ Reject Friend Request
export const rejectFriendRequest = async (friendRequestId, token) => {
  try {
    const response = await api.put(
      `/api/friends/reject/${friendRequestId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error rejecting friend request:", error.response?.data || error);
    throw error;
  }
};

// ✅ Get Friends List
export const getFriendsList = async (userId, token) => {
  try {
    const response = await api.get(`/api/friends/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching friends list:", error.response?.data || error);
    throw error;
  }
};
