import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, Center, Container, Flex, Loader, Text, Title } from "@mantine/core";

const CLIENT_ID = import.meta.env.VITE_API_CLIENT_ID;

const Login = () => {
  const doLogin = useAuthStore((state) => state.doLogin);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      console.error("No credential found in response");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/auth/google", {
        token: credentialResponse.credential,
      });

      const { token } = response.data;
      doLogin(token);
      navigate("/");
      console.log("User logged in successfully");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Container size="xs" style={{ height: "100vh" }}>
        <Flex justify="center" align="center" style={{ height: "100%" }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Center>
              <Title order={2}>Welcome Back</Title>
            </Center>
            <Text ta="center" mt="sm" color="dimmed">
              Sign in with your Google account to continue.
            </Text>
            <Center mt="xl">
              {loading ? (
                <Button variant="outline" disabled>
                  <Loader size="sm" color="blue" /> Logging in...
                </Button>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => console.error("Google Login Failed")}
                  useOneTap
                />
              )}
            </Center>
          </Card>
        </Flex>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default Login;