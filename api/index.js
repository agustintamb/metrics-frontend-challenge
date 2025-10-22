import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const MEMORY_LIMIT = 1000; // maximum number of metrics to keep in memory
let metricsMemory = [];

// Generates a random metrics object
const generateMetrics = (timestamp) => ({
  timestamp: timestamp?.toISOString(),
  activeUsers: Math.floor(Math.random() * 5000),
  newUsers: Math.floor(Math.random() * 200),
  revenue: +(Math.random() * 10000).toFixed(2),
  churnRate: +(Math.random() * 0.15).toFixed(3),
  byRegion: {
    US: Math.floor(Math.random() * 2000),
    EU: Math.floor(Math.random() * 1500),
    LATAM: Math.floor(Math.random() * 1200),
    APAC: Math.floor(Math.random() * 1000),
  }
});

// simulates historical data for the past 'days' days
const initializeMetrics = (days = 30, pointsPerDay = 24) => {
  const now = new Date();
  for (let d = days; d >= 0; d--) {
    for (let i = 0; i < pointsPerDay; i++) {
      const timestamp = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
      timestamp.setHours(i); // distribute points evenly through the day
      metricsMemory.push(generateMetrics(timestamp));
    }
  }
}

// adds a new metric every 5 seconds
const scheduleNextMetric = () =>
  setTimeout(() => {
    metricsMemory.push(generateMetrics(new Date()));
    if (metricsMemory.length > MEMORY_LIMIT)
      metricsMemory.shift();
    scheduleNextMetric();
  }, 5000);

// get latest n (count) metrics from memory
app.get("/metrics", (req, res) => {
  const count = Number(req.query.count) || 20;
  const latestMetrics = metricsMemory.slice(-count);
  res.json(latestMetrics.reverse());
});

//initialize with historical data and start scheduling new metrics
initializeMetrics(30);
scheduleNextMetric();

app.listen(4000, () => {
  console.log("Mock API running on http://localhost:4000");
});
