import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Wind, Home, Battery, Sun, Cloud, Building, Store,  School, Users} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


const EnergyGame = () => {
  // Week-long simulation data (24 hours * 7 days = 168 hours)
  const weekData = {
    // Wind speed in m/s for each hour of the week
    windSpeed: [
      // Day 1
      0, 2, 2, 3, 4, 3, 2, 2, 3, 4, 5, 4, 3, 4, 5, 6, 5, 4, 3, 2, 2, 1, 1, 2,
      // Day 2
      2, 3, 3, 2, 1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 3, 4, 3, 2, 2, 3, 4, 3, 2,
      // Day 3
      1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 4, 5, 6, 5, 4, 3, 4, 2, 1,
      // Day 4
      1, 2, 3, 4, 3, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 4, 4,
      // Day 5
      2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 4, 5, 6, 5, 4, 3, 2, 1, 2, 3, 4, 4,
      // Day 6
      1, 1, 4, 7, 8, 9, 9, 6, 5, 4, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1, 1,
      // Day 7
      2, 3, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 2, 1
    ],
    // Weather conditions for each hour of the week
    weather: [
      // Day 1
      'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 
      'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy',
      // Day 2
      'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear',
      'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy',
      // Day 3
      'cloudy', 'cloudy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy',
      'stormy', 'stormy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy',
      // Day 4
      'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear',
      'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear',
      // Day 5
      'cloudy', 'cloudy', 'cloudy', 'cloudy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy', 'cloudy', 'cloudy',
      'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy',
      // Day 6
      'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear',
      'cloudy', 'cloudy', 'stormy', 'stormy', 'stormy', 'stormy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy',
      // Day 7
      'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear',
      'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'cloudy', 'cloudy', 'cloudy', 'cloudy'
    ],
    // Home consumption in kW for each hour of the week
    homeConsumption: [
      // Day 1
      0, 2, 2, 3, 3, 3, 5, 7, 6, 8, 7, 6, 5, 4, 3, 3, 3, 6, 10, 9, 8, 5, 4, 3,
      // Day 2
      2, 2, 2, 3, 3, 3, 5, 7, 6, 8, 7, 6, 5, 4, 3, 3, 3, 6, 10, 9, 8, 5, 4, 3,
      // Day 3
      2, 2, 2, 3, 3, 3, 5, 7, 6, 8, 7, 6, 5, 4, 3, 3, 3, 6, 10, 9, 8, 5, 4, 3,
      // Day 4
      2, 2, 2, 3, 3, 3, 5, 7, 6, 8, 7, 6, 5, 4, 3, 3, 3, 6, 10, 9, 8, 5, 4, 3,
      // Day 5
      2, 2, 2, 3, 3, 3, 5, 7, 6, 8, 7, 6, 5, 4, 3, 3, 3, 6, 10, 9, 8, 5, 4, 3,
      // Day 6
      2, 2, 2, 3, 3, 3, 5, 7, 6, 8, 7, 6, 5, 4, 3, 3, 3, 6, 10, 9, 8, 5, 4, 3,
      // Day 7
      2, 2, 2, 3, 3, 3, 5, 7, 6, 8, 7, 6, 5, 4, 3, 3, 3, 6, 10, 9, 8, 5, 4, 3,
    ]
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);



  // Game state
  const [currentHour, setCurrentHour] = useState(0);
  const [windEnergyProduced, setWindEnergyProduced] = useState(0);
  const [solarEnergyProduced, setSolarEnergyProduced] = useState(0);
  const [totalEnergyProduced, setTotalEnergyProduced] = useState(0);
  const [batteryLevelPerc, setbatteryLevelPerc] = useState(50); // Battery level in percentage (0-100)
  const [batteryChargekW, setbatteryChargekW] = useState(0); // kW, positive for charging, negative for discharging
  const [actualbatteryChargekW, setActualbatteryChargekW] = useState(0); // What's actually happening with the battery
  const [money, setMoney] = useState(100); // Start with 100 euros
  const [gameRunning, setGameRunning] = useState(false);
  const [dayCount, setDayCount] = useState(1);
  const [batteryNotification, setBatteryNotification] = useState('');
  const [BUY_PRICE] = useState(3); // euros per kWh
  const [SELL_PRICE] = useState(1); // euros per kWh
  const [gameSpeed, setGameSpeed] = useState(1); // Default speed is 1x

  // Max wind in kW
  const MAX_WIND_POWER = 10;

  // Max solar in kW
  const MAX_SOLAR_POWER = 10;

  // Max battery charge/discharge rate in kW
  const MAX_BATTERY_RATE = 2;
  
  // Battery capacity in kWh
  const BATTERY_CAPACITY = 20;

  // Format time to display - memoized to avoid recreation on each render
  const formatHour = useCallback((hour) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  }, []);

  // Get current weather for display - memoized
  const getCurrentWeather = useCallback(() => {
    return weekData.weather[currentHour];
  }, [weekData.weather, currentHour]);

  // Get current wind speed for display - memoized
  const getCurrentWindSpeed = useCallback(() => {
    return weekData.windSpeed[currentHour];
  }, [weekData.windSpeed, currentHour]);

  // Get current home consumption for display - memoized
  const getCurrentConsumption = useCallback(() => {
    return weekData.homeConsumption[currentHour];
  }, [weekData.homeConsumption, currentHour]);

  // Calculate grid interaction - memoized 
  const getGridInteraction = useCallback(() => {
    return getCurrentConsumption() - totalEnergyProduced + actualbatteryChargekW;
  }, [getCurrentConsumption, totalEnergyProduced, actualbatteryChargekW]);
  
  // Calculate real-time FinancialImpact - memoized
  const getFinancialImpact = useCallback(() => {
    let impact = 0;
    const gridInteraction = getGridInteraction();

    if (gridInteraction > 0) {
      impact = -gridInteraction * BUY_PRICE;
    } else {
      impact = -gridInteraction * SELL_PRICE;
    }

    return impact;
  }, [getGridInteraction, BUY_PRICE, SELL_PRICE]);

  // Get forecast data for the next 24 hours - memoized
  const getWindForecast = useCallback(() => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % weekData.windSpeed.length;
      const windSpeed = weekData.windSpeed[hour];
      // Calculate production based on the same formula used in the main loop
      const production = MAX_WIND_POWER * Math.max(0, windSpeed / 9);
      forecast.push({
        hour: (currentHour + i) % 24,
        production: production
      });
    }
    return forecast;
  }, [currentHour, weekData.windSpeed, MAX_WIND_POWER]);

  const getSolarForecast = useCallback(() => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % weekData.weather.length;
      const weather = weekData.weather[hour];
      const time = (currentHour + i) % 24;
      
      // Calculate production using the same logic as in the main loop
      let production = 0;
      if (time >= 6 && time <= 18) {
        const timeEfficiency = 1 - Math.abs((time - 12) / 6);
        let weatherMultiplier = 0;
        if (weather === 'clear') {
          weatherMultiplier = 1.0;
        } else if (weather === 'cloudy') {
          weatherMultiplier = 0.4;
        } else if (weather === 'stormy') {
          weatherMultiplier = 0.2;
        }
        production = MAX_SOLAR_POWER * timeEfficiency * weatherMultiplier;
      }
      
      forecast.push({
        hour: time,
        production: production
      });
    }
    return forecast;
  }, [currentHour, weekData.weather, MAX_SOLAR_POWER]);

  const getConsumptionForecast = useCallback(() => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % weekData.homeConsumption.length;
      forecast.push({
        hour: (currentHour + i) % 24,
        consumption: weekData.homeConsumption[hour]
      });
    }
    return forecast;
  }, [currentHour, weekData.homeConsumption]);



	// Reset game function
	const resetGame = useCallback(() => {
	  // Stop the game if it's running
	  setGameRunning(false);
	  
	  // Reset all state variables to initial values
	  setCurrentHour(0);
	  setWindEnergyProduced(0);
	  setSolarEnergyProduced(0);
	  setTotalEnergyProduced(0);
	  setbatteryLevelPerc(50);
	  setbatteryChargekW(0);
	  setActualbatteryChargekW(0);
	  setMoney(100);
	  setDayCount(1);
	  setBatteryNotification('');
	  setGameSpeed(1);
	  setHourStarted(false);
	  
	  // Reset time accumulators and refs
	  timeAccumulatorRef.current = 0;
	  lastDayTransitionRef.current = null;
	}, []);




  // Clear notification after a delay
  useEffect(() => {
    if (batteryNotification) {
      const timer = setTimeout(() => {
        setBatteryNotification('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [batteryNotification]);

  // Track values for the current hour and animation
  const [hourStarted, setHourStarted] = useState(false);

  
  // Track elapsed time for hour updates using a ref for better performance
  const timeAccumulatorRef = useRef(0);
  const lastDayTransitionRef = useRef(null);

  // Handle game logic with split rendering and game hour cycles
  useEffect(() => {
    if (!gameRunning) return;

    // Fast rendering loop (0.1 seconds)
    const renderLoop = setInterval(() => {
      // If we haven't calculated values for this hour yet, do so now
      if (!hourStarted) {
        // Get current data from the week dataset
        const currentWindSpeed = weekData.windSpeed[currentHour];
        const currentWeather = weekData.weather[currentHour];
        const currentConsumption = weekData.homeConsumption[currentHour];
        const time = currentHour % 24;
        
        // Calculate wind energy production based on wind speed
        const windProduction = MAX_WIND_POWER * Math.max(0, currentWindSpeed / 9);
        
        // Calculate solar energy production based on time of day and weather
        let solarProduction = 0;
        // Daylight hours (6am to 6pm)
        if (time >= 6 && time <= 18) {
          // Base solar production depends on time of day
          const timeEfficiency = 1 - Math.abs((time - 12) / 6);
          
          // Weather effects on solar
          let weatherMultiplier = 0;
          if (currentWeather === 'clear') {
            weatherMultiplier = 1.0;
          } else if (currentWeather === 'cloudy') {
            weatherMultiplier = 0.4;
          } else if (currentWeather === 'stormy') {
            weatherMultiplier = 0.2;
          }
          
          solarProduction = MAX_SOLAR_POWER * timeEfficiency * weatherMultiplier;
        }
        
        // Calculate total energy production
        const totalProduction = windProduction + solarProduction;
        
        // Calculate excess energy available (after consumption)
        const excessEnergy = totalProduction - currentConsumption;
        
        // Determine actual battery charge rate based on user setting and available excess energy
        let actualChargeBattery = 0;
        
        if (batteryChargekW > 0) {
          // User wants to charge battery
          if (excessEnergy <= 0) {
            // No excess energy available, can't charge from grid
            actualChargeBattery = 0;
            setBatteryNotification("Cannot charge: No excess energy available");
          } else {
            // Calculate remaining capacity in kWh
            const remainingCapacity = BATTERY_CAPACITY * (1 - batteryLevelPerc / 100);
            // Can charge, but limited by available excess energy and max rate, remaining capacity
            actualChargeBattery = Math.min(batteryChargekW, excessEnergy, MAX_BATTERY_RATE, remainingCapacity);
            
            // Check if battery is full or will be full
            if (remainingCapacity <= 0.1) { // Allow a small threshold to handle floating point precision
              setBatteryNotification("Battery full");
              actualChargeBattery = 0;
            }
          }
        } else if (batteryChargekW < 0) {
          // Check if battery is empty when trying to discharge
          if (batteryLevelPerc < 20) {
            actualChargeBattery = 0;
            setBatteryNotification("Cannot discharge: state-of-charge below 20%");
          } else {    
            // Calculate current battery level in kWh
            const currentBatteryKWh = BATTERY_CAPACITY * (batteryLevelPerc / 100);
            // Limit discharge rate to available battery and requested discharge rate
            actualChargeBattery = -Math.min(-batteryChargekW, currentBatteryKWh, MAX_BATTERY_RATE);
          }
        }
        
        // Update money immediately based on grid interaction and prices
        const gridInteraction = currentConsumption - totalProduction + actualChargeBattery;
        const financialImpact = gridInteraction > 0 
          ? -gridInteraction * BUY_PRICE 
          : -gridInteraction * SELL_PRICE;
        
        setMoney(prevMoney => prevMoney + financialImpact);
        
        
        // Mark that we've calculated values for this hour
        setHourStarted(true);
        
        // Update all state values at the beginning of the hour
        setWindEnergyProduced(windProduction);
        setSolarEnergyProduced(solarProduction);
        setTotalEnergyProduced(totalProduction);
        setActualbatteryChargekW(actualChargeBattery);
        
        // Update battery level immediately
        setbatteryLevelPerc(prevLevel => {
          // Convert battery percentage to kWh, add charge/discharge, convert back to percentage
          const prevLevelKWh = (prevLevel / 100) * BATTERY_CAPACITY;
          const newLevelKWh = prevLevelKWh + actualChargeBattery;
          const newPercentage = (newLevelKWh / BATTERY_CAPACITY) * 100;
          
          // Ensure percentage is within valid range (0-100)
          return Math.max(0, Math.min(100, newPercentage));
        });
      }
      
      // Nothing to do during in-between updates except increment the time
      // No battery updates needed during the 0.1s intervals
      
      // Accumulate time for hour changes using ref for better performance
      timeAccumulatorRef.current += 0.01 * gameSpeed; // 0.01 seconds per render cycle
      
      // If we've accumulated 1 second or more, update the hour
      if (timeAccumulatorRef.current >= 1) {
        // Reset accumulator and update hour
        setCurrentHour(prevHour => {
          const nextHour = prevHour + 1;
		  
          if (nextHour >= weekData.windSpeed.length) {
            // End of week, stop the game
            setGameRunning(false);
			
            return prevHour;
          }
          
          // Check for new day here using nextHour
          // Then modify the day increment code
		  if (nextHour % 24 === 0 && lastDayTransitionRef.current !== nextHour) {
		      lastDayTransitionRef.current = nextHour;
		      setDayCount((prevDay) => prevDay + 1);
		  }
          
          return nextHour;
        });
        
        // Reset the accumulator
        timeAccumulatorRef.current = 0;
        
        // Reset the hourStarted flag to recalculate values for the new hour
        setHourStarted(false);
      }
      
    }, 10); // Render loop runs every 0.01 seconds (100 FPS)
    
    return () => clearInterval(renderLoop);
  }, [gameRunning, BUY_PRICE, SELL_PRICE, currentHour, batteryChargekW, batteryLevelPerc, 
      weekData.homeConsumption, weekData.weather, weekData.windSpeed, BATTERY_CAPACITY, 
      MAX_BATTERY_RATE, MAX_WIND_POWER, MAX_SOLAR_POWER, hourStarted]);

  // Handle battery charge/discharge rate adjustment from slider
  const handleSliderChange = useCallback((e) => {
    const newValue = parseFloat(e.target.value);
    setbatteryChargekW(newValue);
  }, []);

  return (
    <div className="w-full h-full p-4 rounded-lg bg-blue-100 text-gray-800">
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Energy Community Simulator</h2> <span className="text-base font-normal text-gray-600">by Iacopo Savelli (iacopo.savelli@unibocconi.it)</span>
          <p className="text-lg">Day: {dayCount} | Time: {formatHour(currentHour % 24)} | Weather: {getCurrentWeather()}</p>
        </div>
		
		
        <div className="text-right">
		  <p className="text-xl font-bold">
			Money: <span className={`${money >= 0 ? 'text-green-600' : 'text-red-600'}`}>€{money.toFixed(2)}</span>
		  </p>
		  <div className="flex justify-end items-center mt-2">
			{/* Speed controls on the left */}
			<div className="flex items-center mr-4">
			  <span className="mr-2">Speed:</span>
			  <button 
				onClick={() => setGameSpeed(1)}
				className={`px-2 py-1 mx-1 rounded ${gameSpeed === 1 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
			  >
				1x
			  </button>
			  <button 
				onClick={() => setGameSpeed(2)}
				className={`px-2 py-1 mx-1 rounded ${gameSpeed === 2 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
			  >
				2x
			  </button>
			  <button 
				onClick={() => setGameSpeed(5)}
				className={`px-2 py-1 mx-1 rounded ${gameSpeed === 5 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
			  >
				5x
			  </button>
			  <button 
				onClick={() => setGameSpeed(10)}
				className={`px-2 py-1 mx-1 rounded ${gameSpeed === 10 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
			  >
				10x
			  </button>
			</div>
			
			{/* Pause button on the right */}
			<button 
			  onClick={() => setGameRunning(!gameRunning)}
			  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
			>
			  {gameRunning ? 'Pause' : 'Start'}
			</button>
			
			{/* Reset button - positioned to the right of start button */}
			<button 
			  onClick={resetGame}
			  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 ml-2"
			> Reset
			</button>
			
		  </div>
		
		  
		  
		  
        </div>
      </div>
      
      <div className="flex justify-around items-start mb-8">
        {/* Wind Farm Section */}
        <div className="text-center">
          {/* Wind Production Forecast Chart */}
          <div className="h-32 w-64 mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getWindForecast()}>
                <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3}/>
                <YAxis tick={{fontSize: 10}}/>
                <Tooltip formatter={(value) => [`${value.toFixed(1)} kW`, 'Wind']} />
                <Line type="monotone" dataKey="production" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
              <Wind 
                size={80} 
                className="text-blue-500" 
                style={{ width: `${20 + getCurrentWindSpeed() * 20}px` }} 
              />
            </div>
          </div>
          <h3 className="text-xl mt-2">Wind Farm (max. {MAX_WIND_POWER} kW)</h3>
          <p>Wind Speed: {getCurrentWindSpeed()} m/s</p>
          <p>Energy: {windEnergyProduced.toFixed(1)} kW</p>
        </div>

        {/* Solar Panel Section */}
        <div className="text-center">
          {/* Solar Production Forecast Chart */}
          <div className="h-32 w-64 mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getSolarForecast()}>
                <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3}/>
                <YAxis tick={{fontSize: 10}}/>
                <Tooltip formatter={(value) => [`${value.toFixed(1)} kW`, 'Solar']} />
                <Line type="monotone" dataKey="production" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="relative">
            <div className="w-32 h-32 bg-blue-900 rounded-lg flex items-center justify-center p-2 overflow-hidden">
              {/* Solar panel frame */}
              <div className="w-full h-full border-2 border-gray-700 rounded bg-blue-800 flex flex-col">
                {/* Solar cells - 3x3 grid */}
                <div className="grid grid-cols-3 grid-rows-3 gap-1 p-1 flex-grow">
                  {[...Array(9)].map((_, i) => (
                    <div 
                      key={i}
                      className={`rounded flex items-center justify-center ${
                        (currentHour % 24) >= 6 && (currentHour % 24) <= 18
                          ? solarEnergyProduced > 0 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-700' 
                            : 'bg-blue-950'
                          : 'bg-gray-900' // Darker at night
                      }`}
                      style={{
                        transition: 'all 0.3s ease',
                        boxShadow: (currentHour % 24) >= 6 && (currentHour % 24) <= 18 && solarEnergyProduced > 0 
                          ? 'inset 0 0 5px rgba(255, 255, 255, 0.5)' 
                          : 'none'
                      }}
                    >
                      {/* Reflective highlights */}
                      {(currentHour % 24) >= 6 && (currentHour % 24) <= 18 && solarEnergyProduced > 0 && (
                        <div className="w-1/3 h-1/3 bg-white opacity-20 rounded-full" />
                      )}
                      
                      {/* Night time appearance - small star reflection */}
                      {((currentHour % 24) < 6 || (currentHour % 24) > 18) && i % 4 === 0 && (
                        <div className="w-1 h-1 bg-white opacity-10 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Panel connection - red point becomes green when generating */}
                <div className="h-3 bg-gray-700 flex justify-start px-1">
                  <div 
                    className={`w-2 h-2 rounded-full mt-0.5 transition-colors duration-300 ${
                      solarEnergyProduced > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`} 
                  />
                </div>
              </div>
              
              {/* Sun/Moon indicator - moved down */}
              {(currentHour % 24) > 6 && (currentHour % 24) <= 18 ? (
                // Sun indicator with rays during day
                <div 
                  className={`absolute -top-2 -right-6 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                    solarEnergyProduced > 0 ? 'opacity-100' : 'opacity-20'
                  }`}
                  style={{
                    background: solarEnergyProduced > 0 ? '#fbbf24' : '#9ca3af',
                    boxShadow: solarEnergyProduced > 0 
                      ? '0 0 20px rgba(251, 191, 36, 0.7)' 
                      : 'none'
                  }}
                >
                  {/* Sun rays */}
                  {solarEnergyProduced > 0 && (
                    <>
                      <div className="absolute w-2 h-14 bg-yellow-300 animate-pulse" 
                           style={{transform: 'rotate(0deg) translateY(-16px)'}} />
                      <div className="absolute w-2 h-14 bg-yellow-300 animate-pulse" 
                           style={{transform: 'rotate(45deg) translateY(-16px)'}} />
                      <div className="absolute w-2 h-14 bg-yellow-300 animate-pulse" 
                           style={{transform: 'rotate(90deg) translateY(-16px)'}} />
                      <div className="absolute w-2 h-14 bg-yellow-300 animate-pulse" 
                           style={{transform: 'rotate(135deg) translateY(-16px)'}} />
                    </>
                  )}
                  <Sun 
                    size={36} 
                    fill={solarEnergyProduced > 0 ? "#ffffff" : "#9ca3af"} 
                    className="text-yellow-500 z-10" 
                  />
                </div>
              ) : (
                // Moon indicator during night
                <div 
                  className="absolute -top-2 -right-6 w-24 h-24 rounded-full flex items-center justify-center bg-gray-800"
                  style={{
                    boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {/* Moon symbol */}
                  <div className="w-16 h-16 rounded-full bg-gray-300 relative overflow-hidden">
                    <div className="absolute w-12 h-12 rounded-full bg-gray-800" 
                         style={{top: '-3px', right: '-8px'}} />
                  </div>
                </div>
              )}
              
              {/* Weather indicators - positioned at the bottom of the sun */}
              {getCurrentWeather() === 'cloudy' && (
                <Cloud size={80} className="absolute top-16 -right-4 text-gray-400 z-10" fill="currentColor" />
              )}
              {getCurrentWeather() === 'stormy' && (
                <div className="absolute top-16 -right-4 z-10">
                  <Cloud size={80} className="text-gray-400" fill="currentColor" />
                  <div className="absolute bottom-2 left-8 text-yellow-500 text-4xl">⚡</div>
                </div>
              )}
            </div>
          </div>
          <h3 className="text-xl mt-2">Solar Panel (max. {MAX_SOLAR_POWER} kW)</h3>
          <p>Energy: {solarEnergyProduced.toFixed(1)} kW</p>
          <p>
            {(currentHour % 24) >= 6 && (currentHour % 24) <= 18 
              ? getCurrentWeather() === 'clear' 
                ? 'Clear sky - optimal generation' 
                : getCurrentWeather() === 'cloudy' 
                  ? 'Cloudy - reduced efficiency' 
                  : 'Stormy - minimal generation'
              : 'Night - no generation'}
          </p>
        </div>
        
        {/* Energy Flow */}
		<div className="flex flex-col items-center">
		  <div className="text-center">
			<p>Total Generation: {totalEnergyProduced.toFixed(1)} kW</p>
			<p>Consumption: {getCurrentConsumption()} kW</p>
			<div className="w-64 text-center">
			  <p className={actualbatteryChargekW < 0 ? "text-green-500" : actualbatteryChargekW > 0 ? "text-blue-500" : "text-gray-500"}>
				Battery: {Math.abs(actualbatteryChargekW).toFixed(1)} kW {actualbatteryChargekW < 0 ? '(Discharging)' : actualbatteryChargekW > 0 ? '(Charging)' : '(Idle)'}
			  </p>
			  {/* Using getGridInteraction */}
			  {getGridInteraction() > 0 ? (
				<p className="text-red-500">
				  Grid Import: {getGridInteraction().toFixed(1)} kW (€{(getGridInteraction() * BUY_PRICE).toFixed(2)})
				</p>
			  ) : getGridInteraction() < 0 ? (
				<p className="text-green-500">
				  Grid Export: {Math.abs(getGridInteraction()).toFixed(1)} kW (€{(Math.abs(getGridInteraction()) * SELL_PRICE).toFixed(2)})
				</p>
			  ) : (
				<p className="text-gray-500">
				  Grid: Balanced
				</p>
			  )}
			</div>
		  </div>
		  
		  {/* Grid import/export arrow indicator */}
			<div className="flex justify-center mt-4">
			  <svg className="w-16 h-24" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg">
				{getGridInteraction() > 0 ? (
				  // Red arrow pointing down (importing from grid) - made more pointy
				  <path d="M24 2 L24 42 M10 30 L24 50 L38 30" 
						stroke="rgb(239 68 68)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
				) : getGridInteraction() < 0 ? (
				  // Green arrow pointing up (exporting to grid) - made more pointy
				  <path d="M24 50 L24 10 M10 20 L24 2 L38 20" 
						stroke="rgb(34 197 94)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
				) : (
				  // Gray line with no arrowhead (balanced)
				  <line x1="24" y1="2" x2="24" y2="50" 
						stroke="rgb(209 213 219)" strokeWidth="6" strokeLinecap="round" />
				)}
			  </svg>
			</div>
		</div>

		
        { /* // Debug 
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <h4 className="font-bold">Debug Info:</h4>
		  <div>currentHour: {(currentHour % 24)}</div>
          <div>wind: {windEnergyProduced.toFixed(2)} kW</div>
          <div>solar: {solarEnergyProduced.toFixed(2)} kW</div>
          <div>Generation: {totalEnergyProduced.toFixed(2)} kW</div>
          <div>Consumption: {getCurrentConsumption()} kW</div>
          <div>batteryChargekW: {batteryChargekW.toFixed(2)} kW</div>
          <div>actualbatteryChargekW: {actualbatteryChargekW.toFixed(2)} kW</div>
          <div>getGridInteraction: {getGridInteraction().toFixed(2)} kW</div>
          <div>Financial Impact: €{getFinancialImpact().toFixed(2)}</div>
          <div>Total Money: €{money.toFixed(2)}</div>
        </div>
		*/}
		
        {/* Home Section */}
		<div className="flex flex-col items-center justify-center">
		  {/* Consumption Forecast Chart */}
		  <div className="h-32 w-64 mb-2">
			<ResponsiveContainer width="100%" height="100%">
			  <LineChart data={getConsumptionForecast()}>
				<XAxis dataKey="hour" tick={{fontSize: 10}} interval={3}/>
				<YAxis tick={{fontSize: 10}}/>
				<Tooltip formatter={(value) => [`${value.toFixed(1)} kW`, 'Consumption']} />
				<Line type="monotone" dataKey="consumption" stroke="#ef4444" strokeWidth={2} dot={false} />
			  </LineChart>
			</ResponsiveContainer>
		  </div>
		  
			<div className="relative w-32 h-32">
			  <Home size={40} className="text-indigo-700 absolute top-0 left-0" />
			  <Building size={40} className="text-indigo-700 absolute top-0 right-0" />
			  <Store size={36} className="text-indigo-700 absolute bottom-0 left-0" />
			  <School size={36} className="text-indigo-700 absolute bottom-0 right-0" />
			  <Users size={32} className="text-indigo-700 absolute top-12 left-12" />
			</div>
		  
		  <h3 className="text-xl mt-2">Community (max. 10 kW)</h3>
		  <p>Consumption: {getCurrentConsumption()} kW</p>
		</div>
	</div>
      
	  
      {/* Battery Status & Controls */}
      <div className="mb-8">
        <h3 className="text-xl mb-2">Community Battery (max. {BATTERY_CAPACITY} kWh)</h3>
        
        {/* Battery Level Indicator */}
        <div className="flex items-center mb-4">
          <Battery size={32} className="mr-2" />
          <div className="w-full bg-gray-300 rounded-full h-6">
            <div 
              className={`h-6 rounded-full ${batteryLevelPerc > 20 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${batteryLevelPerc}%` }}
            ></div>
          </div>
          <span className="ml-2">{batteryLevelPerc.toFixed(1)}%</span>
        </div>
        
        {/* Battery Charge/Discharge Control - Slider */}
        <div className="mx-auto w-64 mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Discharge</span>
            <span>Off</span>
            <span>Charge</span>
          </div>
          <input
            type="range"
            min={-MAX_BATTERY_RATE}
            max={MAX_BATTERY_RATE}
            step="0.5"
            value={batteryChargekW}
            onChange={handleSliderChange}
            className="w-full h-4 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs mt-1">
            <span>-{MAX_BATTERY_RATE} kW</span>
            <span>0 kW</span>
            <span>+{MAX_BATTERY_RATE} kW</span>
          </div>
        </div>
        
        {/* Battery Status Labels */}
        <div className="text-center">
          <p>Battery: {actualbatteryChargekW > 0 ? 'Charging' : actualbatteryChargekW < 0 ? 'Discharging' : 'Idle'}</p>
          <p>Rate: {Math.abs(actualbatteryChargekW).toFixed(1)} kW</p>
          <p>Setting: {Math.abs(batteryChargekW).toFixed(1)} kW {batteryChargekW > 0 ? 'Charge' : batteryChargekW < 0 ? 'Discharge' : 'Idle'}</p>
          {batteryNotification && (
            <p className="text-red-500 mt-1">{batteryNotification}</p>
          )}
        </div>
      </div>
      
      {/* Game Instructions */}
      <div className="mt-4 p-4 bg-white rounded-lg text-gray-800">
        <h3 className="font-bold mb-2">How to Play:</h3>
        <ul className="list-disc pl-5">
          <li>The simulation shows one week of predetermined weather and consumption patterns</li>
          <li>Control the battery charging and discharging rate using the sliding bar</li>
          <li>The battery can only charge from excess renewable energy, not from the grid</li>
          <li>Buy electricity from the grid at €{BUY_PRICE}/kWh when you need it</li>
          <li>Sell excess electricity to the grid at €{SELL_PRICE}/kWh when you produce more than you need</li>
          <li>Store excess energy in the community battery during high production</li>
          <li>Discharge the battery during low production periods or high consumption</li>
          <li>Your goal: Maximize your profits through smart energy management!</li>
        </ul>
      </div>
    </div>
  );
};

export default EnergyGame;