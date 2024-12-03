import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Card, Title, Text, Button, Modal, Group, Stack } from "@mantine/core";
import axiosInstance from "../../utils/axiosInstance";
import { useAuthStore } from "../../store/authStore";
import { User } from "../../utils/interfaces";

const AppScreen: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [conflict, setConflict] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const appName = searchParams.get("appName");
  const tabId = React.useRef<string>(`tab-${Math.random().toString(36).substr(2, 9)}`).current;
  const user : User | null = useAuthStore(state => state.user);
  const userId = user?.id
  
  const sendHeartbeat = useCallback(async () => {
    try {
      const response = await axiosInstance.post("/applications/heartbeat", {
        applicationId,
        tabId,
        userId,
      });
      setConflict(response.data.conflict);
    } catch (error) {
      console.error("Heartbeat error:", error);
    }
  }, [applicationId, tabId, userId]);

  const handleLogoutOtherTab = async () => {
    try {
      await axiosInstance.post("/applications/close-other-tab", {
        applicationId,
        tabId,
        userId
      });
      localStorage.setItem("logoutOtherTabs", Date.now().toString());
      setConflict(false);
    } catch (error) {
      console.error("Error logging out other tabs:", error);
    }
  };

  const closeCurrentTab = useCallback(async () => {
    try {
      await axiosInstance.post("/applications/close-tab", {
        applicationId,
        tabId,
        userId
      });
    } catch (error) {
      console.error("Error closing tab:", error);
    }
  }, [applicationId, tabId, userId]);

  useEffect(() => {
    window.addEventListener("beforeunload", closeCurrentTab);
    return () => window.removeEventListener("beforeunload", closeCurrentTab);
  }, [closeCurrentTab]);

  useEffect(() => {
    const interval = setInterval(sendHeartbeat, 5000);
    return () => clearInterval(interval);
  }, [sendHeartbeat]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "logoutOtherTabs") {
        navigate("/");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  return (
    <Container size="sm" py={40}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack align="center">
          <Title order={2}>{appName}</Title>
          <Text>Application ID: {applicationId}</Text>
        </Stack>
      </Card>

      <Modal
        opened={conflict}
        onClose={() => navigate("/")}
        title="Session Conflict"
        centered
        withCloseButton={false}
      >
        <Text>You are already logged into another tab.</Text>
        <Group p="apart" mt="md">
          <Button variant="light" color="blue" onClick={handleLogoutOtherTab}>
            Log out of the other tab
          </Button>
          <Button variant="outline" color="red" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default AppScreen;