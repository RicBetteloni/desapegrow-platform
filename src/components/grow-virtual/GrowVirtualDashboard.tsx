import React, { useState, useEffect } from 'react';
import { Button, Card, Grid, Text } from 'shadcn/ui';

const GrowVirtualDashboard: React.FC = () => {
  const [dailyRewards, setDailyRewards] = useState<number>(0);
  const [inventory, setInventory] = useState<string[]>([]);
  const [plants, setPlants] = useState<string[]>([]);
  const [stats, setStats] = useState<{ [key: string]: number }>({
    totalPlants: 0,
    harvested: 0,
    rewardsClaimed: 0,
  });

  useEffect(() => {
    // Fetch initial data for rewards, plants, and inventory
    fetchRewards();
    fetchInventory();
    fetchPlants();
  }, []);

  const fetchRewards = () => {
    // Simulate fetching daily rewards
    setDailyRewards(100);
  };

  const fetchInventory = () => {
    // Simulate fetching inventory
    setInventory(['Seed', 'Water', 'Fertilizer']);
  };

  const fetchPlants = () => {
    // Simulate fetching plants
    setPlants(['Rose', 'Tulip', 'Sunflower']);
    setStats({ ...stats, totalPlants: 3 });
  };

  const claimReward = () => {
    // Logic to claim a reward
    setStats({ ...stats, rewardsClaimed: stats.rewardsClaimed + 1 });
  };

  return (
    <div>
      <h1>Grow Virtual Dashboard</h1>
      <Grid>
        <Card>
          <Text>Daily Rewards: {dailyRewards}</Text>
          <Button onClick={claimReward}>Claim Reward</Button>
        </Card>
        <Card>
          <Text>Inventory:</Text>
          <ul>
            {inventory.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <Text>Plants:</Text>
          <ul>
            {plants.map((plant, index) => (
              <li key={index}>{plant}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <Text>Stats:</Text>
          <Text>Total Plants: {stats.totalPlants}</Text>
          <Text>Harvested: {stats.harvested}</Text>
          <Text>Rewards Claimed: {stats.rewardsClaimed}</Text>
        </Card>
      </Grid>
    </div>
  );
};

export default GrowVirtualDashboard;