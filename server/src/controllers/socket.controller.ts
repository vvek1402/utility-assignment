import { Server } from "socket.io";
import NodeCache from "node-cache";

const sessionCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

export const initializeSocket = (io: Server): void => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("heartbeat", ({ userId, applicationId, tabId }) => {
      const sessionKey = `${userId}-${applicationId}`;
      const activeTabs = sessionCache.get<string[]>(sessionKey) || [];

      let conflict = false;

      if (activeTabs.includes(tabId)) {
        conflict = false;
      } else if (activeTabs.length > 0) {
        conflict = true;
      } else {
        activeTabs.push(tabId);
        sessionCache.set(sessionKey, activeTabs);
        conflict = false;
      }

      socket.emit("heartbeat-response", { conflict });
    });

    socket.on("close-other-tabs", ({ userId, applicationId, tabId }) => {
      const sessionKey = `${userId}-${applicationId}`;
      sessionCache.set(sessionKey, [tabId]);

      socket.broadcast.emit("close-other-tabs-notification", {
        userId,
        applicationId,
        tabId,
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
