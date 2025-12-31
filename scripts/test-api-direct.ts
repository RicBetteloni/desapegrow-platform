import { prisma } from '../src/lib/prisma';

async function testAPIs() {
  try {
    console.log('🧪 Testing database connection...');
    
    // Test 1: Database connection
    const userCount = await prisma.user.count();
    console.log(`✅ Database connected - ${userCount} users found`);
    
    // Test 2: VirtualGrow query
    const virtualGrows = await prisma.virtualGrow.findMany({
      take: 1,
      include: {
        plants: true,
        inventory: true,
        dailyRewards: {
          orderBy: { rewardDate: 'desc' },
          take: 1
        }
      }
    });
    
    if (virtualGrows.length > 0) {
      const grow = virtualGrows[0];
      console.log(`✅ VirtualGrow query successful`);
      console.log(`   - User ID: ${grow.userId}`);
      console.log(`   - Plants: ${grow.plants.length}`);
      console.log(`   - Inventory items: ${grow.inventory.length}`);
      console.log(`   - Daily rewards: ${grow.dailyRewards.length}`);
      
      if (grow.dailyRewards.length > 0) {
        const reward = grow.dailyRewards[0];
        console.log(`   - Last reward date type: ${typeof reward.rewardDate}`);
        console.log(`   - Last reward date value: ${reward.rewardDate}`);
        
        // Test Date conversion
        try {
          const convertedDate = new Date(reward.rewardDate);
          console.log(`   - Date conversion works: ${convertedDate.toISOString()}`);
        } catch (e) {
          console.error(`   ❌ Date conversion failed:`, e);
        }
      }
    } else {
      console.log('⚠️ No VirtualGrow records found');
    }
    
    // Test 3: Check for null values in plants
    const plants = await prisma.plant.findMany({ take: 5 });
    console.log(`\n✅ Found ${plants.length} plants`);
    
    plants.forEach((plant, idx) => {
      console.log(`\nPlant ${idx + 1}:`);
      console.log(`   - size: ${plant.size} (${typeof plant.size})`);
      console.log(`   - daysGrowing: ${plant.daysGrowing} (${typeof plant.daysGrowing})`);
      console.log(`   - vpdLevel: ${plant.vpdLevel} (${typeof plant.vpdLevel})`);
      
      // Test toFixed on each value
      try {
        const sizeFixed = (plant.size ?? 0).toFixed(1);
        const daysFixed = (plant.daysGrowing ?? 0).toFixed(0);
        const vpdFixed = (plant.vpdLevel ?? 1.0).toFixed(1);
        console.log(`   ✅ toFixed() works: size=${sizeFixed}, days=${daysFixed}, vpd=${vpdFixed}`);
      } catch (e: any) {
        console.error(`   ❌ toFixed() failed:`, e.message);
      }
    });
    
    console.log('\n✅ All tests passed!');
    
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testAPIs();
