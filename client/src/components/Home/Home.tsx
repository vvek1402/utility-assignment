import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  Container,
  Card,
  Title,
  List,
  Button,
  Loader,
  Text,
  Center,
  Flex,
} from "@mantine/core";
import { Application } from "../../utils/interfaces";

const Home: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosInstance.get<Application[]>(
          "/applications"
        );
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleAppSelect = (applicationId: string, applicationName: string) => {
    navigate(`/app/${applicationId}?appName=` + applicationName);
  };

  return (
    <Container size="sm" py={40}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} ta="center">
          Applications
        </Title>
        <Text ta="center" mt="sm" color="dimmed">
          Select an application to proceed.
        </Text>

        {loading ? (
          <Center mt="xl">
            <Loader color="blue" size="lg" />
          </Center>
        ) : (
          <List
            spacing="md"
            size="sm"
            mt="xl"
            withPadding
            style={{ listStyle: "none", padding: 0 }}
          >
            {applications.map((app) => (
              <Card
                key={app.id}
                shadow="sm"
                padding="md"
                radius="md"
                withBorder
                m={10}
              >
                <Flex justify="space-between">
                  <Text w={500}>{app.app_name}</Text>
                  <Button
                    variant="light"
                    color="blue"
                    radius="md"
                    onClick={() => handleAppSelect(app.id, app.app_name)}
                  >
                    Select
                  </Button>
                </Flex>
              </Card>
            ))}
          </List>
        )}
      </Card>
    </Container>
  );
};

export default Home;
