import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

export const createMatch = (data) =>
  api.post("/matches", data);

export const getAllMatches = () =>
  api.get("/matches");

export const getMatchById = (id) =>
  api.get(`/matches/${id}`);

export const deleteMatch = (id) =>
  api.delete(`/matches/${id}`);

export const addBall = (matchId, data) =>
  api.post(`/matches/${matchId}/ball`, data);

export const getScorecard = (matchId) =>
  api.get(`/matches/${matchId}/scorecard`);

export const getStatistics = () => {
  return api.get("/statistics/dashboard");
};

export const getBattingStats = () => {
  return api.get("/statistics/batting");
};

export const getBowlingStats = () => {
  return api.get("/statistics/bowling");
};

export const getBalls = (matchId) =>
  api.get(`/matches/${matchId}/balls`);

export const getBatting = (matchId) =>
  api.get(`/matches/${matchId}/batting`);

export const getBowling = (matchId) =>
  api.get(`/matches/${matchId}/bowling`);

export const addBatsman = (matchId, data) =>
  api.post(`/matches/${matchId}/batsman`, data);

export const addBowler = (matchId, data) =>
  api.post(`/matches/${matchId}/bowler`, data);

export const addPlayer = (matchId, data) =>
  api.post(`/matches/${matchId}/players`, data);

export const getPlayers = (matchId) =>
  api.get(`/matches/${matchId}/players`);

export const getPlayersByTeam = (matchId, teamName) =>
  api.get(`/matches/${matchId}/players/${teamName}`);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const signupUser = (data) =>
  api.post("/auth/signup", data);