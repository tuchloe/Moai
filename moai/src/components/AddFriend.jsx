import { useAuth } from "../context/AuthContext";
import { sendFriendRequest } from "../api/friendsApi";

const AddFriendButton = ({ friendId }) => {
  const { user } = useAuth(); // Get the logged-in user
  const token = localStorage.getItem("token"); // Retrieve token

  const handleSendRequest = async () => {
    try {
      const response = await sendFriendRequest(user.account_id, friendId, token);
      alert(response.message); // Show success message
    } catch (error) {
      alert("Failed to send friend request.");
    }
  };

  return (
    <button onClick={handleSendRequest} className="button">
      Add Friend
    </button>
  );
};

export default AddFriendButton;
