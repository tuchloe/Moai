import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MeetSomeoneNew from "./pages/MeetSomeoneNew";
import Inbox from "./pages/Inbox";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/meet-someone-new" element={<MeetSomeoneNew />} />
        <Route path="/inbox" element={<Inbox />} />
      </Route>

      {/* Default Route */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
