import { useUser } from "../context/userContext";

const ProtectedRoutes = ({ children }) => {
    const { user } = useUser();
    if (!user) return <p>Please login to view this page</p>;
    return children;
};

export default ProtectedRoutes;