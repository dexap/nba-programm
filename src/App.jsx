import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NextGame from './pages/NextGame';
import ScheduleDifficulty from './pages/ScheduleDifficulty';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Glossary from './pages/Glossary';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import CookieConsent from './components/CookieConsent';
import Footer from './components/Footer';
import PageHeader from './components/PageHeader';
import { fetchStandings, fetchTeamSchedule } from './services/api';
import { saveToDatabase, getFromDatabase, isDataStale } from './services/storage';
import './index.css';

function App() {
  const [standings, setStandings] = useState({ eastern: [], western: [] });
  const [schedules, setSchedules] = useState([]); // Array of { teamId, schedule }
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDataFromApi = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch Standings
      const standingsData = await fetchStandings();
      if (!standingsData) throw new Error("Failed to fetch standings");

      const allTeams = [...standingsData.eastern, ...standingsData.western];

      // 2. Fetch Schedules for ALL teams
      const promises = allTeams.map(async (team) => {
        const schedule = await fetchTeamSchedule(team.espnId);
        return { teamId: team.id, schedule };
      });

      const schedulesData = await Promise.all(promises);

      // 3. Save to DB
      saveToDatabase(standingsData, schedulesData);

      // 4. Update State
      setStandings(standingsData);
      setSchedules(schedulesData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      // Check DB first
      const dbData = getFromDatabase();
      const stale = isDataStale();

      if (dbData && !stale) {
        console.log("Loading from Database (Cache Hit)");
        setStandings(dbData.standings);
        setSchedules(dbData.schedules);
        setLastUpdated(new Date(dbData.lastUpdated));
        setLoading(false);
      } else {
        console.log("Cache miss or stale, fetching from API...");
        await fetchDataFromApi();
      }
    };

    init();
  }, []);

  const handleManualRefresh = () => {
    fetchDataFromApi();
  };

  return (
    <Router>
      <div className="app-container">
        <PageHeader onRefresh={handleManualRefresh} isRefreshing={isRefreshing} />
        <Routes>
          <Route path="/" element={<Home standings={standings} schedules={schedules} loading={loading} />} />
          <Route path="/difficulty" element={<ScheduleDifficulty standings={standings} schedules={schedules} loading={loading} />} />
          <Route path="/next-game" element={<NextGame standings={standings} schedules={schedules} loading={loading} />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
        <CookieConsent />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
