import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase";
import { useAuth } from "../AuthContext";

const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        setAdminLoading(false);
        return;
      }

      try {
        const adminRef = ref(database, `admins/${currentUser.uid}`);
        const snapshot = await get(adminRef);

        setIsAdmin(snapshot.exists());
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    };

    checkAdminStatus();
  }, [currentUser]);

  return { isAdmin, adminLoading };
};

export default useAdmin;
