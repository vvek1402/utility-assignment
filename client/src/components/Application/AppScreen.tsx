import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Card,
  Title,
  Text,
  Button,
  Modal,
  Group,
  Stack,
} from "@mantine/core";
import { useAuthStore } from "../../store/authStore";
import { useSocket } from "../../utils/useSocket";

const AppScreen: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [conflict, setConflict] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const appName = searchParams.get("appName");
  const tabId = useRef<string>(
    sessionStorage.getItem("tabId") ||
    `tab-${Math.random().toString(36).substr(2, 9)}`
  ).current;
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const { emitEvent, onEvent, isConnected } = useSocket({
    url: "http://localhost:3000",
  });

  useEffect(() => {
    sessionStorage.setItem("tabId", tabId);
  }, [tabId]);

  useEffect(() => {
    if (isConnected && userId) {
      emitEvent("heartbeat", { userId, applicationId, tabId });
    }

    onEvent("heartbeat-response", ({ conflict }) => {
      setConflict(conflict);
    });

    onEvent("close-other-tabs-notification", ({ applicationId: appId, tabId: ttabId }) => {
      if (appId == applicationId && ttabId != tabId) {
        navigate("/");
      }
    });
  }, [emitEvent, onEvent, isConnected, userId, applicationId, tabId, navigate]);

  const handleLogoutOtherTab = () => {
    emitEvent("close-other-tabs", { userId, applicationId, tabId });
    setConflict(false);
  };

  return (
    <Container size="sm" py={40}>
      {!conflict ? (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack align="center">
            <Title order={2}>{appName}</Title>
            <Text>Application ID: {applicationId}</Text>
            <Text>Tab ID: {tabId}</Text>
          </Stack>
        </Card>
      ) : (
        ""
      )}

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
