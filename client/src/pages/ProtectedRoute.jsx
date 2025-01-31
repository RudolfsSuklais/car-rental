import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function ProtectedRoute({ children }) {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return (
            <div className="loading">
                <Spin
                    indicator={
                        <LoadingOutlined spin style={{ fontSize: "50px" }} />
                    }
                    size="large"
                />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" />;

    if (!user.isAdmin) return <Navigate to="/" />;

    return children;
}

export default ProtectedRoute;
